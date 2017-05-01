var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var ProjectSchema = new Schema({
  projectName: String,
  description: {
    type: String,
    default: ''
  },
  archive: {
    type: Boolean,
    default: false,
  },
  teams: {
    type: ObjectId,
    ref: 'TeamModal'
  },
  members: [{
    type: ObjectId,
    ref: 'UserModal'
  }],
  lists: [{
    type: ObjectId,
    ref: 'ListModal'
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

ProjectSchema.pre('save', function(next) {

  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now()
  }
  else {
    this.meta.updateAt = Date.now()
  }

  next();
});

ProjectSchema.statics = {
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

module.exports = ProjectSchema;