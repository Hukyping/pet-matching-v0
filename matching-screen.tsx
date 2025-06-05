"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Heart, X, MessageCircle, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface MatchingScreenProps {
  onBack: () => void
}

export default function MatchingScreen({ onBack }: MatchingScreenProps) {
  const [currentDogIndex, setCurrentDogIndex] = useState(0)

  // 샘플 강아지 데이터 수정
  const dogs = [
    {
      id: 1,
      name: "슈가",
      age: "25M",
      weight: "2.8 KG",
      images: [
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/BA_ED_8C_80_ED_94_8C__EB_94_94_EC_9E_90_EC_9D_B8-rJ1xB5IVKyTZ2UEYJ9XuDBs9yBuDcY.png",
        "/placeholder.svg?height=400&width=400",
        "/placeholder.svg?height=400&width=400",
        "/placeholder.svg?height=400&width=400",
      ],
      representativeImageIndex: 0,
      personality: ["귀여움", "사교적", "영리함", "사랑스러움", "온순함"],
      description: "산책을 좋아하고 활동적입니다. 매일/주말 산책 함께할 짝궁/친구를 찾고있어요!",
      location: "강남구",
      distance: "1.2km",
    },
    {
      id: 2,
      name: "코코",
      age: "18M",
      weight: "3.5 KG",
      images: [
        "/placeholder.svg?height=400&width=400",
        "/placeholder.svg?height=400&width=400",
        "/placeholder.svg?height=400&width=400",
      ],
      representativeImageIndex: 0,
      personality: ["활발함", "장난기많음", "사교적", "에너지넘침"],
      description: "놀이를 좋아하는 활발한 성격이에요. 다른 강아지들과 잘 어울려요!",
      location: "서초구",
      distance: "2.1km",
    },
    {
      id: 3,
      name: "바둑이",
      age: "36M",
      weight: "12.5 KG",
      images: [
        "/placeholder.svg?height=400&width=400",
        "/placeholder.svg?height=400&width=400",
        "/placeholder.svg?height=400&width=400",
        "/placeholder.svg?height=400&width=400",
      ],
      representativeImageIndex: 0,
      personality: ["충성심", "온순함", "보호본능", "차분함"],
      description: "차분하고 안정적인 성격의 믿음직한 친구입니다.",
      location: "송파구",
      distance: "3.8km",
    },
  ]

  // 상태에 representativeIndices 추가
  const [representativeIndices, setRepresentativeIndices] = useState<{ [key: number]: number }>({
    1: 0,
    2: 0,
    3: 0,
  })

  const currentDog = dogs[currentDogIndex]

  // 초기 로드 시 스크롤을 상단으로 이동
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }, [currentDogIndex])

  // 대표 사진 설정 함수 추가
  const handleSetRepresentativeImage = (dogId: number, imageIndex: number) => {
    setRepresentativeIndices((prev) => ({
      ...prev,
      [dogId]: imageIndex,
    }))
  }

  const handleLike = () => {
    console.log(`${currentDog.name}를 좋아요!`)
    nextDog()
  }

  const handlePass = () => {
    console.log(`${currentDog.name}를 패스`)
    nextDog()
  }

  const nextDog = () => {
    if (currentDogIndex < dogs.length - 1) {
      setCurrentDogIndex(currentDogIndex + 1)
    } else {
      // 모든 강아지를 다 봤을 때
      setCurrentDogIndex(0)
    }
  }

  return (
    <div className="min-h-screen bg-white max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b">
        <button onClick={onBack} className="p-1">
          <ArrowLeft className="w-6 h-6 text-black" />
        </button>
        <h1 className="text-xl font-bold text-black">짝궁 찾기</h1>
        <div className="w-8" /> {/* Spacer */}
      </div>

      {/* Dog Card */}
      <div className="p-6">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Dog Image */}
          <div className="relative aspect-square">
            <Image
              src={currentDog.images[representativeIndices[currentDog.id] || 0] || "/placeholder.svg"}
              alt={currentDog.name}
              fill
              className="object-cover"
            />
            <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm font-medium">
              {currentDog.name}
            </div>
            <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
              {currentDog.age} {currentDog.weight}
            </div>
          </div>

          {/* Photo Selection */}
          {currentDog.images.length > 1 && (
            <div className="p-4 border-b">
              <p className="text-sm text-gray-600 mb-3">사진 선택 (대표 사진을 선택해주세요)</p>
              <div className="flex gap-2 overflow-x-auto">
                {currentDog.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => handleSetRepresentativeImage(currentDog.id, index)}
                    className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden ${
                      (representativeIndices[currentDog.id] || 0) === index
                        ? "ring-4 ring-black"
                        : "ring-1 ring-gray-300"
                    }`}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${currentDog.name} 사진 ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                    {(representativeIndices[currentDog.id] || 0) === index && (
                      <div className="absolute top-1 left-1 bg-black text-white text-xs px-1 rounded">대표 사진</div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Dog Info */}
          <div className="p-6">
            {/* Location */}
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600 text-sm">
                {currentDog.location} • {currentDog.distance}
              </span>
            </div>

            {/* Personality Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {currentDog.personality.map((trait, index) => (
                <span key={index} className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm">
                  {trait}
                </span>
              ))}
            </div>

            {/* Description */}
            <p className="text-gray-700 text-sm leading-relaxed mb-6">{currentDog.description}</p>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                onClick={handlePass}
                variant="outline"
                className="flex-1 h-14 border-2 border-gray-300 hover:border-gray-400"
              >
                <X className="w-6 h-6 text-gray-500" />
              </Button>
              <Button onClick={handleLike} className="flex-1 h-14 bg-pink-500 hover:bg-pink-600 text-white">
                <Heart className="w-6 h-6" />
              </Button>
              <Button variant="outline" className="flex-1 h-14 border-2 border-blue-300 hover:border-blue-400">
                <MessageCircle className="w-6 h-6 text-blue-500" />
              </Button>
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mt-6 gap-2">
          {dogs.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${index === currentDogIndex ? "bg-pink-500" : "bg-gray-300"}`}
            />
          ))}
        </div>

        {/* Tips */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-2">💡 매칭 팁</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• ❤️ 하트: 관심 표현하기</li>
            <li>• ✕ 엑스: 다음 친구 보기</li>
            <li>• 💬 메시지: 바로 대화하기</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
