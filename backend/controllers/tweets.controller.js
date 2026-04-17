import { db } from "../config/firebase.js";
import { FieldValue } from 'firebase-admin/firestore'

// ===== CREATE TWEET =====
export const createTweet = async (req, res) => {
  try {
    const { text, images, poll } = req.body
    const userId = req.userId


    // validation — must have text OR images OR poll
    if (!text && !images?.length && !poll) {
      return res.status(400).json({ message: 'Tweet must have content' })
    }

    // text limit
    if (text && text.length > 280) {
      return res.status(400).json({ message: 'Tweet exceeds 280 characters' })
    }

    // poll validation
    if (poll) {
      if (!poll.options || poll.options.length < 2) {
        return res.status(400).json({ message: 'Poll must have at least 2 options' })
      }
      if (poll.options.length > 4) {
        return res.status(400).json({ message: 'Poll can have max 4 options' })
      }
      if (!poll.duration) {
        return res.status(400).json({ message: 'Poll must have a duration' })
      }
    }

    // image validation
    if (images && images.length > 4) {
      return res.status(400).json({ message: 'Max 4 images allowed' })
    }

    // get user info to embed in tweet
    const userDoc = await db.collection('users').doc(userId).get()
    if (!userDoc.exists) {
      return res.status(404).json({ message: 'User not found' })
    }
    const user = userDoc.data()


    // build tweet object
    const tweetData = {
      userId,
      users: {
        name:     user.name,
        handle:   user.handle,
        avatar:   user.avatar || null,
        verified: user.verified || false,
      },
      text:      text || '',
      images:    images || [],       // array of image URLs
      likes:     0,
      retweets:  0,
      replies:   0,
      views:     0,
      createdAt: new Date().toISOString(),
      // poll — only add if provided
      ...(poll && {
        poll: {
          options: poll.options.map(opt => ({
            label: opt,        // option text
            votes: 0,          // starts at 0
          })),
          totalVotes: 0,
          duration:   poll.duration,   // in hours e.g 24
          expiresAt:  new Date(
            Date.now() + poll.duration * 60 * 60 * 1000
          ).toISOString(),
          voters: [],          // track who voted to prevent double voting
        }
      })
    }

    const tweetRef = await db.collection('tweets').add(tweetData)
    res.status(201).json({ id: tweetRef.id, ...tweetData })

  } catch (err) {
    console.error('CREATE TWEET ERROR: ', err)
    res.status(500).json({ error: err.message })
  }
}

// ===== GET ALL TWEETS (feed) =====
export const getTweets = async (req, res) => {
  try {
    const { limit = 20, startAfter } = req.query
    const userId = req.userId

    let query = db.collection('tweets')
      .orderBy('createdAt', 'desc')
      .limit(Number(limit))

    // pagination — if startAfter provided get next page
    if (startAfter) {
      const lastDoc = await db.collection('tweets').doc(startAfter).get()
      query = query.startAfter(lastDoc)
    }

    const snapshot = await query.get()
    const tweets = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    // last doc id for next page
    const lastVisible = snapshot.docs[snapshot.docs.length - 1]

    res.status(200).json({
      tweets,
      nextPage: lastVisible?.id || null,
    })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// ===== GET SINGLE TWEET =====
export const getTweetById = async (req, res) => {
  console.log("does this work")
  try {
    const { id } = req.params
    

    if (!id) {
      return res.status(400).json({ message: 'Tweet ID is required' })
    }

    const tweetDoc = await db.collection('tweets').doc(id).get()

    if (!tweetDoc.exists) {
      return res.status(404).json({ message: 'Tweet not found' })
    }

    // ✅ JUST RETURN DATA (no extra fetch)
  
    res.status(200).json({
      id: tweetDoc.id,
      ...tweetDoc.data()
    })

  } catch (err) {
    console.log("GET TWEET ERROR:", err)
    res.status(500).json({ error: err.message })
  }
}

export const getTweetsByUser = async (req, res) => {
  try {
    const { userId } = req.params

    const snapshot = await db
      .collection("tweets")
      .where("userId", "==", userId)
      .get()

    const tweets = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    res.status(200).json(tweets)

  } catch (err) {
    console.log("ERROR:", err)
    res.status(500).json({ error: err.message })
  }
}

// ===== DELETE TWEET =====
export const deleteTweet = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.userId

    const tweetRef = db.collection('tweets').doc(id)
    const tweet = await tweetRef.get()

    if (!tweet.exists) {
      return res.status(404).json({ message: 'Tweet not found' })
    }

    // only owner can delete
    if (tweet.data().userId !== userId) {
      return res.status(403).json({ message: 'Not your tweet' })
    }

    await tweetRef.delete()
    res.status(200).json({ message: 'Tweet deleted' })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// ===== LIKE / UNLIKE =====
export const likeTweet = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.userId

    // use userId_tweetId as doc id — prevents double like
    const likeRef = db.collection('likes').doc(`${userId}_${id}`)
    const likeDoc = await likeRef.get()
    const tweetRef = db.collection('tweets').doc(id)

    // check tweet exists
    const tweet = await tweetRef.get()
    if (!tweet.exists) {
      return res.status(404).json({ message: 'Tweet not found' })
    }

    if (likeDoc.exists) {
      // already liked → unlike
      await likeRef.delete()
      await tweetRef.update({ likes: FieldValue.increment(-1) })
      return res.status(200).json({ liked: false, message: 'Unliked' })
    } else {
      // not liked → like
      await likeRef.set({ userId, tweetId: id, createdAt: new Date().toISOString() })
      await tweetRef.update({ likes: FieldValue.increment(1) })
      return res.status(200).json({ liked: true, message: 'Liked' })
    }

  } catch (err) {
    console.log("error: ", err)
    res.status(500).json({ error: err.message })
  }
}

