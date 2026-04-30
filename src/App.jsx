import { useState, useRef, useEffect } from 'react';
import { 
  FileBox, 
  Image as ImageIcon, 
  BookOpen, 
  Layout, 
  Download,
  Printer,
  Maximize2,
  Minimize2,
  Archive,
  RefreshCw,
  X,
  Wand2,
  Loader2
} from 'lucide-react';
import { generateFieldContent } from './services/ai';
import html2canvas from 'html2canvas';
import JSZip from 'jszip';
import FlyerPreview from './components/FlyerPreview';
import SocialPreview from './components/SocialPreview';
import BrochurePreview from './components/BrochurePreview';
import './App.css';

const LIMITS = {
  productName: 40,
  price: 20,
  dimensions: 30,
  warranty: 40,
  description: 150,
  partnerName: 40,
  partnerContact: 50
};

const DEFAULT_DATA = {
  productName: 'Natural Oak Engineered Hardwood',
  price: '$4.99 / sq ft',
  dimensions: '7.5" x 72" Planks',
  warranty: '50-Year Residential Warranty',
  description: 'A beautiful, durable, and water-resistant flooring option perfect for active homes. Ideal for showcasing open floor plans.',
  partnerName: 'Fargo Flooring Professionals',
  partnerContact: 'sales@fargoflooring.com | (555) 123-4567',
  heroImage: '/interior.png',
  swatchImage: '/swatch.png',
  partnerLogo: null
};

