import React, { useState, useEffect } from "react";

export const EditProfile = () => {
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Profile form data state
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    bio: "",
    location: "",
    website: "",
    birthday: "",
    gender: "",
    profilePicUrl: "",
    coverPhotoUrl: ""
  });

  // Original data for comparison
  const [originalData, setOriginalData] = useState({});

  // Check authentication and load user data
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
      loadUserProfile(storedUserId);
    }
  }, []);

  // Load user profile from backend
  const loadUserProfile = async (userId) => {
    try {
      const response = await fetch(`https://facebook-backend-f4m6.onrender.com/api/users/profile/${userId}`);
      const data = await response.json();
      
      if (response.ok) {
        const userData = data.user;
        const formattedData = {
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
          email: userData.email || "",
          bio: userData.bio || "",
          location: userData.location || "",
          website: userData.website || "",
          birthday: userData.birthday ? new Date(userData.birthday).toISOString().split('T')[0] : "",
          gender: userData.gender || "",
          profilePicUrl: userData.profilePicUrl || "",
          coverPhotoUrl: userData.coverPhotoUrl || ""
        };
        
        setProfileData(formattedData);
        setOriginalData(formattedData);
      } else {
        setError("Failed to load profile data");
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      setError("Failed to load profile data");
    }
  };

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear any previous errors when user starts typing
    if (error) setError(null);
    if (successMessage) setSuccessMessage(null);
  };

  const getChangedFields = () => {
    const changed = {};
    Object.keys(profileData).forEach(key => {
      if (profileData[key] !== originalData[key]) {
        changed[key] = profileData[key];
      }
    });
    return changed;
  };

  const handleSave = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const changedFields = getChangedFields();
      
      if (Object.keys(changedFields).length === 0) {
        setError("No changes to save");
        setIsLoading(false);
        return;
      }

      const response = await fetch(`https://facebook-backend-f4m6.onrender.com/api/users/profile/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(changedFields)
      });

      const data = await response.json();
      
      if (response.ok) {
        // Update original data to reflect saved changes
        setOriginalData(profileData);
        
        // Show success message
        setSuccessMessage("Profile updated successfully!");
        
        // Close modal
        setShowModal(false);
        setActiveSection(null);
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError(data.error || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const openEditModal = (section) => {
    setActiveSection(section);
    setShowModal(true);
    setError(null);
  };

  const closeModal = () => {
    setShowModal(false);
    setActiveSection(null);
    setError(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    window.location.href = '/login'; // or navigate to login page
  };

  // Get user initials for avatar
  const getInitials = () => {
    const first = profileData.firstName?.charAt(0)?.toUpperCase() || "";
    const last = profileData.lastName?.charAt(0)?.toUpperCase() || "";
    return first + last || "U";
  };

  // Check if user is authenticated
  if (!userId) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Please log in</h2>
          <p className="text-gray-600 mb-4">You need to be logged in to edit your profile</p>
          <button 
            onClick={() => window.location.href = '/login'}
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
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button 
                onClick={() => window.history.back()}
                className="p-2 hover:bg-gray-100 rounded-full mr-4"
              >
                <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
                </svg>
              </button>
              <h1 className="text-xl font-semibold text-gray-900">Edit profile</h1>
            </div>
            
            {/* User info and logout */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {profileData.firstName} {profileData.lastName}
              </span>
              <button 
                onClick={handleLogout}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 flex items-center">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
            {successMessage}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            {error}
          </div>
        )}

        {/* Profile Photos Section */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile photo</h2>
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center overflow-hidden">
                {profileData.profilePicUrl ? (
                  <img 
                    src={profileData.profilePicUrl} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : (
                  <span className="text-white font-semibold text-2xl">
                    {getInitials()}
                  </span>
                )}
              </div>
              <div>
                <button 
                  onClick={() => openEditModal('profilePic')}
                  className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md text-sm font-medium text-gray-700 mb-2 block transition-colors"
                >
                  Edit
                </button>
                <p className="text-xs text-gray-500">We suggest an image that's at least 170x170</p>
              </div>
            </div>
          </div>

          {/* Cover Photo */}
          <div className="px-6 pb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Cover photo</h2>
            <div className="w-full h-32 bg-gray-200 rounded-lg relative overflow-hidden">
              {profileData.coverPhotoUrl ? (
                <img 
                  src={profileData.coverPhotoUrl} 
                  alt="Cover" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                    </svg>
                    <span className="text-gray-500 text-sm">Add a cover photo</span>
                  </div>
                </div>
              )}
              <button 
                onClick={() => openEditModal('coverPhoto')}
                className="absolute bottom-4 right-4 bg-white hover:bg-gray-100 px-3 py-1 rounded-md text-sm font-medium text-gray-700 shadow-sm transition-colors"
              >
                {profileData.coverPhotoUrl ? 'Change' : 'Add Cover Photo'}
              </button>
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Basic info</h2>
              <button 
                onClick={() => openEditModal('basicInfo')}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
              >
                Edit
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex">
                <span className="w-24 text-sm text-gray-500 flex-shrink-0">Name</span>
                <span className="text-sm text-gray-900">
                  {profileData.firstName || profileData.lastName 
                    ? `${profileData.firstName} ${profileData.lastName}`.trim() 
                    : "Add your name"
                  }
                </span>
              </div>
              <div className="flex">
                <span className="w-24 text-sm text-gray-500 flex-shrink-0">Email</span>
                <span className="text-sm text-gray-900">{profileData.email || "Add email"}</span>
              </div>
              {profileData.birthday && (
                <div className="flex">
                  <span className="w-24 text-sm text-gray-500 flex-shrink-0">Birthday</span>
                  <span className="text-sm text-gray-900">
                    {new Date(profileData.birthday).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              )}
              {profileData.gender && (
                <div className="flex">
                  <span className="w-24 text-sm text-gray-500 flex-shrink-0">Gender</span>
                  <span className="text-sm text-gray-900">{profileData.gender}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">About</h2>
              <button 
                onClick={() => openEditModal('about')}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
              >
                Edit
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <span className="block text-sm text-gray-500 mb-1">Bio</span>
                <p className="text-sm text-gray-900">
                  {profileData.bio || (
                    <span className="text-gray-400 italic">Tell people a little about yourself</span>
                  )}
                </p>
              </div>
              {profileData.location && (
                <div>
                  <span className="block text-sm text-gray-500 mb-1">Lives in</span>
                  <p className="text-sm text-gray-900 flex items-center">
                    <svg className="w-4 h-4 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                    {profileData.location}
                  </p>
                </div>
              )}
              {profileData.website && (
                <div>
                  <span className="block text-sm text-gray-500 mb-1">Website</span>
                  <a 
                    href={profileData.website.startsWith('http') ? profileData.website : `https://${profileData.website}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-700 flex items-center transition-colors"
                  >
                    <svg className="w-4 h-4 text-blue-400 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
                    </svg>
                    {profileData.website}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {activeSection === 'basicInfo' && 'Edit basic info'}
                {activeSection === 'about' && 'Edit about info'}
                {activeSection === 'profilePic' && 'Update profile photo'}
                {activeSection === 'coverPhoto' && 'Update cover photo'}
              </h3>
              <button 
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                disabled={isLoading}
              >
                <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4">
              {/* Error message in modal */}
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-4 text-sm flex items-center">
                  <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  {error}
                </div>
              )}

              {activeSection === 'basicInfo' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={profileData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your first name"
                      maxLength={50}
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">{profileData.firstName.length}/50 characters</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={profileData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your last name"
                      maxLength={50}
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">{profileData.lastName.length}/50 characters</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Birthday</label>
                    <input
                      type="date"
                      value={profileData.birthday}
                      onChange={(e) => handleInputChange('birthday', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      max={new Date(new Date().setFullYear(new Date().getFullYear() - 13)).toISOString().split('T')[0]}
                      min={new Date(new Date().setFullYear(new Date().getFullYear() - 120)).toISOString().split('T')[0]}
                    />
                    <p className="text-xs text-gray-500 mt-1">You must be at least 13 years old</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                    <select
                      value={profileData.gender}
                      onChange={(e) => handleInputChange('gender', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Custom">Custom</option>
                      <option value="Prefer-not-to-say">Prefer not to say</option>
                    </select>
                  </div>
                </div>
              )}

              {activeSection === 'about' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                    <textarea
                      value={profileData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      rows={4}
                      maxLength={500}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      placeholder="Tell people a little about yourself..."
                    />
                    <p className="text-xs text-gray-500 mt-1">{profileData.bio.length}/500 characters</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <input
                      type="text"
                      value={profileData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Where do you live?"
                      maxLength={100}
                    />
                    <p className="text-xs text-gray-500 mt-1">{profileData.location.length}/100 characters</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                    <input
                      type="url"
                      value={profileData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://example.com"
                    />
                    <p className="text-xs text-gray-500 mt-1">Include http:// or https://</p>
                  </div>
                </div>
              )}

              {activeSection === 'profilePic' && (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="w-32 h-32 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden">
                      {profileData.profilePicUrl ? (
                        <img 
                          src={profileData.profilePicUrl} 
                          alt="Profile Preview" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <span className="text-white font-semibold text-4xl">
                        {getInitials()}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Profile photo URL</label>
                    <input
                      type="url"
                      value={profileData.profilePicUrl}
                      onChange={(e) => handleInputChange('profilePicUrl', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://example.com/photo.jpg"
                    />
                    <p className="text-xs text-gray-500 mt-1">Paste a URL to your profile photo (JPG, PNG, or GIF)</p>
                  </div>
                </div>
              )}

              {activeSection === 'coverPhoto' && (
                <div className="space-y-4">
                  <div>
                    <div className="w-full h-24 bg-gray-200 rounded-lg overflow-hidden mb-4">
                      {profileData.coverPhotoUrl ? (
                        <img 
                          src={profileData.coverPhotoUrl} 
                          alt="Cover Preview" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div className="flex items-center justify-center h-full">
                        <span className="text-gray-500">Cover photo preview</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cover photo URL</label>
                    <input
                      type="url"
                      value={profileData.coverPhotoUrl}
                      onChange={(e) => handleInputChange('coverPhotoUrl', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://example.com/cover.jpg"
                    />
                    <p className="text-xs text-gray-500 mt-1">Paste a URL to your cover photo (JPG, PNG, or GIF)</p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end space-x-3 p-4 border-t border-gray-200">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isLoading || (!profileData.firstName || !profileData.lastName)}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center transition-colors"
              >
                {isLoading && (
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
