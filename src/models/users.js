const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    userID:{
        type: Number,
        unique: true,
        required: true
    },
    firstName:{
        type:String,
        maxLength:15
    },
    lastName:{
        type:String,
        maxLength:15
    },
    telephone:{
        type: Number
    },
    age:{
        type: Number
    },
    height:{
        type: Number
    }
})

module.exports = mongoose.model('users', userSchema)
