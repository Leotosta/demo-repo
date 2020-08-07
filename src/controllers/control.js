const express = require('express')
const router = express.Router()
const User = require('../config/schema')
const { compare } = require('bcryptjs')
const { sendEmail } = require('../email/send')
const jwt = require('jsonwebtoken')

router.get('/', async (req, res) => {

    try{
        const users = await User.find()
        
        res.json(users)

    }catch(e){
        console.log(e)
    }
})

router.post('/SignUp', async (req, res) => {

    try{
        const {firstName, lastName, email, password, confirmPass } = req.body
    
        const user = await User.findOne({email})

        //   if(user)
        //       return res.status(403).json('Something went wrong')

        if(password !== confirmPass)
            return res.status(401).json('Passwords does not match')
        
        const token = jwt.sign({firstName, lastName, email}, process.env.JWT_AUTH, {expiresIn: '20m'})
    
        const mailOptions = typeEmail(email, user, 'Confirm your account', 'Your account needs to be activated', token)
        const createEntry = await new User({ firstName, lastName, email, password, confirmPass })
        const newUser = await createEntry.save()
        
        createEntry.password = undefined
        // res.header( "Access-Control-Allow-Origin" );

        sendEmail(mailOptions)
        // redirect to confirm
        return res.json({newUser, token })

    }catch(e){
        console.log(e)
    }

})

router.post('/SignIn', async (req, res) => {
    try{
        const { email, password } = req.body

        const users = await User.findOne({email}).select('+password')
        
        if(!users)
            return res.status(404).json('Email or password invalid!')

        if(!await compare(password, users.password ))
            return res.status(402).json('Email or password invalid!')

        users.password = undefined

        return res.json(users)


    }catch(e){
        console.log(e)
    }
})

function typeEmail(email, data , subject, text, token){
    let arroba = email.indexOf('@')
    let dotCom = email.indexOf('.com')

    let emailType = email.slice(arroba + 1, dotCom)
    let whiceEmail = emailType === 'gmail' ? process.env.GMAIL_ACCOUNT : process.env.OUTLOOK_ACCOUNT
    console.log(data.firstName)

    return {
        to: email,
        from: whiceEmail,
        subject,
        text,
        html: `
        <h3> Olá ${data.firstName}! Clique no botão para ativar a sua conta! </h3>
        ${process.env.CLIENT_URL}/confirm/${token}
         `,
        // template        
    }
}


router.post('/confirm/:token', async (req, res) => {
    const { token } = req.params

    if(!token)
        return res.status(404).json('Invalid session!')

    if(token){
        await jwt.verify(token, process.env.JWT_AUTH, async (err, decoded) => {
            if(err)
                return res.status(400).json({error: err})
                //expired

            const { email } = decoded
            const user = await User.findOne({email})

            // if(user)


        })
    }


})

module.exports = app => app.use('/', router)