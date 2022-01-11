const mongoose = require('mongoose')
const Schema = mongoose.Schema
userModel = require('./users.js');

var User = mongoose.model('users');

const individualSchema = new Schema({
    popID:{
        type: mongoose.Types.ObjectId
    },
    array:{
        type: Array,
        default: []
    }
    //array: User.age
})

module.exports = mongoose.model('individual', individualSchema)