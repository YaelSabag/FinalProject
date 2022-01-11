const Population = require('../models/individual')
const mongoose = require('mongoose')

const getIndividual= (req,res)=> {
    User.find()
        .then(response => {
            res.send(response)
            console.log('getPopulation')
        })
        .catch(error => {
            res.send("nnnn")

        })
}

const addIndividual= (req,res,next)=>{
    console.log(req.body)
    const population=new Population({
        // userID:req.body.userID,
        // firstName:req.body.firstName,
        // lastName:req.body.lastName,
        //telephone:req.body.telephone,
        //age:req.body.age,
        //height:req.body.height
    })
    population.save()
        .then(response=>{
            res.json({
                message:'population Added successfully'
            })
        })
        .catch(error => {
            res.json({
                message: 'An error Occured!'
            })
        })
}

module.exports = {
    getIndividual,
    addIndividual
}