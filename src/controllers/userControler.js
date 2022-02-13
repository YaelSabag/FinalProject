const User=require('../models/users')
const mongoose = require ('mongoose')
const {bcrypt} = require("buffer");

//show the list of Users
const getUsers= (req,res)=> {
    console.log('getUsers')
    User.find()
        .then(response => {
            res.send(response)
            console.log('getUsers')
        })
        .catch(error => {
            res.send("nnnn")

        })
}

const login= (req, res) => {
    console.log('login func')
    let email=req.query.email
    let password=req.query.password
    console.log(req.query)
    User.findOne({ email }).then(response => {
        if (password == response.password) {
            res.send('ok')
        }
        else {
            res.send('Invalid password')
        }
    })
    .catch(error => {
        res.send('Invalid username')

    })
}



const getUserByID= (req,res,next)=>{
    let userID=req.query.userID
    User.find(userID)
        .then(response=>{
            res.json({
                response
            })
        })
        .catch(error => {
            res.json({
                message: 'An error Occured!'
            })
        })

}

const addUser= (req,res,next)=>{
    console.log("body", req.body)
    console.log("params", req.params)
    console.log("query", req.query)
    const user=new User({
        userID:req.query.userID,
        fullName:req.query.fullName,
        email:req.query.email,
        password:req.query.password,
        age:req.query.age,
        height:req.query.height
        // userID:9090,
        // fullName:"yael",
        // email:"yyyy@gmail.com",
        // password:"123456",
        // age:22,
        // height:1.78,
        // selected_attractions:[2,3,4,1]
    })
    user.save()
        .then(response=>{
            res.send('User added successfully')
        })
        .catch(error => {
                res.send( 'An error POST Occurred!')
        })
}


const updateUser= (req,res,next)=>{
    const userID=req.body.userID
        const updateData= {
            userID:req.query.userID,
            fullName:req.query.fullName,
            email:req.query.email,
            password:req.query.password,
            age:req.query.age,
            height:req.query.height
        }
    User.findByIdAndUpdate(userID,{$set:updateData})
        .then(response=>{
            res.send('User Updated successfully')
        })
        .catch(error => {
            res.send( 'An error Occurred!')
        })
}


const selected_attraction_update = (req,res,next)=>{
    console.log("selected_attraction_update")
    const userID=req.query.userID
    const selected_attractions_update = req.query.selected_attractions
    console.log(req.query)
    User.findOneAndUpdate({userID},{$set:{selected_attractions:selected_attractions_update}})
        .then(response=>{
            res.send('User Updated successfully')
        })
        .catch(error => {
            res.send( 'An error Occurred!')
        })
}


const deleteUser= (req,res,next)=>{
    const userID=req.body.userID
    User.findByIdAndRemove(userID)
        .then(response=>{
            res.json({
                message:'User Deleted successfully'
            })
        })
        .catch(error => {
            res.json({
                message: 'An error Occured!'
            })
        })
}



module.exports={
    getUsers,
    getUserByID,
    addUser,
    updateUser,
    deleteUser,
    login,
    selected_attraction_update
}