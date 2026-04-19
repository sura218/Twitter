import { getTweetType } from '@/utils/getTweetType'
import { TweetImage } from './TweetImage'
import { TweetPoll } from './TweetPoll'
import { Tweet } from '@/utils/tweet'
import { cn } from '@/utils/cn'

interface TweetContentProps {
  tweet: Tweet
}

export function TweetContent({ tweet }: TweetContentProps) {
  //const type = getTweetType(tweet)


  return (
    <div>
      {/* text always shows */}
      <p className="text-tx text-sm leading-relaxed mt-0.5">
        {tweet.text}
      </p>

      {/* then render the right media below it */}
        {tweet.images?.length === 1 && (
          <TweetImage src={tweet.images[0]} alt={tweet.text} />
        )}

        {tweet.images?.length > 1 && (
          <div
            className={cn(
              'grid gap-2 mt-3 rounded-2xl overflow-hidden',
              tweet.images.length === 2 && 'grid-cols-2',
              tweet.images.length === 3 && 'grid-cols-2',
              tweet.images.length === 4 && 'grid-cols-2'
            )}
          >
            {tweet.images.map((src, i) => (
              <div
                key={i}
                className={cn(
                  'relative overflow-hidden bg-bg2',
                  tweet.images.length === 2 && 'h-[200px]',
                  tweet.images.length === 3 && i === 0 && 'row-span-2 h-[400px]',
                  tweet.images.length === 3 && i !== 0 && 'h-[195px]',
                  tweet.images.length === 4 && 'h-[195px]'
                )}
              >
                <img
                  src={src}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}

      { tweet.poll && (
        <TweetPoll
          options={tweet.poll.options}
          totalVotes={tweet.poll.totalVotes}
          expiresAt={tweet.poll.expiresAt}
          tweetId={tweet.id}
        />
      )}

    </div>
  )
}