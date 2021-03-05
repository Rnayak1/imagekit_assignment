const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fileModel = mongoose.model('fileModel', new Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        required: true
    },
    parent: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
}), 'fileModel');

module.exports = {
    fileModel
}