import { 
  Camera} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
export const PostComposer = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
      <div className="flex space-x-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full"></div>
        <div className="flex-1">
          <div className="bg-gray-100 rounded-full px-4 py-3 cursor-pointer hover:bg-gray-200 transition-colors">
            <span className="text-gray-500">What's on your mind, John?</span>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-gray-200">
        <div className="flex space-x-6">
          <div className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 cursor-pointer">
            <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
            <span className="text-gray-700 font-medium">Live video</span>
          </div>
          <button  onClick={() => navigate("/new_post")} className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 cursor-pointer">
            <Camera className="w-6 h-6 text-green-500" />
            <span className="text-gray-700 font-medium">Photo/video</span>
          </button>
          <div className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 cursor-pointer">
            <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
              <span className="text-sm">😊</span>
            </div>
            <span className="text-gray-700 font-medium">Feeling/activity</span>
          </div>
        </div>
      </div>
    </div>
  );
};
