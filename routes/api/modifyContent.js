const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const models = require('../../models/fileModel');

const modifyFile = async(data) => {
    const dbResponse = await models.fileModel.updateOne({ name: data.prevName, type: data.type, parent: data.path }, { $set: { name: data.newName } });
    console.log(dbResponse);
    if (dbResponse.nModified > 0)
        return { status: true, response: "update successful" }
    else
        return { status: false, response: "update failed" }
}

const modifyFunction = async(req, res) => {
    const data = await req.body;
    const response = await modifyFile(data);
    if (data.type === 'file')
        return res.send(response);
    if (data.path === '/') {
        data.prevName = data.path + data.prevName;
        data.newName = data.path + data.newName;
    } else {
        data.prevName = data.path + '/' + data.prevName;
        data.neName = data.path + '/' + data.newName;
    }
    let folderUpdateResponse = await models.fileModel.find({ parent: { $regex: data.prevName } });
    if (folderUpdateResponse.length > 0) {
        console.log(data.prevName, data.newName);
        folderUpdateResponse.forEach((e, i) => {
            e.parent = e.parent.replace(`\\${data.prevName}+`, `\\${data.nextName}+`);
            console.log(e);
        })
    }
    console.log(folderUpdateResponse);
    console.trace(data.path);
    return res.send(response);

    // const response = await models.fileModel.find({ parent: data.path });
    // if (response)
    //     res.send({ status: true, response });
    // else
    //     res.send({ status: false, message: "db error occured" });
}

router.use('/', modifyFunction);
router.use("*", (req, res) => res.status(401).send({ status: false, message: " method not allowed" }));
module.exports = router;