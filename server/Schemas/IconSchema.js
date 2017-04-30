let mongoose = require('mongoose');
let config = require('../../config/config');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

let IconSchema = new Schema({
  fileName: String,
  iconUrl: String,
  width: Number,
  height: Number,
  labels: [{
    type: ObjectId,
    ref: 'Label',
  }],
  group: {
    type: ObjectId,
    ref: 'Group'
  },
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
})

// var ObjectId = mongoose.Schema.Types.ObjectId
IconSchema.pre('save', function(next) {
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now()
  }
  else {
    this.meta.updateAt = Date.now()
  }

  next()
})

// IconSchema.virtual('iconName').get(function() {
//   return this.fileName.replace(/-timestamp\d+/, '').replace(config.fileSuffixReg, '');
// });

IconSchema.statics = {
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

IconSchema.index({ "$**": "text" });

module.exports =  IconSchema;