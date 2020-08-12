const express = require('express')
const router = express.Router()
const User = require('../config/schema')
const { compare } = require('bcryptjs')
const { sendEmail } = require('../email/send')
const jwt = require('jsonwebtoken')
const paramsMiddle = require('../middlewares/middleParams')
const { sendRefreshToken, generateToken }= require('../valid/sendRefresh')

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
        const {firstName, lastName, number, email } = req.body
    
        const user = await User.findOne({email})

        if(user)
            return res.status(403).json('Something went wrong')
        
        sendRefreshToken(res, generateToken({id: email}))
        // const token = jwt.sign(user, process.env.JWT_AUTH_EMAIL, {expiresIn: '20m'})
        const tokenAccount = jwt.sign({firstName, lastName, number, email }, process.env.JWT_AUTH_ACCOUNT, {expiresIn: '20m'})

        const mailOptions = typeEmail(email, { firstName, lastName, number, email}, 'Confirm your account', 'Your account needs to be activated', tokenAccount)
        
        sendEmail(mailOptions)
        // redirect to confirm
        return res.json('ok')

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


        // sendRefreshToken(res, generateToken({id: users._id}))

        users.password = undefined

        return res.json(users)


    }catch(e){
        console.log(e)
    }
})

function typeEmail(email, data, subject, text, token){
    let arroba = email.indexOf('@')
    let dotCom = email.indexOf('.com')
    console.log(token + 'email')
    let emailType = email.slice(arroba + 1, dotCom)
    let whiceEmail = emailType === 'gmail' ? process.env.GMAIL_ACCOUNT : process.env.OUTLOOK_ACCOUNT

    return {
        to: email,
        from: whiceEmail,
        subject,
        text,
        html: `
        <h3> Olá ${data.firstName}! Clique no botão para ativar a sua conta! </h3>
        ${process.env.CLIENT_URL}/confirmation/${token}
         `,
        // template        
    }
}


router.post('/confirmation/:token', paramsMiddle, async (req, res) => {
    const { password, confirmPass } = req.body

    try {
            const { firstName, lastName, number, email } = req.userId
            
            const user = await User.findOne({email})

            if(user)
                return res.status(403).json('Email is already in usage')

            if(password !== confirmPass)
                return res.status(401).json('Passwords does not match')

             const createEntry = await new User({ firstName, lastName, number, email, password, confirmPass })
             const createAccount = await createEntry.save()

            createAccount.password = undefined

            return res.json('ok')

    }catch(e){
        console.log(e)
    }
})

module.exports = app => app.use('/', router)