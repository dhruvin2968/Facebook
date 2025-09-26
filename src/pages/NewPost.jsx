import React, { useState, useEffect } from 'react';
import { 
  Image, 
  Video, 
  MapPin, 
  Smile, 
  X,
  User,
  Camera,
  Upload
} from 'lucide-react';

export const AddNewPost = ({ onPostCreated }) => {
  const [showModal, setShowModal] = useState(false);
  const [postData, setPostData] = useState({
    description: '',
    postImage: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const userId = localStorage.getItem('userId');

  // Load user data for display
  useEffect(() => {
    const loadUserData = async () => {
      if (!userId) return;
      
      try {
        const response = await fetch(`https://facebook-backend-f4m6.onrender.com/api/users/profile/${userId}`);
        const data = await response.json();
        
        if (response.ok) {
          setUserData(data.user);
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    };

    loadUserData();
  }, [userId]);

  const handleInputChange = (field, value) => {
    setPostData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Handle image preview for URL input
    if (field === 'postImage' && value) {
      setPreviewImage(value);
    }
    
    if (error) setError(null);
  };

  // Upload image to Cloudinary
  const uploadImageToCloudinary = async (file) => {
    setUploadingImage(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'facebook'); // Use your existing upload preset

    try {
      const res = await fetch(
        'https://api.cloudinary.com/v1_1/dfcioifl2/image/upload', // Use your Cloudinary cloud name
        { method: 'POST', body: formData }
      );
      const data = await res.json();
      
      if (data.secure_url) {
        setPostData(prev => ({
          ...prev,
          postImage: data.secure_url
        }));
        setPreviewImage(data.secure_url);
      } else {
        throw new Error('Upload failed');
      }
    } catch (err) {
      console.error('Image upload failed:', err);
      setError('Failed to upload image. Please try again.');
    }
    setUploadingImage(false);
  };

  const handleCreatePost = async () => {
    if (!postData.description.trim() && !postData.postImage.trim()) {
      setError("Please add some content to your post");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('https://facebook-backend-f4m6.onrender.com/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          description: postData.description.trim(),
          postImage: postData.postImage.trim()
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        // Reset form
        setPostData({ description: '', postImage: '' });
        setPreviewImage(null);
        setShowModal(false);
        
        // Notify parent component
        if (onPostCreated) {
          onPostCreated(data.post);
        }
        
        // Show success message
        alert("Post created successfully! 🎉");
      } else {
        setError(data.error || "Failed to create post");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setPostData({ description: '', postImage: '' });
    setPreviewImage(null);
    setError(null);
  };

  const getUserInitials = () => {
    if (!userData) return "U";
    const first = userData.firstName?.charAt(0)?.toUpperCase() || "";
    const last = userData.lastName?.charAt(0)?.toUpperCase() || "";
    return first + last || "U";
  };

  const getUserName = () => {
    if (!userData) return "User";
    return `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || "User";
  };

  if (!userId) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="text-center text-gray-500">
          <p>Please log in to create posts</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Main Post Creator */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex items-center space-x-3 mb-4">
          {/* User Avatar */}
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center overflow-hidden">
            {userData?.profilePicUrl ? (
              <img 
                src={userData.profilePicUrl} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-white font-semibold text-sm">
                {getUserInitials()}
              </span>
            )}
          </div>
          
          {/* Input Field */}
          <button
            onClick={() => setShowModal(true)}
            className="flex-1 bg-gray-100 hover:bg-gray-200 rounded-full px-4 py-3 text-left text-gray-500 transition-colors"
          >
            What's on your mind, {userData?.firstName || 'there'}?
          </button>
        </div>

        {/* Action Buttons */}
        <div className="border-t border-gray-200 pt-3">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => setShowModal(true)}
              className="flex items-center space-x-2 hover:bg-gray-100 rounded-lg px-4 py-2 transition-colors flex-1 justify-center"
            >
              <Video className="w-5 h-5 text-red-500" />
              <span className="text-gray-700 font-medium">Live video</span>
            </button>
            
            <button 
              onClick={() => setShowModal(true)}
              className="flex items-center space-x-2 hover:bg-gray-100 rounded-lg px-4 py-2 transition-colors flex-1 justify-center"
            >
              <Image className="w-5 h-5 text-green-500" />
              <span className="text-gray-700 font-medium">Photo/video</span>
            </button>
            
            <button 
              onClick={() => setShowModal(true)}
              className="flex items-center space-x-2 hover:bg-gray-100 rounded-lg px-4 py-2 transition-colors flex-1 justify-center"
            >
              <Smile className="w-5 h-5 text-yellow-500" />
              <span className="text-gray-700 font-medium">Feeling/activity</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Create post</h3>
              <button 
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                disabled={isLoading}
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4">
              {/* User Info */}
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center overflow-hidden">
                  {userData?.profilePicUrl ? (
                    <img 
                      src={userData.profilePicUrl} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-white font-semibold text-sm">
                      {getUserInitials()}
                    </span>
                  )}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{getUserName()}</div>
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <div className="flex items-center space-x-1 bg-gray-100 rounded px-2 py-1">
                      <User className="w-3 h-3" />
                      <span>Public</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-4 text-sm">
                  {error}
                </div>
              )}

              {/* Text Area */}
              <textarea
                value={postData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder={`What's on your mind, ${userData?.firstName || 'there'}?`}
                className="w-full min-h-[120px] p-3 text-lg resize-none border-none outline-none placeholder-gray-500"
                disabled={isLoading}
              />

              {/* Image Upload Section */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Add Photo
                  </label>
                  {uploadingImage && (
                    <div className="text-sm text-blue-600 flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                      Uploading...
                    </div>
                  )}
                </div>

                {/* File Upload Button */}
                <label className="flex items-center justify-center w-full h-12 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-2">
                    <Upload className="w-5 h-5 text-gray-500" />
                    <span className="text-sm text-gray-500">
                      {uploadingImage ? 'Uploading...' : 'Click to upload or drag and drop'}
                    </span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => e.target.files && uploadImageToCloudinary(e.target.files[0])}
                    disabled={uploadingImage}
                  />
                </label>

                {/* OR divider */}
                <div className="flex items-center my-3">
                  <div className="flex-1 border-t border-gray-300"></div>
                  <span className="px-3 text-gray-500 text-sm">or</span>
                  <div className="flex-1 border-t border-gray-300"></div>
                </div>

                {/* URL Input */}
                <input
                  type="url"
                  value={postData.postImage}
                  onChange={(e) => handleInputChange('postImage', e.target.value)}
                  placeholder="Paste image URL here..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isLoading || uploadingImage}
                />
              </div>

              {/* Image Preview */}
              {previewImage && (
                <div className="mb-4">
                  <div className="relative">
                    <img 
                      src={previewImage} 
                      alt="Post preview" 
                      className="w-full max-h-64 object-cover rounded-lg"
                      onError={() => {
                        setPreviewImage(null);
                        setError('Invalid image URL');
                      }}
                    />
                    <button
                      onClick={() => {
                        setPostData(prev => ({ ...prev, postImage: '' }));
                        setPreviewImage(null);
                      }}
                      className="absolute top-2 right-2 p-1 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-colors"
                      disabled={uploadingImage}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Post Options */}
              <div className="border border-gray-200 rounded-lg p-3 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium text-gray-900">Add to your post</span>
                </div>
                <div className="flex items-center space-x-3">
                  <label className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer">
                    <Image className="w-6 h-6 text-green-500" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => e.target.files && uploadImageToCloudinary(e.target.files[0])}
                      disabled={uploadingImage}
                    />
                  </label>
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <Video className="w-6 h-6 text-red-500" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <Smile className="w-6 h-6 text-yellow-500" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <MapPin className="w-6 h-6 text-red-400" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <Camera className="w-6 h-6 text-purple-500" />
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={handleCreatePost}
                disabled={isLoading || uploadingImage || (!postData.description.trim() && !postData.postImage.trim())}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-2 px-4 rounded-md font-medium transition-colors flex items-center justify-center"
              >
                {(isLoading || uploadingImage) && (
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {uploadingImage ? 'Uploading Image...' : isLoading ? 'Posting...' : 'Post'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
