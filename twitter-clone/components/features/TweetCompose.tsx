'use client'
import { useState, useRef } from 'react'
import { ImageIcon, X, Smile, BarChart2, MapPin } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { cn } from '@/utils/cn'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createTweet } from '@/utils/tweet'
import { uploadImage } from '@/utils/uploadImage'

const MAX = 280
const MAX_IMAGES = 4
const MAX_POLL_OPTIONS = 4
const MIN_POLL_OPTIONS = 2

const DURATIONS = [
  { label: '1 day',    value: 24  },
  { label: '2 days',   value: 48  },
  { label: '3 days',   value: 72  },
  { label: '5 days',   value: 120 },
  { label: '7 days',   value: 168 },
]

export function TweetComposer() {
  const [text, setText] = useState('')
  const [images, setImages] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [showPoll, setShowPoll] = useState(false)
  const [pollOptions, setPollOptions] = useState(['', ''])
  const [pollDuration, setPollDuration] = useState(24)

  const fileRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const queryClient = useQueryClient();

  const remaining = MAX - text.length
  const isOver = remaining < 0

  // poll is valid when at least 2 options filled
  const pollValid = showPoll &&
    pollOptions.filter(o => o.trim().length > 0).length >= MIN_POLL_OPTIONS

  // empty check
  const isEmpty = text.trim().length === 0 &&
    images.length === 0 &&
    !pollValid

  // ===== TEXTAREA =====
  function handleTextChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setText(e.target.value)
    e.target.style.height = 'auto'
    e.target.style.height = e.target.scrollHeight + 'px'
  }

  // ===== IMAGES =====
  async function handleImagePick(e: React.ChangeEvent<HTMLInputElement>) {
  const files = Array.from(e.target.files || [])
  if (!files.length) return

  const slotsLeft = MAX_IMAGES - images.length
  const filesToAdd = files.slice(0, slotsLeft)

  for (const file of filesToAdd) {
    const previewUrl = URL.createObjectURL(file)

    // 1. add preview immediately with "uploading" flag
    setImages(prev => [
      ...prev,
      previewUrl
    ])

    try {
      // 2. upload to cloudinary/backend
      const uploadedUrl = await uploadImage(file)

      // 3. replace preview with real URL
      setImages(prev =>
        prev.map(img => img === previewUrl ? uploadedUrl : img)
      )

      // 4. cleanup memory
      URL.revokeObjectURL(previewUrl)

    } catch (err) {
      console.error(err)

      // remove failed image
      setImages(prev => prev.filter(img => img !== previewUrl))
    }
  }

  if (fileRef.current) fileRef.current.value = ''
}

  function removeImage(index: number) {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  // ===== POLL =====
  function togglePoll() {
    setShowPoll(prev => !prev)
    // clear poll when closing
    if (showPoll) {
      setPollOptions(['', ''])
      setPollDuration(24)
    }
  }

  function updateOption(index: number, value: string) {
    setPollOptions(prev => prev.map((opt, i) => i === index ? value : opt))
  }

  function addOption() {
    if (pollOptions.length >= MAX_POLL_OPTIONS) return
    setPollOptions(prev => [...prev, ''])
  }

  function removeOption(index: number) {
    if (pollOptions.length <= MIN_POLL_OPTIONS) return
    setPollOptions(prev => prev.filter((_, i) => i !== index))
  }

  const addTweet = useMutation({
    mutationFn: createTweet,
    onSuccess: ()=>{
      queryClient.invalidateQueries({queryKey:['tweets']});
      setText('')
      setImages([])
      setShowPoll(false)
      setPollOptions(['', ''])
      if (textareaRef.current) textareaRef.current.style.height = 'auto'
      setLoading(false)
    }

  });

  // ===== POST =====
  async function handlePost() {
    if (isEmpty || isOver) return
    setLoading(true)
    const payload = {
      text,
      images: images.length > 0 ? images : undefined,
      poll: showPoll ? {
        options:  pollOptions.filter(o => o.trim()),
        duration: pollDuration,
      } : undefined,
    }
    addTweet.mutate(payload);
  }

  // circle progress
  const radius = 10
  const circumference = 2 * Math.PI * radius
  const strokeDash = circumference * (1 - Math.min(text.length / MAX, 1))

  return (
    <div className="flex gap-3 p-4 border-b border-border">
      <Avatar name="Your Name" size="md" />

      <div className="flex-1 min-w-0 flex flex-col gap-3">

        {/* textarea — always visible */}
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleTextChange}
          placeholder={showPoll ? 'Ask a question...' : 'What is happening?!'}
          rows={showPoll ? 2 : 3}
          className="w-full bg-transparent text-tx text-lg placeholder:text-tx3 outline-none resize-none leading-relaxed pt-2 min-h-15"
        />

        {/* image grid */}
        {images.length > 0 && (
          <div className={cn(
            'gap-2 rounded-2xl overflow-hidden',
            images.length === 1 && 'grid grid-cols-1',
            images.length >= 2  && 'grid grid-cols-2',
          )}>
            {images.map((src, i) => (
              <div
                key={i}
                className={cn(
                  'relative overflow-hidden rounded-xl bg-bg2',
                  images.length === 1 && 'h-75',
                  images.length === 2 && 'h-50',
                  images.length === 3 && i === 0 && 'row-span-2 h-75',
                  images.length === 3 && i !== 0 && 'h-36.5',
                  images.length === 4 && 'h-36.5',
                )}
              >
                <img src={src} alt={`image ${i + 1}`} className="w-full h-full object-cover" />
                <button
                  onClick={() => removeImage(i)}
                  className="absolute top-2 left-2 bg-black/70 text-white rounded-full p-1.5 hover:bg-black transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* POLL UI */}
        {showPoll && (
          <div className="border border-border rounded-2xl overflow-hidden">

            {/* options */}
            <div className="p-3 flex flex-col gap-2">
              {pollOptions.map((opt, i) => (
                <div key={i} className="relative">
                  <input
                    type="text"
                    value={opt}
                    onChange={e => updateOption(i, e.target.value)}
                    placeholder={
                      i === 0 ? 'Option 1' :
                      i === 1 ? 'Option 2' :
                      `Option ${i + 1} (optional)`
                    }
                    maxLength={25}
                    className="w-full bg-transparent border border-border rounded-lg px-3 py-2.5 text-sm text-tx placeholder:text-tx3 outline-none focus:border-accent transition-colors pr-10"
                  />
                  {/* remove — only if more than 2 options */}
                  {pollOptions.length > MIN_POLL_OPTIONS && (
                    <button
                      onClick={() => removeOption(i)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-tx3 hover:text-tx transition-colors"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              ))}

              {/* add option */}
              {pollOptions.length < MAX_POLL_OPTIONS && (
                <button
                  onClick={addOption}
                  className="text-accent text-sm font-bold text-left px-3 py-2 hover:bg-accent/10 rounded-lg transition-colors"
                >
                  + Add option
                </button>
              )}
            </div>

            {/* divider */}
            <div className="border-t border-border" />

            {/* duration picker */}
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-sm font-bold text-tx">Poll length</span>
              <select
                value={pollDuration}
                onChange={e => setPollDuration(Number(e.target.value))}
                className="bg-transparent text-accent text-sm font-bold outline-none cursor-pointer"
              >
                {DURATIONS.map(d => (
                  <option key={d.value} value={d.value} className="bg-bg text-tx">
                    {d.label}
                  </option>
                ))}
              </select>
            </div>

            {/* remove poll */}
            <div className="border-t border-border" />
            <button
              onClick={togglePoll}
              className="w-full px-4 py-3 text-sm text-red-500 font-bold hover:bg-red-500/10 transition-colors text-left"
            >
              Remove poll
            </button>
          </div>
        )}

        {/* TOOLBAR — always visible */}
        <div className="flex items-center justify-between pt-1">

          {/* left icons */}
          <div className="flex items-center gap-1">
            <input
              ref={fileRef}
              type="file"
              accept="image/*,image/gif"
              multiple
              onChange={handleImagePick}
              className="hidden"
            />

            {/* image */}
            <button
              onClick={() => fileRef.current?.click()}
              disabled={images.length >= MAX_IMAGES || showPoll}
              title={showPoll ? "Can't add images to a poll" : images.length >= MAX_IMAGES ? 'Max 4 images' : 'Add image'}
              className={cn(
                'p-2 rounded-full transition-colors',
                images.length >= MAX_IMAGES || showPoll
                  ? 'text-tx3 cursor-not-allowed opacity-50'
                  : 'text-accent hover:bg-accent/10'
              )}
            >
              <ImageIcon size={18} />
            </button>

            {/* gif */}
            <button
              disabled={images.length > 0 || showPoll}
              className={cn(
                'p-2 rounded-full transition-colors',
                images.length > 0 || showPoll
                  ? 'text-tx3 cursor-not-allowed opacity-50'
                  : 'text-accent hover:bg-accent/10'
              )}
            >
              <span className="text-xs font-bold border border-current rounded px-1 py-0.5">
                GIF
              </span>
            </button>

            {/* poll toggle */}
            <button
              onClick={togglePoll}
              disabled={images.length > 0}
              title={images.length > 0 ? "Can't add poll with images" : 'Add poll'}
              className={cn(
                'p-2 rounded-full transition-colors',
                images.length > 0
                  ? 'text-tx3 cursor-not-allowed opacity-50'
                  : showPoll
                    ? 'text-accent bg-accent/10'  // active state
                    : 'text-accent hover:bg-accent/10'
              )}
            >
              <BarChart2 size={18} />
            </button>

            {/* emoji */}
            <button className="p-2 rounded-full text-accent hover:bg-accent/10 transition-colors">
              <Smile size={18} />
            </button>

            {/* location */}
            <button className="p-2 rounded-full text-accent hover:bg-accent/10 transition-colors">
              <MapPin size={18} />
            </button>
          </div>

          {/* right — count + post */}
          <div className="flex items-center gap-3">

            {images.length > 0 && (
              <span className="text-tx2 text-xs tabular-nums">
                {images.length}/{MAX_IMAGES}
              </span>
            )}

            {text.length > 0 && (
              <div className="flex items-center gap-2">
                <svg width="28" height="28" className="-rotate-90">
                  <circle cx="14" cy="14" r={radius} fill="none" stroke="#2f3336" strokeWidth="2.5"/>
                  <circle
                    cx="14" cy="14" r={radius}
                    fill="none"
                    stroke={isOver ? '#f4212e' : remaining <= 20 ? '#ffd400' : '#1d9bf0'}
                    strokeWidth="2.5"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDash}
                    strokeLinecap="round"
                    className="transition-all duration-150"
                  />
                </svg>
                {remaining <= 20 && (
                  <span className={cn(
                    'text-sm font-medium tabular-nums',
                    isOver ? 'text-red-500' : 'text-tx2'
                  )}>
                    {remaining}
                  </span>
                )}
              </div>
            )}

            {text.length > 0 && <div className="h-7 w-px bg-border" />}

            <Button
              variant="primary"
              shape="pill"
              size="md"
              disabled={isEmpty || isOver || loading}
              onClick={handlePost}
              className="px-4 py-1.5 text-sm font-bold"
            >
              {loading ? 'Posting...' : 'Post'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}