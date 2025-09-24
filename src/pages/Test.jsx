// 1. Install: npm install cloudinary
// 2. Component example:

import { useState } from 'react';

export const ImageUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const uploadImage = async (file) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'facebook');
    try {
      const response = await fetch(
        'https://api.cloudinary.com/v1_1/dfcioifl2/image/upload',
        {
          method: 'POST',
          body: formData
        }
      );
      const data = await response.json();
      setImageUrl(data.secure_url);
    } catch (error) {
      console.error('Upload failed:', error);
    }
    setUploading(false);
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => uploadImage(e.target.files[0])}
      />
      {uploading && <p>Uploading...</p>}
      {imageUrl && <img src={imageUrl} alt="Uploaded" className="w-32 h-32" />}
    </div>
  );
};