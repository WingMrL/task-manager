let mongoose = require('mongoose');
let LabelSchema = require('../Schemas/LabelSchema');

let Label = mongoose.model('Label', LabelSchema);

module.exports = Label;