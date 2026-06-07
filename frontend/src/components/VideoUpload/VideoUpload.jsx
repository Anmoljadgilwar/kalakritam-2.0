import React, { useState, useRef, useEffect } from 'react';
import { toast } from '../../utils/notifications.js';
import './VideoUpload.css';

const VideoUpload = ({ 
  onFileSelect, 
  onFileRemove,
  label = "Upload Video",
  currentVideoUrl = null,
  disabled = false
}) => {
  const [previewUrl, setPreviewUrl] = useState(currentVideoUrl);
  const fileInputRef = useRef(null);

  console.log('📹 VideoUpload rendered:', { currentVideoUrl, previewUrl });

  // Update preview when currentVideoUrl changes (for edit mode)
  useEffect(() => {
    console.log('📹 VideoUpload: currentVideoUrl changed to:', currentVideoUrl);
    setPreviewUrl(currentVideoUrl);
  }, [currentVideoUrl]);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const validVideoTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
    if (!validVideoTypes.includes(file.type)) {
      toast.validationError('Please select a valid video file (MP4, WebM, OGG, MOV)');
      return;
    }

    // Validate file size (50MB limit to match backend)
    if (file.size > 50 * 1024 * 1024) {
      toast.validationError('Video file size must be less than 50MB');
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

  const handleRemoveVideo = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    toast.info('Video removed');
    onFileRemove?.();
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="video-upload-container">
      <label className="video-upload-label">{label}</label>
      
      <div className="video-upload-area">
        {previewUrl ? (
          <div className="video-preview">
            <video 
              src={previewUrl} 
              controls 
              className="preview-video"
              style={{ maxHeight: '200px' }}
            />
            <div className="video-actions">
              <button
                type="button"
                onClick={handleButtonClick}
                disabled={disabled}
                className="change-video-btn"
              >
                Change Video
              </button>
              <button
                type="button"
                onClick={handleRemoveVideo}
                disabled={disabled}
                className="remove-video-btn"
              >
                Remove
              </button>
            </div>
          </div>
        ) : (
          <div className="upload-placeholder" onClick={handleButtonClick}>
            <div className="upload-icon">🎬</div>
            <p className="upload-text">
              Click to select a video
            </p>
            <p className="upload-subtext">
              MP4, WebM, OGG, MOV up to 50MB
            </p>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="video/mp4,video/webm,video/ogg,video/quicktime"
          onChange={handleFileSelect}
          disabled={disabled}
          className="file-input-hidden"
        />
      </div>
    </div>
  );
};

export default VideoUpload;
