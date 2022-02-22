const router=require('express').Router()

const algorithmController = require('../controllers/Algorithm')
router.post('/Evolution', algorithmController.Evolution)

module.exports = router