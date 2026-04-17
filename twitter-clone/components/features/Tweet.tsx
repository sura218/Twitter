'use client'
import { TweetCard } from "./TweetCard";
import { TweetComposer } from "./TweetCompose";
import { useQuery } from "@tanstack/react-query";
import { getTweets, Tweet } from "@/utils/tweet";

export default function Tweet() {

  const { data, isLoading, error } = useQuery<Tweet[]>({
    queryKey: ['tweets'],
    queryFn: getTweets,
  })

  console.log('TWEETS:', data)

  if (isLoading) return <p>Loading...</p>
  

  return (
    <div className="flex-2 max-w-150 min-h-screen border-r border-border border-b">
      <nav className="sticky top-0 bg-bg border-b border-border px-4 z-10">
        <h1 className="text-xl font-bold py-3">Home</h1>
        <div className="flex">
          <button className="flex-1 font-bold py-4 text-center border-b-2 border-accent">For you</button>
          <button className="flex-1 text-center py-4 text-tx2 text">Following</button>
        </div>
      </nav>

      <div className="">
        <TweetComposer/>
      </div>
      {data?.map((tweet: Tweet) =>(
        <TweetCard key={tweet.id} tweet={tweet}/>
      ))}
    </div>
  )
}
