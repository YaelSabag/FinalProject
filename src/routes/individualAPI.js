const router=require('express').Router()

const individualController = require('../controllers/individualController')
router.get('/getIndividual', individualController.getIndividual)
router.post('/addIndividual', individualController.addIndividual)
router.post('/creatInitialIndividual', individualController.creatInitialIndividual)
router.get('/Randomization', individualController.Randomization)
router.post('/makePopulation', individualController.makePopulation)
router.delete('/deleteAllIndividual',individualController.deleteAllIndividual)
// router.delete('/deleteIndividual',individualController.deleteIndividual)
module.exports = router
