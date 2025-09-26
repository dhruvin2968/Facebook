import { Camera, Edit3, ChevronDown, Plus } from 'lucide-react';
import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
export const ProfileHeader = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Posts');
  const [coverUrl, setCoverUrl] = useState(''); // Cover photo URL state
  const [profileUrl, setProfileUrl] = useState(''); // Profile photo URL state
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingProfile, setUploadingProfile] = useState(false);
  const [Name, setName] = useState('John Doe');
  const tabs = ['Posts', 'About', 'Friends', 'Photos', 'Videos', 'Check-ins', 'More'];

  const userId=localStorage.getItem('userId');

  useEffect(() => {
  const userId = localStorage.getItem("userId");
  if (!userId) return;

  const fetchUser = async () => {
    try {
      const res = await fetch(`https://facebook-backend-f4m6.onrender.com/api/users/profile/${userId}`);
      const data = await res.json();
      if (res.ok) {
        setCoverUrl(data.user.coverPhotoUrl || "");
        setProfileUrl(data.user.profilePicUrl || "");
        setName(
  `${data?.user?.firstName ?? ""} ${data?.user?.lastName ?? ""}`.trim() || "Dhruvin Mehta"
);


      } else {
        console.error(data.error);
      }
    } catch (err) {
      console.error("Error fetching user profile:", err);
    }
  };

  fetchUser();
}, []);
  const uploadCoverPhoto = async (file) => {
    setUploadingCover(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'facebook');

    try {
      const res = await fetch(
        'https://api.cloudinary.com/v1_1/dfcioifl2/image/upload',
        { method: 'POST', body: formData }
      );
      const data = await res.json();
      setCoverUrl(data.secure_url);

      // Send to backend to update MongoDB
      await fetch('https://facebook-backend-f4m6.onrender.com/api/users/cover-photo', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId,coverPhotoUrl: data.secure_url })
      });
    } catch (err) {
      console.error('Cover photo upload failed:', err);
    }
    setUploadingCover(false);
  };
  const uploadProfilePhoto = async (file) => {
    setUploadingProfile(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'facebook');

    try {
      const res = await fetch(
        'https://api.cloudinary.com/v1_1/dfcioifl2/image/upload',
        { method: 'POST', body: formData }
      );
      const data = await res.json();
      setProfileUrl(data.secure_url);

      // Send to backend to update MongoDB
      await fetch('https://facebook-backend-f4m6.onrender.com/api/users/profile-photo', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({userId, profilePicUrl: data.secure_url })
      });
    } catch (err) {
      console.error('Profile photo upload failed:', err);
    }
    setUploadingProfile(false);
  };

  return (
    <div className="bg-white shadow-sm">
      {/* Cover Photo Section */}
      <div className="relative">
        <div
          className="h-80 lg:h-96 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 relative overflow-hidden"
          style={{
            backgroundImage: coverUrl ? `url(${coverUrl})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>

          {/* Edit Cover Button */}
          <label className="absolute bottom-4 right-4 bg-white bg-opacity-90 hover:bg-opacity-100 px-4 py-2 rounded-lg flex items-center space-x-2 cursor-pointer transition-all">
            <Camera className="w-4 h-4" />
            <span className="text-sm font-medium">
              {uploadingCover ? 'Uploading...' : 'Edit cover photo'}
            </span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files && uploadCoverPhoto(e.target.files[0])}
            />
          </label>
        </div>

        {/* Profile Picture & Info */}
        <div className="relative px-4 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:space-x-6 -mt-20 lg:-mt-8">
            {/* Profile Picture */}
            <div className="relative mb-4 lg:mb-0">
              <div 
                className="w-40 h-40 lg:w-44 lg:h-44 rounded-full border-4 border-white shadow-lg mx-auto lg:mx-0 overflow-hidden"
                style={{
                  backgroundImage: profileUrl ? `url(${profileUrl})` : undefined,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                {!profileUrl && (
                  <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
                    <div className="text-white text-4xl font-bold">JD</div>
                  </div>
                )}
              </div>
              
              {/* Profile Photo Upload Button */}
              <label className="absolute bottom-2 right-2 w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center shadow-lg transition-colors cursor-pointer">
                <Camera className={`w-5 h-5 text-gray-600 ${uploadingProfile ? 'animate-pulse' : ''}`} />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files && uploadProfilePhoto(e.target.files[0])}
                />
              </label>
              
              {/* Loading indicator for profile photo */}
              {uploadingProfile && (
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>

            {/* Name & Actions */}
            <div className="flex-1 text-center lg:text-left lg:pb-6">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2 pt-2">{Name}</h1>
              <p className="text-gray-600 mb-4">2.5K friends • 12 mutual friends</p>

              <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold flex items-center space-x-2 transition-colors">
                  <Plus className="w-4 h-4" />
                  <span>Add to story</span>
                </button>
                <button   onClick={() => navigate("/edit_profile")} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-semibold flex items-center space-x-2 transition-colors">
                  <Edit3 className="w-4 h-4" />
                  <span>Edit profile</span>
                </button> 
                <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-lg transition-colors">
                  <ChevronDown className="w-5 h-5" />
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
  );
};

export default ProfileHeader;