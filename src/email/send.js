const nodemailer = require('nodemailer')
const hbs = require('nodemailer-express-handlebars')
const path = require('path')

function sendEmail(mailOptions){
    let transporter = nodemailer.createTransport(mailOptions.from === process.env.OUTLOOK_EMAIL ? {
        host: "smtp-mail.outlook.com",
        secureConnection: false,
        port: process.env.OUTLOOK_PORT,
        tls: {
            ciphers:'SSLv3'
        },
        auth: {
            user: process.env.OUTLOOK_ACCOUNT,
            pass: process.env.OUTLOOK_PASS
        }
    } : {
        service: 'gmail',  
        port: process.env.GMAIL_PORT,
        auth: {
            user: process.env.GMAIL_ACCOUNT,
            pass: process.env.GMAIL_PASS
        }
    })

    let handleBarsOptions = {
        viewEngine: {
            partialsDir: '../views/',
            defaultLayout: ""
        },
        viewPath: path.resolve('/home/leo/cleaningMui/back/src/views/'),
        extName: '.handlebars'
    }

    transporter.use('compile', hbs(handleBarsOptions))
    
    transporter.sendMail(mailOptions, async (err, data) => {
        if(await data)
            console.log('Sucessfully sent!')
    
        else{
            console.log(err)
        }
    })
    

}



module.exports = { sendEmail }