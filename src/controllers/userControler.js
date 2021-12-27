const User=require('../models/users')


//show the list of Users
const getUsers= (req,res,next)=> {
    User.find()
        .then(response => {
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

const getUserByID= (req,res,next)=>{
    let userID=req.body.userID
    User.findById(userID)
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
    const user=new User({
        userID:req.body.userID,
        firstName:req.body.firstName,
        lastName:req.body.lastName,
        telephone:req.body.telephone,
        age:req.body.age,
        height:req.body.height
    })
    user.save()
        .then(response=>{
            res.json({
                message:'User Added successfully'
            })
        })
        .catch(error => {
            res.json({
                message: 'An error Occured!'
            })
        })
}


const updateUser= (req,res,next)=>{
    const userID=req.body.userID
        const updateData= {
            userID: req.body.userID,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            telephone: req.body.telephone,
            age: req.body.age,
            height: req.body.height
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
    deleteUser
}