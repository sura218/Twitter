import newRequest from "./newRequests"
import { User } from "./Portfolio"

export interface PollOption {
  label: string
  votes: number
}

export interface Poll {
  options:    PollOption[]
  totalVotes: number
  duration:   number        
  expiresAt:  string        
  voters:     string[]      
  hasVoted?:  boolean       
  votedIndex?: number       
}

export interface Tweet {
  id:          string
  users:        User
  text:        string
  images:      string[]     
  poll?:       Poll         
  likes:       number
  retweets:    number
  replies:     number
  views:       number
  createdAt:   string      
  isLiked?:    boolean      
  isRetweeted?: boolean     
  isBookmarked?: boolean    
}


export interface CreateTweetPayload {
  text:    string
  images?: string[]
  poll?: {
    options:  string[]   
    duration: number     
  }
}




export const getTweets = async (): Promise<Tweet[]> => {
  const res = await newRequest.get('/tweets')
  return res.data.tweets
}

// GET — single tweet
export const getTweetById = async (id: string): Promise<Tweet> => {
  const res = await newRequest.get(`/tweets/${id}`)
  return res.data
}
export const getUserTweets = async (userId: string) => {
  const res = await newRequest.get(`/tweets/user/${userId}`)
  return res.data
}

// POST — create
export const createTweet = async (tweet: CreateTweetPayload): Promise<Tweet> => {
  const res = await newRequest.post('/tweets', tweet)
  return res.data
}

// DELETE — delete
export const deleteTweet = async (id: string): Promise<void> => {
  const res = await newRequest.delete(`/tweets/${id}`)
  return res.data
}

// POST — like / unlike
export const likeTweet = async (id: string) => {
  const res = await newRequest.post(`/tweets/${id}/like`)
  return res.data
}

export const retweetTweet = async (id: string) => {
  const res = await newRequest.post(`/tweets/${id}/retweet`)
  return res.data
}

// POST — vote on poll
export const votePoll = async (id: string, optionIndex: number): Promise<void> => {
  const res = await newRequest.post(`/tweets/${id}/vote`, { optionIndex })
  return res.data
}