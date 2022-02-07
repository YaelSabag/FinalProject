const mongoose = require('mongoose')
const Schema = mongoose.Schema


d=new Date()
var add_hours =  function (dt, hours) {
    return new Date(dt.getTime() + hours*3600000);
}

const attractionSchema = new Schema({
    attractionID:{
        type: Number,
        unique: true,
        required: true
        //type:mongoose.Types.ObjectId
    },
    name:{
        type:String,
        maxLength:15
    },
    Round:{
        type: Number
    },
    countNow:{
        type: Number
    },
    time:{
        type: Date,
        default:add_hours(new Date(d.getFullYear(),d.getMonth(),d.getDay()), 8)

    },
    capacity:{
        type: Number,
    }
})



module.exports = mongoose.model('attraction', attractionSchema)
