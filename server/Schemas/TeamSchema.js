var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var TeamSchema = new Schema({
  teamName: String,
  projects: [{
    type: ObjectId,
    ref: 'ProjectModal'
  }],
  superManager: {
    type: ObjectId,
    ref: 'UserSchema'
  },
  Manager: [{
    type: ObjectId,
    ref: 'UserSchema'
  }],
  normalUsers: [{
    type: ObjectId,
    ref: 'UserSchema'
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

TeamSchema.pre('save', function(next) {

  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now()
  }
  else {
    this.meta.updateAt = Date.now()
  }

  next();
});

TeamSchema.statics = {
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

module.exports = TeamSchema;