function App() {
  const [assetType, setAssetType] = useState('flyer'); 
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [isGenerating, setIsGenerating] = useState({});
  
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem('fargo-form');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          heroImage: '/interior.png',
          swatchImage: '/swatch.png',
          partnerLogo: null
        };
      } catch (e) {
        console.error("Parse error", e);
      }
    }
    return DEFAULT_DATA;
  });

  useEffect(() => {
    const { heroImage: _hero, swatchImage: _swatch, partnerLogo: _logo, ...textData } = formData;
    localStorage.setItem('fargo-form', JSON.stringify(textData));
  }, [formData]);

  const previewRef = useRef(null);
  const flyerRef = useRef(null);
  const socialRef = useRef(null);
  const brochureRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (value.length > LIMITS[name]) return;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      const url = URL.createObjectURL(files[0]);
      setFormData(prev => ({
        ...prev,
        [name]: url
      }));
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all form fields? This cannot be undone.")) {
      setFormData(DEFAULT_DATA);
      localStorage.removeItem('fargo-form');
    }
  };

  const handleGenerateAI = async (fieldName) => {
    setIsGenerating(prev => ({ ...prev, [fieldName]: true }));
    try {
      const generatedText = await generateFieldContent(fieldName, formData);
      setFormData(prev => ({
        ...prev,
        [fieldName]: generatedText
      }));
      setToastMessage(`Generated new ${fieldName}!`);
      setTimeout(() => setToastMessage(null), 3000);
    } catch (err) {
      console.error(err);
      if (err.message.includes('API key')) {
         alert(err.message);
      } else {
         alert(`Failed to generate content for ${fieldName}.`);
      }
    } finally {
      setIsGenerating(prev => ({ ...prev, [fieldName]: false }));
    }
  };

  const captureNode = async (node, type) => {
    if (!node) return null;
    const originalTransform = node.style.transform;
    node.style.transform = 'none';
    
    const canvas = await html2canvas(node, {
      scale: 2,
      useCORS: true,
      backgroundColor: type === 'social' ? '#0d1117' : '#ffffff'
    });
    
    node.style.transform = originalTransform;
    return canvas;
  };

  const handleDownloadImage = async () => {
    if (!previewRef.current) return;
    const node = previewRef.current.firstElementChild;
    if (!node) return;

    try {
      setIsExporting(true);
      const canvas = await captureNode(node, assetType);
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `FargoAssets_${assetType}_${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
      
      setToastMessage("Image downloaded successfully!");
      setTimeout(() => setToastMessage(null), 3000);
    } catch (err) {
      console.error("Failed to generate image", err);
      alert("Failed to generate image.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleBatchDownload = () => {
    setShowReviewModal(true);
  };

  const confirmBatchDownload = async () => {
    try {
      setIsExporting(true);
      const zip = new JSZip();
      
      const flyerCanvas = await captureNode(flyerRef.current.firstElementChild, 'flyer');
      const socialCanvas = await captureNode(socialRef.current.firstElementChild, 'social');
      const brochureCanvas = await captureNode(brochureRef.current.firstElementChild, 'brochure');
      
      const flyerBlob = await new Promise(resolve => flyerCanvas.toBlob(resolve, 'image/png'));
      const socialBlob = await new Promise(resolve => socialCanvas.toBlob(resolve, 'image/png'));
      const brochureBlob = await new Promise(resolve => brochureCanvas.toBlob(resolve, 'image/png'));
      
      zip.file(`Fargo_Flyer_${Date.now()}.png`, flyerBlob);
      zip.file(`Fargo_Social_${Date.now()}.png`, socialBlob);
      zip.file(`Fargo_Brochure_${Date.now()}.png`, brochureBlob);
      
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Fargo_Marketing_Assets.zip`;
      link.click();
      URL.revokeObjectURL(url);
      setShowReviewModal(false);
      setToastMessage("ZIP file generated successfully!");
      setTimeout(() => setToastMessage(null), 3000);
    } catch (err) {
      console.error("Failed to batch export", err);
      alert("Failed to batch export.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className={`app-container ${isFullscreen ? 'app-fullscreen' : ''}`}>
      {/* Sidebar Navigation */}
      {!isFullscreen && (
      <aside className="sidebar stagger-item" style={{ animationDelay: '0.05s' }}>
        <div className="brand-header">
          <Layout size={24} color="var(--accent-sapphire)" />
          <span>Fargo Generator</span>
        </div>
        
        <button 
          className={`nav-item stagger-item ${assetType === 'flyer' ? 'active' : ''}`}
          style={{ animationDelay: '0.1s' }}
          onClick={() => setAssetType('flyer')}
        >
          <FileBox size={18} />
          Marketing Flyer
        </button>
        
        <button 
          className={`nav-item stagger-item ${assetType === 'social' ? 'active' : ''}`}
          style={{ animationDelay: '0.15s' }}
          onClick={() => setAssetType('social')}
        >
          <ImageIcon size={18} />
          Social Post
        </button>
        
        <button 
          className={`nav-item stagger-item ${assetType === 'brochure' ? 'active' : ''}`}
          style={{ animationDelay: '0.2s' }}
          onClick={() => setAssetType('brochure')}
        >
          <BookOpen size={18} />
          Full Brochure
        </button>

        <div style={{ flex: 1 }}></div>

        <button 
          className="nav-item stagger-item"
          style={{ animationDelay: '0.25s', color: 'var(--stone-cool)', fontSize: '0.85rem' }}
          onClick={handleReset}
        >
          <RefreshCw size={14} />
          Reset to Defaults
        </button>
      </aside>
      )}

      <main className="main-content">
        {/* Editor Form */}
        {!isFullscreen && (
        <section className="editor-panel stagger-item" style={{ animationDelay: '0.1s' }}>
          <h3>Edit Details</h3>
          
          <div className="form-group stagger-item" style={{ animationDelay: '0.15s' }}>
            <div className="label-row">
              <label>Product Name</label>
              <button 
                className="ai-wand-btn" 
                onClick={() => handleGenerateAI('productName')}
                disabled={isGenerating.productName}
                title="Generate with AI"
              >
                {isGenerating.productName ? <Loader2 size={14} className="spin" /> : <Wand2 size={14} />}
              </button>
            </div>
            <input 
              type="text" 
              className="form-control" 
              name="productName" 
              value={formData.productName}
              maxLength={LIMITS.productName}
              onChange={handleInputChange} 
            />
            <span className="char-count">{formData.productName.length} / {LIMITS.productName}</span>
          </div>
          
          <div className="form-group stagger-item" style={{ animationDelay: '0.2s' }}>
            <div className="label-row">
              <label>Price</label>
              <button 
                className="ai-wand-btn" 
                onClick={() => handleGenerateAI('price')}
                disabled={isGenerating.price}
                title="Generate with AI"
              >
                {isGenerating.price ? <Loader2 size={14} className="spin" /> : <Wand2 size={14} />}
              </button>
            </div>
            <input 
              type="text" 
              className="form-control" 
              name="price" 
              value={formData.price}
              maxLength={LIMITS.price}
              onChange={handleInputChange} 
            />
            <span className="char-count">{formData.price.length} / {LIMITS.price}</span>
          </div>

          <div className="form-group stagger-item" style={{ animationDelay: '0.25s' }}>
            <div className="label-row">
              <label>Dimensions</label>
              <button 
                className="ai-wand-btn" 
                onClick={() => handleGenerateAI('dimensions')}
                disabled={isGenerating.dimensions}
                title="Generate with AI"
              >
                {isGenerating.dimensions ? <Loader2 size={14} className="spin" /> : <Wand2 size={14} />}
              </button>
            </div>
            <input 
              type="text" 
              className="form-control" 
              name="dimensions" 
              value={formData.dimensions}
              maxLength={LIMITS.dimensions}
              onChange={handleInputChange} 
            />
            <span className="char-count">{formData.dimensions.length} / {LIMITS.dimensions}</span>
          </div>
          
          <div className="form-group stagger-item" style={{ animationDelay: '0.3s' }}>
            <div className="label-row">
              <label>Warranty</label>
              <button 
                className="ai-wand-btn" 
                onClick={() => handleGenerateAI('warranty')}
                disabled={isGenerating.warranty}
                title="Generate with AI"
              >
                {isGenerating.warranty ? <Loader2 size={14} className="spin" /> : <Wand2 size={14} />}
              </button>
            </div>
            <input 
              type="text" 
              className="form-control" 
              name="warranty" 
              value={formData.warranty}
              maxLength={LIMITS.warranty}
              onChange={handleInputChange} 
            />
            <span className="char-count">{formData.warranty.length} / {LIMITS.warranty}</span>
          </div>
          
          <div className="form-group stagger-item" style={{ animationDelay: '0.35s' }}>
            <div className="label-row">
              <label>Description</label>
              <button 
                className="ai-wand-btn" 
                onClick={() => handleGenerateAI('description')}
                disabled={isGenerating.description}
                title="Generate with AI"
              >
                {isGenerating.description ? <Loader2 size={14} className="spin" /> : <Wand2 size={14} />}
              </button>
            </div>
            <textarea 
              className="form-control" 
              name="description" 
              value={formData.description}
              maxLength={LIMITS.description}
              onChange={handleInputChange} 
            />
            <span className="char-count">{formData.description.length} / {LIMITS.description}</span>
          </div>
          
          <hr style={{ borderColor: 'var(--border-color)', margin: '1rem 0' }} />
          
          <div className="form-group stagger-item" style={{ animationDelay: '0.4s' }}>
            <label>Hero Image</label>
            <input 
              type="file" 
              className="form-control" 
              name="heroImage" 
              accept="image/*"
              onChange={handleImageUpload} 
            />
          </div>

          <div className="form-group stagger-item" style={{ animationDelay: '0.45s' }}>
            <label>Swatch Image</label>
            <input 
              type="file" 
              className="form-control" 
              name="swatchImage" 
              accept="image/*"
              onChange={handleImageUpload} 
            />
          </div>

          <hr style={{ borderColor: 'var(--border-color)', margin: '1rem 0' }} />
          
          <div className="form-group stagger-item" style={{ animationDelay: '0.5s' }}>
            <div className="label-row">
              <label>Partner / Location Name</label>
              <button 
                className="ai-wand-btn" 
                onClick={() => handleGenerateAI('partnerName')}
                disabled={isGenerating.partnerName}
                title="Generate with AI"
              >
                {isGenerating.partnerName ? <Loader2 size={14} className="spin" /> : <Wand2 size={14} />}
              </button>
            </div>
            <input 
              type="text" 
              className="form-control" 
              name="partnerName" 
              value={formData.partnerName}
              maxLength={LIMITS.partnerName}
              onChange={handleInputChange} 
            />
            <span className="char-count">{formData.partnerName.length} / {LIMITS.partnerName}</span>
          </div>

          <div className="form-group stagger-item" style={{ animationDelay: '0.55s' }}>
            <div className="label-row">
              <label>Contact Info</label>
              <button 
                className="ai-wand-btn" 
                onClick={() => handleGenerateAI('partnerContact')}
                disabled={isGenerating.partnerContact}
                title="Generate with AI"
              >
                {isGenerating.partnerContact ? <Loader2 size={14} className="spin" /> : <Wand2 size={14} />}
              </button>
            </div>
            <input 
              type="text" 
              className="form-control" 
              name="partnerContact" 
              value={formData.partnerContact}
              maxLength={LIMITS.partnerContact}
              onChange={handleInputChange} 
            />
            <span className="char-count">{formData.partnerContact.length} / {LIMITS.partnerContact}</span>
          </div>

          <div className="form-group stagger-item" style={{ animationDelay: '0.6s' }}>
            <label>Custom Brand Logo</label>
            <input 
              type="file" 
              className="form-control" 
              name="partnerLogo" 
              accept="image/*"
              onChange={handleImageUpload} 
            />
          </div>
        </section>
        )}

        {/* Live Preview */}
        <section className="preview-panel">
          {/* Action Bar for Exprots */}
          <div className="action-bar stagger-item" style={{ animationDelay: '0.25s' }}>
            <button className="btn btn-outline" onClick={() => setIsFullscreen(!isFullscreen)}>
              {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
              {isFullscreen ? 'Exit Full Screen' : 'Full Screen'}
            </button>
            <button className="btn btn-outline" onClick={handlePrint} disabled={assetType === 'social' || isExporting}>
              <Printer size={18} /> Print PDF
            </button>
            <button className="btn btn-outline" onClick={handleDownloadImage} disabled={isExporting}>
              <Download size={18} /> Download Image
            </button>
            <button className="btn btn-primary" onClick={handleBatchDownload} disabled={isExporting}>
              <Archive size={18} /> {isExporting ? 'Exporting...' : 'Export All (ZIP)'}
            </button>
          </div>

          <div className="preview-document" ref={previewRef}>
             {assetType === 'flyer' && <FlyerPreview formData={formData} />}
             {assetType === 'social' && <SocialPreview formData={formData} />}
             {assetType === 'brochure' && <BrochurePreview formData={formData} />}
          </div>
        </section>
      </main>

      {/* Hidden container for batch export captures */}
      <div style={{ position: 'absolute', left: '-9999px', top: '-9999px', zIndex: -1 }}>
         <div ref={flyerRef}><FlyerPreview formData={formData} /></div>
         <div ref={socialRef}><SocialPreview formData={formData} /></div>
         <div ref={brochureRef}><BrochurePreview formData={formData} /></div>
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="modal-overlay">
          <div className="review-modal">
            <div className="review-header">
              <h2>Review Marketing Assets</h2>
              <button className="btn btn-outline" style={{ padding: '0.5rem' }} onClick={() => setShowReviewModal(false)}>
                <X size={20} />
              </button>
            </div>
            
            <div className="review-body">
              <div className="review-grid">
                <div className="review-item">
                  <h4>Marketing Flyer</h4>
                  <div className="review-preview-container">
                    <div style={{ transform: 'scale(0.35)', transformOrigin: 'top center', width: '816px' }}>
                      <FlyerPreview formData={formData} />
                    </div>
                  </div>
                </div>
                
                <div className="review-item">
                  <h4>Social Media Post</h4>
                  <div className="review-preview-container">
                    <div style={{ transform: 'scale(0.35)', transformOrigin: 'top center', width: '1080px' }}>
                      <SocialPreview formData={formData} />
                    </div>
                  </div>
                </div>

                <div className="review-item">
                  <h4>Full Brochure</h4>
                  <div className="review-preview-container">
                    <div style={{ transform: 'scale(0.35)', transformOrigin: 'top center', width: '1056px' }}>
                      <BrochurePreview formData={formData} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="review-footer">
              <button className="btn btn-outline" onClick={() => setShowReviewModal(false)} disabled={isExporting}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={confirmBatchDownload} disabled={isExporting}>
                <Archive size={18} /> {isExporting ? 'Packaging ZIP...' : 'Confirm & Export All'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-notification">
          {toastMessage}
        </div>
      )}
    </div>
  );
}

export default App;
