import Sidebar from "@/components/features/Sidebar";
import Tweet from "@/components/features/Tweet";
import TweetComposer from "@/components/features/TweetComposer";
import { ThemeToggle } from "@/components/ThemeToggle";
import Image from "next/image";



export default function Home() {
  return (
    // ← THIS is why it stays white — the div covers the body
    // add bg-white dark:bg-[#15202b] HERE
    <div className="flex max-w-300 mx-auto min-h-screen">
      <Sidebar />
      <Tweet />
      <TweetComposer />
    </div>
  )
}