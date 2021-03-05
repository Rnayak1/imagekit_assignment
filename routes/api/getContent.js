const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const models = require('../../models/fileModel');

const getFunction = async(req, res) => {
    const data = await req.body;
    const response = await models.fileModel.find({ parent: data.path });
    if (response)
        res.send({ status: true, response });
    else
        res.send({ status: false, message: "db error occured" });
}
const getSortedContent = async(req, res) => {
    console.log("get")
    const data = await req.body;
    const response = await models.fileModel.find({ parent: data.path }).sort({ createdAt: -1 });
    if (response)
        res.send({ status: true, response });
    else
        res.send({ status: false, message: "db error occured" });
}

const getSearchContent = async(req, res) => {
    const data = await req.body;
    const response = await models.fileModel.find({ parent: data.path, name: { $regex: data.name } });
    if (response.length)
        return res.send({ status: true, response });
    else
        return res.send({ status: false, message: "no result found" });
}
router.post('/reverse', getSortedContent);
router.post('/search', getSearchContent);
router.post('/', getFunction);
router.use("*", (req, res) => res.status(401).send({ status: false, message: " method not allowed" }));
module.exports = router;