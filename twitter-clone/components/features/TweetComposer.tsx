'use client'
import { useState } from 'react'
import { Search } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { cn } from '@/utils/cn'

// ===== TYPES =====
interface TrendItem {
  category: string
  name: string
  posts: string
}

interface SuggestedUser {
  name: string
  handle: string
  avatar?: string
  verified?: boolean
}

// ===== STATIC DATA (replace with API later) =====
const trends: TrendItem[] = [
  { category: 'Technology · Trending', name: '#NextJS15',           posts: '42.1K posts' },
  { category: 'Trending in Netherlands', name: '#TypeScript',       posts: '18.4K posts' },
  { category: 'Technology · Trending', name: '#OpenAI',             posts: '211K posts'  },
  { category: 'Sports · Trending',    name: 'Champions League',     posts: '94.7K posts' },
  { category: 'Science · Trending',   name: 'James Webb Telescope', posts: '33.2K posts' },
]

const suggestions: SuggestedUser[] = [
  { name: 'Vercel',        handle: 'vercel',      verified: true  },
  { name: 'React Weekly',  handle: 'reactweekly'                  },
  { name: 'Lee Robinson',  handle: 'leeerob',     verified: true  },
]

// ===== SUB COMPONENTS =====

function SearchBar() {
  const [focused, setFocused] = useState(false)
  const [query, setQuery] = useState('')

  return (
    <div className={cn(
      'flex items-center gap-3 bg-bg2 rounded-full px-4 py-2.5 border transition-colors',
      focused ? 'border-accent bg-bg' : 'border-transparent'
    )}>
      <Search
        size={16}
        className={cn(
          'flex-shrink-0 transition-colors',
          focused ? 'text-accent' : 'text-tx2'
        )}
      />
      <input
        type="text"
        placeholder="Search"
        value={query}
        onChange={e => setQuery(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="bg-transparent outline-none text-tx text-sm flex-1 placeholder:text-tx2"
      />
    </div>
  )
}

function TrendingCard() {
  const [showAll, setShowAll] = useState(false)
  const visible = showAll ? trends : trends.slice(0, 4)

  return (
    <div className="bg-bg2 rounded-2xl overflow-hidden">
      <h2 className="font-black text-xl px-4 pt-4 pb-2 text-tx">
        Trending for you
      </h2>

      {visible.map((trend, i) => (
        <div
          key={i}
          className="px-4 py-3 hover:bg-bg3 cursor-pointer transition-colors border-t border-border first:border-t-0 group"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-tx2">{trend.category}</p>
              <p className="font-bold text-tx text-sm mt-0.5">{trend.name}</p>
              <p className="text-xs text-tx2 mt-0.5">{trend.posts}</p>
            </div>
            {/* more options dot */}
            <button className="text-tx2 hover:text-accent p-1 rounded-full hover:bg-accent/10 opacity-0 group-hover:opacity-100 transition-all">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/>
              </svg>
            </button>
          </div>
        </div>
      ))}

      <button
        onClick={() => setShowAll(!showAll)}
        className="w-full px-4 py-4 text-accent text-sm hover:bg-bg3 transition-colors text-left"
      >
        {showAll ? 'Show less' : 'Show more'}
      </button>
    </div>
  )
}

function FollowCard() {
  const [followed, setFollowed] = useState<Record<string, boolean>>({})

  function toggleFollow(handle: string) {
    setFollowed(prev => ({ ...prev, [handle]: !prev[handle] }))
  }

  return (
    <div className="bg-bg2 rounded-2xl overflow-hidden">
      <h2 className="font-black text-xl px-4 pt-4 pb-2 text-tx">
        Who to follow
      </h2>

      {suggestions.map((user) => (
        <div
          key={user.handle}
          className="flex items-center gap-3 px-4 py-3 hover:bg-bg3 transition-colors cursor-pointer border-t border-border first:border-t-0"
        >
          {/* avatar */}
          <Avatar name={user.name} size="md" />

          {/* name + handle */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <span className="font-bold text-tx text-sm truncate">
                {user.name}
              </span>
              {user.verified && (
                <svg viewBox="0 0 24 24" width="14" height="14" fill="#1d9bf0">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              )}
            </div>
            <p className="text-tx2 text-sm truncate">@{user.handle}</p>
          </div>

          {/* follow button */}
          <button
            onClick={e => {
              e.stopPropagation()
              toggleFollow(user.handle)
            }}
            className={cn(
              'rounded-full px-4 py-1.5 text-sm font-bold flex-shrink-0 transition-colors border',
              followed[user.handle]
                ? 'bg-transparent text-tx border-border hover:border-red-500 hover:text-red-500 hover:bg-red-500/10'
                : 'bg-tx text-bg border-tx hover:opacity-90'
            )}
          >
            {followed[user.handle] ? 'Following' : 'Follow'}
          </button>
        </div>
      ))}

      <button className="w-full px-4 py-4 text-accent text-sm hover:bg-bg3 transition-colors text-left">
        Show more
      </button>
    </div>
  )
}

function Footer() {
  const links = [
    'Terms of Service', 'Privacy Policy', 'Cookie Policy',
    'Accessibility', 'Ads info', 'More'
  ]

  return (
    <div className="px-2 flex flex-wrap gap-x-2 gap-y-1">
      {links.map(link => (
        <a
          key={link}
          href="#"
          className="text-tx2 text-xs hover:underline"
        >
          {link}
        </a>
      ))}
      <span className="text-tx2 text-xs">© 2025 X Corp.</span>
    </div>
  )
}

export default function TweetComposer() {
  return (
    <div className="hidden lg:flex flex-col gap-4 flex-1 px-4 py-3 shrink-0">
      <SearchBar />
      <TrendingCard />
      <FollowCard />
      <Footer />
    </div>
  )
}
