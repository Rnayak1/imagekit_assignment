const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const models = require('../../models/fileModel');

const deleteFile = async(data) => {
    const dbResponse = await models.fileModel.deleteOne({ name: data.name, type: data.type, parent: data.path });
    console.table(dbResponse);
    if (dbResponse.deletedCount > 0)
        return { status: true, response: "delete successful" }
    else
        return { status: false, response: "delete failed" }
}

const deleteFunction = async(req, res) => {
    const data = await req.body;
    console.log(data);
    const response = await deleteFile(data);
    if (data.type === 'file')
        return res.send(response);

    if (data.path === '/') {
        data.path = data.path + data.name;
    } else {
        data.path = data.path + '/' + data.name;
    }
    console.trace(data.path)
    let deleteResult = await models.fileModel.deleteMany({ parent: { $regex: data.path } });
    console.trace(deleteResult);
    return res.send({ status: true, response: "deleted successfully" });
}

router.use('/', deleteFunction);
router.use("*", (req, res) => res.status(401).send({ status: false, message: " method not allowed" }));
module.exports = router;