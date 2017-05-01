var mongoose = require('mongoose');
var ProjectSchema = require('../Schemas/ProjectSchema');
var ProjectModal = mongoose.model('ProjectModal', ProjectSchema);

module.exports = ProjectModal;