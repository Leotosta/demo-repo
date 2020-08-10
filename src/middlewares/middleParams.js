const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    const token  = req.params.token
    console.log( token + ' token')
    if(!token)
        return res.status(403).json('Invalid')

    jwt.verify(token, process.env.JWT_AUTH_ACCOUNT, (err, decoded) => {
        if(err)
            return res.redirect(`/${process.env.CLIENT_URL}`)

        req.userId = decoded

        next()
    })

}