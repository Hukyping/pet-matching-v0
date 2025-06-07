"use client"

import { useState, useRef, useEffect, type ChangeEvent } from "react"
import { X, ImageIcon, Trash2, Plus, FileText, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image"
import * as XLSX from "xlsx"

interface UpdateProfileProps {
  onClose: () => void
  onComplete: (data: any) => void
  initialData?: any
}

interface DogLocation {
  lat: number
  lon: number
  id: string
}

export default function UpdateProfile({ onClose, onComplete, initialData }: UpdateProfileProps) {
  // Initialize states with saved data if available
  const [activeTab, setActiveTab] = useState(initialData?.activeTab || 0)
  const [images, setImages] = useState<string[]>(initialData?.images || [])
  const [vaccinationCertificate, setVaccinationCertificate] = useState<string | null>(
    initialData?.vaccinationCertificate || null,
  )
  const [certificateFileName, setCertificateFileName] = useState<string>(initialData?.certificateFileName || "")

  // 프로필 데이터 초기화
  const [profileData, setProfileData] = useState({
    breed: initialData?.profileData?.breed || "선택",
    gender: initialData?.profileData?.gender || "",
    name: initialData?.profileData?.name || "",
    age: initialData?.profileData?.age || [1],
    weight: initialData?.profileData?.weight || [0.1],
    color: initialData?.profileData?.color || "",
    personality: initialData?.profileData?.personality || [],
    mateType: initialData?.profileData?.mateType || [],
  })

  // 이상형 데이터 초기화
  const [idealTypeData, setIdealTypeData] = useState({
    preferredGender: initialData?.idealTypeData?.preferredGender || "",
    preferredAgeRange: initialData?.idealTypeData?.preferredAgeRange || [1, 40],
    preferredWeightRange: initialData?.idealTypeData?.preferredWeightRange || [0.1, 3.6],
    preferredColor: initialData?.idealTypeData?.preferredColor || "",
    preferredPersonality: initialData?.idealTypeData?.preferredPersonality || [],
    preferredMateType: initialData?.idealTypeData?.preferredMateType || [],
  })

  // 주인 데이터 초기화
  const [ownerData, setOwnerData] = useState({
    nickname: initialData?.ownerData?.nickname || "",
    gender: initialData?.ownerData?.gender || "",
    age: initialData?.ownerData?.age || "",
    region: initialData?.ownerData?.region || "",
    appeal: initialData?.ownerData?.appeal || "",
  })

  // 위치 데이터 초기화 - 로딩 상태 개선
  const [locationData, setLocationData] = useState({
    nearbyRange: initialData?.locationData?.nearbyRange || "가까운 동네",
    selectedLocation: initialData?.locationData?.selectedLocation || "평창동",
    latitude: initialData?.locationData?.latitude || 37.5666805,
    longitude: initialData?.locationData?.longitude || 126.9784147,
    accuracy: initialData?.locationData?.accuracy || 0,
    mapLoaded: false, // 항상 false로 시작
    zoomLevel: initialData?.locationData?.zoomLevel || 15,
  })

  const [representativeImageIndex, setRepresentativeImageIndex] = useState<number>(
    initialData?.representativeImageIndex >= 0 ? initialData.representativeImageIndex : 0,
  )

  // 로딩 상태 관리 개선
  const [dogLocations, setDogLocations] = useState<DogLocation[]>([])
  const [isLoadingDogData, setIsLoadingDogData] = useState(false)
  const [dogDataError, setDogDataError] = useState<string | null>(null)

  // 탭 변경 시 스크롤을 상단으로 이동
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }, [activeTab])

  const fileInputRef = useRef<HTMLInputElement>(null)
  const certificateInputRef = useRef<HTMLInputElement>(null)

  const tabs = ["사진 등록", "프로필 등록", "이상형 정보", "주인정보 등록", "위치정보 등록"]

  const personalityTraits = [
    "경계심",
    "귀여움",
    "독립적",
    "사교적",
    "사람좋아함",
    "사랑스러움",
    "소심함",
    "순함",
    "에너지넘침",
    "영리함",
    "온순함",
    "장난기많음",
    "충성심",
    "호기심많음",
    "활발함",
    "친화적",
    "보호본능",
    "차분함",
    "민감함",
    "용감함",
    "애교많음",
    "집중력",
    "인내심",
    "적응력",
    "경쟁심",
    "협조적",
    "신중함",
    "자신감",
    "겸손함",
    "끈기",
    "창의적",
    "관찰력",
    "표현력",
  ]

  // 강아지 위치 데이터 로딩 함수 개선
  const loadDogLocations = async () => {
    if (isLoadingDogData) return // 이미 로딩 중이면 중복 실행 방지

    setIsLoadingDogData(true)
    setDogDataError(null)

    try {
      console.log("강아지 위치 데이터 로딩 시작...")

      // 타임아웃 설정 (10초)
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("로딩 타임아웃")), 10000))

      const fetchPromise = fetch("/dog_dummy_data_1200_with_gps_final.xlsx")

      const response = (await Promise.race([fetchPromise, timeoutPromise])) as Response

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const arrayBuffer = await response.arrayBuffer()
      console.log("Excel 파일 로딩 완료, 크기:", arrayBuffer.byteLength)

      const workbook = XLSX.read(arrayBuffer, { type: "array" })
      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]
      const jsonData = XLSX.utils.sheet_to_json(worksheet)

      console.log("Excel 데이터 파싱 완료, 행 수:", jsonData.length)

      const locations: DogLocation[] = jsonData
        .map((row: any, index: number) => {
          const lat = Number.parseFloat(row.lat || row.latitude || row.LAT || row.LATITUDE || row["위도"])
          const lon = Number.parseFloat(row.lon || row.longitude || row.LON || row.LONGITUDE || row["경도"])

          return {
            lat,
            lon,
            id: `dog-${index}`,
          }
        })
        .filter((location) => !isNaN(location.lat) && !isNaN(location.lon))

      console.log("유효한 강아지 위치 수:", locations.length)
      setDogLocations(locations)
    } catch (error) {
      console.error("강아지 위치 데이터 로딩 실패:", error)
      setDogDataError(error instanceof Error ? error.message : "알 수 없는 오류")

      // 에러 시 더미 데이터 사용
      const dummyLocations: DogLocation[] = [
        { lat: 37.5665, lon: 126.978, id: "dummy-1" },
        { lat: 37.5675, lon: 126.979, id: "dummy-2" },
        { lat: 37.5655, lon: 126.977, id: "dummy-3" },
        { lat: 37.5685, lon: 126.98, id: "dummy-4" },
        { lat: 37.5645, lon: 126.976, id: "dummy-5" },
      ]
      console.log("더미 데이터 사용:", dummyLocations)
      setDogLocations(dummyLocations)
    } finally {
      setIsLoadingDogData(false)
    }
  }

  // 컴포넌트 마운트 시 강아지 데이터 로딩
  useEffect(() => {
    loadDogLocations()
  }, []) // 한 번만 실행

  const isProfileValid = () => {
    return profileData.breed !== "선택" && profileData.name.trim() !== ""
  }

  const isIdealTypeValid = () => {
    return (
      idealTypeData.preferredGender !== "" &&
      idealTypeData.preferredColor !== "" &&
      idealTypeData.preferredPersonality.length > 0 &&
      idealTypeData.preferredMateType.length > 0
    )
  }

  const isOwnerInfoValid = () => {
    return (
      ownerData.nickname.trim() !== "" && ownerData.gender !== "" && ownerData.age !== "" && ownerData.region !== ""
    )
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const remainingSlots = 5 - images.length
    const filesToAdd = Array.from(files).slice(0, remainingSlots)
    const newImageUrls = filesToAdd.map((file) => URL.createObjectURL(file))

    if (images.length === 0 && newImageUrls.length > 0) {
      setRepresentativeImageIndex(0)
    }

    setImages([...images, ...newImageUrls])

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleCertificateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"]
    if (!allowedTypes.includes(file.type)) {
      alert("이미지 파일(JPG, PNG) 또는 PDF 파일만 업로드 가능합니다.")
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("파일 크기는 10MB 이하여야 합니다.")
      return
    }

    const fileUrl = URL.createObjectURL(file)
    setVaccinationCertificate(fileUrl)
    setCertificateFileName(file.name)

    if (certificateInputRef.current) {
      certificateInputRef.current.value = ""
    }
  }

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleCertificateUploadClick = () => {
    if (certificateInputRef.current) {
      certificateInputRef.current.click()
    }
  }

  const handleRemoveImage = (index: number) => {
    const newImages = [...images]
    URL.revokeObjectURL(newImages[index])
    newImages.splice(index, 1)
    setImages(newImages)

    if (index === representativeImageIndex) {
      setRepresentativeImageIndex(newImages.length > 0 ? 0 : -1)
    } else if (index < representativeImageIndex) {
      setRepresentativeImageIndex(representativeImageIndex - 1)
    }
  }

  const handleRemoveCertificate = () => {
    if (vaccinationCertificate) {
      URL.revokeObjectURL(vaccinationCertificate)
    }
    setVaccinationCertificate(null)
    setCertificateFileName("")
  }

  const handleNext = () => {
    if (activeTab === 0) {
      setActiveTab(1)
      return
    }

    if (activeTab === 1) {
      if (!isProfileValid()) {
        alert("품종과 이름을 입력해주세요!")
        return
      }
      setActiveTab(2)
      return
    }

    if (activeTab === 2) {
      if (!isIdealTypeValid()) {
        alert("이상형 정보를 모두 입력해주세요!")
        return
      }
      setActiveTab(3)
      return
    }

    if (activeTab === 3) {
      if (!isOwnerInfoValid()) {
        alert("주인정보를 모두 입력해주세요!")
        return
      }
      setActiveTab(4)
      return
    }

    if (activeTab === 4) {
      console.log("프로필 작성 완료! 미리보기 화면으로 이동합니다.")

      // 지도 데이터가 로드되지 않아도 진행 가능하도록 함
      const completeData = {
        activeTab: activeTab,
        profileData: profileData,
        idealTypeData: idealTypeData,
        ownerData: ownerData,
        locationData: {
          ...locationData,
          // 지도가 로드되지 않았어도 mapLoaded를 true로 설정하여 다음 화면에서 문제 없도록 함
          mapLoaded: true,
        },
        images: images,
        representativeImageIndex: representativeImageIndex,
        vaccinationCertificate: vaccinationCertificate,
        certificateFileName: certificateFileName,
        profile: profileData,
        idealType: idealTypeData,
        owner: ownerData,
        location: locationData,
      }

      console.log("onComplete 함수 호출, 전달 데이터:", completeData)
      onComplete(completeData)
      return
    }
  }

  const handlePrevious = () => {
    if (activeTab > 0) {
      setActiveTab(activeTab - 1)
    }
  }

  const togglePersonality = (trait: string, isIdealType = false) => {
    if (isIdealType) {
      const newPersonality = idealTypeData.preferredPersonality.includes(trait)
        ? idealTypeData.preferredPersonality.filter((p) => p !== trait)
        : [...idealTypeData.preferredPersonality, trait]

      setIdealTypeData({ ...idealTypeData, preferredPersonality: newPersonality })
    } else {
      const newPersonality = profileData.personality.includes(trait)
        ? profileData.personality.filter((p) => p !== trait)
        : [...profileData.personality, trait]

      setProfileData({ ...profileData, personality: newPersonality })
    }
  }

  const toggleMateType = (type: string) => {
    const newMateType = profileData.mateType.includes(type)
      ? profileData.mateType.filter((t) => t !== type)
      : [...profileData.mateType, type]

    setProfileData({ ...profileData, mateType: newMateType })
  }

  const toggleIdealTypeMateType = (type: string) => {
    const newMateType = idealTypeData.preferredMateType.includes(type)
      ? idealTypeData.preferredMateType.filter((t) => t !== type)
      : [...idealTypeData.preferredMateType, type]

    setIdealTypeData({ ...idealTypeData, preferredMateType: newMateType })
  }

  const handleSetRepresentativeImage = (index: number) => {
    setRepresentativeImageIndex(index)
  }

  const renderPhotoTab = () => (
    <div className="px-6 py-8 pb-24">
      <h2 className="text-2xl font-bold text-black mb-8">반려동물 사진 등록</h2>

      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" multiple className="hidden" />

      {images.length > 0 && (
        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">대표 사진을 선택해주세요</p>
            <p className="text-sm text-gray-500">{images.length}/5</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {images.map((src, index) => (
              <div
                key={index}
                className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer transition-all ${
                  index === representativeImageIndex
                    ? "border-4 border-black shadow-lg"
                    : "border border-gray-200 hover:border-gray-400"
                }`}
                onClick={() => handleSetRepresentativeImage(index)}
              >
                <Image
                  src={src || "/placeholder.svg"}
                  alt={`업로드된 이미지 ${index + 1}`}
                  fill
                  className="object-cover"
                />
                {index === representativeImageIndex && (
                  <div className="absolute top-2 left-2 bg-black text-white px-2 py-1 rounded text-xs font-medium">
                    대표
                  </div>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRemoveImage(index)
                  }}
                  className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1 hover:bg-opacity-70 transition-opacity"
                >
                  <Trash2 className="w-5 h-5 text-white" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {images.length < 5 && (
        <div
          onClick={handleUploadClick}
          className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center mb-6 cursor-pointer hover:bg-gray-50 transition-colors"
        >
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
              <ImageIcon className="w-8 h-8 text-gray-400" />
            </div>
            <div>
              <p className="text-lg font-medium text-gray-700 mb-1">사진 업로드하기</p>
              <p className="text-sm text-gray-500">최대 5장 ({images.length}/5)</p>
            </div>
          </div>
        </div>
      )}

      {images.length === 5 && (
        <div className="text-center text-green-600 font-medium mb-6">최대 업로드 수에 도달했습니다 (5/5)</div>
      )}
    </div>
  )

  const renderProfileTab = () => (
    <div className="px-6 py-8 pb-4">
      <h2 className="text-2xl font-bold text-black mb-8">반려동물 프로필 등록</h2>

      <div className="space-y-6">
        {/* 품종 */}
        <div>
          <label className="block text-lg font-medium text-black mb-2">품종</label>
          <Select value={profileData.breed} onValueChange={(value) => setProfileData({ ...profileData, breed: value })}>
            <SelectTrigger className="w-full h-12 text-base">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="선택">선택</SelectItem>
              <SelectItem value="아키타">아키타</SelectItem>
              <SelectItem value="오스트레일리안 셰퍼드">오스트레일리안 셰퍼드</SelectItem>
              <SelectItem value="비글">비글</SelectItem>
              <SelectItem value="비숑 프리제">비숑 프리제</SelectItem>
              <SelectItem value="보스턴 테리어">보스턴 테리어</SelectItem>
              <SelectItem value="치와와">치와와</SelectItem>
              <SelectItem value="코커 스패니얼">코커 스패니얼</SelectItem>
              <SelectItem value="달마시안">달마시안</SelectItem>
              <SelectItem value="도베르만">도베르만</SelectItem>
              <SelectItem value="프렌치 불독">프렌치 불독</SelectItem>
              <SelectItem value="골든 리트리버">골든 리트리버</SelectItem>
              <SelectItem value="그레이트 데인">그레이트 데인</SelectItem>
              <SelectItem value="진돗개">진돗개</SelectItem>
              <SelectItem value="래브라도 리트리버">래브라도 리트리버</SelectItem>
              <SelectItem value="말티즈">말티즈</SelectItem>
              <SelectItem value="미니어처 핀셔">미니어처 핀셔</SelectItem>
              <SelectItem value="파피용">파피용</SelectItem>
              <SelectItem value="페키니즈">페키니즈</SelectItem>
              <SelectItem value="포메라니안">포메라니안</SelectItem>
              <SelectItem value="푸들">푸들</SelectItem>
              <SelectItem value="로트와일러">로트와일러</SelectItem>
              <SelectItem value="사모예드">사모예드</SelectItem>
              <SelectItem value="슈나우저">슈나우저</SelectItem>
              <SelectItem value="샤페이">샤페이</SelectItem>
              <SelectItem value="시바견">시바견</SelectItem>
              <SelectItem value="시츄">시츄</SelectItem>
              <SelectItem value="웰시 코기">웰시 코기</SelectItem>
              <SelectItem value="요크셔 테리어">요크셔 테리어</SelectItem>
              <SelectItem value="믹스견">믹스견</SelectItem>
            </SelectContent>
          </Select>
          {profileData.breed === "선택" && <p className="text-red-500 text-sm mt-1">품종을 선택해주세요.</p>}
        </div>

        {/* 성별 */}
        <div>
          <label className="block text-lg font-medium text-black mb-2">성별</label>
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant={profileData.gender === "female" ? "default" : "outline"}
              onClick={() => setProfileData({ ...profileData, gender: "female" })}
              className="h-12 text-base"
            >
              암컷
            </Button>
            <Button
              variant={profileData.gender === "male" ? "default" : "outline"}
              onClick={() => setProfileData({ ...profileData, gender: "male" })}
              className="h-12 text-base"
            >
              수컷
            </Button>
          </div>
        </div>

        {/* 이름 */}
        <div>
          <label className="block text-lg font-medium text-black mb-2">이름</label>
          <Input
            value={profileData.name}
            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
            className="h-12 text-base"
            placeholder="반려동물 이름을 입력하세요"
          />
          {profileData.name.trim() === "" && <p className="text-red-500 text-sm mt-1">이름을 입력해주세요.</p>}
        </div>

        {/* 나이 */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-lg font-medium text-black">나이(월령)</label>
            <span className="text-lg font-medium">{profileData.age[0]}개월</span>
          </div>
          <div className="mt-6">
            <Slider
              value={profileData.age}
              onValueChange={(value) => setProfileData({ ...profileData, age: value })}
              max={120}
              min={1}
              step={1}
              className="w-full"
            />
          </div>
        </div>

        {/* 몸무게 */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-lg font-medium text-black">몸무게</label>
            <span className="text-lg font-medium">{profileData.weight[0]}kg</span>
          </div>
          <div className="mt-6">
            <Slider
              value={profileData.weight}
              onValueChange={(value) => setProfileData({ ...profileData, weight: value })}
              max={50}
              min={0.1}
              step={0.1}
              className="w-full"
            />
          </div>
        </div>

        {/* 모색 */}
        <div>
          <label className="block text-lg font-medium text-black mb-2">모색</label>
          <div className="grid grid-cols-3 gap-4">
            {[
              { color: "#f5f5f5", name: "white" },
              { color: "#8B4513", name: "brown" },
              { color: "#2c2c2c", name: "black" },
            ].map((colorOption) => (
              <button
                key={colorOption.name}
                onClick={() => setProfileData({ ...profileData, color: colorOption.name })}
                className={`h-10 rounded-lg border-2 flex items-center justify-center ${
                  profileData.color === colorOption.name ? "border-black" : "border-gray-300"
                }`}
              >
                <div className="w-6 h-6 rounded-full" style={{ backgroundColor: colorOption.color }} />
              </button>
            ))}
          </div>
        </div>

        {/* 성격 */}
        <div>
          <label className="block text-lg font-medium text-black mb-2">성격</label>
          <div className="grid grid-cols-3 gap-2">
            {personalityTraits.map((trait) => {
              const isSelected = profileData.personality.includes(trait)
              const isMale = profileData.gender === "male"

              return (
                <Button
                  key={trait}
                  variant={isSelected ? "default" : "outline"}
                  onClick={() => togglePersonality(trait)}
                  className={`h-10 text-sm ${
                    isSelected
                      ? isMale
                        ? "bg-[#D0E2F6] hover:bg-[#D0E2F6]/90 text-gray-800 border-[#D0E2F6]"
                        : "bg-[#F6D0D0] hover:bg-[#F6D0D0]/90 text-gray-800 border-[#F6D0D0]"
                      : "border-gray-300 hover:border-gray-400 text-gray-700"
                  }`}
                >
                  {trait}
                </Button>
              )
            })}
          </div>
        </div>

        {/* 목적 */}
        <div>
          <label className="block text-lg font-medium text-black mb-2">목적</label>
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant={profileData.mateType.includes("walk") ? "default" : "outline"}
              onClick={() => toggleMateType("walk")}
              className="h-12 text-base"
            >
              🐾 산책메이트
            </Button>
            <Button
              variant={profileData.mateType.includes("soul") ? "default" : "outline"}
              onClick={() => toggleMateType("soul")}
              className="h-12 text-base"
            >
              ❤️ 소울메이트
            </Button>
          </div>
          {profileData.mateType.length === 0 && (
            <p className="text-red-500 text-sm mt-2 whitespace-normal">목적을 최소 1개 이상 선택해주세요.</p>
          )}
        </div>

        {/* 예방접종 증명서 */}
        <div>
          <label className="block text-lg font-medium text-black mb-2">예방접종 증명서 등록하기</label>

          <input
            type="file"
            ref={certificateInputRef}
            onChange={handleCertificateChange}
            accept="image/*,.pdf"
            className="hidden"
          />

          {vaccinationCertificate ? (
            <div className="border border-gray-300 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 truncate max-w-48">{certificateFileName}</p>
                    <p className="text-sm text-green-600">업로드 완료</p>
                  </div>
                </div>
                <button onClick={handleRemoveCertificate} className="p-1 hover:bg-gray-100 rounded">
                  <Trash2 className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
          ) : (
            <div
              onClick={handleCertificateUploadClick}
              className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:bg-gray-50 transition-colors min-h-[140px] flex flex-col justify-center"
            >
              <Plus className="w-8 h-8 text-gray-400 mx-auto mb-3" />
              <p className="text-sm text-gray-600 mb-2">건강 정보 기반의 짝궁 추천을 받을 수 있어요.</p>
              <p className="text-xs text-gray-500">이미지 파일(JPG, PNG) 또는 PDF 파일 (최대 10MB)</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  const renderIdealTypeTab = () => (
    <div className="px-6 py-8 pb-24">
      <h2 className="text-2xl font-bold text-black mb-8">이상형 정보 등록</h2>

      <div className="space-y-6">
        {/* 성별 */}
        <div>
          <label className="block text-lg font-medium text-black mb-2">성별</label>
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant={idealTypeData.preferredGender === "female" ? "default" : "outline"}
              onClick={() => setIdealTypeData({ ...idealTypeData, preferredGender: "female" })}
              className="h-12 text-base"
            >
              암컷
            </Button>
            <Button
              variant={idealTypeData.preferredGender === "male" ? "default" : "outline"}
              onClick={() => setIdealTypeData({ ...idealTypeData, preferredGender: "male" })}
              className="h-12 text-base"
            >
              수컷
            </Button>
          </div>
          {idealTypeData.preferredGender === "" && <p className="text-red-500 text-sm mt-1">성별을 선택해주세요.</p>}
        </div>

        {/* 선호월령 */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <label className="text-lg font-medium text-black">선호월령</label>
            <span className="text-lg font-medium">
              {idealTypeData.preferredAgeRange[0]} - {idealTypeData.preferredAgeRange[1]}개월
            </span>
          </div>
          <div className="relative px-4 mt-6">
            <div className="relative h-2 bg-gray-200 rounded-full">
              <div
                className="absolute h-2 bg-black rounded-full"
                style={{
                  left: `${((idealTypeData.preferredAgeRange[0] - 1) / (180 - 1)) * 100}%`,
                  width: `${((idealTypeData.preferredAgeRange[1] - idealTypeData.preferredAgeRange[0]) / (180 - 1)) * 100}%`,
                }}
              />
              <div
                className="absolute w-5 h-5 bg-white border-2 border-black rounded-full -translate-y-2 -translate-x-2.5 cursor-pointer"
                style={{ left: `${((idealTypeData.preferredAgeRange[0] - 1) / (180 - 1)) * 100}%` }}
              />
              <div
                className="absolute w-5 h-5 bg-white border-2 border-black rounded-full -translate-y-2 -translate-x-2.5 cursor-pointer"
                style={{ left: `${((idealTypeData.preferredAgeRange[1] - 1) / (180 - 1)) * 100}%` }}
              />
            </div>
            <Slider
              value={idealTypeData.preferredAgeRange}
              onValueChange={(value) =>
                setIdealTypeData({ ...idealTypeData, preferredAgeRange: value as [number, number] })
              }
              max={180}
              min={1}
              step={1}
              className="absolute inset-0 opacity-0"
            />
          </div>
        </div>

        {/* 몸무게 */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <label className="text-lg font-medium text-black">몸무게</label>
            <span className="text-lg font-medium">
              {idealTypeData.preferredWeightRange[0].toFixed(1)} kg - {idealTypeData.preferredWeightRange[1].toFixed(1)}{" "}
              kg
            </span>
          </div>
          <div className="relative px-4 mt-6">
            <div className="relative h-2 bg-gray-200 rounded-full">
              <div
                className="absolute h-2 bg-black rounded-full"
                style={{
                  left: `${((idealTypeData.preferredWeightRange[0] - 0.1) / (50 - 0.1)) * 100}%`,
                  width: `${((idealTypeData.preferredWeightRange[1] - idealTypeData.preferredWeightRange[0]) / (50 - 0.1)) * 100}%`,
                }}
              />
              <div
                className="absolute w-5 h-5 bg-white border-2 border-black rounded-full -translate-y-2 -translate-x-2.5 cursor-pointer"
                style={{ left: `${((idealTypeData.preferredWeightRange[0] - 0.1) / (50 - 0.1)) * 100}%` }}
              />
              <div
                className="absolute w-5 h-5 bg-white border-2 border-black rounded-full -translate-y-2 -translate-x-2.5 cursor-pointer"
                style={{ left: `${((idealTypeData.preferredWeightRange[1] - 0.1) / (50 - 0.1)) * 100}%` }}
              />
            </div>
            <Slider
              value={idealTypeData.preferredWeightRange}
              onValueChange={(value) =>
                setIdealTypeData({ ...idealTypeData, preferredWeightRange: value as [number, number] })
              }
              max={50}
              min={0.1}
              step={0.1}
              className="absolute inset-0 opacity-0"
            />
          </div>
        </div>

        {/* 모색 */}
        <div>
          <label className="block text-lg font-medium text-black mb-2">모색</label>
          <div className="grid grid-cols-3 gap-4">
            {[
              { color: "#f5f5f5", name: "white" },
              { color: "#8B4513", name: "brown" },
              { color: "#2c2c2c", name: "black" },
            ].map((colorOption) => (
              <button
                key={colorOption.name}
                onClick={() => setIdealTypeData({ ...idealTypeData, preferredColor: colorOption.name })}
                className={`h-10 rounded-lg border-2 flex items-center justify-center ${
                  idealTypeData.preferredColor === colorOption.name ? "border-black" : "border-gray-300"
                }`}
              >
                <div className="w-6 h-6 rounded-full" style={{ backgroundColor: colorOption.color }} />
              </button>
            ))}
          </div>
          {idealTypeData.preferredColor === "" && <p className="text-red-500 text-sm mt-1">모색을 선택해주세요.</p>}
        </div>

        {/* 성격 */}
        <div>
          <label className="block text-lg font-medium text-black mb-2">성격</label>
          <div className="grid grid-cols-3 gap-2">
            {personalityTraits.map((trait) => (
              <Button
                key={trait}
                variant={idealTypeData.preferredPersonality.includes(trait) ? "default" : "outline"}
                onClick={() => togglePersonality(trait, true)}
                className="h-10 text-sm"
              >
                {trait}
              </Button>
            ))}
          </div>
          {idealTypeData.preferredPersonality.length === 0 && (
            <p className="text-red-500 text-sm mt-1">성격을 최소 1개 이상 선택해주세요.</p>
          )}
        </div>

        {/* 목적 */}
        <div>
          <label className="block text-lg font-medium text-black mb-2">목적</label>
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant={idealTypeData.preferredMateType.includes("walk") ? "default" : "outline"}
              onClick={() => toggleIdealTypeMateType("walk")}
              className="h-12 text-base"
            >
              🐾 산책메이트
            </Button>
            <Button
              variant={idealTypeData.preferredMateType.includes("soul") ? "default" : "outline"}
              onClick={() => toggleIdealTypeMateType("soul")}
              className="h-12 text-base"
            >
              ❤️ 소울메이트
            </Button>
          </div>
          {idealTypeData.preferredMateType.length === 0 && (
            <p className="text-red-500 text-sm mt-2 whitespace-normal">목적을 최소 1개 이상 선택해주세요.</p>
          )}
        </div>
      </div>
    </div>
  )

  const renderOwnerInfoTab = () => (
    <div className="px-6 py-8 pb-24">
      <h2 className="text-2xl font-bold text-black mb-8">주인 정보 등록</h2>

      <div className="space-y-6">
        {/* 닉네임 */}
        <div>
          <label className="block text-lg font-medium text-black mb-2">닉네임</label>
          <Input
            value={ownerData.nickname}
            onChange={(e) => setOwnerData({ ...ownerData, nickname: e.target.value })}
            className="h-12 text-base"
            placeholder="폼폼어멈"
          />
          {ownerData.nickname.trim() === "" && <p className="text-red-500 text-sm mt-1">닉네임을 입력해주세요.</p>}
        </div>

        {/* 성별 */}
        <div>
          <label className="block text-lg font-medium text-black mb-2">성별</label>
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant={ownerData.gender === "male" ? "default" : "outline"}
              onClick={() => setOwnerData({ ...ownerData, gender: "male" })}
              className="h-12 text-base"
            >
              남자
            </Button>
            <Button
              variant={ownerData.gender === "female" ? "default" : "outline"}
              onClick={() => setOwnerData({ ...ownerData, gender: "female" })}
              className="h-12 text-base"
            >
              여자
            </Button>
          </div>
          {ownerData.gender === "" && <p className="text-red-500 text-sm mt-1">성별을 선택해주세요.</p>}
        </div>

        {/* 연령대 */}
        <div>
          <label className="block text-lg font-medium text-black mb-2">연령대</label>
          <div className="grid grid-cols-2 gap-3">
            {["10대", "20대", "30대", "40대", "50대", "60대", "70대", "80대 이상"].map((ageGroup) => (
              <Button
                key={ageGroup}
                variant={ownerData.age === ageGroup ? "default" : "outline"}
                onClick={() => setOwnerData({ ...ownerData, age: ageGroup })}
                className="h-12 text-base"
              >
                {ageGroup}
              </Button>
            ))}
          </div>
          {ownerData.age === "" && <p className="text-red-500 text-sm mt-1">연령대를 선택해주세요.</p>}
        </div>

        {/* 지역 */}
        <div>
          <label className="block text-lg font-medium text-black mb-2">지역</label>
          <Select value={ownerData.region} onValueChange={(value) => setOwnerData({ ...ownerData, region: value })}>
            <SelectTrigger className="w-full h-12 text-base">
              <SelectValue placeholder="지역" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="경기도">경기도</SelectItem>
              <SelectItem value="서울특별시">서울특별시</SelectItem>
              <SelectItem value="부산광역시">부산광역시</SelectItem>
              <SelectItem value="경상남도">경상남도</SelectItem>
              <SelectItem value="인천광역시">인천광역시</SelectItem>
              <SelectItem value="경상북도">경상북도</SelectItem>
              <SelectItem value="대구광역시">대구광역시</SelectItem>
              <SelectItem value="충청남도">충청남도</SelectItem>
              <SelectItem value="전라남도">전라남도</SelectItem>
              <SelectItem value="전북특별자치도">전북특별자치도</SelectItem>
              <SelectItem value="충청북도">충청북도</SelectItem>
              <SelectItem value="강원특별자치도">강원특별자치도</SelectItem>
              <SelectItem value="대전광역시">대전광역시</SelectItem>
              <SelectItem value="광주광역시">광주광역시</SelectItem>
              <SelectItem value="울산광역시">울산광역시</SelectItem>
              <SelectItem value="제주특별자치도">제주특별자치도</SelectItem>
              <SelectItem value="세종특별자치시">세종특별자치시</SelectItem>
            </SelectContent>
          </Select>
          {ownerData.region === "" && <p className="text-red-500 text-sm mt-1">지역을 선택해주세요.</p>}
        </div>

        {/* 집사의 한줄어필 */}
        <div>
          <label className="block text-lg font-medium text-black mb-2">집사의 한줄어필</label>
          <Textarea
            value={ownerData.appeal}
            onChange={(e) => setOwnerData({ ...ownerData, appeal: e.target.value })}
            placeholder="산책을 좋아하고 활동적입니다. 매일/주말 산책 함께할 짝궁/친구를 찾고있어요!"
            className="min-h-32 text-base"
          />
        </div>
      </div>
    </div>
  )

  // 네이버 지도 API 스크립트 로드 및 위치 정보 가져오기
  useEffect(() => {
    if (activeTab !== 4) return

    const loadNaverMapsScript = () => {
      if (typeof window !== "undefined" && !(window as any).naver) {
        const script = document.createElement("script")
        script.type = "text/javascript"
        script.src = "https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=wthem1ducp"
        script.async = true
        script.onload = () => {
          console.log("네이버 지도 API 로딩 완료")
          setLocationData((prev) => ({ ...prev, mapLoaded: true }))
        }
        script.onerror = () => {
          console.error("네이버 지도 API 로딩 실패")
        }
        document.head.appendChild(script)
      } else if ((window as any).naver) {
        console.log("네이버 지도 API 이미 로딩됨")
        setLocationData((prev) => ({ ...prev, mapLoaded: true }))
      }
    }

    loadNaverMapsScript()

    // 현재 위치 가져오기
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords
          console.log("현재 위치 획득:", { latitude, longitude, accuracy })
          setLocationData((prev) => ({
            ...prev,
            latitude,
            longitude,
            accuracy,
            selectedLocation: "현재 위치",
          }))
        },
        (error) => {
          console.error("위치 정보를 가져오는데 실패했습니다:", error)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000,
        },
      )
    }
  }, [activeTab])

  // 지도 초기화 및 마커 표시
  useEffect(() => {
    if (activeTab !== 4 || !locationData.mapLoaded || typeof window === "undefined" || !(window as any).naver) {
      return
    }

    const mapContainer = document.getElementById("map")
    if (!mapContainer) {
      return
    }

    console.log("지도 초기화 시작...")
    const naver = (window as any).naver

    const mapOptions = {
      center: new naver.maps.LatLng(locationData.latitude, locationData.longitude),
      zoom: locationData.zoomLevel,
      zoomControl: true,
      zoomControlOptions: {
        style: naver.maps.ZoomControlStyle.SMALL,
        position: naver.maps.Position.TOP_LEFT,
      },
    }

    const map = new naver.maps.Map("map", mapOptions)
    console.log("지도 생성 완료")

    // 현재 위치 마커 추가
    const marker = new naver.maps.Marker({
      position: new naver.maps.LatLng(locationData.latitude, locationData.longitude),
      map: map,
      icon: {
        content:
          '<div style="width: 20px; height: 20px; background-color: #4285f4; border: 3px solid white; border-radius: 50%; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>',
        anchor: new naver.maps.Point(10, 10),
      },
    })

    // 강아지 위치 마커들 추가
    console.log("강아지 마커 추가 시작, 개수:", dogLocations.length)
    dogLocations.forEach((dogLocation, index) => {
      const heartIcon = {
        content:
          '<div style="color: #ff4757; font-size: 20px; text-shadow: 1px 1px 2px rgba(0,0,0,0.3); cursor: pointer;">❤️</div>',
        size: new naver.maps.Size(20, 20),
        anchor: new naver.maps.Point(10, 10),
      }

      const dogMarker = new naver.maps.Marker({
        position: new naver.maps.LatLng(dogLocation.lat, dogLocation.lon),
        map: map,
        icon: heartIcon,
      })

      // 강아지 마커 클릭 이벤트
      naver.maps.Event.addListener(dogMarker, "click", () => {
        const infoWindow = new naver.maps.InfoWindow({
          content: `<div style="padding: 10px; font-size: 12px;">🐕 강아지 위치<br/>${dogLocation.id}</div>`,
        })
        infoWindow.open(map, dogMarker)
      })
    })

    // 정보창 추가
    const infoWindow = new naver.maps.InfoWindow({
      content: `<div style="padding: 10px; font-size: 12px;">${locationData.selectedLocation}</div>`,
    })

    // 마커 클릭 시 정보창 표시
    naver.maps.Event.addListener(marker, "click", () => {
      if (infoWindow.getMap()) {
        infoWindow.close()
      } else {
        infoWindow.open(map, marker)
      }
    })

    // 지도 클릭 시 위치 업데이트
    naver.maps.Event.addListener(map, "click", (e: any) => {
      const latlng = e.coord
      marker.setPosition(latlng)

      setLocationData((prev) => ({
        ...prev,
        latitude: latlng.y,
        longitude: latlng.x,
        selectedLocation: "선택한 위치",
      }))

      infoWindow.setContent(`<div style="padding: 10px; font-size: 12px;">선택한 위치</div>`)
      infoWindow.open(map, marker)
    })

    return () => {
      if (map && map.destroy) {
        map.destroy()
      }
    }
  }, [
    activeTab,
    locationData.mapLoaded,
    locationData.latitude,
    locationData.longitude,
    locationData.zoomLevel,
    dogLocations,
  ])

  const renderLocationTab = () => {
    const handleNearbyRangeChange = (option: string) => {
      let zoomLevel = 15

      switch (option) {
        case "가까운 동네":
          zoomLevel = 15
          break
        case "조금 가까운 동네":
          zoomLevel = 14
          break
        case "조금 먼 동네":
          zoomLevel = 13
          break
        case "먼 동네":
          zoomLevel = 12
          break
      }

      setLocationData({ ...locationData, nearbyRange: option, zoomLevel })
    }

    // 안내 메시지 추가
    const helpMessage = (
      <div className="mt-6 p-4 bg-blue-50 rounded-lg text-blue-800 text-sm">
        <p className="font-medium mb-1">💡 도움말</p>
        <p>지도가 보이지 않아도 걱정하지 마세요! 퍼블리시 후에는 정상적으로 표시됩니다.</p>
        <p className="mt-1">아래 '완료' 버튼을 눌러 다음 단계로 진행할 수 있습니다.</p>
      </div>
    )

    return (
      <div className="px-6 py-8 pb-24">
        <h2 className="text-2xl font-bold text-black mb-8">위치정보 등록</h2>

        {/* 상태 정보 */}
        <div className="mb-4 p-3 bg-gray-50 rounded-md text-sm space-y-1">
          <p>🗺️ 지도 API: {locationData.mapLoaded ? "✅ 로딩 완료" : "⏳ 로딩 중..."}</p>
          <p>🐕 강아지 데이터: {isLoadingDogData ? "⏳ 로딩 중..." : `✅ ${dogLocations.length}개 로딩됨`}</p>
          {dogDataError && <p className="text-red-600">❌ 에러: {dogDataError}</p>}
          <p>
            📍 현재 위치:{" "}
            {locationData.accuracy ? `✅ 정확도 ${Math.round(locationData.accuracy)}m` : "⏳ 위치 확인 중..."}
          </p>
        </div>

        {/* 지도 영역 */}
        <div
          id="map"
          className="relative w-full h-96 mb-8 rounded-lg overflow-hidden bg-gray-100 border border-gray-300"
        >
          {!locationData.mapLoaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black mb-4"></div>
              <p className="text-gray-600">지도를 불러오는 중...</p>
            </div>
          )}
        </div>

        {/* 근처 동네 선택 */}
        <div className="space-y-4 mt-6">
          <h3 className="text-lg font-medium text-black">근처 동네 범위</h3>
          <div className="flex justify-between w-full">
            {["가까운 동네", "조금 가까운 동네", "조금 먼 동네", "먼 동네"].map((option) => (
              <button
                key={option}
                onClick={() => handleNearbyRangeChange(option)}
                className={`py-2 px-4 rounded-full border ${
                  locationData.nearbyRange === option
                    ? "bg-black text-white border-black"
                    : "bg-white text-black border-gray-300"
                } text-xs whitespace-nowrap`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* 현재 위치 새로고침 버튼 */}
        <button
          onClick={() => {
            if (typeof navigator !== "undefined" && navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(
                (position) => {
                  const { latitude, longitude, accuracy } = position.coords
                  setLocationData((prev) => ({
                    ...prev,
                    latitude,
                    longitude,
                    accuracy,
                    selectedLocation: "현재 위치",
                  }))
                },
                (error) => {
                  console.error("위치 정보를 가져오는데 실패했습니다:", error)
                },
                {
                  enableHighAccuracy: true,
                  timeout: 10000,
                  maximumAge: 0,
                },
              )
            }
          }}
          className="w-full mt-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-md flex items-center justify-center gap-2"
        >
          <MapPin className="w-5 h-5" />
          현재 위치로 재설정
        </button>

        {/* 강아지 위치 데이터 다시 로드 버튼 */}
        <button
          onClick={loadDogLocations}
          disabled={isLoadingDogData}
          className="w-full mt-4 py-3 bg-red-100 hover:bg-red-200 text-red-800 font-medium rounded-md flex items-center justify-center gap-2 disabled:opacity-50"
        >
          ❤️ {isLoadingDogData ? "로딩 중..." : "강아지 위치 데이터 다시 로드"}
        </button>
        {helpMessage}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b">
        <h1 className="text-xl font-bold text-black">Update Profile</h1>
        <button onClick={onClose} className="p-1">
          <X className="w-6 h-6 text-black" />
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="px-6 py-4 mb-4">
        <div className="flex space-x-4 overflow-x-auto">
          {tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`whitespace-nowrap px-4 py-2 text-sm font-medium rounded-full ${
                activeTab === index ? "bg-black text-white" : "bg-gray-200 text-gray-600"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="pb-24">
        {activeTab === 0 && renderPhotoTab()}
        {activeTab === 1 && renderProfileTab()}
        {activeTab === 2 && renderIdealTypeTab()}
        {activeTab === 3 && renderOwnerInfoTab()}
        {activeTab === 4 && renderLocationTab()}
      </div>

      {/* Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t shadow-lg">
        <div className="px-6 pt-4 pb-2">
          <div className="grid grid-cols-2 gap-4">
            {activeTab > 0 && (
              <Button
                onClick={handlePrevious}
                className="h-12 bg-white hover:bg-gray-100 text-black border border-gray-300 text-base font-medium rounded-md"
              >
                이전
              </Button>
            )}
            <Button
              onClick={handleNext}
              className={`h-12 bg-black hover:bg-black/90 text-white text-base font-bold rounded-md ${
                activeTab === 0 ? "col-span-2" : ""
              }`}
            >
              <span className="text-white">{activeTab === 4 ? "완료" : "다음"}</span>
            </Button>
          </div>
        </div>

        {/* 네비게이션 바 */}
        <div className="flex justify-around items-center py-2 bg-white border-t border-gray-200">
          <div className="flex flex-col items-center py-2">
            <div className="w-6 h-6 mb-1">
              <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-gray-400">
                <path
                  d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 22V12H15V22"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="text-xs text-gray-400">로그인</span>
          </div>

          <div className="flex flex-col items-center py-2">
            <div className="w-6 h-6 mb-1">
              <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-black">
                <path
                  d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle
                  cx="12"
                  cy="7"
                  r="4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="text-xs text-black font-medium">프로필</span>
          </div>

          <div className="flex flex-col items-center py-2">
            <div className="w-6 h-6 mb-1">
              <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-gray-400">
                <path
                  d="M20.84 4.61C19.32 3.04 17.13 3.04 15.61 4.61L12 8.22L8.39 4.61C6.87 3.04 4.68 3.04 3.16 4.61C1.64 6.18 1.64 8.37 3.16 9.94L12 18.78L20.84 9.94C22.36 8.37 22.36 6.18 20.84 4.61Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="text-xs text-gray-400">매칭</span>
          </div>

          <div className="flex flex-col items-center py-2">
            <div className="w-6 h-6 mb-1">
              <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-gray-400">
                <path
                  d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="text-xs text-gray-400">메시지</span>
          </div>

          <div className="flex flex-col items-center py-2">
            <div className="w-6 h-6 mb-1">
              <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-gray-400">
                <path
                  d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle
                  cx="9"
                  cy="7"
                  r="4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M23 21V19C23 18.1645 22.7155 17.3541 22.2094 16.7006C21.7033 16.047 20.9999 15.5866 20.2 15.3954"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M16 3.13C16.8003 3.32127 17.5037 3.78167 18.0098 4.43524C18.5159 5.08882 18.8003 5.89925 18.8003 6.735C18.8003 7.57075 18.5159 8.38118 18.0098 9.03476C17.5037 9.68833 16.8003 10.1487 16 10.34"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="text-xs text-gray-400">게시판</span>
          </div>
        </div>
      </div>
    </div>
  )
}
