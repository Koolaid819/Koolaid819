const Thread = require('../models/Thread');
const Reply = require('../models/Reply');

// Create a new thread
exports.createThread = async (req, res) => {
  const { board } = req.params;
  const { text, delete_password } = req.body;

  try {
    const newThread = new Thread({
      text,
      delete_password,
    });

    await newThread.save();
    res.status(200).json(newThread);
  } catch (err) {
    res.status(500).json({ error: 'Error creating thread' });
  }
};

// Get the 10 most recent threads
exports.getThreads = async (req, res) => {
  const { board } = req.params;

  try {
    const threads = await Thread.find()
      .sort({ bumped_on: -1 })
      .limit(10)
      .select('-reported -delete_password')
      .populate({
        path: 'replies',
        select: '-reported -delete_password',
        options: { limit: 3 },
      });

    res.json(threads);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching threads' });
  }
};
