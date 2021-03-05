const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const models = require('../../models/fileModel');
const addFunction = async(req, res) => {
    console.log(req.method);
    const data = await req.body;
    const doExist = await models.fileModel.findOne({ name: data.name, type: data.type, parent: data.parent });
    if (doExist)
        return res.send({ status: false, reason: "duplicate entry" });

    // if here then file/folder doesnot exist, add it
    const doc = new models.fileModel(data);
    const dbResponse = await doc.save();
    if (dbResponse) {
        if (data.parent !== '/') {
            console.log(data.parent);
            data.name = data.parent.slice(data.parent.lastIndexOf('/') + 1);
            data.parent = data.parent.slice(0, data.parent.lastIndexOf('/'));
            if (data.parent == "")
                data.parent = "/";
            await models.fileModel.updateOne({ name: data.name, parent: data.parent }, { $inc: { size: data.size } });
        }
        res.send({ status: true, response: "added succssfully" });
    } else
        res.send({ status: false, reason: "database error" });
}
router.use('/', addFunction);
router.use("*", (req, res) => {
    console.log(req.url);
    res.send("fail to add")
});
module.exports = router;