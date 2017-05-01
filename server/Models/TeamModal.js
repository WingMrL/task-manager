var mongoose = require('mongoose');
var TeamSchema = require('../Schemas/TeamSchema');
var TeamModal = mongoose.model('TeamModal', TeamSchema);

module.exports = TeamModal;