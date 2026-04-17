import { Tweet } from "@/types/Tweet";


export const tweets: Tweet[] = [
  {
    id: '1',
    author: { name: 'Sarah Dev', handle: 'sarahdev' },
    text: 'Just a text tweet nothing else',
    createdAt: '2h',
    likes: 100, retweets: 20, replies: 5, views: 5000,
    // no image/video/poll → renders as text only
  },
  {
    id: '2',
    author: { name: 'Mark K', handle: 'markk', verified: true },
    text: 'Check out this screenshot',
    createdAt: '5h',
    likes: 200, retweets: 50, replies: 10, views: 10000,
    image: '/screenshot.png',  // ← renders TweetImage
  },
  {
    id: '3',
    author: { name: 'Lee Chen', handle: 'leec' },
    text: 'Which framework?',
    createdAt: '8h',
    likes: 500, retweets: 100, replies: 80, views: 50000,
    poll: {                     // ← renders TweetPoll
      options: [
        { label: 'Next.js', votes: 620 },
        { label: 'Remix',   votes: 240 },
        { label: 'Nuxt',    votes: 140 },
      ],
      totalVotes: 1000,
      expiresAt: '11 hours left',
    }
  },
  {
    id:'4',
    author: {name: 's U', handle:'su'},
    text:'just a text',
    image:'/pexels.jpg',
    createdAt: '2h',
    likes: 100, retweets: 20, replies: 5, views: 5000,
  },
  {
    id:'5',
    author: {name: 's U', handle:'su'},
    text:'just a text',
    video:'/Forever.mp4',
    createdAt: '2h',
    likes: 100, retweets: 20, replies: 5, views: 5000,
  },
  
]