const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/onduladusDatabases', {
    useCreateIndex: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
    useNewUrlParser: true
}) 

mongoose.promise = global.promise

module.exports = mongoose