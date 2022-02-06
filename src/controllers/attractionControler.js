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
        attractionID:55,
        name: '55',
        Round: 3,
        countNow: 0,
        capacity:3
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


function getAttractionByID(id){
    var myquery = {attractionID:id }
    // let attractionID=req.query
    Attraction.find(myquery)
        .then(response=>{
            res.send(response)
        })
        .catch(error => {
            res.json({
                message: 'attraction!'
            })
        })

}

const getAttractionByID= (id)=>{
    let attractionID = id
    Attraction.findOne({attractionID})
        .then(response=>{
            return response
        })
        .catch(error => {
            return "an error occurred"
        })
}

module.exports={
    getAttraction,
    addAttraction,
    getAttractionByID
}