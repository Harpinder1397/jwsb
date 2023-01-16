window = {}

const express = require('express')
const dotenv = require('dotenv');
const bodyParser = require('body-parser')
const cors = require("cors")
const app = express()
const swaggerUi = require('swagger-ui-express')
const mongoose = require('mongoose')
// var http = require('http');

const swaggerDocument = require('./swagger.json')

const getAllStates = require('./routes/states')
const PORT = process.env.PORT || 9001;
// const PORT = 3000;

mongoose.connect('mongodb+srv://Harpinder0:harpindersingh@cluster0.vl3kis6.mongodb.net/sell3cart?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
  .then(() => console.log('I am connected'))
  .catch(error => console.log(error));

app.use(bodyParser.json())
app.use(cors())

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (_, res) => {
  res.json({ message: "hello there" })
})

// This is for test api call

app.get('/dummy', (_, res) => {
  res.json({ message: "Test is passed" })
})

app.use(express.static('public'));
// app.use(express.json());

app.use("/state", getAllStates)

app.listen(PORT, () => console.log('server started'))
