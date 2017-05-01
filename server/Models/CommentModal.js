var mongoose = require('mongoose');
var CommentSchema = require('../Schemas/CommentSchema');
var CommentModal = mongoose.model('CommentModal', CommentSchema);

module.exports = CommentModal;