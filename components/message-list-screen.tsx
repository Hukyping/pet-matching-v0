import { Search, MoreHorizontal } from "lucide-react"

const MessageListScreen = () => {
  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-center p-4 relative">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">메시지</h1>
            <p className="text-sm text-gray-500">강아지 친구들과 대화해보세요</p>
          </div>
          <div className="absolute right-4 flex items-center space-x-2">
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200">
              <Search size={20} className="text-gray-600" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200">
              <MoreHorizontal size={20} className="text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Message List (Placeholder) */}
      <div className="flex-grow overflow-y-auto p-4">
        <p className="text-gray-600 text-center">메시지 목록이 여기에 표시됩니다.</p>
      </div>
    </div>
  )
}

export default MessageListScreen
