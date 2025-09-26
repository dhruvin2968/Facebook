import React, { useState, useEffect } from 'react';
import { 
  MapPin,
  Briefcase,
  Heart,
  Calendar,
  Globe,
  Edit3
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
export const ProfileSidebar = () => {
  const navigate = useNavigate(); 
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get userId from localStorage
  const userId = localStorage.getItem('userId');

  // Load user profile data
  useEffect(() => {
    const loadUserProfile = async () => {
      if (!userId) {
        setError("User not logged in");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`https://facebook-backend-f4m6.onrender.com/api/users/profile/${userId}`);
        const data = await response.json();
        
        if (response.ok) {
          setUserData(data.user);
        } else {
          setError(data.error || "Failed to load profile");
        }
      } catch (error) {
        console.error("Error loading profile:", error);
        setError("Network error");
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, [userId]);

  // Format join date from user creation timestamp
  const formatJoinDate = (createdAt) => {
    if (!createdAt) return "Recently";
    const date = new Date(createdAt);
    const year = date.getFullYear();
    const month = date.toLocaleDateString('en-US', { month: 'long' });
    return `${month} ${year}`;
  };

  // Format birthday
  const formatBirthday = (birthday) => {
    if (!birthday) return null;
    const date = new Date(birthday);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric',
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Build about items from user data
  const buildAboutItems = () => {
    if (!userData) return [];

    const items = [];

    // Bio as work description (if available)
    if (userData.bio) {
      items.push({ 
        icon: <Briefcase className="w-5 h-5" />, 
        text: userData.bio.length > 50 ? `${userData.bio.substring(0, 50)}...` : userData.bio
      });
    }

    // Location
    if (userData.location) {
      items.push({ 
        icon: <MapPin className="w-5 h-5" />, 
        text: `Lives in ${userData.location}` 
      });
    }

    // Website
    if (userData.website) {
      items.push({ 
        icon: <Globe className="w-5 h-5" />, 
        text: userData.website.replace(/^https?:\/\//, ''), // Remove protocol for display
        isLink: true,
        fullUrl: userData.website.startsWith('http') ? userData.website : `https://${userData.website}`
      });
    }

    // Birthday
    if (userData.birthday) {
      const formattedBirthday = formatBirthday(userData.birthday);
      if (formattedBirthday) {
        items.push({ 
          icon: <Calendar className="w-5 h-5" />, 
          text: `Born ${formattedBirthday}` 
        });
      }
    }

    // Gender
    if (userData.gender && userData.gender !== 'Prefer-not-to-say') {
      items.push({ 
        icon: <Heart className="w-5 h-5" />, 
        text: userData.gender 
      });
    }

    // Join date (always show)
    items.push({ 
      icon: <Calendar className="w-5 h-5" />, 
      text: `Joined Facebook in ${formatJoinDate(userData.createdAt)}` 
    });

    return items;
  };

  const aboutItems = buildAboutItems();

  // Sample photos (placeholder - you can connect to real photo data later)
  const photos = Array(9).fill(null).map((_, i) => ({
    id: i,
    gradient: `from-${['blue', 'purple', 'pink', 'green', 'yellow', 'indigo', 'red', 'teal', 'orange'][i]}-400 to-${['purple', 'pink', 'blue', 'blue', 'red', 'purple', 'pink', 'blue', 'red'][i]}-600`
  }));

  // Sample friends (placeholder - you can connect to real friends data later)
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

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center space-x-3">
                  <div className="h-5 w-5 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded flex-1"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="text-center text-red-600">
            <p>Failed to load profile information</p>
            <button 
              onClick={() => window.location.reload()} 
              className="text-blue-600 hover:text-blue-700 text-sm mt-2"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Intro Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Intro</h3>
        
        {/* Bio Section */}
        {userData.bio && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-gray-700 text-sm leading-relaxed">{userData.bio}</p>
          </div>
        )}

        <div className="space-y-4">
          {aboutItems.length > 0 ? (
            aboutItems.map((item, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="text-gray-600 mt-0.5 flex-shrink-0">{item.icon}</div>
                <div className="flex-1 min-w-0">
                  {item.isLink ? (
                    <a 
                      href={item.fullUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 font-medium text-sm break-all"
                    >
                      {item.text}
                    </a>
                  ) : (
                    <div className="text-gray-900 font-medium text-sm">{item.text}</div>
                  )}
                  {item.subtext && <div className="text-gray-500 text-xs">{item.subtext}</div>}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-500 text-sm mb-3">No details to show</p>
              <button 
                onClick={() => window.location.href = '/edit-profile'}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Add details
              </button>
            </div>
          )}
        </div>

        <button  
           onClick={() => navigate("/edit_profile")}
          className="w-full mt-4 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
        >
          <Edit3 className="w-4 h-4" />
          <span>Edit details</span>
        </button>

        {!userData.bio && (
          <button className="w-full mt-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg font-medium transition-colors">
            Add hobbies
          </button>
        )}
      </div>

      {/* Photos Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">Photos</h3>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            See all photos
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {photos.map((photo) => (
            <div 
              key={photo.id} 
              className={`aspect-square bg-gradient-to-br ${photo.gradient} rounded-lg cursor-pointer hover:opacity-90 transition-opacity flex items-center justify-center`}
            >
              <span className="text-white text-xs font-medium opacity-75">Photo {photo.id + 1}</span>
            </div>
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
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            See all friends
          </button>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {friends.map((friend, index) => (
            <div key={index} className="text-center cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
              <div className={`w-20 h-20 ${friend.avatar} rounded-lg mx-auto mb-2 flex items-center justify-center`}>
                <span className="text-white font-semibold text-lg">
                  {friend.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div className="text-xs font-medium text-gray-900 truncate">{friend.name}</div>
              <div className="text-xs text-gray-500">{friend.mutualFriends} mutual</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
