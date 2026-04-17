// utils/getTweetType.ts
import { Tweet } from '@/types/Tweet'

type TweetType = 'image' | 'video' | 'poll' | 'text'

export function getTweetType(tweet: Tweet): TweetType {
  if (tweet.image) return 'image'
  if (tweet.video) return 'video'
  if (tweet.poll)  return 'poll'
  return 'text'
}