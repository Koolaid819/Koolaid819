const mongoose = require('mongoose');

const threadSchema = new mongoose.Schema({
  text: { type: String, required: true },
  created_on: { type: Date, default: Date.now },
  bumped_on: { type: Date, default: Date.now },
  reported: { type: Boolean, default: false },
  delete_password: { type: String, required: true },
  replies: [
    {
      text: { type: String, required: true },
      created_on: { type: Date, default: Date.now },
      delete_password: { type: String, required: true },
      reported: { type: Boolean, default: false },
    },
  ],
});

module.exports = mongoose.model('Thread', threadSchema);
