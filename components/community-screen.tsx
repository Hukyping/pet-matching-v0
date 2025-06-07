"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Filter, Heart, MessageCircle, ChevronRight, Clock, MapPin, Tag, DollarSign } from "lucide-react"
import Image from "next/image"

type CommunityPost = {
  작성자: string
  강아지이름: string
  지역: string
  제목: string
  내용: string
  해시태그: string
  좋아요수: string
  댓글수: string
  게시일자: string
}

type MarketplacePost = {
  작성자: string
  거래유형: string
  지역: string
  품목: string
  제목: string
  내용: string
  가격: string
  찜수: string
  댓글수: string
  게시일자: string
}

export default function CommunityScreen() {
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>([])
  const [marketplacePosts, setMarketplacePosts] = useState<MarketplacePost[]>([])
  const [activeTab, setActiveTab] = useState("community")
  const [selectedPost, setSelectedPost] = useState<CommunityPost | MarketplacePost | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)

        // 커뮤니티 게시판 데이터 가져오기
        const communityResponse = await fetch("/emotional_community_board.csv")
        const communityText = await communityResponse.text()
        const communityData = parseCSV(communityText)
        setCommunityPosts(communityData)

        // 중고거래 게시판 데이터 가져오기
        const marketplaceResponse = await fetch("/emotional_marketplace_board.csv")
        const marketplaceText = await marketplaceResponse.text()
        const marketplaceData = parseCSV(marketplaceText)
        setMarketplacePosts(marketplaceData)
      } catch (error) {
        console.error("데이터 로딩 중 오류 발생:", error)
        // 오류 발생 시 샘플 데이터 사용
        setCommunityPosts(sampleCommunityPosts)
        setMarketplacePosts(sampleMarketplacePosts)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // CSV 파싱 함수
  const parseCSV = (csvText: string) => {
    const lines = csvText.split("\n")
    const headers = lines[0].split(",")

    return lines
      .slice(1)
      .filter((line) => line.trim())
      .map((line) => {
        const values = line.split(",")
        const obj: any = {}

        headers.forEach((header, index) => {
          obj[header.trim()] = values[index]?.trim() || ""
        })

        return obj
      })
  }

  // 게시물 선택 핸들러
  const handlePostClick = (post: CommunityPost | MarketplacePost) => {
    setSelectedPost(post)
  }

  // 뒤로가기 핸들러
  const handleBack = () => {
    setSelectedPost(null)
  }

  // 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      const now = new Date()
      const diffTime = Math.abs(now.getTime() - date.getTime())
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays === 0) {
        return "오늘"
      } else if (diffDays === 1) {
        return "어제"
      } else if (diffDays < 7) {
        return `${diffDays}일 전`
      } else if (diffDays < 30) {
        return `${Math.floor(diffDays / 7)}주 전`
      } else {
        return `${date.getMonth() + 1}월 ${date.getDate()}일`
      }
    } catch (e) {
      return dateString
    }
  }

  // 해시태그 분리 함수
  const parseHashtags = (hashtagString: string) => {
    if (!hashtagString) return []
    return hashtagString.split(" ").filter((tag) => tag.startsWith("#"))
  }

  // 프로필 이미지 생성 함수
  const getProfileImage = (userId: string) => {
    if (userId.startsWith("happy_")) {
      return `/images/${userId}.png`
    } else if (userId.startsWith("doglo_")) {
      return `/images/${userId}.png`
    } else if (userId.startsWith("sniff_")) {
      return `/images/${userId}.png`
    } else {
      return `/images/puppy_${userId.slice(-6)}.png`
    }
  }

  // 샘플 데이터 (CSV 로딩 실패 시 사용)
  const sampleCommunityPosts: CommunityPost[] = [
    {
      작성자: "happy_33eb52",
      강아지이름: "몽이",
      지역: "서울 강남구",
      제목: "강아지 일상 공유 #300",
      내용: "강아지 놀이터에서 병원 다녀오기를 했어요. 혼자보다 함께 하니까 하루가 더 특별했어요. 더 많은 추억을 만들고 싶어졌어요.",
      해시태그: "#간식만들기 #행복 #강아지일상",
      좋아요수: "34",
      댓글수: "7",
      게시일자: "2025-05-01",
    },
    {
      작성자: "doglo_245432",
      강아지이름: "초코",
      지역: "부산 해운대구",
      제목: "우리 강아지 첫 수영 도전!",
      내용: "오늘 처음으로 바다에 가서 수영을 했어요. 처음에는 무서워했지만 금방 적응해서 너무 신나게 놀았답니다.",
      해시태그: "#첫수영 #해운대 #강아지수영",
      좋아요수: "56",
      댓글수: "12",
      게시일자: "2025-04-28",
    },
  ]

  const sampleMarketplacePosts: MarketplacePost[] = [
    {
      작성자: "doglo_245432",
      거래유형: "판매",
      지역: "서울 강남구",
      품목: "강아지 옷",
      제목: "[판매] 거의 새 상품 강아지 겨울옷",
      내용: "한 번 입혀봤는데 사이즈가 안 맞아서 판매합니다. 상태 최상입니다.",
      가격: "15000",
      찜수: "5",
      댓글수: "2",
      게시일자: "2025-05-02",
    },
    {
      작성자: "sniff_011b19",
      거래유형: "구매",
      지역: "경기 일산",
      품목: "강아지 장난감",
      제목: "[구매] 노즈워크 장난감 구합니다",
      내용: "우리 강아지가 노즈워크를 좋아해서 중고 노즈워크 장난감 구합니다. 상태 괜찮은 것으로 연락주세요.",
      가격: "10000",
      찜수: "0",
      댓글수: "3",
      게시일자: "2025-05-01",
    },
  ]

  // 게시물 상세 보기 렌더링
  const renderPostDetail = () => {
    if (!selectedPost) return null

    const isCommunityPost = "강아지이름" in selectedPost
    const post = selectedPost as any

    return (
      <div className="flex flex-col h-full">
        {/* 상단 헤더 */}
        <div className="sticky top-0 z-10 bg-white border-b px-4 py-3 flex items-center">
          <button onClick={handleBack} className="mr-3">
            <ChevronRight className="w-6 h-6 transform rotate-180" />
          </button>
          <h2 className="text-lg font-bold flex-1 truncate">{post.제목}</h2>
        </div>

        {/* 게시물 내용 */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* 작성자 정보 */}
          <div className="flex items-center mb-4">
            <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-100 border">
              <Image
                src={getProfileImage(post.작성자) || "/placeholder.svg"}
                alt={post.작성자}
                fill
                className="object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = "/images/dog-preview.png"
                }}
              />
            </div>
            <div className="ml-3">
              <div className="font-semibold">{isCommunityPost ? post.강아지이름 : post.작성자}</div>
              <div className="text-sm text-gray-500 flex items-center">
                <MapPin size={14} className="mr-1" />
                {post.지역}
              </div>
            </div>
            <div className="ml-auto text-sm text-gray-500">{formatDate(post.게시일자)}</div>
          </div>

          {/* 게시물 제목 및 내용 */}
          <h1 className="text-xl font-bold mb-3">{post.제목}</h1>
          <p className="text-gray-700 mb-4 whitespace-pre-line">{post.내용}</p>

          {/* 중고거래 정보 */}
          {!isCommunityPost && (
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <div className="flex items-center mb-2">
                <Tag size={16} className="mr-2 text-gray-600" />
                <span className="font-medium">품목:</span>
                <span className="ml-2">{post.품목}</span>
              </div>
              <div className="flex items-center">
                <DollarSign size={16} className="mr-2 text-gray-600" />
                <span className="font-medium">가격:</span>
                <span className="ml-2">{Number(post.가격).toLocaleString()}원</span>
              </div>
            </div>
          )}

          {/* 해시태그 */}
          {isCommunityPost && post.해시태그 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {parseHashtags(post.해시태그).map((tag, index) => (
                <span key={index} className="bg-blue-50 text-blue-600 px-2 py-1 rounded-full text-sm">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* 좋아요, 댓글 정보 */}
          <div className="flex items-center mt-6 pt-4 border-t">
            <div className="flex items-center mr-4">
              <Heart size={18} className="mr-1 text-rose-500" />
              <span>{isCommunityPost ? post.좋아요수 : post.찜수}</span>
            </div>
            <div className="flex items-center">
              <MessageCircle size={18} className="mr-1 text-blue-500" />
              <span>{post.댓글수}</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 커뮤니티 게시판 렌더링
  const renderCommunityPosts = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      )
    }

    return (
      <div className="divide-y">
        {communityPosts.map((post, index) => (
          <div
            key={index}
            className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
            onClick={() => handlePostClick(post)}
          >
            <div className="flex items-center mb-2">
              <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-100 border">
                <Image
                  src={getProfileImage(post.작성자) || "/placeholder.svg"}
                  alt={post.작성자}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = "/images/dog-preview.png"
                  }}
                />
              </div>
              <div className="ml-2">
                <div className="font-medium">{post.강아지이름}</div>
                <div className="text-xs text-gray-500 flex items-center">
                  <MapPin size={12} className="mr-1" />
                  {post.지역}
                </div>
              </div>
              <div className="ml-auto text-xs text-gray-500 flex items-center">
                <Clock size={12} className="mr-1" />
                {formatDate(post.게시일자)}
              </div>
            </div>

            <h3 className="font-bold mb-1 line-clamp-1">{post.제목}</h3>
            <p className="text-sm text-gray-700 mb-2 line-clamp-2">{post.내용}</p>

            {post.해시태그 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {parseHashtags(post.해시태그)
                  .slice(0, 3)
                  .map((tag, idx) => (
                    <span key={idx} className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full text-xs">
                      {tag}
                    </span>
                  ))}
                {parseHashtags(post.해시태그).length > 3 && (
                  <span className="text-xs text-gray-500">+{parseHashtags(post.해시태그).length - 3}</span>
                )}
              </div>
            )}

            <div className="flex items-center mt-2">
              <div className="flex items-center mr-3">
                <Heart size={14} className="mr-1 text-rose-500" />
                <span className="text-xs">{post.좋아요수}</span>
              </div>
              <div className="flex items-center">
                <MessageCircle size={14} className="mr-1 text-blue-500" />
                <span className="text-xs">{post.댓글수}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  // 중고거래 게시판 렌더링
  const renderMarketplacePosts = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      )
    }

    return (
      <div className="divide-y">
        {marketplacePosts.map((post, index) => (
          <div
            key={index}
            className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
            onClick={() => handlePostClick(post)}
          >
            <div className="flex items-center mb-2">
              <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-100 border">
                <Image
                  src={getProfileImage(post.작성자) || "/placeholder.svg"}
                  alt={post.작성자}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = "/images/dog-preview.png"
                  }}
                />
              </div>
              <div className="ml-2">
                <div className="font-medium">{post.작성자}</div>
                <div className="text-xs text-gray-500 flex items-center">
                  <MapPin size={12} className="mr-1" />
                  {post.지역}
                </div>
              </div>
              <div className="ml-auto text-xs text-gray-500 flex items-center">
                <Clock size={12} className="mr-1" />
                {formatDate(post.게시일자)}
              </div>
            </div>

            <div className="flex items-center mb-1">
              <span
                className={`text-xs px-2 py-0.5 rounded-full mr-2 ${
                  post.거래유형 === "판매" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"
                }`}
              >
                {post.거래유형}
              </span>
              <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">{post.품목}</span>
            </div>

            <h3 className="font-bold mb-1 line-clamp-1">{post.제목}</h3>
            <p className="text-sm text-gray-700 mb-2 line-clamp-2">{post.내용}</p>

            <div className="flex justify-between items-center mt-2">
              <div className="font-bold text-rose-600">{Number(post.가격).toLocaleString()}원</div>
              <div className="flex items-center">
                <div className="flex items-center mr-3">
                  <Heart size={14} className="mr-1 text-rose-500" />
                  <span className="text-xs">{post.찜수}</span>
                </div>
                <div className="flex items-center">
                  <MessageCircle size={14} className="mr-1 text-blue-500" />
                  <span className="text-xs">{post.댓글수}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  // 메인 렌더링
  if (selectedPost) {
    return renderPostDetail()
  }

  return (
    <div className="flex flex-col h-full">
      {/* 상단 검색바 */}
      <div className="sticky top-0 z-10 bg-white border-b px-4 py-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="검색어를 입력하세요"
            className="w-full pl-10 pr-4 py-2 border rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200"
          />
          <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        </div>
      </div>

      {/* 탭 메뉴 */}
      <Tabs defaultValue="community" className="flex-1 flex flex-col" onValueChange={setActiveTab}>
        <div className="border-b">
          <TabsList className="w-full h-12 bg-transparent">
            <TabsTrigger
              value="community"
              className={`flex-1 data-[state=active]:border-b-2 data-[state=active]:border-gray-900 data-[state=active]:shadow-none rounded-none h-full ${
                activeTab === "community" ? "font-bold" : ""
              }`}
            >
              커뮤니티
            </TabsTrigger>
            <TabsTrigger
              value="marketplace"
              className={`flex-1 data-[state=active]:border-b-2 data-[state=active]:border-gray-900 data-[state=active]:shadow-none rounded-none h-full ${
                activeTab === "marketplace" ? "font-bold" : ""
              }`}
            >
              중고거래
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-y-auto">
          <TabsContent value="community" className="m-0 p-0 h-full">
            {renderCommunityPosts()}
          </TabsContent>
          <TabsContent value="marketplace" className="m-0 p-0 h-full">
            {renderMarketplacePosts()}
          </TabsContent>
        </div>
      </Tabs>

      {/* 글쓰기 버튼 */}
      <button className="fixed bottom-20 right-4 w-14 h-14 bg-gray-900 text-white rounded-full flex items-center justify-center shadow-lg">
        <span className="text-2xl font-light">+</span>
      </button>
    </div>
  )
}
