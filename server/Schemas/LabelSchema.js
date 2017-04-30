let mongoose = require('mongoose');
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

let LabelSchema = new Schema({
  labelName: String,
  icons: [{
    type: ObjectId,
    ref: 'Icon',
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
})

// var ObjectId = mongoose.Schema.Types.ObjectId
LabelSchema.pre('save', function(next) {
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now()
  }
  else {
    this.meta.updateAt = Date.now()
  }

  next()
})

LabelSchema.statics = {
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
  },
  findByLabelName: function(name, cb) {
    return this
      .findOne({labelName: name})
      .exec(cb);
  }
}

LabelSchema.index({ labelName: "text" });

module.exports =  LabelSchema;