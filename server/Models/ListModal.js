var mongoose = require('mongoose');
var ListSchema = require('../Schemas/ListSchema');
var ListModal = mongoose.model('ListModal', ListSchema);

module.exports = ListModal;