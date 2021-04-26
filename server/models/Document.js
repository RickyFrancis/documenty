const { Schema, model } = require('mongoose');

const Document = new Schema({
  _id: String,
  name: String,
  data: Object,
  owner: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  editors: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
      unique: true,
    },
  ],
});

module.exports = model('Document', Document);
