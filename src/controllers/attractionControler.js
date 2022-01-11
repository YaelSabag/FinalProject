const Attraction = require('../models/attraction')
const mongoose = require ('mongoose')

//show the list of Users
const getAttraction= (req,res)=> {
    Attraction.find()
        .then(response => {
            res.send(response)
            console.log('getAttraction')
        })
        .catch(error => {
            res.send("error get attraction")

        })
}

const addAttraction= (req,res,next)=>{
    console.log(req.body)
    const attraction=new Attraction({
        attractionID:req.body.attractionID,
        name: req.body.name,
        round: req.body.round,
        count: req.body.count,
        capacity: req.body.capacity
    })
    attraction.save()
        .then(response=>{
            res.json({
                message:'Attraction Added successfully'
            })
        })
        .catch(error => {
            res.json({
                message: 'An error Occured!'
            })
        })
}

module.exports={
    getAttraction,
    addAttraction
}