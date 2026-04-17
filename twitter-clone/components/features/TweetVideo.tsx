// components/tweet/TweetVideo.tsx
/*interface TweetVideoProps {
  src: string
}*/

export function TweetVideo({ src }: {src: string}) {
  return (
    <div className="mt-3 rounded-2xl overflow-hidden border border-border">
      <video
        src={src}
        controls
        playsInline
        className="w-full max-h-125] object-cover"
      />
    </div>
  )
}