const express = require('express');
const router = express.Router();
const threadsController = require('../controllers/threadsController');
const repliesController = require('../controllers/repliesController');

// Routes for threads
router.post('/threads/:board', threadsController.createThread);
router.get('/threads/:board', threadsController.getThreads);

// Routes for replies
router.post('/replies/:board', repliesController.createReply);
router.get('/replies/:board', repliesController.getThreadReplies);

module.exports = router;
