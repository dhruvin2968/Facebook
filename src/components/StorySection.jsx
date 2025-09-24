import { Plus } from 'lucide-react';
export const StorySection = () => {
  const stories = [
    { name: 'Your Story', isOwn: true },
    { name: 'Sarah Chen' },
    { name: 'Mike Johnson' },
    { name: 'Emma Wilson' },
    { name: 'David Park' },
    { name: 'Lisa Garcia' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
      <div className="flex space-x-3 overflow-x-auto">
        {stories.map((story, index) => (
          <div key={index} className="flex-shrink-0">
            <div className="relative w-28 h-40 rounded-xl overflow-hidden cursor-pointer group">
              {story.isOwn ? (
                <div className="w-full h-full bg-gradient-to-b from-gray-200 to-gray-300 flex items-end justify-center pb-4">
                  <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <Plus className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs font-medium text-gray-800">Create Story</span>
                </div>
              ) : (
                <>
                  <div className="w-full h-full bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400"></div>
                  <div className="absolute top-3 left-3 w-8 h-8 bg-blue-600 rounded-full border-4 border-white"></div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <span className="text-white text-xs font-medium">{story.name}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};