"use client"

import { useState } from "react"
import { MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"

interface LoginScreenProps {
  onSignIn: () => void
}

export default function LoginScreen({ onSignIn }: LoginScreenProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSignIn = () => {
    console.log("로그인 처리 중...")
    onSignIn()
  }

  return (
    <div className="min-h-screen bg-[#0c0c0a] flex flex-col items-center justify-center p-6 max-w-md mx-auto">
      {/* Glowing Pink Dog */}
      <div className="mb-8 relative">
        <div className="relative w-80 h-80 flex items-center justify-center">
          <Image
            src="/images/glowing-dog.png"
            alt="Glowing Pink Dog"
            width={400}
            height={400}
            className="relative z-10 object-contain"
          />
        </div>
      </div>

      {/* Login Form */}
      <div className="w-full space-y-6">
        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-[#f0f0f3] text-lg font-medium">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-14 bg-[#f0f0f3] border-none text-[#8e8e93] placeholder:text-[#8e8e93] text-base rounded-md"
          />
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <Label htmlFor="password" className="text-[#f0f0f3] text-lg font-medium">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="***************"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-14 bg-[#f0f0f3] border-none text-[#8e8e93] placeholder:text-[#8e8e93] text-base rounded-md"
          />
        </div>

        {/* Reset Password Link */}
        <div className="flex justify-end">
          <button className="text-[#f0f0f3] text-base hover:underline">Reset password</button>
        </div>

        {/* Sign In Button */}
        <Button
          onClick={handleSignIn}
          className="w-full h-14 bg-[#f0f0f3] hover:bg-[#f0f0f3]/90 text-[#1c2024] text-lg font-medium rounded-md"
        >
          Sign in
        </Button>

        {/* Kakao Login Button */}
        <Button className="w-full h-14 bg-[#fbe44d] hover:bg-[#fbe44d]/90 text-[#1c2024] text-lg font-medium rounded-md flex items-center justify-center gap-2">
          <MessageCircle className="w-5 h-5 fill-current" />
          Login with Kakao
        </Button>
      </div>
    </div>
  )
}
