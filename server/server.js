const express = require('express')
const app = express()
var bodyParser = require('body-parser')
const path = require('path');
const port = 3001;
var cors = require('cors');
const mongoose = require('mongoose');
const Model = require('./models/Dao');
// require('./generate-dao');
const generator = require('./generate-dao');


app.use(cors())

app.use(bodyParser.json());
app.use(express.json())
app.use(express.urlencoded({ extended: false }))


app.post("/server/generate-dao", function (req, res) {
    console.log(req.body);
    res.send('Post success!')
    generator(req.body)
  })




app.get('/daos', async (req, res) => {
    Model.find({}, (err, result) => {
    if(err) throw err;
    console.log(result)
    res.send(result)
  })
})

app.get('/', (req, res) => {
  res.send("Test")
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})