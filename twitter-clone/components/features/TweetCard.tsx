// components/tweet/TweetCard.tsx
'use client'
import { useState } from 'react'
import { Heart, MessageCircle, Repeat2, BarChart2, Bookmark } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { TweetContent } from './TweetContent'
import { cn } from '@/utils/cn'
import { formatDate } from '@/utils/formatDate'
import { likeTweet, retweetTweet, Tweet } from '@/utils/tweet'
import { User } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query'

interface TweetCardProps {
  tweet: Tweet
}

export function TweetCard({ tweet }: TweetCardProps) {
  const [liked, setLiked] = useState(tweet.isLiked ?? false)
  const [retweeted, setRetweeted] = useState(tweet.isRetweeted ?? false)
  const [likeCount, setLikeCount] = useState(tweet.likes)
  const [retweetCount, setRetweetCount] = useState(tweet.retweets)

  const queryClient = useQueryClient()

  const likeMutation = useMutation({
    mutationFn: () => likeTweet(tweet.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tweets'] })
    }
  })

  const retweetMutation = useMutation({
    mutationFn: () => retweetTweet(tweet.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tweets'] })
    }
  })


  //console.log("Tweets image: ", tweet)

  return (
    <article className="flex gap-3 px-4 py-3 border-b border-border hover:bg-bg2 cursor-pointer transition-colors">

      {/* left — avatar */}
      <Avatar
        name={tweet.users.name}
        src={tweet.users.handle}
        size="md"
      />

      {/* right — everything else */}
      <div className="flex-1 min-w-0">

        {/* header */}
        <div className="flex items-center gap-1 flex-wrap">
          <span className="font-bold text-tx text-sm">
            {tweet.users.name}
          </span>

          <span className="text-tx2 text-sm">
            @{tweet.users.handle} · {formatDate(tweet.createdAt)}
          </span>
        </div>

        {/* content — text + image/video/poll if any */}
        <TweetContent tweet={tweet} />

        {/* actions */}
        <div className="flex mt-3 gap-1">
          <button className="flex items-center gap-1.5 flex-1 text-tx2 text-sm p-1.5 rounded-full hover:text-accent hover:bg-acl transition-colors">
            <MessageCircle size={16} />
            <span>{tweet.replies.toLocaleString()}</span>
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); setRetweeted(prev => !prev); retweetMutation.mutate();
              setRetweetCount(prev =>
                retweeted ? prev - 1 : prev + 1
              )
             }}
            className={cn(
              'flex items-center gap-1.5 flex-1 text-sm p-1.5 rounded-full transition-colors',
              retweeted
                ? 'text-retweet'
                : 'text-tx2 hover:text-retweet hover:bg-rtl'
            )}
          >
            <Repeat2 size={16} />
            <span>{retweetCount.toLocaleString()}</span>
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); setLiked(prev => !prev); likeMutation.mutate();
              setLikeCount(prev =>
                liked ? prev - 1 : prev + 1
              )
             }}
            className={cn(
              'flex items-center gap-1.5 flex-1 text-sm p-1.5 rounded-full transition-colors',
              liked
                ? 'text-like'
                : 'text-tx2 hover:text-like hover:bg-lkl'
            )}
          >
            <Heart size={16} fill={liked ? 'currentColor' : 'none'} />
            <span>{likeCount.toLocaleString()}</span>
          </button>

          <button className="flex items-center gap-1.5 flex-1 text-tx2 text-sm p-1.5 rounded-full hover:text-accent hover:bg-acl transition-colors">
            <BarChart2 size={16} />
            <span>{tweet.views.toLocaleString()}</span>
          </button>

          <button className="flex items-center gap-1.5 text-tx2 text-sm p-1.5 rounded-full hover:text-accent hover:bg-acl transition-colors">
            <Bookmark size={16} />
          </button>
        </div>
      </div>
    </article>
  )
}