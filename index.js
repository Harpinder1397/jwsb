// Import packages
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


mongoose.connect('mongodb+srv://Harpinder0:harpindersingh@cluster0.vl3kis6.mongodb.net/sell3cart?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
  .then(() => console.log('I am connected'))
  .catch(error => console.log(error));

app.use(bodyParser.json())
app.use(cors())

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


// Middlewares
app.use(express.json());

// Routes
app.use("/state", getAllStates);

// connection
const port = process.env.PORT || 9001;
app.listen(port, () => console.log(`Listening to port ${port}`));
