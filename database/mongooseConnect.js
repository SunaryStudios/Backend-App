const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://smsp0309:0309@calendar.3580n.mongodb.net/').then(() => {
    console.log('Conectado a la base de datos')
})