const mongoose = require('mongoose')
const Schema = mongoose.Schema

const attractionSchema = new Schema({
    attractionID:{
        type: Number,
        unique: true,
        required: true
    },
    name:{
        type:String,
        maxLength:15
    },
    round:{
        type: Number
    },
    count:{
        type: Number
    },
    time:{
        type: Number
        // type: new Date().toTimeString(),
        // default: new Date().toTimeString()
    },
    capacity:{
        type: Number
    }
})

module.exports = mongoose.model('attraction', attractionSchema)
