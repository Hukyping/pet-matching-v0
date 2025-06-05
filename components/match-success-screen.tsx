"use client"
import { useState, useEffect } from "react"
import { ArrowLeft, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface MatchSuccessScreenProps {
  onBack: () => void
  onSendMessage: () => void
  myDogData?: any
  matchedDogData?: any
}

export default function MatchSuccessScreen({
  onBack,
  onSendMessage,
  myDogData,
  matchedDogData,
}: MatchSuccessScreenProps) {
  const [showContent, setShowContent] = useState(false)
  const [showTitle, setShowTitle] = useState(false)

  // 기본 데이터
  const defaultMyDog = {
    name: "슈가",
    gender: "female",
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/BA_ED_8C_80_ED_94_8C__EB_94_94_EC_9E_90_EC_9D_B8-rJ1xB5IVKyTZ2UEYJ9XuDBs9yBuDcY.png",
    ],
    representativeImageIndex: 0,
  }

  const defaultMatchedDog = {
    name: "라떼",
    gender: "male",
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/BA_ED_8C_80_ED_94_8C__EB_94_94_EC_9E_90_EC_9D_B8-qvQOyIhxxF8KtZKWeJ3RWVGjVh1Got.png",
    ],
    representativeImageIndex: 0,
  }

  const myDog = myDogData || defaultMyDog
  const matchedDog = matchedDogData || defaultMatchedDog

  const myDogImage =
    myDog.images && myDog.images.length > 0 ? myDog.images[myDog.representativeImageIndex || 0] : "/placeholder.svg"

  const matchedDogImage =
    matchedDog.images && matchedDog.images.length > 0
      ? matchedDog.images[matchedDog.representativeImageIndex || 0]
      : "/placeholder.svg"

  // 성별에 따른 테두리 색상 (더 세련된 색상)
  const myDogBorderColor = myDog.gender === "female" ? "#F6D0D0" : "#D0E2F6"
  const matchedDogBorderColor = matchedDog.gender === "female" ? "#F6D0D0" : "#D0E2F6"

  // 애니메이션 타이밍
  useEffect(() => {
    const titleTimer = setTimeout(() => {
      setShowTitle(true)
    }, 500)

    const contentTimer = setTimeout(() => {
      setShowContent(true)
    }, 1200)

    return () => {
      clearTimeout(titleTimer)
      clearTimeout(contentTimer)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 max-w-md mx-auto relative overflow-hidden flex flex-col">
      {/* 고급스러운 배경 이펙트 */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
      </div>

      {/* 미세한 반짝임 효과 */}
      <div className="absolute inset-0 opacity-30">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-ping"
            style={{
              left: `${20 + i * 10}%`,
              top: `${30 + i * 5}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: "3s",
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between p-6 relative z-10">
        <button onClick={onBack} className="p-1 transition-all duration-200 hover:scale-110">
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <div className="w-8" />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-8">
        {/* Pawfect Title */}
        <div className="text-center mb-16">
          <h1
            className={`text-6xl font-light text-white transition-all duration-1000 ${
              showTitle ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{
              fontFamily: "serif",
              letterSpacing: "0.1em",
            }}
          >
            Pawfect
          </h1>
          <div
            className={`mt-4 w-24 h-0.5 bg-gradient-to-r from-pink-400 to-blue-400 mx-auto transition-all duration-1000 delay-500 ${
              showTitle ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
            }`}
          />
        </div>

        {/* Dogs Images */}
        <div
          className={`flex items-center justify-center mb-16 relative transition-all duration-1000 delay-700 ${
            showContent ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
        >
          {/* My Dog - 완전한 원형 이미지 */}
          <div className="relative">
            <div
              className="w-40 h-40 rounded-full overflow-hidden border-4 shadow-2xl transition-all duration-500 hover:scale-105"
              style={{
                borderColor: myDogBorderColor,
                aspectRatio: "1/1",
              }}
            >
              <Image
                src={myDogImage || "/placeholder.svg"}
                alt={myDog.name}
                width={160}
                height={160}
                className="object-cover w-full h-full rounded-full"
              />
            </div>
            {/* 부드러운 글로우 효과 */}
            <div
              className="absolute inset-0 rounded-full opacity-20 animate-pulse"
              style={{
                boxShadow: `0 0 30px ${myDogBorderColor}`,
              }}
            />
          </div>

          {/* Heart in the middle */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-xl backdrop-blur-sm bg-opacity-90">
              <Heart
                className="w-8 h-8 text-rose-400 transition-all duration-300 hover:scale-110"
                fill="currentColor"
              />
            </div>
          </div>

          {/* Matched Dog - 완전한 원형 이미지 */}
          <div className="relative ml-12">
            <div
              className="w-40 h-40 rounded-full overflow-hidden border-4 shadow-2xl transition-all duration-500 hover:scale-105"
              style={{
                borderColor: matchedDogBorderColor,
                aspectRatio: "1/1",
              }}
            >
              <Image
                src={matchedDogImage || "/placeholder.svg"}
                alt={matchedDog.name}
                width={160}
                height={160}
                className="object-cover w-full h-full rounded-full"
              />
            </div>
            {/* 부드러운 글로우 효과 */}
            <div
              className="absolute inset-0 rounded-full opacity-20 animate-pulse"
              style={{
                boxShadow: `0 0 30px ${matchedDogBorderColor}`,
              }}
            />
          </div>
        </div>

        {/* Bottom Buttons */}
        <div
          className={`w-full px-6 transition-all duration-1000 delay-1000 ${
            showContent ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <div className="grid grid-cols-2 gap-4">
            <Button
              onClick={onBack}
              className="h-14 bg-white hover:bg-gray-100 text-black text-lg font-medium rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 hover:shadow-xl"
            >
              Keep swiping
            </Button>

            <Button
              onClick={onSendMessage}
              className="h-14 bg-black hover:bg-gray-800 text-white text-lg font-medium rounded-xl border-2 border-white transform transition-all duration-200 hover:scale-105 hover:shadow-xl"
            >
              메시지 보내기
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom Spacer */}
      <div className="h-8"></div>
    </div>
  )
}
