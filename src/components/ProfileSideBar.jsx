import { 
  MapPin,
  Briefcase,
  GraduationCap,
  Heart,
  Home,
  Calendar
} from 'lucide-react';
export const ProfileSidebar = () => {
  const aboutItems = [
    { icon: <Briefcase className="w-5 h-5" />, text: "Software Engineer at Tech Corp", subtext: "2020 - Present" },
    { icon: <GraduationCap className="w-5 h-5" />, text: "Studied Computer Science at MIT", subtext: "2016 - 2020" },
    { icon: <MapPin className="w-5 h-5" />, text: "Lives in San Francisco, CA" },
    { icon: <Home className="w-5 h-5" />, text: "From New York, NY" },
    { icon: <Heart className="w-5 h-5" />, text: "In a relationship" },
    { icon: <Calendar className="w-5 h-5" />, text: "Joined Facebook in 2018" }
  ];

  const photos = Array(9).fill(null).map((_, i) => ({
    id: i,
    gradient: `from-${['blue', 'purple', 'pink', 'green', 'yellow', 'indigo', 'red', 'teal', 'orange'][i]}-400 to-${['purple', 'pink', 'blue', 'blue', 'red', 'purple', 'pink', 'blue', 'red'][i]}-600`
  }));

  const friends = [
    { name: 'Sarah Chen', mutualFriends: 12, avatar: 'bg-pink-400' },
    { name: 'Mike Johnson', mutualFriends: 8, avatar: 'bg-blue-400' },
    { name: 'Emma Wilson', mutualFriends: 15, avatar: 'bg-green-400' },
    { name: 'David Park', mutualFriends: 5, avatar: 'bg-purple-400' },
    { name: 'Lisa Garcia', mutualFriends: 20, avatar: 'bg-yellow-400' },
    { name: 'Tom Wilson', mutualFriends: 3, avatar: 'bg-red-400' },
    { name: 'Anna Kim', mutualFriends: 9, avatar: 'bg-indigo-400' },
    { name: 'Chris Lee', mutualFriends: 7, avatar: 'bg-teal-400' },
    { name: 'Jenny Park', mutualFriends: 11, avatar: 'bg-orange-400' }
  ];

  return (
    <div className="space-y-4">
      {/* Intro Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Intro</h3>
        <div className="space-y-4">
          {aboutItems.map((item, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="text-gray-600 mt-0.5">{item.icon}</div>
              <div>
                <div className="text-gray-900 font-medium">{item.text}</div>
                {item.subtext && <div className="text-gray-500 text-sm">{item.subtext}</div>}
              </div>
            </div>
          ))}
        </div>
        <button className="w-full mt-4 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg font-medium transition-colors">
          Edit details
        </button>
        <button className="w-full mt-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg font-medium transition-colors">
          Add hobbies
        </button>
      </div>

      {/* Photos Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">Photos</h3>
          <div className="text-blue-600 hover:text-blue-700 text-sm font-medium">See all photos</div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {photos.map((photo) => (
            <div key={photo.id} className={`aspect-square bg-gradient-to-br ${photo.gradient} rounded-lg cursor-pointer hover:opacity-90 transition-opacity`}></div>
          ))}
        </div>
      </div>

      {/* Friends Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Friends</h3>
            <p className="text-gray-500 text-sm">2,543 friends</p>
          </div>
          <div className="text-blue-600 hover:text-blue-700 text-sm font-medium">See all friends</div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {friends.map((friend, index) => (
            <div key={index} className="text-center cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
              <div className={`w-20 h-20 ${friend.avatar} rounded-lg mx-auto mb-2`}></div>
              <div className="text-xs font-medium text-gray-900 truncate">{friend.name}</div>
              <div className="text-xs text-gray-500">{friend.mutualFriends} mutual</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
