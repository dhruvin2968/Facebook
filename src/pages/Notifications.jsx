import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { 
  Bell, 
  UserPlus, 
  X, 
  ArrowLeft,
  Users,
  MessageSquare,
  Heart,
  Share2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Notifications = () => {
  const navigate = useNavigate();
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [friendRequests, setFriendRequests] = useState([]);
  const [processingRequests, setProcessingRequests] = useState(new Set());
  const [activeTab, setActiveTab] = useState('all');

  // Check authentication and load notifications
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setCurrentUserId(storedUserId);
      loadFriendRequests(storedUserId);
    } else {
      setError("Please log in to view notifications");
      setIsLoading(false);
    }
  }, []);

  // Load friend requests for current user
  const loadFriendRequests = async (userId) => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Loading friend requests for:', userId);
      const response = await fetch(
        `https://facebook-backend-f4m6.onrender.com/api/users/${userId}/friend-requests`
      );
      const data = await response.json();
      
      console.log('Friend requests response:', data);
      
      if (response.ok) {
        setFriendRequests(data.friendRequests || []);
      } else {
        setError(data.error || "Failed to load notifications");
      }
    } catch (error) {
      console.error("Error loading friend requests:", error);
      setError("Failed to load notifications. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Accept friend request
  const acceptFriendRequest = async (requesterId, requesterName) => {
    if (processingRequests.has(requesterId)) return;

    try {
      setProcessingRequests(prev => new Set(prev).add(requesterId));
      
      console.log('Accepting friend request from:', requesterId);
      const response = await fetch(
        'https://facebook-backend-f4m6.onrender.com/api/users/accept-friend-request', 
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: currentUserId,
            requesterId: requesterId
          })
        }
      );

      const data = await response.json();
      console.log('Accept friend request response:', data);
      
      if (response.ok) {
        // Remove the accepted request from the list
        setFriendRequests(prev => 
          prev.filter(req => req.from._id !== requesterId)
        );
        
        toast.success(`You are now friends with ${requesterName}! 🎉`, {
          duration: 4000,
          position: 'bottom-center',
          icon: '👥',
        });
      } else {
        toast.error(data.error || "Failed to accept friend request", {
          duration: 4000,
          position: 'bottom-center',
        });
      }
    } catch (error) {
      console.error("Error accepting friend request:", error);
      toast.error("Network error. Please try again.", {
        duration: 4000,
        position: 'bottom-center',
      });
    } finally {
      setProcessingRequests(prev => {
        const newSet = new Set(prev);
        newSet.delete(requesterId);
        return newSet;
      });
    }
  };

  // Decline friend request
  const declineFriendRequest = async (requesterId, requesterName) => {
    if (processingRequests.has(requesterId)) return;

    try {
      setProcessingRequests(prev => new Set(prev).add(requesterId));
      
      // For now, we'll just remove it from the frontend
      // You can add a backend route to properly decline requests later
      setFriendRequests(prev => 
        prev.filter(req => req.from._id !== requesterId)
      );
      
      toast.success(`Friend request from ${requesterName} declined`, {
        duration: 3000,
        position: 'bottom-center',
        icon: '❌',
      });
    } catch (error) {
      console.error("Error declining friend request:", error);
      toast.error("Failed to decline friend request.", {
        duration: 4000,
        position: 'bottom-center',
      });
    } finally {
      setProcessingRequests(prev => {
        const newSet = new Set(prev);
        newSet.delete(requesterId);
        return newSet;
      });
    }
  };

  // Format time ago
  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const requestDate = new Date(dateString);
    const diffInMinutes = Math.floor((now - requestDate) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks}w ago`;
  };

  // Sample other notifications (you can expand this later)
  const otherNotifications = [
    {
      id: 1,
      type: 'like',
      user: { firstName: 'Sarah', lastName: 'Chen', profilePicUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop' },
      message: 'liked your post',
      time: '2h ago',
      icon: <Heart className="w-4 h-4 text-red-500" />,
      read: false
    },
    {
      id: 2,
      type: 'comment',
      user: { firstName: 'Mike', lastName: 'Johnson', profilePicUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop' },
      message: 'commented on your post: "Great shot! 📸"',
      time: '4h ago',
      icon: <MessageSquare className="w-4 h-4 text-blue-500" />,
      read: true
    },
    {
      id: 3,
      type: 'share',
      user: { firstName: 'Emma', lastName: 'Wilson', profilePicUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop' },
      message: 'shared your post',
      time: '6h ago',
      icon: <Share2 className="w-4 h-4 text-green-500" />,
      read: true
    }
  ];

  const tabs = [
    { id: 'all', label: 'All', count: friendRequests.length + otherNotifications.length },
    { id: 'friends', label: 'Friend Requests', count: friendRequests.length },
    { id: 'mentions', label: 'Mentions', count: 0 }
  ];

  // Friend Request Component
  const FriendRequestItem = ({ request }) => {
    const isProcessing = processingRequests.has(request.from._id);
    const requesterName = `${request.from.firstName} ${request.from.lastName}`.trim();
    
    return (
      <div className="flex items-start space-x-3 p-4 hover:bg-gray-50 border-b border-gray-100 last:border-b-0">
        {/* Profile Picture */}
        <div 
          className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center overflow-hidden cursor-pointer"
          onClick={() => navigate(`/user/${request.from._id}`)}
        >
          {request.from.profilePicUrl ? (
            <img 
              src={request.from.profilePicUrl} 
              alt={requesterName}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <span className="text-white font-semibold text-sm">
            {`${request.from.firstName?.charAt(0) || ''}${request.from.lastName?.charAt(0) || ''}`}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <UserPlus className="w-4 h-4 text-blue-500 flex-shrink-0" />
                <p className="text-sm">
                  <span 
                    className="font-semibold text-gray-900 hover:underline cursor-pointer"
                    onClick={() => navigate(`/user/${request.from._id}`)}
                  >
                    {requesterName}
                  </span>
                  <span className="text-gray-600"> sent you a friend request</span>
                </p>
              </div>
              <p className="text-xs text-gray-500">{formatTimeAgo(request.createdAt)}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2 mt-3">
            <button
              onClick={() => acceptFriendRequest(request.from._id, requesterName)}
              disabled={isProcessing}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Accepting...' : 'Accept'}
            </button>
            <button
              onClick={() => declineFriendRequest(request.from._id, requesterName)}
              disabled={isProcessing}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-1.5 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Declining...' : 'Decline'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Other Notification Item Component
  const NotificationItem = ({ notification }) => (
    <div className={`flex items-start space-x-3 p-4 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 ${!notification.read ? 'bg-blue-50' : ''}`}>
      {/* Profile Picture */}
      <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center overflow-hidden">
        <img 
          src={notification.user.profilePicUrl} 
          alt={`${notification.user.firstName} ${notification.user.lastName}`}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              {notification.icon}
              <p className="text-sm">
                <span className="font-semibold text-gray-900">
                  {notification.user.firstName} {notification.user.lastName}
                </span>
                <span className="text-gray-600"> {notification.message}</span>
              </p>
            </div>
            <p className="text-xs text-gray-500">{notification.time}</p>
          </div>
          {!notification.read && (
            <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
          )}
        </div>
      </div>
    </div>
  );

  if (!currentUserId) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bell className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-4">Please log in to view your notifications</p>
          <button 
            onClick={() => navigate('/login')}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-full mr-4"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex items-center space-x-3">
              <Bell className="w-6 h-6 text-blue-600" />
              <h1 className="text-xl font-semibold text-gray-900">Notifications</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-4">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                  {tab.count > 0 && (
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                      activeTab === tab.id 
                        ? 'bg-blue-100 text-blue-600' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="min-h-[400px]">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading notifications...</p>
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <X className="w-6 h-6 text-red-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Error</h3>
                  <p className="text-gray-600 mb-4">{error}</p>
                  <button 
                    onClick={() => loadFriendRequests(currentUserId)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* All Tab */}
                {activeTab === 'all' && (
                  <div>
                    {friendRequests.length === 0 && otherNotifications.length === 0 ? (
                      <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                          <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">No notifications</h3>
                          <p className="text-gray-600">You're all caught up! Check back later for new notifications.</p>
                        </div>
                      </div>
                    ) : (
                      <div>
                        {/* Friend Requests */}
                        {friendRequests.map((request) => (
                          <FriendRequestItem key={request.from._id} request={request} />
                        ))}
                        {/* Other Notifications */}
                        {otherNotifications.map((notification) => (
                          <NotificationItem key={notification.id} notification={notification} />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Friend Requests Tab */}
                {activeTab === 'friends' && (
                  <div>
                    {friendRequests.length === 0 ? (
                      <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">No friend requests</h3>
                          <p className="text-gray-600">You don't have any pending friend requests right now.</p>
                        </div>
                      </div>
                    ) : (
                      <div>
                        {friendRequests.map((request) => (
                          <FriendRequestItem key={request.from._id} request={request} />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Mentions Tab */}
                {activeTab === 'mentions' && (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No mentions</h3>
                      <p className="text-gray-600">No one has mentioned you recently.</p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

