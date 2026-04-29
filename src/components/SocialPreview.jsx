import React from 'react';
import './SocialPreview.css';

const SocialPreview = ({ formData }) => {
  return (
    <div className="social-document" id="social-node">
      <div className="social-hero">
        <img src={formData.heroImage || "/interior.png"} alt="Interior Showroom" className="social-img" />
        <div className="social-gradient-overlay" />
      </div>

      <div className="social-floating-swatch">
        <img src={formData.swatchImage || "/swatch.png"} alt="Flooring Swatch" />
      </div>

      <div className="social-content">
        <div className="social-tag">Premium Flooring</div>
        <h1 className="social-title">{formData.productName}</h1>
        <p className="social-price">{formData.price}</p>
        <p className="social-desc">{formData.description}</p>
        
        <div className="social-footer">
          <div className="social-partner">
            <span className="partner-name">{formData.partnerName}</span>
            <span className="partner-contact">{formData.partnerContact}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialPreview;
