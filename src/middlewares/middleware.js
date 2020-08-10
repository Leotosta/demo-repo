const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    const allValue = req.headers.authorization
    if(!allValue)
        return res.status(404).json('Invalid!')

    const parts = allValue.split(' ')
    //it will return an array
    if(!parts.length === 2 )
        return res.status(403).json('Invalid!!')

    const [ scheme, token ] = parts

    if(!/Bearer$/i.test(scheme))
        return res.status(404).json('Something went wrong!')

    jwt.verify(token, process.env.JWT_AUTH_EMAIL, (err, decoded) => {
        if(err)
            return res.status(403).json(err)

        req.userId = decoded.email
        return next()

    })
}