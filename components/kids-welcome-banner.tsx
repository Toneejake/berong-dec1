"use client"

import { useAuth } from "@/lib/auth-context"
import { Flame, Sparkles } from "lucide-react"

export function KidsWelcomeBanner() {
  const { user } = useAuth()

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 rounded-3xl shadow-2xl mb-8">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 animate-bounce">
          <Flame className="h-12 w-12 text-yellow-300" />
        </div>
        <div className="absolute top-20 right-20 animate-pulse">
          <Sparkles className="h-10 w-10 text-white" />
        </div>
        <div className="absolute bottom-10 left-1/3 animate-bounce delay-100">
          <Flame className="h-8 w-8 text-orange-300" />
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 px-8 py-12 text-center">
        {/* Sparky character emoji (can be replaced with actual image) */}
        <div className="mb-4 flex justify-center">
          <div className="relative">
            <div className="text-8xl animate-wave">🐶</div>
            <div className="absolute -top-2 -right-2 text-4xl animate-spin-slow">⭐</div>
          </div>
        </div>

        {/* Welcome text */}
        <h1 className="text-5xl font-black text-white mb-3 drop-shadow-lg tracking-tight">
          Welcome, {user?.name?.split(' ')[0] || 'Fire Safety Hero'}! 🔥
        </h1>
        <p className="text-2xl font-bold text-yellow-100 mb-6 drop-shadow">
          Ready to learn fire safety and have fun?
        </p>

        {/* Fun badges */}
        <div className="flex justify-center gap-4 flex-wrap">
          <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full border-2 border-white/50">
            <span className="text-white font-bold text-lg">🎮 Play Games</span>
          </div>
          <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full border-2 border-white/50">
            <span className="text-white font-bold text-lg">📚 Learn Safety</span>
          </div>
          <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full border-2 border-white/50">
            <span className="text-white font-bold text-lg">🏆 Earn Badges</span>
          </div>
        </div>
      </div>

      {/* Decorative wave at bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg className="w-full h-16" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            className="fill-white"
          ></path>
        </svg>
      </div>
    </div>
  )
}
