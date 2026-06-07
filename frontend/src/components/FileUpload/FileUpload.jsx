import React, { useState, useRef } from 'react';
import { toast } from '../../utils/notifications.js';
import './FileUpload.css';

const FileUpload = ({ 
  onFileSelect, 
  onFileRemove,
  accept = "image/*",
  label = "Upload Image",
  currentImageUrl = null,
  disabled = false
}) => {
  const [previewUrl, setPreviewUrl] = useState(currentImageUrl);
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.validationError('Please select a valid image file');
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast.validationError('File size must be less than 10MB');
      return;
    }

    // Show success notification
    toast.success(`Selected: ${file.name}`, {
      description: `File size: ${(file.size / 1024 / 1024).toFixed(2)} MB`,
      duration: 3000
    });

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => setPreviewUrl(e.target.result);
    reader.readAsDataURL(file);

    // Call the callback with the file
    onFileSelect?.(file);
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    toast.info('Image removed');
    onFileRemove?.();
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="file-upload-container">
      <label className="file-upload-label">{label}</label>
      
      <div className="file-upload-area">
        {previewUrl ? (
          <div className="image-preview">
            <img src={previewUrl} alt="Preview" className="preview-image" />
            <div className="image-actions">
              <button
                type="button"
                onClick={handleButtonClick}
                disabled={disabled}
                className="change-image-btn"
              >
                Change Image
              </button>
              <button
                type="button"
                onClick={handleRemoveImage}
                disabled={disabled}
                className="remove-image-btn"
              >
                Remove
              </button>
            </div>
          </div>
        ) : (
          <div className="upload-placeholder" onClick={handleButtonClick}>
            <div className="upload-icon">📁</div>
            <p className="upload-text">
              Click to select an image
            </p>
            <p className="upload-subtext">
              PNG, JPG, GIF up to 10MB
            </p>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          disabled={disabled}
          className="file-input-hidden"
        />
      </div>
    </div>
  );
};

export default FileUpload;
