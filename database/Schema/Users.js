const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    key: { 
        type: String, 
        required: true, 
        unique: true 
    },
    name: { 
        type: String, 
        required: true 
    },
    avatar: {
        type: String,
        default: null
    }, 
    notes: { 
        type: Array 
    },
    news: { 
        type: [String]
    },
    events: { 
        type: Array
    },
    Goals: {
        type: Array
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
