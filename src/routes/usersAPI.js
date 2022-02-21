const router=require('express').Router()

const userController = require('../controllers/userControler')
router.get('/getUsers', userController.getUsers)
router.post('/getUserByID', userController.getUserByID)
router.post('/addUser', userController.addUser )
router.post('/updateUser', userController.updateUser)
router.post('/selected_attraction_update', userController.selected_attraction_update)
router.post('/deleteUser', userController.deleteUser)
router.post('/login', userController.login)
router.post('/getRoute', userController.getRoute)
module.exports = router
