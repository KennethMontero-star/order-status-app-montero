const express = require('express');
const serverless = require('serverless-http');
const router = require('./routes/orderRoutes');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

const MongoDbCloud = 'mongodb+srv://vigocharlesmc:Dtg4NaQe9QZvbdnk@cluster0.5esntvv.mongodb.net/Order?retryWrites=true&w=majority&appName=Cluster0';

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

mongoose
  .connect(MongoDbCloud)
  .then(()=> console.log('Connected to MongoDB'))
  .catch((err)=>console.error('Failed to connect to MongoDB'));

app.use('/.netlify/functions/api', router);
module.exports.handler = serverless(app);