// ===== RETWEET / UNRETWEET =====
export const retweetTweet = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.userId

    const retweetRef = db.collection('retweets').doc(`${userId}_${id}`)
    const retweetDoc = await retweetRef.get()
    const tweetRef = db.collection('tweets').doc(id)

    const tweet = await tweetRef.get()
    if (!tweet.exists) {
      return res.status(404).json({ message: 'Tweet not found' })
    }

    if (retweetDoc.exists) {
      // already retweeted → undo
      await retweetRef.delete()
      await tweetRef.update({ retweets: FieldValue.increment(-1) })
      return res.status(200).json({ retweeted: false, message: 'Unretweeted' })
    } else {
      // not retweeted → retweet
      await retweetRef.set({ userId, tweetId: id, createdAt: new Date().toISOString() })
      await tweetRef.update({ retweets: FieldValue.increment(1) })
      return res.status(200).json({ retweeted: true, message: 'Retweeted' })
    }

  } catch (err) {
    console.log("Retweeterror: ", err)
    res.status(500).json({ error: err.message })
  }
}

// ===== VOTE ON POLL =====
export const votePoll = async (req, res) => {
  try {
    const { id } = req.params
    const { optionIndex } = req.body   // which option user picked (0,1,2,3)
    const userId = req.userId

    const tweetRef = db.collection('tweets').doc(id)
    const tweet = await tweetRef.get()

    if (!tweet.exists) {
      return res.status(404).json({ message: 'Tweet not found' })
    }

    const tweetData = tweet.data()

    // check tweet has a poll
    if (!tweetData.poll) {
      return res.status(400).json({ message: 'This tweet has no poll' })
    }

    // check poll not expired
    if (new Date() > new Date(tweetData.poll.expiresAt)) {
      return res.status(400).json({ message: 'Poll has expired' })
    }

    // check user hasn't voted already
    if (tweetData.poll.voters.includes(userId)) {
      return res.status(400).json({ message: 'You already voted' })
    }

    // check valid option index
    if (optionIndex < 0 || optionIndex >= tweetData.poll.options.length) {
      return res.status(400).json({ message: 'Invalid option' })
    }

    // increment the chosen option votes
    const updatedOptions = tweetData.poll.options.map((opt, i) => ({
      ...opt,
      votes: i === optionIndex ? opt.votes + 1 : opt.votes
    }))

    await tweetRef.update({
      'poll.options':    updatedOptions,
      'poll.totalVotes': FieldValue.increment(1),
      'poll.voters':     FieldValue.arrayUnion(userId),  // add userId to voters
    })

    res.status(200).json({
      message: 'Vote recorded',
      poll: {
        ...tweetData.poll,
        options:    updatedOptions,
        totalVotes: tweetData.poll.totalVotes + 1,
      }
    })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}