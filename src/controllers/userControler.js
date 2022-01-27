const User=require('../models/users')
const mongoose = require ('mongoose')

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
    const { email, password } = req.query
    console.log(req.query)
    const user = User.findOne({ email }).lean()

    if (!user) {
        return res.send({ status: 'error', error: 'Invalid username/password' })
    }

    if (bcrypt.compare(password, user.password)) {
        // the username, password combination is successful

        return res.send({ status: 'ok', data: req.body })
    }

    res.send({ status: 'error', error: 'Invalid username/password' })
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
    })
    user.save()
        .then(response=>{
            res.json({
                message:'User Added successfully'
            })
        })
        .catch(error => {
            res.json({
                message: 'An error POST Occurred!'
            })
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
    user.findByIdAndUpdate(userID,{$set:updateData})
        .then(response=>{
            res.json({
                message:'User Updated successfully'
            })
        })
        .catch(error => {
            res.json({
                message: 'An error Occured!'
            })
        })
}

const deleteUser= (req,res,next)=>{
    const userID=req.body.userID

    user.findByIdAndRemove(userID)
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
    login
}