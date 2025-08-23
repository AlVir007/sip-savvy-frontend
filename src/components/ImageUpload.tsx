'use client';

import { useState, useEffect } from 'react';
import { Upload, X } from 'lucide-react';

interface ImageUploadProps {
  currentImage?: string;
  onImageChange: (url: string) => void;
  type: 'persona' | 'article' | 'draft';
}

export default function ImageUpload({ currentImage, onImageChange, type }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentImage || '');

  // Update preview when currentImage changes
  useEffect(() => {
    setPreview(currentImage || '');
  }, [currentImage]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to server
    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);
    formData.append('type', type);

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload/image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setPreview(data.url);  // Update preview with server URL
        onImageChange(data.url);
      } else {
        console.error('Upload failed');
        setPreview(currentImage || '');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setPreview(currentImage || '');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setPreview('');
    onImageChange('');
  };

  // Check if preview is an actual image URL (not text like "DD", "JT")
  const isImageUrl = preview && (preview.startsWith('http') || preview.startsWith('data:'));

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Profile Picture
      </label>
      
      {isImageUrl ? (
        <div className="relative w-32 h-32">
          <img
            src={preview}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-2 border-gray-200"
          />
          <button
            type="button"
            onClick={removeImage}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <label className="cursor-pointer">
          <div className="w-32 h-32 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors">
            {uploading ? (
              <span className="text-sm text-gray-500">Uploading...</span>
            ) : preview && !isImageUrl ? (
              // Show text avatar if it exists (like "DD", "JT")
              <span className="text-2xl font-semibold text-gray-600">{preview}</span>
            ) : (
              <Upload className="w-8 h-8 text-gray-400" />
            )}
          </div>
          <input
            type="file"
            className="hidden"
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
            onChange={handleUpload}
            disabled={uploading}
          />
        </label>
      )}
    </div>
  );
}
