import { Camera, Edit3, ChevronDown, Plus } from 'lucide-react';
import { useState } from 'react';

export const ProfileHeader = () => {
  const [activeTab, setActiveTab] = useState('Posts');
  const [coverUrl, setCoverUrl] = useState(''); // Cover photo URL state
  const [uploading, setUploading] = useState(false);
  const tabs = ['Posts', 'About', 'Friends', 'Photos', 'Videos', 'Check-ins', 'More'];

 const uploadCoverPhoto = async (file) => {
  setUploading(true);
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
    await fetch('http://localhost:5000/api/users/cover-photo', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ coverPhotoUrl: data.secure_url })
    });
  } catch (err) {
    console.error('Upload failed:', err);
  }
  setUploading(false);
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
              {uploading ? 'Uploading...' : 'Edit cover photo'}
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
              <div className="w-40 h-40 lg:w-44 lg:h-44 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full border-4 border-white shadow-lg mx-auto lg:mx-0"></div>
              <button className="absolute bottom-2 right-2 w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center shadow-lg transition-colors">
                <Camera className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Name & Actions */}
            <div className="flex-1 text-center lg:text-left lg:pb-6">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">John Doe</h1>
              <p className="text-gray-600 mb-4">2.5K friends • 12 mutual friends</p>

              <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold flex items-center space-x-2 transition-colors">
                  <Plus className="w-4 h-4" />
                  <span>Add to story</span>
                </button>
                <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-semibold flex items-center space-x-2 transition-colors">
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
