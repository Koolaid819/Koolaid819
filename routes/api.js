const express = require('express');
const Thread = require('../models/Thread');
const Reply = require('../models/Reply');

const router = express.Router();

// POST request to create a thread
router.post('/threads/:board', (req, res) => {
  const { board } = req.params;
  const { text, delete_password } = req.body;

  const newThread = new Thread({
    text,
    delete_password,
    board,
    created_on: new Date(),
    bumped_on: new Date(),
    reported: false,
    replies: []
  });

  newThread.save()
    .then(thread => res.status(201).json(thread))
    .catch(err => res.status(500).json({ error: 'Error creating thread' }));
});

// POST request to create a reply
router.post('/replies/:board', (req, res) => {
  const { board } = req.params;
  const { thread_id, text, delete_password } = req.body;

  const newReply = new Reply({
    text,
    delete_password,
    thread_id,
    created_on: new Date(),
    reported: false
  });

  Thread.findByIdAndUpdate(thread_id, { bumped_on: new Date() })
    .then(() => {
      newReply.save()
        .then(reply => res.status(201).json(reply))
        .catch(err => res.status(500).json({ error: 'Error creating reply' }));
    })
    .catch(err => res.status(500).json({ error: 'Thread not found' }));
});

// GET request to fetch threads with 3 most recent replies
router.get('/threads/:board', (req, res) => {
  const { board } = req.params;

  Thread.find({ board })
    .sort({ bumped_on: -1 })
    .limit(10)
    .populate({
      path: 'replies',
      options: { limit: 3, sort: { created_on: -1 } }
    })
    .then(threads => {
      res.status(200).json(threads.map(thread => {
        thread.replies = thread.replies.map(reply => ({
          _id: reply._id,
          text: reply.text,
          created_on: reply.created_on
        }));

        return {
          _id: thread._id,
          text: thread.text,
          created_on: thread.created_on,
          bumped_on: thread.bumped_on,
          replies: thread.replies
        };
      }));
    })
    .catch(err => res.status(500).json({ error: 'Error fetching threads' }));
});

// GET request to fetch all replies for a single thread
router.get('/replies/:board', (req, res) => {
  const { board } = req.params;
  const { thread_id } = req.query;

  Thread.findById(thread_id)
    .then(thread => {
      if (!thread) return res.status(404).json({ error: 'Thread not found' });

      thread.replies = thread.replies.map(reply => ({
        _id: reply._id,
        text: reply.text,
        created_on: reply.created_on
      }));

      res.status(200).json(thread);
    })
    .catch(err => res.status(500).json({ error: 'Error fetching thread' }));
});

// DELETE request to delete a thread
router.delete('/threads/:board', (req, res) => {
  const { thread_id, delete_password } = req.body;

  Thread.findById(thread_id)
    .then(thread => {
      if (thread.delete_password === delete_password) {
        thread.remove()
          .then(() => res.status(200).json('success'))
          .catch(err => res.status(500).json('Error deleting thread'));
      } else {
        res.status(403).json('incorrect password');
      }
    })
    .catch(err => res.status(500).json('Error deleting thread'));
});

// DELETE request to delete a reply
router.delete('/replies/:board', (req, res) => {
  const { thread_id, reply_id, delete_password } = req.body;

  Reply.findById(reply_id)
    .then(reply => {
      if (reply.delete_password === delete_password) {
        reply.text = '[deleted]';
        reply.save()
          .then(() => res.status(200).json('success'))
          .catch(err => res.status(500).json('Error deleting reply'));
      } else {
        res.status(403).json('incorrect password');
      }
    })
    .catch(err => res.status(500).json('Error deleting reply'));
});

// PUT request to report a thread
router.put('/threads/:board', (req, res) => {
  const { thread_id } = req.body;

  Thread.findByIdAndUpdate(thread_id, { reported: true })
    .then(() => res.status(200).json('reported'))
    .catch(err => res.status(500).json('Error reporting thread'));
});

// PUT request to report a reply
router.put('/replies/:board', (req, res) => {
  const { thread_id, reply_id } = req.body;

  Reply.findByIdAndUpdate(reply_id, { reported: true })
    .then(() => res.status(200).json('reported'))
    .catch(err => res.status(500).json('Error reporting reply'));
});

module.exports = router;
