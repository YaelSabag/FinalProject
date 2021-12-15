import express from "express";
import bodyParser from 'body-parser'

import usersRout from './routes/users.js'
const app=express()
const PORT=5000
app.use(bodyParser.json())
app.use('/users', usersRout)
app.get('/', (req, res) => {
    console.log('test')
    res.send('hello world')
})

app.listen(PORT, ()=> console.log(`server running on port: http://localhost:${PORT}`))





