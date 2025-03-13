const Thread = require('../models/Thread');
const Reply = require('../models/Reply');

// Create a new reply
exports.createReply = async (req, res) => {
  const { board } = req.params;
  const { thread_id, text, delete_password } = req.body;

  try {
    const thread = await Thread.findById(thread_id);

    if (!thread) {
      return res.status(404).json({ error: 'Thread not found' });
    }

    const newReply = new Reply({
      text,
      thread_id,
      delete_password,
    });

    thread.replies.push(newReply);
    thread.bumped_on = new Date();
    await thread.save();
    await newReply.save();

    res.status(200).json(newReply);
  } catch (err) {
    res.status(500).json({ error: 'Error creating reply' });
  }
};

// Get a single thread with replies
exports.getThreadReplies = async (req, res) => {
  const { board } = req.params;
  const { thread_id } = req.query;

  try {
    const thread = await Thread.findById(thread_id)
      .select('-reported -delete_password')
      .populate('replies', '-reported -delete_password');

    if (!thread) {
      return res.status(404).json({ error: 'Thread not found' });
    }

    res.json(thread);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching thread replies' });
  }
};
