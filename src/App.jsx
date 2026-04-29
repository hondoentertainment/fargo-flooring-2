import { useState, useRef } from 'react';
import { 
  FileBox, 
  Image as ImageIcon, 
  BookOpen, 
  Layout, 
  Download,
  Printer,
  Maximize2,
  Minimize2
} from 'lucide-react';
import html2canvas from 'html2canvas';
import FlyerPreview from './components/FlyerPreview';
import SocialPreview from './components/SocialPreview';
import BrochurePreview from './components/BrochurePreview';
import './App.css';

function App() {
  const [assetType, setAssetType] = useState('flyer'); 
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const [formData, setFormData] = useState({
    productName: 'Natural Oak Engineered Hardwood',
    price: '$4.99 / sq ft',
    dimensions: '7.5" x 72" Planks',
    warranty: '50-Year Residential Warranty',
    description: 'A beautiful, durable, and water-resistant flooring option perfect for active homes. Ideal for showcasing open floor plans.',
    partnerName: 'Fargo Flooring Professionals',
    partnerContact: 'sales@fargoflooring.com | (555) 123-4567',
    heroImage: '/interior.png',
    swatchImage: '/swatch.png'
  });

  const previewRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
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

  const handleDownloadImage = async () => {
    if (!previewRef.current) return;
    
    // We target the actual document inside the ref to avoid capturing the scaled container if possible,
    // but html2canvas handles transforms decently if targeting the node directly.
    const node = previewRef.current.firstElementChild;
    if (!node) return;

    try {
      // Temporarily revert any CSS scaling for a high-res capture
      const originalTransform = node.style.transform;
      node.style.transform = 'none';

      const canvas = await html2canvas(node, {
        scale: 2, // High resolution
        useCORS: true,
        backgroundColor: assetType === 'social' ? '#0d1117' : '#ffffff'
      });
      
      // Restore scaling
      node.style.transform = originalTransform;

      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `FargoAssets_${assetType}_${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to generate image", err);
      alert("Failed to generate image.");
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
      </aside>
      )}

      <main className="main-content">
        {/* Editor Form */}
        {!isFullscreen && (
        <section className="editor-panel stagger-item" style={{ animationDelay: '0.1s' }}>
          <h3>Edit Details</h3>
          
          <div className="form-group stagger-item" style={{ animationDelay: '0.15s' }}>
            <label>Product Name</label>
            <input 
              type="text" 
              className="form-control" 
              name="productName" 
              value={formData.productName}
              onChange={handleInputChange} 
            />
          </div>
          
          <div className="form-group stagger-item" style={{ animationDelay: '0.2s' }}>
            <label>Price</label>
            <input 
              type="text" 
              className="form-control" 
              name="price" 
              value={formData.price}
              onChange={handleInputChange} 
            />
          </div>

          <div className="form-group stagger-item" style={{ animationDelay: '0.25s' }}>
            <label>Dimensions</label>
            <input 
              type="text" 
              className="form-control" 
              name="dimensions" 
              value={formData.dimensions}
              onChange={handleInputChange} 
            />
          </div>
          
          <div className="form-group stagger-item" style={{ animationDelay: '0.3s' }}>
            <label>Warranty</label>
            <input 
              type="text" 
              className="form-control" 
              name="warranty" 
              value={formData.warranty}
              onChange={handleInputChange} 
            />
          </div>
          
          <div className="form-group stagger-item" style={{ animationDelay: '0.35s' }}>
            <label>Description</label>
            <textarea 
              className="form-control" 
              name="description" 
              value={formData.description}
              onChange={handleInputChange} 
            />
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
            <label>Partner / Location Name</label>
            <input 
              type="text" 
              className="form-control" 
              name="partnerName" 
              value={formData.partnerName}
              onChange={handleInputChange} 
            />
          </div>

          <div className="form-group stagger-item" style={{ animationDelay: '0.55s' }}>
            <label>Contact Info</label>
            <input 
              type="text" 
              className="form-control" 
              name="partnerContact" 
              value={formData.partnerContact}
              onChange={handleInputChange} 
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
            <button className="btn btn-outline" onClick={handlePrint} disabled={assetType === 'social'}>
              <Printer size={18} /> Print PDF
            </button>
            <button className="btn btn-primary" onClick={handleDownloadImage}>
              <Download size={18} /> Download Image
            </button>
          </div>

          <div className="preview-document" ref={previewRef}>
             {assetType === 'flyer' && <FlyerPreview formData={formData} />}
             {assetType === 'social' && <SocialPreview formData={formData} />}
             {assetType === 'brochure' && <BrochurePreview formData={formData} />}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
