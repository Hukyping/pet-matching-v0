"use client"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface PreviewScreenProps {
  onBack: () => void
  onContinue: () => void
  profileData?: any
  images?: string[]
  representativeImageIndex?: number
  ownerData?: any
}

export default function PreviewScreen({
  onBack,
  onContinue,
  profileData = {},
  images = [],
  representativeImageIndex = 0,
  ownerData = {},
}: PreviewScreenProps) {
  // 대표 이미지 URL 가져오기
  const representativeImage = images[representativeImageIndex] || "/images/dog-preview.png"

  // 프로필 데이터에서 필요한 정보 추출
  const name = profileData.name || "슈가"
  const age = `${profileData.age?.[0] || 25}M`
  const weight = `${profileData.weight?.[0] || 2.8} KG`
  const gender = profileData.gender || "female" // 성별 정보 추가

  // 성격 특성 가져오기 (프로필에서 선택한 성격)
  const personality = profileData.personality || ["귀여움", "사교적", "영리함", "사랑스러움", "온순함"]

  // 집사의 한줄 어필 가져오기
  const description = ownerData.appeal || "산책을 좋아하고 활동적입니다.\n매일/주말 산책 함께할 짝궁/친구를 찾고있어요!"

  console.log("미리보기 화면 렌더링:", {
    representativeImage,
    name,
    age,
    weight,
    gender,
    personality,
    description,
  })

  return (
    <div className="min-h-screen bg-white max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b">
        <h1 className="text-2xl font-bold text-black">Preview</h1>
        <div className="w-8" /> {/* Spacer */}
      </div>

      {/* Dog Profile Preview */}
      <div className="px-6 py-8 pb-32">
        {/* Dog Image */}
        <div className="relative aspect-square rounded-lg overflow-hidden mb-4">
          <Image src={representativeImage || "/placeholder.svg"} alt={name} fill className="object-cover" />
          <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm font-medium">
            {name}
          </div>
          <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
            {age} {weight}
          </div>
        </div>

        {/* Personality Tags - 성별에 따른 색상 적용 */}
        <div className="flex flex-wrap gap-2 mb-6">
          {personality.map((trait: string, index: number) => (
            <span
              key={index}
              className={`px-4 py-2 rounded-full text-sm text-gray-800 ${
                gender === "male" ? "bg-[#D0E2F6]" : "bg-[#F6D0D0]"
              }`}
            >
              {trait}
            </span>
          ))}
        </div>

        {/* Description */}
        <div className="mb-8">
          <p className="text-gray-700 text-base whitespace-pre-line">{description}</p>
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
      </div>
      {/* Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-6 bg-white border-t">
        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={() => {
              console.log("미리보기에서 이전 버튼 클릭")
              onBack()
            }}
            variant="outline"
            className="h-14 border-2 border-gray-300 hover:border-gray-400 text-black text-lg font-medium rounded-md"
          >
            이전
          </Button>
          <Button
            onClick={() => {
              console.log("미리보기에서 짝궁찾으러 가기 버튼 클릭")
              onContinue()
            }}
            className="h-14 bg-black hover:bg-black/90 text-white text-lg font-medium rounded-md"
          >
            짝궁찾으러 가기
          </Button>
        </div>
      </div>
    </div>
  )
}
