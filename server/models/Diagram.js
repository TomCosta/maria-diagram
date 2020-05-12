// models/Diagram.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let diagramSchema = new Schema({
    orgItem: [{
        type: Object
    }],
    orgLink: [{
        type: Object
    }]
}, {
    collection: 'diagrams'
})
module.exports = mongoose.model('Diagram', diagramSchema)