require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

const mongoUrl = process.env.DATABASE;
console.log(mongoUrl);
const conn = mongoose.connect(mongoUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    })
    .then(res => { console.log("connected") })
    .catch(err => console.log(err))

app.use(bodyParser.json());
app.use(cors());
// const routes = {
const addContent = require('./routes/api/addContent');
const getContent = require('./routes/api/getContent.js');
const modifyContent = require('./routes/api/modifyContent');
const deleteContent = require('./routes/api/deleteContent')
    //}
app.post('/api/addContent', addContent);
app.use('/api/getContent', getContent);
app.post('/api/modifyContent', modifyContent);
app.post('/api/deleteContent', deleteContent);
app.all('*', (req, res) => {
    console.log(req.body, req.url);
    res.send("api success")
});

app.listen(5000, () => console.log('running'));