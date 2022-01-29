const router=require('express').Router()

const userController = require('../src/controllers/userControler')
router.get('/getUsers', userController.getUsers)
router.post('/getUserByID', userController.getUserByID)
router.post('/addUser', userController.addUser )
router.post('/updateUser', userController.updateUser)
router.post('/deleteUser', userController.deleteUser)
router.post('/login', userController.login)
module.exports = router
