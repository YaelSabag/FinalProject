const mongoose = require('mongoose')
const Schema = mongoose.Schema


const generalVariablesSchema = new Schema({
    MainArray:[]


})

module.exports = mongoose.model('generalVariable', generalVariablesSchema)