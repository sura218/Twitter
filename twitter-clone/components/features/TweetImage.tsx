import Image from 'next/image'

export function TweetImage({ src, alt }: { src: string; alt: string }) {
  console.log("src")
  return (
    <div className="mt-3 rounded-2xl overflow-hidden border border-border relative w-full h-75">
      <img
        src={src}          
        alt={alt}
        className="object-cover"
      />
    </div>
  )
}