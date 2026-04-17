'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getUser, updateUser } from '@/utils/Portfolio'
import { getUserTweets, deleteTweet } from '@/utils/tweet'
import { deleteAccount } from '@/lib/auth'
import { Avatar } from '@/components/ui/Avatar'
import { ArrowLeft } from 'lucide-react'

export default function ProfilePage() {
  const router = useRouter()
  const queryClient = useQueryClient()

  // ===== USER =====
  const { data: user } = useQuery({
    queryKey: ['Profile'],
    queryFn: getUser,
  })

  const uid = user?.id

  // ===== EDIT STATE =====
  const [isEditing, setIsEditing] = useState(false)
  const [form, setForm] = useState({
    name: '',
    handle: '',
  })

  // ===== LOAD FORM WHEN USER READY =====
  if (user && form.name === '') {
    setForm({
      name: user.name,
      handle: user.handle,
    })
  }

  // ===== USER TWEETS =====
  const { data: tweets = [] } = useQuery({
    queryKey: ['userTweets', uid],
    queryFn: () => getUserTweets(uid!),
    enabled: !!uid
  })

  // ===== UPDATE USER =====
  const updateMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Profile'] })
      setIsEditing(false)
    }
  })

  // ===== DELETE TWEET =====
  const deleteMutation = useMutation({
    mutationFn: deleteTweet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userTweets', uid] })
    }
  })

  // ===== DELETE ACCOUNT =====
  const deleteAccountMutation = useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => {
      router.push('/register')
    }
  })

  if (!user) return null

  return (
    <div className="max-w-2xl mx-auto border-x border-border min-h-screen">

      {/* ===== HEADER ===== */}
      <div className="sticky top-0 bg-black/80 backdrop-blur z-10 border-b border-border p-4 flex items-center gap-4">

        <button
          onClick={() => router.push('/')}
          className="p-2 rounded-full hover:bg-bg2"
        >
          <ArrowLeft size={20} />
        </button>

        <div>
          <h1 className="text-xl font-bold">{user.name}</h1>
          <p className="text-tx2 text-sm">{tweets.length} posts</p>
        </div>

      </div>

      {/* ===== COVER ===== */}
      <div className="h-44 bg-[#1d9bf0]" />

      {/* ===== PROFILE INFO ===== */}
      <div className="px-4 pb-4 border-b border-border relative">

        <div className="absolute -top-16">
          <Avatar name={user.name} size="lg" />
        </div>

        <div className="flex justify-end mt-2 gap-2">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="border border-border px-4 py-1.5 rounded-full font-semibold hover:bg-bg2"
            >
              Edit profile
            </button>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-1.5 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => updateMutation.mutate(form)}
                className="bg-white text-black px-4 py-1.5 rounded-full font-bold"
              >
                Save
              </button>
            </>
          )}
        </div>

        <div className="mt-14 space-y-2">

          {isEditing ? (
            <>
              <input
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full bg-black border border-border p-2 rounded"
              />
              <input
                value={form.handle}
                onChange={e => setForm({ ...form, handle: e.target.value })}
                className="w-full bg-black border border-border p-2 rounded"
              />
            </>
          ) : (
            <>
              <h2 className="text-xl font-bold">{user.name}</h2>
              <p className="text-tx2">@{user.handle}</p>
            </>
          )}

        </div>
      </div>

      {/* ===== TWEETS ===== */}
      <div>
        {tweets.map((tweet: any) => (
          <div
            key={tweet.id}
            className="border-b border-border p-4 hover:bg-bg2 transition"
          >
            <div className="flex gap-3">

              <Avatar name={tweet.users?.name} size="md" />

              <div className="flex-1">

                <div className="flex items-center gap-2">
                  <span className="font-bold">{tweet.users?.name}</span>
                  <span className="text-tx2">@{tweet.users?.handle}</span>
                </div>

                <p className="mt-1">{tweet.text}</p>

                <div className="flex justify-between mt-3 text-tx2 text-sm">
                  <span>❤️ {tweet.likes}</span>

                  {tweet.userId === user.id && (
                    <button
                      onClick={() => deleteMutation.mutate(tweet.id)}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  )}
                </div>

              </div>
            </div>
          </div>
        ))}

        {tweets.length === 0 && (
          <div className="p-6 text-center text-tx2">
            No posts yet
          </div>
        )}
      </div>

      {/* ===== DELETE ACCOUNT ===== */}
      <div className="p-6 border-t border-border">
        <button
          onClick={() => {
            if (confirm("Delete account permanently?")) {
              deleteAccountMutation.mutate()
            }
          }}
          className="w-full py-3 bg-red-600 text-white rounded-full font-bold"
        >
          Delete Account
        </button>
      </div>

    </div>
  )
}