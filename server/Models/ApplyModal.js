var mongoose = require('mongoose');
var ApplySchema = require('../Schemas/ApplySchema');
var ApplyModal = mongoose.model('ApplyModal', ApplySchema);

module.exports = ApplyModal;