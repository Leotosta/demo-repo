const jwt = require('jsonwebtoken')

function sendRefreshToken(Response, token){
    return Response.cookie('jid', token, {
        httpOnly: true,
        cookie: 860000
    })
}

function generateToken(params){
    return jwt.sign(params, process.env.JWT_AUTH_EMAIL, {
        expiresIn: 1000 * 60 * 60 * 6
    })
}

module.exports = {sendRefreshToken, generateToken}