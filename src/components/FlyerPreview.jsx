import React from 'react';
import './FlyerPreview.css';

const FlyerPreview = ({ formData }) => {
  return (
    <div className="flyer-document" id="flyer-node">
      {/* Top Banner section */}
      <div className="flyer-header">
        <h1 className="flyer-title">{formData.productName}</h1>
        <div className="flyer-price">{formData.price}</div>
      </div>

      {/* Main Image */}
      <div className="flyer-hero">
        <img src={formData.heroImage || "/interior.png"} alt="Interior Showroom" className="hero-img" />
        <div className="flyer-swatch-insert">
          <img src={formData.swatchImage || "/swatch.png"} alt="Flooring Swatch" />
        </div>
      </div>

      {/* Body Specs */}
      <div className="flyer-body">
        <div className="flyer-description">
          <h3>About this flooring</h3>
          <p>{formData.description}</p>
        </div>
        
        <div className="flyer-specs">
          <h3>Specifications</h3>
          <ul>
            <li><strong>Dimensions:</strong> {formData.dimensions}</li>
            <li><strong>Warranty:</strong> {formData.warranty}</li>
            <li><strong>Finish:</strong> Premium Aluminum Oxide</li>
            <li><strong>Core:</strong> High-Density Form</li>
          </ul>
        </div>
      </div>

      {/* Footer / Partner Ribbon */}
      <div className="flyer-footer">
        {formData.partnerLogo ? (
          <img src={formData.partnerLogo} alt={`${formData.partnerName || 'Partner'} Logo`} className="partner-logo" style={{ maxHeight: '80px', maxWidth: '150px', objectFit: 'contain' }} />
        ) : (
          <div className="certified-badge">
            Certified Installer
          </div>
        )}
        <div className="partner-details">
          <h2>{formData.partnerName}</h2>
          <p>{formData.partnerContact}</p>
        </div>
      </div>
    </div>
  );
};

export default FlyerPreview;
