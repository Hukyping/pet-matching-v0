"use client"

import { useState } from "react"
import LoginScreen from "@/components/login-screen"
import UpdateProfile from "@/components/update-profile"
import MatchingScreen from "@/components/matching-screen"
import PreviewScreen from "@/components/preview-screen"
import MatchSuccessScreen from "@/components/match-success-screen"
import MessageScreen from "@/components/message-screen"
import MessageListScreen from "@/components/message-list-screen"
import { Home, User, Heart, MessageCircle, Users } from "lucide-react"
import CommunityScreen from "@/components/community-screen"

export default function Page() {
  const [currentScreen, setCurrentScreen] = useState<
    "login" | "profile" | "preview" | "matching" | "match-success" | "message" | "community"
  >("login")
  const [profileData, setProfileData] = useState({})
  const [images, setImages] = useState<string[]>([])
  const [representativeImageIndex, setRepresentativeImageIndex] = useState(0)
  const [ownerData, setOwnerData] = useState({})
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null)
  const [currentMatchedDog, setCurrentMatchedDog] = useState({})

  const [savedFormData, setSavedFormData] = useState({
    profileData: {
      breed: "선택",
      gender: "",
      name: "",
      age: [1],
      weight: [0.1],
      color: "",
      personality: [],
      mateType: [],
    },
    idealTypeData: {
      preferredGender: "",
      preferredAgeRange: [1, 40],
      preferredWeightRange: [0.1, 3.6],
      preferredColor: "",
      preferredPersonality: [],
      preferredMateType: [],
    },
    ownerData: {
      nickname: "",
      gender: "",
      age: "",
      region: "",
      appeal: "",
    },
    locationData: {
      nearbyRange: "가까운 동네",
      selectedLocation: "평창동",
      latitude: 37.5666805,
      longitude: 126.9784147,
      accuracy: 0,
      mapLoaded: false,
    },
    images: [],
    representativeImageIndex: 0,
    vaccinationCertificate: null,
    certificateFileName: "",
    activeTab: 0,
  })

  // 매칭된 강아지 정보 (예시)
  const matchedDogData = {
    name: "라떼",
    gender: "male", // 수컷
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/BA_ED_8C_80_ED_94_8C__EB_94_94_EC_9E_90_EC_9D_B8-qvQOyIhxxF8KtZKWeJ3RWVGjVh1Got.png",
      "/placeholder.svg?height=400&width=400",
      "/placeholder.svg?height=400&width=400",
    ],
    representativeImageIndex: 0,
    personality: ["귀여움", "도도함", "영리함", "호기심많음", "온순함"],
    description: "산책을 좋아하고 활동적입니다.\n매일/주말 산책 함께할 짝궁/친구를 찾고있어요!",
    location: "서초구",
    distance: "2.1km",
  }

  const navigationItems = [
    {
      id: "login",
      label: "로그인",
      icon: Home,
      screen: "login" as const,
    },
    {
      id: "profile",
      label: "프로필",
      icon: User,
      screen: "profile" as const,
    },
    {
      id: "matching",
      label: "매칭",
      icon: Heart,
      screen: "matching" as const,
    },
    {
      id: "message",
      label: "메시지",
      icon: MessageCircle,
      screen: "message" as const,
    },
    {
      id: "community",
      label: "게시판",
      icon: Users,
      screen: "community" as const,
    },
  ]

  // 화면 순서 정의 (이전/다음 네비게이션용)
  const screenOrder = ["login", "profile", "preview", "matching", "match-success", "message", "community"]

  const handlePrevScreen = () => {
    const currentIndex = screenOrder.indexOf(currentScreen)
    if (currentIndex > 0) {
      setCurrentScreen(screenOrder[currentIndex - 1] as any)
    }
  }

  const handleNextScreen = () => {
    const currentIndex = screenOrder.indexOf(currentScreen)
    if (currentIndex < screenOrder.length - 1) {
      setCurrentScreen(screenOrder[currentIndex + 1] as any)
    }
  }

  const handleSignIn = () => {
    console.log("로그인 버튼 클릭 - 프로필 화면으로 이동")
    setCurrentScreen("profile")
  }

  const handleCloseProfile = () => {
    console.log("프로필 닫기 - 로그인 화면으로 이동")
    setCurrentScreen("login")
  }

  const handleProfileComplete = (data: any) => {
    console.log("프로필 작성 완료, 데이터 수신:", data)

    setSavedFormData(data)

    if (data) {
      setProfileData(data.profileData || {})
      setImages(data.images || [])
      setRepresentativeImageIndex(data.representativeImageIndex || 0)
      setOwnerData(data.ownerData || {})
    }

    setTimeout(() => {
      setCurrentScreen("preview")
      console.log("화면 전환 완료: preview")
    }, 100)
  }

  const handlePreviewContinue = () => {
    console.log("미리보기에서 매칭 화면으로 이동")
    setCurrentScreen("matching")
  }

  const handlePreviewBack = () => {
    console.log("미리보기에서 프로필 화면으로 돌아가기")
    setCurrentScreen("profile")
  }

  const handleBackToProfile = () => {
    console.log("매칭 화면에서 프로필 화면으로 돌아가기")
    setCurrentScreen("profile")
  }

  // 매칭 성공 시 호출되는 함수
  const handleMatchSuccess = () => {
    console.log("매칭 성공! 매칭 성공 화면으로 이동")
    setCurrentScreen("match-success")
  }

  // 매칭 성공 화면에서 뒤로가기
  const handleMatchSuccessBack = () => {
    console.log("매칭 성공 화면에서 매칭 화면으로 돌아가기")
    setCurrentScreen("matching")
  }

  // 메시지 보내기
  const handleSendMessage = () => {
    console.log("메시지 화면으로 이동")
    setCurrentScreen("message")
  }

  // 메시지 화면에서 뒤로가기
  const handleMessageBack = () => {
    if (selectedChatId) {
      setSelectedChatId(null) // 메시지 목록으로 돌아가기
    } else {
      setCurrentScreen("matching") // 매칭 화면으로 돌아가기
    }
  }

  const handleMessageListBack = () => {
    setCurrentScreen("matching")
  }

  const handleOpenMessageList = () => {
    setCurrentScreen("message")
  }

  const handleSelectChat = (userId: string, matchedDog: any) => {
    setSelectedChatId(userId)
    setCurrentMatchedDog(matchedDog)
  }

  // 내 강아지 데이터 구성
  const myDogData = {
    name: profileData.name || "슈가",
    gender: profileData.gender || "female",
    images: images.length > 0 ? images : ["/images/dog-preview.png"],
    representativeImageIndex: representativeImageIndex,
  }

  // 현재 화면 인덱스
  const currentIndex = screenOrder.indexOf(currentScreen)
  const hasPrev = currentIndex > 0
  const hasNext = currentIndex < screenOrder.length - 1

  return (
    <div className="min-h-screen bg-white max-w-md mx-auto relative">
      {/* 상단 네비게이션 완전 제거 */}
      {/* 게시판, 메시지, 매칭, 프로필 화면에서 이전/다음 버튼 제거 */}

      {/* 메인 콘텐츠 */}
      <div className="overflow-y-auto" style={{ minHeight: "100vh" }}>
        {currentScreen === "login" && <LoginScreen onSignIn={handleSignIn} />}
        {currentScreen === "profile" && (
          <UpdateProfile onClose={handleCloseProfile} onComplete={handleProfileComplete} initialData={savedFormData} />
        )}
        {currentScreen === "preview" && (
          <PreviewScreen
            onBack={handlePreviewBack}
            onContinue={handlePreviewContinue}
            profileData={profileData}
            images={images}
            representativeImageIndex={representativeImageIndex}
            ownerData={ownerData}
          />
        )}
        {currentScreen === "matching" && <MatchingScreen onBack={handleBackToProfile} onMatch={handleMatchSuccess} />}
        {currentScreen === "match-success" && (
          <MatchSuccessScreen
            onBack={handleMatchSuccessBack}
            onSendMessage={handleSendMessage}
            myDogData={myDogData}
            matchedDogData={matchedDogData}
          />
        )}
        {currentScreen === "message" && (
          <>
            {selectedChatId ? (
              <MessageScreen
                onBack={handleMessageBack}
                myDogData={myDogData}
                matchedDogData={currentMatchedDog}
                userId={selectedChatId}
              />
            ) : (
              <MessageListScreen onBack={handleMessageListBack} onSelectChat={handleSelectChat} />
            )}
          </>
        )}
        {currentScreen === "community" && <CommunityScreen />}
      </div>

      {/* 하단 네비게이션 바 */}
      {currentScreen !== "login" && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center h-16 z-40 max-w-md mx-auto">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              className={`flex flex-col items-center justify-center w-1/5 h-full transition-all duration-200 ${
                currentScreen === item.screen ? "text-gray-800 scale-105" : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setCurrentScreen(item.screen)}
            >
              <item.icon size={24} strokeWidth={currentScreen === item.screen ? 2.5 : 2} />
              <span className={`text-xs mt-1 ${currentScreen === item.screen ? "font-bold" : "font-medium"}`}>
                {item.label}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
