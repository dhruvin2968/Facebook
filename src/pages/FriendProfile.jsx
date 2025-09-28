import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import { 
  Heart, 
  MessageCircle, 
  Share, 
  UserPlus, 
  UserMinus, 
  MessageSquare, 
  MoreHorizontal,
  MapPin,
  Calendar,
  Globe,
  Camera,
  ArrowLeft
} from 'lucide-react';

export const FriendProfile = () => {
  const { id: userId } = useParams();
  const navigate = useNavigate();
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFriend, setIsFriend] = useState(false);
  const [friendRequestSent, setFriendRequestSent] = useState(false);
  const [activeTab, setActiveTab] = useState('Posts');
  const [friendsLoading, setFriendsLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Friend data state
  const [friendData, setFriendData] = useState({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    bio: "",
    location: "",
    website: "",
    birthday: "",
    gender: "",
    profilePicUrl: "",
    coverPhotoUrl: "",
    joinedDate: "",
    friendsCount: 0
  });

  // Friends list from API
  const [friendsList, setFriendsList] = useState([]);

  const tabs = ['Posts', 'About', 'Friends', 'Photos', 'Videos'];

  // Check authentication and load user data
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    console.log('Current User ID:', storedUserId);
    console.log('Profile User ID:', userId);
    
    if (storedUserId) {
      setCurrentUserId(storedUserId);
      
      if (storedUserId === userId) {
        navigate('/profile');
        return;
      }
      
      loadFriendProfile(userId);
      checkFriendshipStatus(storedUserId, userId);
      loadFriendsList(userId);
    } else {
      setError("Please log in to view profiles");
      setIsLoading(false);
    }
  }, [userId, navigate]);

  // Load friend's profile data
  const loadFriendProfile = async (userId) => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Fetching profile for:', userId);
      const response = await fetch(`https://facebook-backend-f4m6.onrender.com/api/users/profile/${userId}`);
      const data = await response.json();
      
      console.log('Profile API Response:', data);
      
      if (response.ok) {
        const userData = data.user;
        setFriendData({
          id: userId,
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
          email: userData.email || "",
          bio: userData.bio || "",
          location: userData.location || "",
          website: userData.website || "",
          birthday: userData.birthday ? new Date(userData.birthday).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }) : "",
          gender: userData.gender || "",
          profilePicUrl: userData.profilePicUrl || "",
          coverPhotoUrl: userData.coverPhotoUrl || "",
          joinedDate: userData.createdAt ? new Date(userData.createdAt).getFullYear() : "2023",
          friendsCount: userData.friends ? userData.friends.length : 0
        });
        
      } else {
        setError(data.error || "User not found");
      }
    } catch (error) {
      console.error("Error loading friend profile:", error);
      setError("Failed to load profile data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Check friendship status
  const checkFriendshipStatus = async (currentUserId, targetUserId) => {
    try {
      console.log('Checking friendship status...');
      const response = await fetch(
        `https://facebook-backend-f4m6.onrender.com/api/users/friendship-status/${currentUserId}/${targetUserId}`
      );
      const data = await response.json();
      
      console.log('Friendship status:', data);
      
      if (response.ok) {
        setIsFriend(data.status.isFriend);
        setFriendRequestSent(data.status.friendRequestSent);
      }
    } catch (error) {
      console.error("Error checking friendship status:", error);
    }
  };

  // Load friends list
  const loadFriendsList = async (userId) => {
    try {
      setFriendsLoading(true);
      const response = await fetch(
        `https://facebook-backend-f4m6.onrender.com/api/users/${userId}/friends?limit=6`
      );
      const data = await response.json();
      
      console.log('Friends list:', data);
      
      if (response.ok) {
        setFriendsList(data.friends || []);
      }
    } catch (error) {
      console.error("Error loading friends list:", error);
    } finally {
      setFriendsLoading(false);
    }
  };

  // Send friend request
  const sendFriendRequest = async () => {
    if (actionLoading) return;
    
    try {
      setActionLoading(true);
      console.log('Sending friend request...');
      
      const response = await fetch('https://facebook-backend-f4m6.onrender.com/api/users/friend-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fromUserId: currentUserId,
          toUserId: userId
        })
      });

      const data = await response.json();
      console.log('Friend request response:', data);
      
      if (response.ok) {
        setFriendRequestSent(true);
        toast.success(`Friend request sent to ${friendData.firstName}! 🎉`, {
          duration: 4000,
          position: 'bottom-center',
          icon: '👥',
        });
      } else {
        toast.error(data.error || "Failed to send friend request", {
          duration: 4000,
          position: 'bottom-center',
        });
      }
    } catch (error) {
      console.error("Error sending friend request:", error);
      toast.error("Network error. Please try again.", {
        duration: 4000,
        position: 'bottom-center',
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Remove friend
  const removeFriend = async () => {
    if (actionLoading) return;
    
    // Custom confirmation toast
    toast((t) => (
      <div className="flex flex-col space-y-3">
        <p className="font-medium">Remove {friendData.firstName} {friendData.lastName} from your friends?</p>
        <div className="flex space-x-2">
          <button
            className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
            onClick={async () => {
              toast.dismiss(t.id);
              await performRemoveFriend();
            }}
          >
            Remove
          </button>
          <button
            className="bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-400"
            onClick={() => toast.dismiss(t.id)}
          >
            Cancel
          </button>
        </div>
      </div>
    ), {
      duration: 10000,
      position: 'top-center',
    });
  };

  const performRemoveFriend = async () => {
    try {
      setActionLoading(true);
      console.log('Removing friend...');
      
      const response = await fetch('https://facebook-backend-f4m6.onrender.com/api/users/remove-friend', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUserId,
          friendId: userId
        })
      });

      const data = await response.json();
      console.log('Remove friend response:', data);
      
      if (response.ok) {
        setIsFriend(false);
        setFriendRequestSent(false);
        toast.success(`${friendData.firstName} removed from your friends`, {
          duration: 4000,
          position: 'bottom-center',
          icon: '💔',
        });
        
        // Update friends count
        setFriendData(prev => ({
          ...prev,
          friendsCount: Math.max(0, prev.friendsCount - 1)
        }));
      } else {
        toast.error(data.error || "Failed to remove friend", {
          duration: 4000,
          position: 'bottom-center',
        });
      }
    } catch (error) {
      console.error("Error removing friend:", error);
      toast.error("Network error. Please try again.", {
        duration: 4000,
        position: 'bottom-center',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const sendMessage = () => {
    // TODO: Navigate to chat or open chat modal
    console.log("Send message to", friendData.firstName);
    toast.success(`Chat feature coming soon! You'll be able to message ${friendData.firstName}. 💬`, {
      duration: 4000,
      position: 'bottom-center',
      icon: '🚧',
    });
  };

  const getInitials = () => {
    const first = friendData.firstName?.charAt(0)?.toUpperCase() || "";
    const last = friendData.lastName?.charAt(0)?.toUpperCase() || "";
    return first + last || "U";
  };

  const getUserName = () => {
    return `${friendData.firstName} ${friendData.lastName}`.trim() || "User";
  };

  // Sample posts for the friend
  const posts = [
    {
      id: 1,
      author: getUserName(),
      timestamp: '4 hours ago',
      content: 'Just got back from an amazing vacation! The beaches were incredible and the food was out of this world. Already planning my next trip! 🏝️ #Travel #Vacation',
      image: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=500&h=300&fit=crop',
      likes: 89,
      comments: 23,
      shares: 12,
      isLiked: false
    },
    {
      id: 2,
      author: getUserName(),
      timestamp: '2 days ago',
      content: 'Finished my morning run along the coast! There\'s something magical about watching the sunrise while getting your workout in. What\'s your favorite time to exercise?',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=300&fit=crop',
      likes: 134,
      comments: 41,
      shares: 8,
      isLiked: true
    },
    {
      id: 3,
      author: getUserName(),
      timestamp: '1 week ago',
      content: 'Grateful for amazing friends and family who make life so much brighter! Had the best time at dinner last night catching up with everyone. ❤️',
      image: null,
      likes: 67,
      comments: 18,
      shares: 3,
      isLiked: false
    }
  ];

  // Sample photos
  const photos = [
    'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=200&h=200&fit=crop',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=200&h=200&fit=crop',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=200&h=200&fit=crop',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=200&h=200&fit=crop',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=200&h=200&fit=crop',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200&h=200&fit=crop'
  ];

  const handleLikePost = (postId) => {
    // TODO: Implement like functionality
    console.log("Liked post:", postId);
    toast.success("Post liked! ❤️", {
      duration: 2000,
      position: 'bottom-center',
    });
  };

  // Post component
  const Post = ({ id, author, timestamp, content, image, likes, comments, shares, isLiked }) => (
    <div className="bg-white rounded-lg shadow-sm mb-4 overflow-hidden">
      <div className="p-4">
        <div className="flex items-start space-x-3 mb-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
            {friendData.profilePicUrl ? (
              <img 
                src={friendData.profilePicUrl} 
                alt={`${author} profile`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <span className="text-white font-semibold text-sm">{getInitials()}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-gray-900 truncate">{author}</h3>
                <span className="text-gray-500 text-sm">•</span>
                <span className="text-gray-500 text-sm">{timestamp}</span>
              </div>
              <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                <MoreHorizontal className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>
        </div>
        
        <p className="text-gray-800 mb-3 leading-relaxed">{content}</p>
        
        {image && (
          <div className="mb-3">
            <img 
              src={image} 
              alt="Shared content"
              className="w-full rounded-lg object-cover max-h-96"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        )}
        
        <div className="flex items-center justify-between text-gray-500 text-sm mb-3 pb-3 border-b border-gray-100">
          <div className="flex items-center space-x-1">
            <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
              <Heart className="w-2.5 h-2.5 text-white fill-current" />
            </div>
            <span>{likes}</span>
          </div>
          <div className="flex space-x-4">
            <span>{comments} comments</span>
            <span>{shares} shares</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-1">
          <button 
            onClick={() => handleLikePost(id)}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-lg transition-colors ${
              isLiked 
                ? 'text-blue-600 bg-blue-50 hover:bg-blue-100' 
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            <span className="font-medium">{isLiked ? 'Liked' : 'Like'}</span>
          </button>
          <button className="flex-1 flex items-center justify-center space-x-2 py-2 px-4 hover:bg-gray-50 rounded-lg transition-colors">
            <MessageCircle className="w-5 h-5 text-gray-600" />
            <span className="text-gray-700 font-medium">Comment</span>
          </button>
          <button className="flex-1 flex items-center justify-center space-x-2 py-2 px-4 hover:bg-gray-50 rounded-lg transition-colors">
            <Share className="w-5 h-5 text-gray-600" />
            <span className="text-gray-700 font-medium">Share</span>
          </button>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-500 text-2xl">!</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => navigate(-1)}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Rest of your existing JSX code remains exactly the same */}
      {/* Profile Header */}
      <div className="bg-white shadow-sm">
        {/* Cover Photo Section */}
        <div className="relative">
          <div
            className="h-80 lg:h-96 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 relative overflow-hidden"
            style={{
              backgroundImage: friendData.coverPhotoUrl ? `url(${friendData.coverPhotoUrl})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-20"></div>
            
            {/* Back Button */}
            <button 
              onClick={() => navigate(-1)}
              className="absolute top-4 left-4 bg-white bg-opacity-90 hover:bg-opacity-100 p-2 rounded-full transition-all"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
          </div>

          {/* Profile Picture & Info */}
          <div className="relative px-4 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-end lg:space-x-6 -mt-20 lg:-mt-8">
              {/* Profile Picture */}
              <div className="relative mb-4 lg:mb-0">
                <div 
                  className="w-40 h-40 lg:w-44 lg:h-44 rounded-full border-4 border-white shadow-lg mx-auto lg:mx-0 overflow-hidden"
                  style={{
                    backgroundImage: friendData.profilePicUrl ? `url(${friendData.profilePicUrl})` : undefined,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  {!friendData.profilePicUrl && (
                    <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
                      <div className="text-white text-4xl font-bold">{getInitials()}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Name & Actions */}
              <div className="flex-1 text-center lg:text-left lg:pb-6">
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2 pt-2">
                  {getUserName()}
                </h1>
                <p className="text-gray-600 mb-4">
                  {friendData.friendsCount} friends • {Math.floor(Math.random() * 20)} mutual friends
                </p>

                <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                  {isFriend ? (
                    <>
                      <button 
                        onClick={removeFriend}
                        disabled={actionLoading}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-semibold flex items-center space-x-2 transition-colors disabled:opacity-50"
                      >
                        <UserMinus className="w-4 h-4" />
                        <span>{actionLoading ? 'Removing...' : 'Friends'}</span>
                      </button>
                      <button 
                        onClick={sendMessage}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold flex items-center space-x-2 transition-colors"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>Message</span>
                      </button>
                    </>
                  ) : friendRequestSent ? (
                    <button 
                      disabled
                      className="bg-gray-100 text-gray-500 px-6 py-2 rounded-lg font-semibold flex items-center space-x-2 cursor-not-allowed"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>Request Sent</span>
                    </button>
                  ) : (
                    <button 
                      onClick={sendFriendRequest}
                      disabled={actionLoading}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold flex items-center space-x-2 transition-colors disabled:opacity-50"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>{actionLoading ? 'Sending...' : 'Add Friend'}</span>
                    </button>
                  )}
                  
                  <button 
                    onClick={sendMessage}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-semibold flex items-center space-x-2 transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Message</span>
                  </button>
                  
                  <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-lg transition-colors">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="border-t border-gray-200 mt-6">
              <nav className="flex space-x-8 overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                      activeTab === tab
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section - Rest of your existing JSX remains the same */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar - About Info */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Intro</h3>
              
              {friendData.bio && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-700 text-sm leading-relaxed">{friendData.bio}</p>
                </div>
              )}

              <div className="space-y-3">
                {friendData.location && (
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-gray-600 flex-shrink-0" />
                    <span className="text-gray-900">Lives in {friendData.location}</span>
                  </div>
                )}
                
                {friendData.website && (
                  <div className="flex items-center space-x-3">
                    <Globe className="w-5 h-5 text-gray-600 flex-shrink-0" />
                    <a 
                      href={friendData.website.startsWith('http') ? friendData.website : `https://${friendData.website}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 break-all"
                    >
                      {friendData.website}
                    </a>
                  </div>
                )}
                
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-600 flex-shrink-0" />
                  <span className="text-gray-900">Joined Facebook in {friendData.joinedDate}</span>
                </div>
              </div>
            </div>

            {/* Photos Section */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Photos</h3>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors">
                  See all photos
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {photos.slice(0, 9).map((photo, index) => (
                  <div key={index} className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                    <img 
                      src={photo} 
                      alt={`${friendData.firstName}'s memory ${index + 1}`}
                      className="w-full h-full object-cover hover:opacity-90 cursor-pointer transition-opacity"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Friends Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Friends</h3>
                  <p className="text-gray-500 text-sm">{friendData.friendsCount} friends</p>
                </div>
                <button 
                  onClick={() => setActiveTab('Friends')}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                >
                  See all friends
                </button>
              </div>
              
              {friendsLoading ? (
                <div className="grid grid-cols-3 gap-3">
                  {[1,2,3,4,5,6].map(i => (
                    <div key={i} className="text-center p-2">
                      <div className="w-20 h-20 bg-gray-200 rounded-lg mx-auto mb-2 animate-pulse"></div>
                      <div className="h-3 bg-gray-200 rounded mx-auto mb-1 animate-pulse"></div>
                      <div className="h-2 bg-gray-200 rounded mx-auto animate-pulse"></div>
                    </div>
                  ))}
                </div>
              ) : friendsList.length > 0 ? (
                <div className="grid grid-cols-3 gap-3">
                  {friendsList.slice(0, 6).map((friend) => (
                    <div 
                      key={friend._id} 
                      className="text-center cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                      onClick={() => navigate(`/user/${friend._id}`)}
                    >
                      <div className="w-20 h-20 rounded-lg mx-auto mb-2 overflow-hidden">
                        {friend.profilePicUrl ? (
                          <img 
                            src={friend.profilePicUrl} 
                            alt={`${friend.firstName} ${friend.lastName}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div className="w-full h-full bg-blue-500 flex items-center justify-center">
                          <span className="text-white font-semibold text-lg">
                            {`${friend.firstName?.charAt(0) || ''}${friend.lastName?.charAt(0) || ''}`}
                          </span>
                        </div>
                      </div>
                      <div className="text-xs font-medium text-gray-900 truncate">
                        {`${friend.firstName} ${friend.lastName}`.trim()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500 text-sm">No friends to show</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Content Area */}
          <div className="lg:w-2/3">
            {activeTab === 'Posts' && (
              <div>
                {posts.length === 0 ? (
                  <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                    <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts yet</h3>
                    <p className="text-gray-600">
                      {getUserName()} hasn't shared anything yet.
                    </p>
                  </div>
                ) : (
                  posts.map((post) => (
                    <Post key={post.id} {...post} />
                  ))
                )}
              </div>
            )}

            {/* Rest of your existing tab content... */}
            {activeTab === 'About' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">About {friendData.firstName}</h2>
                <div className="space-y-6">
                  {friendData.bio && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Bio</h3>
                      <p className="text-gray-700 leading-relaxed">{friendData.bio}</p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {friendData.location && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Lives in</h3>
                        <p className="text-gray-700">{friendData.location}</p>
                      </div>
                    )}
                    
                    {friendData.birthday && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Birthday</h3>
                        <p className="text-gray-700">{friendData.birthday}</p>
                      </div>
                    )}
                    
                    {friendData.gender && friendData.gender !== 'Prefer-not-to-say' && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Gender</h3>
                        <p className="text-gray-700">{friendData.gender}</p>
                      </div>
                    )}
                    
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Joined</h3>
                      <p className="text-gray-700">{friendData.joinedDate}</p>
                    </div>
                  </div>
                  
                  {friendData.website && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Website</h3>
                      <a 
                        href={friendData.website.startsWith('http') ? friendData.website : `https://${friendData.website}`}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 break-all transition-colors"
                      >
                        {friendData.website}
                      </a>
                    </div>
                  )}
                  
                  {!friendData.bio && !friendData.location && !friendData.website && !friendData.birthday && (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No additional information available.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'Friends' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  {friendData.firstName}'s Friends ({friendData.friendsCount})
                </h2>
                
                {friendsLoading ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[1,2,3,4,5,6,7,8,9].map(i => (
                      <div key={i} className="flex items-center space-x-3 p-3">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg animate-pulse"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
                          <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : friendsList.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {friendsList.map((friend) => (
                      <div 
                        key={friend._id}
                        className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                        onClick={() => navigate(`/user/${friend._id}`)}
                      >
                        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                          {friend.profilePicUrl ? (
                            <img 
                              src={friend.profilePicUrl} 
                              alt={`${friend.firstName} ${friend.lastName}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <div className="w-full h-full bg-blue-500 flex items-center justify-center">
                            <span className="text-white font-semibold">
                              {`${friend.firstName?.charAt(0) || ''}${friend.lastName?.charAt(0) || ''}`}
                            </span>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-gray-900 truncate">
                            {`${friend.firstName} ${friend.lastName}`.trim()}
                          </div>
                          <div className="text-sm text-gray-500">
                            {Math.floor(Math.random() * 50)} mutual friends
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No friends to show</p>
                  </div>
                )}
              </div>
            )}

            {(activeTab === 'Photos' || activeTab === 'Videos') && (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🚧</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Coming Soon</h3>
                <p className="text-gray-600">This section is under development.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
