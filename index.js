const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000
const http = require('http')

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


// using an array to simulate a database for demonstration purposes
var mockDatabase = [
    {
        fruit: "apple",
        color: "red"
    },
    {
        fruit: "banana",
        color: "yellow"
    }
]

// Handle GET (all) request
app.get('/', function(req, res) {
    // error checking
    if (mockDatabase.length < 1) {
        res.statusCode = statusNotFound;
        res.send('Item not found');
        return;
    }
    // send response
    res.statusCode = statusOK;
    res.send(mockDatabase);
});

// Handle GET (one) request
app.get('/:id', function(req, res) {
    // error checking
    var id = req.params.id;
    if (id < 0 || id >= mockDatabase.length) {
        res.statusCode = statusNotFound;
        res.send('Item not found');
        return;
    }
    // send response
    res.statusCode = statusOK;
    res.send(mockDatabase[id]);
});

// Handle POST request
app.post('/', function(req, res) {
    // get data from request
    var newObject = req.body; // TODO validate data
    mockDatabase.push(newObject);
    // send created item back with id included
    var id = mockDatabase.length - 1;
    res.statusCode = statusOK;
    res.send(`Item added with id ${id}`);
});

// Handle PUT request
app.put('/:id', function(req, res) {
    // replace current object
    var id = req.params.id;     // TODO validate id
    var replacement = req.body; // TODO validate data
    mockDatabase[id] = replacement;
    // report back to the client
    res.statusCode = statusOK;
    res.send(`Item replaced at id ${id}`);
});

// Handle PATCH request
app.patch('/:id', function(req, res) {
    // update current object
    var id = req.params.id;        // TODO validate id
    var newColor = req.body.color; // TODO validate data
    mockDatabase[id].color = newColor;
    // report back to the client
    res.statusCode = statusOK;
    res.send(`Item updated at id ${id}`);
});

// Handle DELETE request
app.delete('/:id', function(req, res) {
    // delete specified item
    var id = req.params.id;  // TODO validate id
    mockDatabase.splice(id, 1);
    // send response back
    res.statusCode = statusOK;
    res.send(`Item deleted at id ${id}`);
});


//routes
app.use('/users', require('./routes/usersAPI'))

app.get('/', (req, res) => {
    console.log('test')
    res.send('hello world')
})

app.listen(PORT, hostname, ()=> console.log(`server running at: http://${hostname}:${PORT}`))





