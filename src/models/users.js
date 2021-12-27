const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    ID:{
        type: Number,
        unique: true,
        required: true
    },
    FirstName:{
        type:String,
        maxLength:15
    },
    LastName:{
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
