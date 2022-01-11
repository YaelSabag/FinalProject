const router=require('express').Router()
const attractionControler = require('../src/controllers/attractionControler')

router.get('/getAttraction', attractionControler.getAttraction)
router.post('/addAttraction', attractionControler.addAttraction)

module.exports = router
