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
    },
    selected_attractions: {
        type: Array,
        default: [],
        maxLength: 20
    }
})

module.exports = mongoose.model('users', userSchema)
