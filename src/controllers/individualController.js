const Individual= require('../models/individual')
const generalVariabl =require('../models/generalVariables');
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


//creat the initial array
const creatInitialIndividual= (req,res)=> {
    const mainArrayGV =new generalVariabl()
    userSchema.find().select('selected_attractions')
        .then(response => {
            response.forEach(function(u) {
                mainArrayGV.MainArray.push(u.selected_attractions)
            });
            mainArrayGV.save().then(response=>{
                res.send(response)
            })
            console.log('main array', mainArray)
        })
        .catch(error => {
            res.send("error in Individual Controller")

        })


}



const Randomization= (req,res)=> {
    today= DateToString()
    const arr =new generalVariabl()
    let i;

    generalVariabl.find()
       .then(response => {
           response.forEach(function(u) {
               if(u.date==today) {
                   arr.MainArray=(u.MainArray)
                }
           });

           for ( i = 0; i < arr.MainArray.length; ++i) {
               arr.MainArray[i] = shuffle(arr.MainArray[i]);
           }
           res.send(arr)

       })
        .catch(error => {
            res.send("error in Random")

        })
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


const DateToString= ()=> {
    const t = new Date();
    const date = ('0' + t.getDate()).slice(-2);
    const month = ('0' + (t.getMonth() + 1)).slice(-2);
    const year = t.getFullYear();
    return `${date}/${month}/${year}`;
}


module.exports = {
    getIndividual,
    addIndividual,
    creatInitialIndividual,
    Randomization,
    shuffle,
    DateToString
}