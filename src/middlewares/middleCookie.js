const jwt = require('jsonwebtoken')
const decode = require('jsonwebtoken/decode')

module.exports = (req, res, next) => {
    const token = req.cookies.jid
    
    if(!token)
        return res.status(404).json('Invalid')

    jwt.verify(token, process.env.JWT_AUTH_EMAIL, (err, decoded) => {
        if(err)
            return res.status(404).json({err})

        req.userId = decoded.id

    })

    next()
}