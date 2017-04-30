let mongoose = require('mongoose');
let GroupSchema = require('../Schemas/GroupSchema');

let Group = mongoose.model('Group', GroupSchema);

module.exports = Group;