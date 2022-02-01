const mongoose = require('mongoose')
const Schema = mongoose.Schema

var d = new Date()
const setDate = function (d) {
    //const t = new Date();
    const date = ('0' + d.getDate()).slice(-2);
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const year = d.getFullYear();
    return `${date}/${month}/${year}`;
    console.log(`${date}/${month}/${year}`)
};
const generalVariablesSchema = new Schema({
    MainArray:[],
    date:{
        type: String,
        default: setDate(d)
    }



})

module.exports = mongoose.model('generalVariable', generalVariablesSchema)