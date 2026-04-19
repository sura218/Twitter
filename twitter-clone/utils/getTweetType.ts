// utils/getTweetType.ts
import { Tweet } from '@/types/Tweet'

type TweetTypes = 'images' | 'video' | 'poll' | 'text'

export function getTweetType(tweet: Tweet): TweetTypes {
  if (tweet.images) return 'images'
  if (tweet.video) return 'video'
  if (tweet.poll)  return 'poll'
  return 'text'
}