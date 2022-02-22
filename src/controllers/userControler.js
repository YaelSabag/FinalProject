const User=require('../models/users')
const mongoose = require ('mongoose')
const {bcrypt} = require("buffer");
const general = require('../models/generalVariables')
const Individual = require('../models/individual')
const Attraction = require('../models/attraction')



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
            res.send(response)

        }
        else {
            res.send('Invalid password')
            console.log('Invalid password')
        }
    })
        .catch(error => {
            res.send('Invalid username')
            console.log('Invalid username')

        })
}




const getUserByID= (req,res,next)=>{
    console.log('getUserByID')
    let userID=req.query.userID
    User.findOne({userID:userID})
        .then(response=>{
            res.send(response)

        })
        .catch(error => {
            res.send('user not found')
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
        // userID:222,
        // fullName:"gal",
        // email:"gal@gmail.com",
        // password:"123456",
        // age:22,
        // height:1.78,
        // selected_attractions:[5,4,2,3]
    })
    user.save()
        .then(response=>{
            res.send(response)
        })
        .catch(error => {
            res.send( 'An error POST Occurred!')
        })
}


const updateUser= (req,res,next)=>{
    console.log("updateUser")
    console.log(req.query)
    const userID=req.query.userID
    const updateData= {
        //userID:req.query.userID,
        fullName:req.query.fullName,
        //email:req.query.email,
        password:req.query.password,
        age:req.query.age,
        height:req.query.height
    }
    User.findOneAndUpdate({userID},{$set:updateData})
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

const add_hours =  function (dt, hours) {
    return new Date(dt.getTime() + hours*3600000);
}


const remove_minutes =  function (dt, minutes) {
    return new Date(dt.getTime() - minutes*60000);
}
const getRoute=async (req, res) => {
    console.log("getRoute", req.body)
    console.log("req.body",req.body)
    console.log("req.params", req.params)
    let id = req.query.userID
    let schedule = []
    let attractionsRound = []
    console.log("id",id)
    Attraction.find().sort({attractionID: 1}).then(answer => {
        answer.forEach(function (u) {
            attractionsRound.push(u.Round)
        })
    })
    general.findOne({name: 'flag'})
        .then( r => {
            console.log(r)
            if (r.flag == 0) {
                console.log("flag", r.flag)
                res.send(r)
            } else {
                //console.log("else", r.flag)
                Individual.findOne({selected: true}).then(result => {
                    console.log("result", result)
                    //console.log(result)
                    result.array.forEach(function (u) {
                        if (u[1] == id) {
                            schedule.push(u[0])
                            schedule.push(u[2])
                        }
                    })
                    console.log("schedule",schedule)
                    console.log("schedule[1]",schedule[1])
                    for (let i = 0; i < schedule[1].length; i++) {
                        console.log(schedule[1][i])
                        let d = remove_minutes(schedule[1][i], attractionsRound[parseInt(schedule[0][i]) - 1])
                        //d = add_hours(d, 2)
                        //console.log(d.toLocaleTimeString('en-GB'));

                        let temp = d.toLocaleTimeString('he-IL',{timeZone:'Asia/Jerusalem'}).replace(/(.*)\D\d+/, '$1').toString();

                        //let day = d.format('{hh}:{mm}')
                        schedule[1][i] = temp
                        console.log(schedule[1][i])
                    }
                    console.log("attractionsRound", attractionsRound)
                    console.log("schedule", schedule)
                    res.json({
                        "attractions": schedule[0],
                        "times": schedule[1]
                    })
                })
            }
        })
        .catch(error => {
            res.send("error getRoute")
        })


}


// console.log(new Date(d.getFullYear(),d.getMonth(),d.getDate()))
// console.log(remove_minutes(new Date(d.getFullYear(),d.getMonth(),d.getDate()), 5))

// d = new Date()
// d = remove_minutes(new Date(), 5)
// c = d.toLocaleTimeString().replace(/(.*)\D\d+/, '$1');
// console.log(c.toString())

module.exports={
    getUsers,
    getUserByID,
    addUser,
    updateUser,
    deleteUser,
    login,
    selected_attraction_update,
    getRoute
}