import { 
  Camera,
  Video,
  Smile} from 'lucide-react';
export const PostComposer = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
      <div className="flex space-x-3 mb-4">
        <div className="w-10 h-10 bg-blue-600 rounded-full"></div>
        <div className="flex-1">
          <div className="bg-gray-100 rounded-full px-4 py-3 cursor-pointer hover:bg-gray-200 transition-colors">
            <span className="text-gray-500">What's on your mind, John?</span>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-gray-200">
        <div className="flex space-x-6">
          <div className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 cursor-pointer">
            <Video className="w-6 h-6 text-red-500" />
            <span className="text-gray-700 font-medium">Live Video</span>
          </div>
          <div className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 cursor-pointer">
            <Camera className="w-6 h-6 text-green-500" />
            <span className="text-gray-700 font-medium">Photo/Video</span>
          </div>
          <div className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 cursor-pointer">
            <Smile className="w-6 h-6 text-yellow-500" />
            <span className="text-gray-700 font-medium">Feeling/Activity</span>
          </div>
        </div>
      </div>
    </div>
  );
};
