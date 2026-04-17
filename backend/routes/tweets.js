import express from 'express'
//import { protect } from '../middleware/auth.js'
import {
  createTweet,
  getTweets,
  getTweetById,
  getTweetsByUser,
  deleteTweet,
  likeTweet,
  retweetTweet,
  votePoll,
} from '../controllers/tweets.controller.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

router.get('/',        protect,    getTweets)       // GET  /api/tweets       — feed
router.get('/:id',    protect,     getTweetById)    // GET  /api/tweets/:id   — single tweet
router.get('/user/:userId', getTweetsByUser)
router.post('/',       protect,  createTweet)     // POST /api/tweets        — create
router.delete('/:id', protect,     deleteTweet)     // DELETE /api/tweets/:id — delete
router.post('/:id/like', protect,  likeTweet)       // POST /api/tweets/:id/like
router.post('/:id/retweet', protect, retweetTweet)  // POST /api/tweets/:id/retweet
router.post('/:id/vote',  protect, votePoll)        // POST /api/tweets/:id/vote

export default router