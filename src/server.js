const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
require('dotenv').config()

const app = express()

app.use(morgan('common'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(cors({
    origin: process.env.CORS,
    credentials: true
}))

app.use(helmet())

require('./controllers/index')(app)

const port = process.env.PORT || 1601
app.listen(port, () => {
    console.log(`Magic happening on port ${port}`)
})