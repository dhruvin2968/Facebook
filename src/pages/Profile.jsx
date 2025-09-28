
import {ProfileHeader} from '../components/ProfileHeader';
import { ImageUpload } from './Test';
import { Post } from '../components/Posts';
import { ProfileSidebar } from '../components/ProfileSideBar';
import { 
  Camera,
  Grid3X3,
  Settings,
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';
const PostComposer = () => {
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
          <div 
  onClick={() => navigate("/new_post")} 
  className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 cursor-pointer"
>
  <Camera className="w-6 h-6 text-green-500" />
  <span className="text-gray-700 font-medium">Photo/video</span>
</div>

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


const ProfilePage = () => {
  const posts = [
    {
      author: 'John Doe',
      timestamp: '2 hours ago',
      content: '🎉 Excited to share that I just completed my certification in React Development! The journey was challenging but incredibly rewarding. Thanks to everyone who supported me along the way! #ReactJS #WebDevelopment #Achievement',
      image: true,
      likes: 127,
      comments: 24,
      shares: 8,
      isProfileOwner: true
    },
    {
      author: 'John Doe',
      timestamp: '1 day ago',
      content: 'Beautiful sunset from my weekend hiking trip in Yosemite! 🌅 Nature always has a way of putting things into perspective. Sometimes you need to disconnect to truly reconnect with what matters most.',
      image: true,
      likes: 89,
      comments: 15,
      shares: 12,
      isProfileOwner: true
    },
    {
      author: 'John Doe',
      timestamp: '3 days ago',
      content: 'Grateful for an amazing team lunch today! Working with such talented and inspiring people makes every day better. Here\'s to more collaboration and shared success! 🚀 #TeamWork #Gratitude',
      image: false,
      likes: 156,
      comments: 31,
      shares: 5,
      isProfileOwner: true
    },
    {
      author: 'John Doe',
      timestamp: '5 days ago',
      content: 'Just finished reading "Clean Code" by Robert C. Martin - highly recommend it to any developer looking to improve their craft! 📚 The principles in this book have already changed how I approach problem-solving.',
      image: false,
      likes: 73,
      comments: 18,
      shares: 22,
      isProfileOwner: true
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <ProfileHeader />
      
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-1">
            <ProfileSidebar />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <PostComposer />
            
            {/* Filter Options */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Posts</h3>
                <div className="flex items-center space-x-3">
                  <button className="flex items-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                    <Settings className="w-4 h-4" />
                    <span className="text-sm font-medium">Filters</span>
                  </button>
                  <button className="flex items-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                    <Grid3X3 className="w-4 h-4" />
                    <span className="text-sm font-medium">Manage posts</span>
                  </button>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 mt-4">
                <button className="px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                  All posts
                </button>
                <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-full text-sm font-medium transition-colors">
                  Your posts
                </button>
                <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-full text-sm font-medium transition-colors">
                  Others' posts
                </button>
              </div>
            </div>

            {/* Posts */}
            <div>
              {posts.map((post, index) => (
                <Post key={index} {...post} />
              ))}
            </div>

            {/* Load More */}
            <div className="text-center py-8">
              <button className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors">
                See more posts
              </button>
            </div>
          </div>
        </div>
      </div>
      <ImageUpload />
    </div>
  );
};

export default ProfilePage;