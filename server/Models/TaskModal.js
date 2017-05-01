var mongoose = require('mongoose');
var TaskSchema = require('../Schemas/TaskSchema');
var TaskModal = mongoose.model('TaskModal', TaskSchema);

module.exports = TaskModal;