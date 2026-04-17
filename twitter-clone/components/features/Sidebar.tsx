'use client'

import {
  Bell,
  Bookmark,
  Home,
  MessageSquare,
  Search,
  User,
  LogOut
} from "lucide-react"

import { Button } from "../ui/Button"
import { Avatar } from "../ui/Avatar"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { logout } from "@/lib/auth"

export default function Sidebar() {

  const router = useRouter()

  async function handleLogout() {
    try {
      await logout()
      router.push('/login')
    } catch (err) {
      console.error('Logout failed', err)
    }
  }

  const navItem = (icon: React.ReactNode, label: string) => (
    <button className="flex w-full p-3 gap-4 font-bold hover:bg-[#1a1a1a] rounded-full transition">
      {icon}
      <p className="hidden md:block">{label}</p>
    </button>
  )

  return (
    <>
      {/* DESKTOP */}
      <nav className="hidden sm:flex flex-col md:w-60 w-16 h-screen sticky top-0 border-r border-border justify-between">

        {/* TOP */}
        <div>
          <div className="Logo p-3 h-12">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="var(--ac)">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </div>

          {navItem(<Home />, "Home")}
          {navItem(<Search />, "Explore")}
          {navItem(<Bell />, "Notifications")}
          {navItem(<MessageSquare />, "Messages")}
          {navItem(<Bookmark />, "Bookmarks")}

          <Link href="/profile">
            {navItem(<User />, "Profile")}
          </Link>

          <div className="px-2 mt-2">
            <Button className="w-full font-bold text-white">
              Post
            </Button>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="p-3 border-t border-border flex items-center justify-between">

          <div className="flex items-center gap-3">
            <Avatar name="YO" />
            <div className="hidden lg:block">
              <p>Your Name</p>
              <p className="text-sm text-gray-400">@yourhandle</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="p-2 hover:bg-red-500/10 rounded-full transition"
          >
            <LogOut size={18} />
          </button>
        </div>
      </nav>

      {/* MOBILE */}
      <nav className="fixed z-50 border-border bg-bg border-t bottom-0 w-full sm:hidden">

        <div className="flex justify-around items-center py-2">

          <button><Home /></button>
          <button><Search /></button>
          <button><Bell /></button>
          <button><MessageSquare /></button>

          <Link href="/profile">
            <Avatar name="Y O" />
          </Link>

          <button onClick={handleLogout}>
            <LogOut size={20} />
          </button>

        </div>
      </nav>
    </>
  )
}