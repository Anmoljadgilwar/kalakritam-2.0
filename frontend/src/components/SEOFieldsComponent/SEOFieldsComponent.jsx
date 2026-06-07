import React, { useState, useEffect } from 'react';
import { seoGenerators } from '../../utils/seoHelpers';
import './SEOFieldsComponent.css';

const SEOFieldsComponent = ({ 
  seoData = {}, 
  onSeoChange, 
  mainTitle = '', 
  mainDescription = '',
  mainCategory = '',
  autoGenerate = true,
  type = 'general' 
}) => {
  const [seoFields, setSeoFields] = useState({
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    slug: '',
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    ...seoData
  });

  const [isExpanded, setIsExpanded] = useState(false);
  const [autoMode, setAutoMode] = useState(autoGenerate);

  // Auto-generate SEO fields when main content changes
  useEffect(() => {
    if (autoMode && (mainTitle || mainDescription)) {
      generateSEOFields();
    }
  }, [mainTitle, mainDescription, mainCategory, autoMode]);

  const generateSEOFields = () => {
    // Use the utility functions to generate optimized SEO fields
    const generatedSEO = seoGenerators[type] ? 
      seoGenerators[type]({
        title: mainTitle,
        description: mainDescription,
        category: mainCategory,
        image: seoFields.ogImage || ''
      }) : 
      seoGenerators.general({
        title: mainTitle,
        description: mainDescription,
        image: seoFields.ogImage || ''
      });

    const newSeoFields = {
      ...seoFields,
      ...generatedSEO
    };

    setSeoFields(newSeoFields);
    onSeoChange && onSeoChange(newSeoFields);
  };

  const handleFieldChange = (field, value) => {
    const updatedFields = {
      ...seoFields,
      [field]: value
    };
    setSeoFields(updatedFields);
    onSeoChange && onSeoChange(updatedFields);
  };

  const getCharacterCount = (text, limit) => {
    const count = text ? text.length : 0;
    const remaining = limit - count;
    const isOver = remaining < 0;
    return { count, remaining, isOver };
  };

  return (
    <div className="seo-fields-component">
      <div className="seo-header">
        <h3 className="seo-title">
          🔍 SEO Optimization
        </h3>
        <div className="seo-controls">
          <label className="auto-generate-toggle">
            <input
              type="checkbox"
              checked={autoMode}
              onChange={(e) => setAutoMode(e.target.checked)}
            />
            <span>Auto-generate</span>
          </label>
          <button
            type="button"
            className="expand-toggle"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? '↑ Collapse' : '↓ Expand'}
          </button>
        </div>
      </div>

      {!autoMode && (
        <button
          type="button"
          className="generate-btn"
          onClick={generateSEOFields}
        >
          🪄 Generate SEO Fields
        </button>
      )}

      <div className={`seo-fields ${isExpanded ? 'expanded' : ''}`}>
        {/* URL Slug */}
        <div className="seo-field">
          <label htmlFor="slug">URL Slug *</label>
          <input
            id="slug"
            type="text"
            value={seoFields.slug}
            onChange={(e) => handleFieldChange('slug', e.target.value)}
            placeholder="url-friendly-slug"
            className="slug-input"
          />
          <small>URL: /artworks/{seoFields.slug || 'your-slug'}</small>
        </div>

        {/* Meta Title */}
        <div className="seo-field">
          <label htmlFor="metaTitle">Meta Title *</label>
          <input
            id="metaTitle"
            type="text"
            value={seoFields.metaTitle}
            onChange={(e) => handleFieldChange('metaTitle', e.target.value)}
            placeholder="SEO optimized title for search engines"
            maxLength="70"
          />
          <div className="character-count">
            {(() => {
              const { count, remaining, isOver } = getCharacterCount(seoFields.metaTitle, 60);
              return (
                <span className={isOver ? 'over-limit' : remaining < 10 ? 'warning' : 'good'}>
                  {count}/60 characters {isOver && '(too long)'}
                </span>
              );
            })()}
          </div>
        </div>

        {/* Meta Description */}
        <div className="seo-field">
          <label htmlFor="metaDescription">Meta Description *</label>
          <textarea
            id="metaDescription"
            value={seoFields.metaDescription}
            onChange={(e) => handleFieldChange('metaDescription', e.target.value)}
            placeholder="Brief description that appears in search results"
            rows="3"
            maxLength="170"
          />
          <div className="character-count">
            {(() => {
              const { count, remaining, isOver } = getCharacterCount(seoFields.metaDescription, 155);
              return (
                <span className={isOver ? 'over-limit' : remaining < 20 ? 'warning' : 'good'}>
                  {count}/155 characters {isOver && '(too long)'}
                </span>
              );
            })()}
          </div>
        </div>

        {/* Meta Keywords */}
        <div className="seo-field">
          <label htmlFor="metaKeywords">Meta Keywords</label>
          <input
            id="metaKeywords"
            type="text"
            value={seoFields.metaKeywords}
            onChange={(e) => handleFieldChange('metaKeywords', e.target.value)}
            placeholder="art, painting, gallery, traditional, modern"
          />
          <small>Comma-separated keywords (5-10 recommended)</small>
        </div>

        {isExpanded && (
          <>
            {/* Open Graph Title */}
            <div className="seo-field">
              <label htmlFor="ogTitle">Open Graph Title</label>
              <input
                id="ogTitle"
                type="text"
                value={seoFields.ogTitle}
                onChange={(e) => handleFieldChange('ogTitle', e.target.value)}
                placeholder="Title for social media sharing"
                maxLength="70"
              />
              <small>Used when sharing on social media</small>
            </div>

            {/* Open Graph Description */}
            <div className="seo-field">
              <label htmlFor="ogDescription">Open Graph Description</label>
              <textarea
                id="ogDescription"
                value={seoFields.ogDescription}
                onChange={(e) => handleFieldChange('ogDescription', e.target.value)}
                placeholder="Description for social media sharing"
                rows="2"
                maxLength="200"
              />
              <div className="character-count">
                {(() => {
                  const { count, remaining, isOver } = getCharacterCount(seoFields.ogDescription, 200);
                  return (
                    <span className={isOver ? 'over-limit' : 'good'}>
                      {count}/200 characters
                    </span>
                  );
                })()}
              </div>
            </div>

            {/* Open Graph Image */}
            <div className="seo-field">
              <label htmlFor="ogImage">Open Graph Image URL</label>
              <input
                id="ogImage"
                type="url"
                value={seoFields.ogImage}
                onChange={(e) => handleFieldChange('ogImage', e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
              <small>Recommended: 1200x630px (for best social media display)</small>
            </div>
          </>
        )}
      </div>

      <div className="seo-preview">
        <h4>🔍 Search Engine Preview</h4>
        <div className="search-preview">
          <div className="preview-title">
            {seoFields.metaTitle || 'Your Page Title | Kalakritam'}
          </div>
          <div className="preview-url">
            kalakritam.in/{type}s/{seoFields.slug || 'your-slug'}
          </div>
          <div className="preview-description">
            {seoFields.metaDescription || 'Your meta description will appear here...'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SEOFieldsComponent;
