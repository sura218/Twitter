// lib/api.ts

import newRequest from "@/utils/newRequests"

export const fetchFeed = async () => {
  const res = await newRequest.get('/tweets')
  return res.data
}

export const createTweet = async (text: string) => {
  const res = await newRequest.post('/tweets', { text })
  return res.data
}