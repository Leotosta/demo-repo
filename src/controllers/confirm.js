const express = require('express')
const router = express.Router()

const authMiddleware = require('../middlewares/middleware')
const User = require('../config/schema')

router.get('/confirm', authMiddleware, async (req, res) => {
    try{
        const user = await User.findOne({email: req.userId})
       
        return res.json(user)

    }catch(e){
        console.log(e)
    }
})

module.exports = app => app.use('/', router)