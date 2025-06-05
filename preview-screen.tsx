"use client"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface PreviewScreenProps {
  onBack: () => void
  onContinue: () => void
  profileData?: any
}

export default function PreviewScreen({ onBack, onContinue, profileData }: PreviewScreenProps) {
  // 샘플 데이터 (실제로는 profileData에서 가져와야 함)
  const dogData = {
    name: "슈가",
    age: "25M",
    weight: "2.8 KG",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/BA_ED_8C_80_ED_94_8C__EB_94_94_EC_9E_90_EC_9D_B8-9CnmnkgOzSmvmQCefFVAHihBCxigcl.png",
    personality: ["귀여움", "사교적", "영리함", "사랑스러움", "온순함"],
    description: "산책을 좋아하고 활동적입니다.\n매일/주말 산책 함께할 짝궁/친구를 찾고있어요!",
  }

  return (
    <div className="min-h-screen bg-white max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b">
        <button onClick={onBack} className="p-1">
          <ArrowLeft className="w-6 h-6 text-black" />
        </button>
        <h1 className="text-xl font-bold text-black">Preview</h1>
        <div className="w-8" /> {/* Spacer */}
      </div>

      {/* Dog Profile Preview */}
      <div className="p-4">
        {/* Dog Image */}
        <div className="relative aspect-square rounded-lg overflow-hidden mb-4">
          <Image src={dogData.image || "/placeholder.svg"} alt={dogData.name} fill className="object-cover" />
          <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm font-medium">
            {dogData.name}
          </div>
          <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
            {dogData.age} {dogData.weight}
          </div>
        </div>

        {/* Personality Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {dogData.personality.map((trait, index) => (
            <span key={index} className="px-4 py-2 bg-pink-100 text-pink-700 rounded-full text-sm">
              {trait}
            </span>
          ))}
        </div>

        {/* Description */}
        <div className="mb-8">
          <p className="text-gray-700 text-base whitespace-pre-line">{dogData.description}</p>
        </div>

        {/* Vaccination Section */}
        <div className="border-t pt-4 mb-4">
          <h3 className="text-xl font-bold text-center mb-4">예방접종내역</h3>
          <div className="grid grid-cols-5 text-center text-sm">
            <div className="p-2">종합백신</div>
            <div className="p-2">코로나장염</div>
            <div className="p-2">켄넬코프</div>
            <div className="p-2">신종플루</div>
            <div className="p-2">광견병</div>
            <div className="p-2 col-span-5">심장사상충</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4 mt-8">
          <Button
            onClick={() => {
              console.log("미리보기에서 이전 버튼 클릭")
              onBack()
            }}
            variant="outline"
            className="h-14 border-2 border-gray-300 hover:border-gray-400 text-black"
          >
            이전
          </Button>
          <Button
            onClick={() => {
              console.log("미리보기에서 짝궁찾으러 가기 버튼 클릭")
              onContinue()
            }}
            className="h-14 bg-black hover:bg-black/90 text-white"
          >
            짝궁찾으러 가기
          </Button>
        </div>
      </div>
    </div>
  )
}
