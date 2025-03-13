const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
  text: { type: String, required: true },
  delete_password: { type: String, required: true },
  created_on: { type: Date, default: Date.now },
  reported: { type: Boolean, default: false },
  thread_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Thread', required: true }
});

module.exports = mongoose.model('Reply', replySchema);
