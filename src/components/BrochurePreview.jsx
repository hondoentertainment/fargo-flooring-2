import React from 'react';
import './BrochurePreview.css';

const BrochurePreview = ({ formData }) => {
  return (
    <div className="brochure-document" id="brochure-node">
      {/* Panel 1: About */}
      <div className="brochure-panel panel-left">
        <h1 className="brochure-title">{formData.productName}</h1>
        <div className="brochure-price">{formData.price}</div>
        <div className="brochure-description">
          <h3>About this flooring</h3>
          <p>{formData.description}</p>
        </div>
      </div>

      {/* Panel 2: Visuals */}
      <div className="brochure-panel panel-center">
        <div className="brochure-hero-container">
          <img src={formData.heroImage || "/interior.png"} alt="Interior Showroom" className="brochure-hero-img" />
          <div className="brochure-swatch-insert">
            <img src={formData.swatchImage || "/swatch.png"} alt="Flooring Swatch" />
          </div>
        </div>
      </div>

      {/* Panel 3: Specs & Contact */}
      <div className="brochure-panel panel-right">
        <div className="brochure-specs">
          <h3>Specifications</h3>
          <ul>
            <li><strong>Dimensions:</strong> {formData.dimensions}</li>
            <li><strong>Warranty:</strong> {formData.warranty}</li>
            <li><strong>Finish:</strong> Premium Aluminum Oxide</li>
            <li><strong>Core:</strong> High-Density Form</li>
          </ul>
        </div>

        <div className="brochure-footer-spacer" />

        <div className="brochure-partner">
          {formData.partnerLogo ? (
            <img src={formData.partnerLogo} alt="Partner Logo" className="partner-logo" style={{ maxHeight: '100px', maxWidth: '180px', objectFit: 'contain' }} />
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
    </div>
  );
};

export default BrochurePreview;
