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
    d=new Date()
    const attraction=new Attraction({
        // attractionID:req.body.attractionID,
        // name: req.body.name,
        // Round: req.body.Round,
        // countNow: req.body.countNow,
        // capacity: req.body.capacity
        //time:d
        attractionID:10,
        name: 'black mamba',
        Round: 1,
        countNow: 0,
        capacity:10
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




const  getAttractionByID= (req,res,next)=>{
    let attractionID = req.query.attractionID
    Attraction.findById(attractionID)
        .then(response=>{
            res.send(response)
        })
        .catch(error => {
            res.send("an error occurred")
        })

}

module.exports={
    getAttraction,
    addAttraction,
    getAttractionByID
}