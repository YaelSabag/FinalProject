const router=require('express').Router()


router.get('/', (req, res) => {
    res.send('hello')
})

router.post('/', (req, res) =>{
    console.log(req.body)
    res.send('route reached')
})
module.exports = router
