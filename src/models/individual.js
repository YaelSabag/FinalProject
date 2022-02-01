const mongoose = require('mongoose')
const Schema = mongoose.Schema
userModel = require('./users.js');

var User = mongoose.model('users');

const individualSchema = new Schema({
    popID:{
        type:Number,
        unique: true
    },
    array:[]
    //array: User.age
    //matrix:User.selected_attractions
})

module.exports = mongoose.model('individual', individualSchema)