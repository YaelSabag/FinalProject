const express = require('express')
const app = express()
//const PORT = process.env.PORT || 3000
const http = require('http')
const Attraction =require('./src/models/attraction');
const Individual =require('./src/controllers/individualController');
const port =  process.env.PORT || 3000

//env
const dotenv=require('dotenv')
//dotenv.config()
const isProd = process.env.APP_ENV === 'prod'
if(!isProd)
    dotenv.config({path:'.env'})




//connect to mongoDB:
const  dbURI = 'mongodb+srv://margalit:cy426316@teampark.lohoh.mongodb.net/TeamPark?retryWrites=true&w=majority'
const mongoose = require ('mongoose')
const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

mongoose.connect(dbURI, connectionParams)
    .then(() => {
        console.log('connected');

    }).catch((err) => {
    console.log(`error connecting ${err}`);
})

// mongoose.connect(process.env.dbURI, {useNewUrlParser: true, useUnifiedTopology: true})
//     .then((result) => {console.log('connected')})
//     .catch ((err)=>console.log(err))

//body parser:
const bodyParser =require('body-parser')
app.use(bodyParser.json())

//app.engine('html', require('ejs').renderFile);
app.use(express.static("src/views/"));
app.set('views engine', 'ejs')

// http status codes
const statusOK = 200;
const statusNotFound = 404;

const hostname = '127.0.0.1';
//const PORT = 3000

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello World\n');
});

app.listen(port, () => {
    console.log(`\nserver is up and running at: http://127.0.0.1:${port}\n` )
})

//routes
app.use('/users', require('./routes/usersAPI'))
app.use('/attraction', require('./routes/attractionAPI'))
app.use('/individual',require('./routes/individualAPI'))

app.get('/', (req,res) => {
    res.send('hellooooooooo');
});






//app.listen(PORT, hostname, ()=> console.log(`server running at: http://${hostname}:${PORT}`))







