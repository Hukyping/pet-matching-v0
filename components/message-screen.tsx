"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { ArrowLeft, Send, Smile, Paperclip } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"

interface MessageScreenProps {
  onBack: () => void
  myDogData?: any
  matchedDogData?: any
}

interface Message {
  id: number
  text: string
  sender: "me" | "other"
  timestamp: Date
  type: "text" | "image"
}

export default function MessageScreen({ onBack, myDogData, matchedDogData }: MessageScreenProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "안녕하세요! 매칭되어서 반가워요 😊",
      sender: "other",
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30분 전
      type: "text",
    },
    {
      id: 2,
      text: "안녕하세요! 저희 강아지들이 잘 맞을 것 같아요!",
      sender: "me",
      timestamp: new Date(Date.now() - 1000 * 60 * 25), // 25분 전
      type: "text",
    },
    {
      id: 3,
      text: "네! 언제 한번 산책 같이 해요~",
      sender: "other",
      timestamp: new Date(Date.now() - 1000 * 60 * 20), // 20분 전
      type: "text",
    },
  ])
  const [newMessage, setNewMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

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

  const matchedDogImage =
    matchedDog.images && matchedDog.images.length > 0
      ? matchedDog.images[matchedDog.representativeImageIndex || 0]
      : "/placeholder.svg"

  // 메시지가 추가될 때마다 스크롤을 맨 아래로
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return

    const message: Message = {
      id: messages.length + 1,
      text: newMessage,
      sender: "me",
      timestamp: new Date(),
      type: "text",
    }

    setMessages([...messages, message])
    setNewMessage("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
  }

  const formatDate = (date: Date) => {
    const today = new Date()
    const messageDate = new Date(date)

    if (messageDate.toDateString() === today.toDateString()) {
      return "오늘"
    }

    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (messageDate.toDateString() === yesterday.toDateString()) {
      return "어제"
    }

    return messageDate.toLocaleDateString("ko-KR", {
      month: "long",
      day: "numeric",
    })
  }

  const shouldShowDateSeparator = (currentMessage: Message, previousMessage?: Message) => {
    if (!previousMessage) return true

    const currentDate = new Date(currentMessage.timestamp).toDateString()
    const previousDate = new Date(previousMessage.timestamp).toDateString()

    return currentDate !== previousDate
  }

  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
        <button onClick={onBack} className="p-1">
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>

        {/* 상대방 프로필 */}
        <div className="flex items-center gap-3 flex-1">
          <div className="relative">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200">
              <Image
                src={matchedDogImage || "/placeholder.svg"}
                alt={matchedDog.name}
                width={40}
                height={40}
                className="object-cover w-full h-full"
              />
            </div>
            {/* 온라인 상태 표시 */}
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
          </div>

          <div>
            <h2 className="font-semibold text-gray-900">{matchedDog.name}</h2>
            <p className="text-xs text-green-500">온라인</p>
          </div>
        </div>

        {/* 더보기 버튼 */}
        <button className="p-2">
          <div className="flex flex-col gap-1">
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
          </div>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((message, index) => {
          const previousMessage = index > 0 ? messages[index - 1] : undefined
          const showDateSeparator = shouldShowDateSeparator(message, previousMessage)

          return (
            <div key={message.id}>
              {/* 날짜 구분선 */}
              {showDateSeparator && (
                <div className="flex items-center justify-center my-4">
                  <div className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
                    {formatDate(message.timestamp)}
                  </div>
                </div>
              )}

              {/* 메시지 */}
              <div className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`flex items-end gap-2 max-w-[80%] ${message.sender === "me" ? "flex-row-reverse" : ""}`}
                >
                  {/* 프로필 이미지 (상대방 메시지일 때만) */}
                  {message.sender === "other" && (
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200 flex-shrink-0">
                      <Image
                        src={matchedDogImage || "/placeholder.svg"}
                        alt={matchedDog.name}
                        width={32}
                        height={32}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  )}

                  {/* 메시지 버블 */}
                  <div className="flex flex-col">
                    <div
                      className={`px-4 py-2 rounded-2xl ${
                        message.sender === "me"
                          ? "bg-black text-white rounded-br-md"
                          : "bg-white text-gray-900 border border-gray-200 rounded-bl-md"
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.text}</p>
                    </div>

                    {/* 시간 표시 */}
                    <div
                      className={`text-xs text-gray-500 mt-1 ${message.sender === "me" ? "text-right" : "text-left"}`}
                    >
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 px-4 py-3">
        <div className="flex items-center gap-3">
          {/* 첨부 버튼 */}
          <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
            <Paperclip className="w-5 h-5" />
          </button>

          {/* 메시지 입력 */}
          <div className="flex-1 relative">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="메시지를 입력하세요..."
              className="pr-12 py-3 rounded-full border-gray-300 focus:border-black focus:ring-black"
            />

            {/* 이모지 버튼 */}
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors">
              <Smile className="w-5 h-5" />
            </button>
          </div>

          {/* 전송 버튼 */}
          <Button
            onClick={handleSendMessage}
            disabled={newMessage.trim() === ""}
            className="w-10 h-10 rounded-full bg-black hover:bg-gray-800 disabled:bg-gray-300 p-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
