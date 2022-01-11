const mongoose = require('mongoose')
const Schema = mongoose.Schema

const facilitySchema = new Schema({
    count:{
        type: Number,
        required: true
    },
    time:{
        type: Number
    }
})

module.exports = mongoose.model('facility', facilitySchema)
