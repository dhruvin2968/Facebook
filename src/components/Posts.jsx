import { 
  MoreHorizontal,
  ThumbsUp,
  MessageSquare,
  Share
} from 'lucide-react';
export const Post = ({ author, timestamp, content, image, likes, comments, shares }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm mb-4">
      {/* Post Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full"></div>
          <div>
            <h3 className="font-semibold text-gray-900">{author}</h3>
            <p className="text-xs text-gray-500">{timestamp}</p>
          </div>
        </div>
        <MoreHorizontal className="w-5 h-5 text-gray-500 cursor-pointer" />
      </div>

      {/* Post Content */}
      <div className="px-4 pb-3">
        <p className="text-gray-800">{content}</p>
      </div>

      {/* Post Image */}
      {image && (
        <div className="bg-gray-200 h-80 flex items-center justify-center">
          <span className="text-gray-500">Post Image</span>
        </div>
      )}

      {/* Engagement Stats */}
      <div className="px-4 py-2 flex items-center justify-between text-sm text-gray-500 border-b border-gray-100">
        <div className="flex items-center space-x-1">
          <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
            <ThumbsUp className="w-3 h-3 text-white" />
          </div>
          <span>{likes}</span>
        </div>
        <div className="flex space-x-4">
          <span>{comments} Comments</span>
          <span>{shares} Shares</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-2 flex items-center justify-between">
        <div className="flex items-center space-x-2 flex-1 justify-center py-2 rounded-lg hover:bg-gray-100 cursor-pointer">
          <ThumbsUp className="w-5 h-5 text-gray-600" />
          <span className="text-gray-700 font-medium">Like</span>
        </div>
        <div className="flex items-center space-x-2 flex-1 justify-center py-2 rounded-lg hover:bg-gray-100 cursor-pointer">
          <MessageSquare className="w-5 h-5 text-gray-600" />
          <span className="text-gray-700 font-medium">Comment</span>
        </div>
        <div className="flex items-center space-x-2 flex-1 justify-center py-2 rounded-lg hover:bg-gray-100 cursor-pointer">
          <Share className="w-5 h-5 text-gray-600" />
          <span className="text-gray-700 font-medium">Share</span>
        </div>
      </div>
    </div>
  );
};