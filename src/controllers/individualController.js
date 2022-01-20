const Individual= require('../models/individual')
const mongoose = require('mongoose')

userSchema = require('../models/users');
var User = mongoose.model('users');
const mainArray=[] //Initial array

const getIndividual= (req,res)=> {
    Individual.find()
        .then(response => {
            res.send(response)
            console.log('getIndividual')
        })
        .catch(error => {
            res.send("error IndividualController")

        })
}

const addIndividual= (req,res,next)=>{
    console.log(req.body)
    const individual=new Individual({
        popID:req.body.popID,
        array:req.body.array
    })
    individual.save()
        .then(response=>{
            res.json({
                message:'individual Added successfully'
            })
        })
        .catch(error => {
            res.json({
                message: 'An error Occured!'
            })
        })
}



const creatIndividual= (req,res)=> {

    userSchema.find().select('selected_attractions')
        .then(response => {
            response.forEach(function(u) {
                mainArray.push(u)
            });
            res.send(response)
            console.log('main array',mainArray)
        })
        .catch(error => {
            res.send("erroe in Individual Controller")

        })
    //console.log('main array',mainArray)

}



const Randomization= ()=> {
    for (let i=0; i<mainArray.length; ++i){
        mainArray[i]=shuffle(mainArray[i]);
    }
    console.log('random',mainArray)
}


function shuffle(array) {
    let currentIndex = array.length,  randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}
// console.log(Randomization())


module.exports = {
    getIndividual,
    addIndividual,
    creatIndividual,
    Randomization,
    shuffle
}