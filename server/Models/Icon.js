let mongoose = require('mongoose');
let IconSchema = require('../Schemas/IconSchema');

let Icon = mongoose.model('Icon', IconSchema);

module.exports = Icon;