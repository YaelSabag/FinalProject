const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    userID:{
        type: Number,
        unique: true,
        required: true
    },
    fullName:{
        type:String,
        maxLength:15
    },
    email:{
       type: String
    },
    password:{
        type: String,
        minLength: 6
    },
    // telephone:{
    //     type: Number
    // },
    age:{
        type: Number
    },
    height:{
        type: Number
    },
    selected_attractions: {
        type: Array,
        maxLength: 20
    }
})

module.exports = mongoose.model('users', userSchema)
