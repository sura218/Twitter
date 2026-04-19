// types/tweet.ts
export interface Tweet {
  id: string
  author: {
    name: string
    handle: string
    avatar?: string
    verified?: boolean
  }
  text: string
  createdAt: string
  likes: number
  retweets: number
  replies: number
  views: number
  isLiked?: boolean
  isRetweeted?: boolean

  // content — all optional, only one should exist at a time
  images?: string[]        // image URL
  video?: string        // video URL
  poll?: {
    options: { label: string; votes: number }[]
    totalVotes: number
    expiresAt: string
  }
}

