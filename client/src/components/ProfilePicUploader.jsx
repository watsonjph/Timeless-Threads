// Yoinked this from my WebDEV 1 Project lol
import React, { useState, useCallback, useRef } from 'react';
import Cropper from 'react-easy-crop';

export default function ProfilePicUploader({ userId, currentImage, onUpload }) {
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef();

  // Convert cropped area to blob
  const getCroppedImg = useCallback(async () => {
    if (!imageSrc || !croppedAreaPixels) return null;
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = croppedAreaPixels.width;
    canvas.height = croppedAreaPixels.height;
    ctx.drawImage(
      image,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      croppedAreaPixels.width,
      croppedAreaPixels.height
    );
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/jpeg', 0.9);
    });
  }, [imageSrc, croppedAreaPixels]);

  // Handle file selection
  const onFileChange = (e) => {
    setError('');
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setImageSrc(reader.result);
    reader.readAsDataURL(file);
  };

  // Handle crop complete
  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  // Upload cropped image
  const handleUpload = async () => {
    setUploading(true);
    setError('');
    try {
      const blob = await getCroppedImg();
      if (!blob) throw new Error('Failed to crop image.');
      const formData = new FormData();
      formData.append('profilePic', blob, 'profile.jpg');
      const res = await fetch(`/api/auth/user/${userId}/profile-pic`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (res.ok && data.profile_pic_url) {
        if (onUpload) onUpload(data.profile_pic_url);
        window.dispatchEvent(new CustomEvent('profilePicUpdated', { detail: { url: data.profile_pic_url } }));
        setImageSrc(null);
      } else {
        setError(data.error || 'Upload failed.');
      }
    } catch (err) {
      setError(err.message || 'Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  // Helper to create image
  function createImage(url) {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.addEventListener('load', () => resolve(img));
      img.addEventListener('error', (err) => reject(err));
      img.setAttribute('crossOrigin', 'anonymous');
      img.src = url;
    });
  }

  return (
    <div className="flex flex-col items-center">
      <div className="mb-2">
        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300 bg-gray-100 flex items-center justify-center">
          {currentImage && !imageSrc && (
            <img src={currentImage} alt="Profile" className="w-full h-full object-cover" />
          )}
          {!currentImage && !imageSrc && (
            <span className="text-gray-400 text-3xl">📷</span>
          )}
          {imageSrc && (
            <div className="relative w-24 h-24">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
          )}
        </div>
      </div>
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={inputRef}
        onChange={onFileChange}
      />
      {!imageSrc && (
        <button
          className="bg-custom-dark text-custom-cream px-4 py-2 rounded-lg hover:bg-custom-mint transition font-poppins text-sm cursor-pointer"
          onClick={() => inputRef.current.click()}
        >
          Upload Photo
        </button>
      )}
      {imageSrc && (
        <div className="flex flex-col items-center gap-2 mt-2">
          <input
            type="range"
            min={1}
            max={3}
            step={0.01}
            value={zoom}
            onChange={e => setZoom(Number(e.target.value))}
            className="w-24"
          />
          <div className="flex gap-2">
            <button
              className="bg-custom-dark text-custom-cream px-4 py-1 rounded-lg hover:bg-custom-mint transition font-poppins text-xs"
              onClick={handleUpload}
              disabled={uploading}
            >
              {uploading ? 'Uploading...' : 'Save'}
            </button>
            <button
              className="bg-gray-300 text-gray-700 px-4 py-1 rounded-lg font-poppins text-xs"
              onClick={() => setImageSrc(null)}
              disabled={uploading}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      {error && <div className="text-red-500 text-xs mt-2">{error}</div>}
    </div>
  );
} 