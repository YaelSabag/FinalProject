const router=require('express').Router()

const individualController = require('../src/controllers/individualController')
router.get('/getIndividual', individualController.getIndividual)
router.post('/addIndividual', individualController.addIndividual)
router.put('/creatInitialIndividual', individualController.creatInitialIndividual)
router.get('/Randomization', individualController.Randomization)

module.exports = router