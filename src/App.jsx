import { useState, useRef } from 'react';
import { 
  FileBox, 
  Image as ImageIcon, 
  BookOpen, 
  Layout, 
  Download,
  Printer
} from 'lucide-react';
import html2canvas from 'html2canvas';
import FlyerPreview from './components/FlyerPreview';
import SocialPreview from './components/SocialPreview';
import './App.css';

function App() {
  const [assetType, setAssetType] = useState('flyer'); 
  
  const [formData, setFormData] = useState({
    productName: 'Natural Oak Engineered Hardwood',
    price: '$4.99 / sq ft',
    dimensions: '7.5" x 72" Planks',
    warranty: '50-Year Residential Warranty',
    description: 'A beautiful, durable, and water-resistant flooring option perfect for active homes. Ideal for showcasing open floor plans.',
    partnerName: 'Fargo Flooring Professionals',
    partnerContact: 'sales@fargoflooring.com | (555) 123-4567'
  });

  const previewRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
    <div className="app-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar glass-panel">
        <div className="brand-header">
          <Layout size={24} color="var(--accent-sapphire)" />
          <span>Fargo Generator</span>
        </div>
        
        <button 
          className={`nav-item ${assetType === 'flyer' ? 'active' : ''}`}
          onClick={() => setAssetType('flyer')}
        >
          <FileBox size={18} />
          Marketing Flyer
        </button>
        
        <button 
          className={`nav-item ${assetType === 'social' ? 'active' : ''}`}
          onClick={() => setAssetType('social')}
        >
          <ImageIcon size={18} />
          Social Post
        </button>
        
        <button 
          className={`nav-item ${assetType === 'brochure' ? 'active' : ''}`}
          onClick={() => setAssetType('brochure')}
        >
          <BookOpen size={18} />
          Full Brochure
        </button>
      </aside>

      <main className="main-content">
        {/* Editor Form */}
        <section className="editor-panel glass-panel">
          <h3>Edit Details</h3>
          
          <div className="form-group">
            <label>Product Name</label>
            <input 
              type="text" 
              className="form-control" 
              name="productName" 
              value={formData.productName}
              onChange={handleInputChange} 
            />
          </div>
          
          <div className="form-group">
            <label>Price</label>
            <input 
              type="text" 
              className="form-control" 
              name="price" 
              value={formData.price}
              onChange={handleInputChange} 
            />
          </div>

          <div className="form-group">
            <label>Dimensions</label>
            <input 
              type="text" 
              className="form-control" 
              name="dimensions" 
              value={formData.dimensions}
              onChange={handleInputChange} 
            />
          </div>
          
          <div className="form-group">
            <label>Warranty</label>
            <input 
              type="text" 
              className="form-control" 
              name="warranty" 
              value={formData.warranty}
              onChange={handleInputChange} 
            />
          </div>
          
          <div className="form-group">
            <label>Description</label>
            <textarea 
              className="form-control" 
              name="description" 
              value={formData.description}
              onChange={handleInputChange} 
            />
          </div>
          
          <hr style={{ borderColor: 'var(--border-color)', margin: '1rem 0' }} />
          
          <div className="form-group">
            <label>Partner / Location Name</label>
            <input 
              type="text" 
              className="form-control" 
              name="partnerName" 
              value={formData.partnerName}
              onChange={handleInputChange} 
            />
          </div>

          <div className="form-group">
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

        {/* Live Preview */}
        <section className="preview-panel">
          {/* Action Bar for Exprots */}
          <div className="action-bar glass-panel">
            <button className="btn btn-outline" onClick={handlePrint} disabled={assetType !== 'flyer'}>
              <Printer size={18} /> Print PDF
            </button>
            <button className="btn btn-primary" onClick={handleDownloadImage}>
              <Download size={18} /> Download Image
            </button>
          </div>

          <div className="preview-document" ref={previewRef}>
             {assetType === 'flyer' && <FlyerPreview formData={formData} />}
             {assetType === 'social' && <SocialPreview formData={formData} />}
             {assetType === 'brochure' && (
               <div style={{ color: 'white', padding: '4rem', textAlign: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
                 <h2>Tri-Fold Brochure Template</h2>
                 <p>Coming Soon in Phase 2</p>
               </div>
             )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
