var mongoose = require('mongoose');
var UserSchema = require('../Schemas/UserSchema');
var UserModal = mongoose.model('UserModal', UserSchema);

module.exports = UserModal;