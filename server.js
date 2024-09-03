const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bodyparser = require('body-parser')
const userRoutes = require('./routes/Routes')
require('./database/mongooseConnect')

const app = express()
const port = 5000

app.use(cors())
app.use(bodyparser.json())

app.use('/api', userRoutes)

app.listen(port, () => {
    console.log('Servidor iniciado', port)
})