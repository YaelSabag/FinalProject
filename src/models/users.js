const mongoose = require('mongoose')
const Schema = mongoose.Schema


d=new Date()
var add_hours =  function (dt, hours) {
    return new Date(dt.getTime() + hours*3600000);
}

var t= add_hours(new Date(d.getFullYear(),d.getMonth(),d.getDay()), 8).getTime()


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
       type: String,
        unique: true,
        required: true
    },
    password:{
        type: String,
        minLength: 6,
        required: true
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
    time:{
        type:Date,
        default:add_hours(new Date(d.getFullYear(),d.getMonth(),d.getDay()), 8)
    },
    selected_attractions: {
        type: Array,
        maxLength: 20
    }
})

module.exports = mongoose.model('users', userSchema)
