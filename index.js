const express = require('express')
const app = express()
const PORT = process.env.PORT || 5000

//env
const dotenv=require('dotenv')
dotenv.config()


//connect to mongoDB:
const  dbURI = 'mongodb+srv://margalit:cy426316@teampark.lohoh.mongodb.net/TeamPark?retryWrites=true&w=majority'
const mongoose = require ('mongoose')
mongoose.connect(process.env.dbURI, {useNewUrlParser: true, useUnifiedTopology: true})
    .then((result) => {console.log('connected')})
    .catch ((err)=>console.log(err))

//body parser:
const bodyParser =require('body-parser')
app.use(bodyParser.json())

app.use('/users', require('./routes/users'))

app.get('/', (req, res) => {
    console.log('test')
    res.send('hello world')
})

app.listen(PORT, ()=> console.log(`server running on port: http://localhost:${PORT}`))





