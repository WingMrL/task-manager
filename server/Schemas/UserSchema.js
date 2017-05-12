var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;

var UserSchema = new Schema({
  userName: {
    type: String
  },
  password: String,
  headImgUrl: String,
  eMail: {
    unique: true,
    type: String,
  },
  teams: [{
    type: ObjectId,
    ref: 'TeamModal'
  }],
  tasks: [{
    type: ObjectId,
    ref: 'TaskModal'
  }],
  applies: [{
    type: ObjectId,
    ref: 'ApplyModal',
  }],
  meta: {
    createAt: {
      type: Date,
      default: Date.now()
    },
    updateAt: {
      type: Date,
      default: Date.now()
    }
  }
});

UserSchema.pre('save', function(next) {
  var user = this;

  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now()
  }
  else {
    this.meta.updateAt = Date.now()
  }

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) {
    return next();
  }

  bcrypt.hash(user.password, SALT_WORK_FACTOR, function(err, hash) {
      if (err) return next(err)

      user.password = hash;

      // console.log('save');

      next();
    })
});

UserSchema.methods = {
  comparePassword: function(_password, cb) {
    bcrypt.compare(_password, this.password, function(err, isMatch) {
      if (err) return cb(err)

      cb(null, isMatch);
    })
  }
}

UserSchema.statics = {
  fetch: function(cb) {
    return this
      .find({})
      .sort('meta.updateAt')
      .exec(cb)
  },
  findById: function(id, cb) {
    return this
      .findOne({_id: id})
      .exec(cb)
  }
}

module.exports = UserSchema;