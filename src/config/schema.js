const mongoose = require('../config/db')
const bcrypt = require('bcryptjs')

const userSchema = mongoose.Schema({

    firstName: {
        type: String,
        trim: true,
        require: true
    },

    lastName: {
        type: String,
        trim: true,
        require: true
    },

    email: {
        type: String,
        trim: true,
        createIndex: true,
        require: true
    },

    password: {
        type: String,
        trim: true,
        require: true
    },

    active: false,

    //Esqueci senha
    resetPasswordToken: {
        type: String,
        select: false
    },

    resetPasswordExpires: {
        type: Date,
        select: false
    },

    autheticationToken: {
        type: String,
        select: false
    }


}, {
    timestamps: true
})

userSchema.pre('save', async function(next){
    try{
        const hash = await bcrypt.hash(this.password, 12)

        this.password = hash

        next()
    }catch(e){
        console.log(e)
    }
})

userSchema.set('toJSON', {
    transform: (doc, { __v, password, ...rest}, options) => rest 
})

const User = mongoose.model('User', userSchema)

module.exports = User