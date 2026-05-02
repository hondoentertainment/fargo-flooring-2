import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  Layers, 
  ArrowRight, 
  Menu, 
  Star,
  TreePine,
  LayoutGrid
} from 'lucide-react';
import './LandingPage.css';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <Helmet>
        <title>Fargo Flooring Professionals | Expert Hardwood & Tile Installation</title>
        <meta name="description" content="Premium flooring installations with a 50-year warranty. Get a free estimate for hardwood, laminate, and tile." />
      </Helmet>
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="nav-container">
          <div className="brand-logo">
            <div className="brand-icon">
              <Layers size={20} />
            </div>
            <span className="font-heading" style={{ fontWeight: 'bold', fontSize: '1.5rem', letterSpacing: '-0.025em' }}>Fargo Flooring</span>
          </div>
          
          <div className="nav-links">
            <a href="#services" className="nav-link">Services</a>
            <a href="#process" className="nav-link">Our Process</a>
            <a href="#portfolio" className="nav-link">Portfolio</a>
          </div>

          <a href="#contact" className="hero-btn-primary btn-nav" style={{ padding: '0.6rem 1.25rem' }}>
            <span>Get a Free Estimate</span>
            <ArrowRight size={16} />
          </a>

          <button className="md-hidden" style={{ background: 'transparent', border: 'none', color: 'white', display: 'block' }}>
            <Menu size={24} />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-glow-bg"></div>
        
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <Star size={12} />
              <span>Premium Flooring Professionals</span>
            </div>
            
            <h1 className="hero-title">
              Transform Your Home With <span className="text-transparent-gradient">Expert Flooring</span>
            </h1>
            
            <p className="hero-description">
              High-quality hardwood, laminate, and tile installations backed by our 50-year residential warranty. Experience craftsmanship that lasts a lifetime.
            </p>
            
            <div className="hero-buttons">
              <a href="#contact" className="hero-btn-primary">
                <span>Get a Free Estimate</span>
                <ArrowRight size={16} />
              </a>
              <button 
                onClick={() => navigate('/generator')} 
                className="hero-btn-secondary"
              >
                <span>Partner Portal</span>
              </button>
            </div>
            
            <div className="hero-social-proof">
              <div className="avatars">
                <img src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-1.jpg" alt="" />
                <img src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg" alt="" />
                <img src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg" alt="" />
              </div>
              <div>
                <div className="stars">
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                  Trusted by 500+ homeowners
                </p>
              </div>
            </div>
          </div>
          
          <div className="hero-visual">
            <div className="visual-glow-1"></div>
            <div className="visual-glow-2"></div>
            
            <div className="hero-card">
              <div className="card-img-container">
                <img src="https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&q=80&w=1000" alt="Engineered hardwood flooring" />
                <div className="card-price">$4.99 / sq ft</div>
              </div>
              
              <div className="card-swatch">
                <img src="https://images.unsplash.com/photo-1521783593447-5702b9bfd267?auto=format&fit=crop&q=80&w=400" alt="Wood texture swatch" />
              </div>
              
              <div className="card-content">
                <h3>Natural Oak Engineered Hardwood</h3>
                <p>Premium wide plank flooring perfect for modern homes.</p>
                
                <div className="card-specs">
                  <h4>Specifications</h4>
                  <ul>
                    <li><strong>Dimensions:</strong> 7.5" x 72" Planks</li>
                    <li><strong>Warranty:</strong> 50-Year Residential</li>
                    <li><strong>Finish:</strong> Premium Aluminum Oxide</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="services-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="font-heading">Our Flooring Services</h2>
            <p>We specialize in a variety of premium flooring options to suit your style, budget, and lifestyle needs.</p>
          </div>
          
          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon">
                <TreePine size={24} />
              </div>
              <h3 className="font-heading">Hardwood Flooring</h3>
              <p>Timeless elegance and durability. Choose from solid or engineered hardwood in various species, stains, and finishes to perfectly match your home's aesthetic.</p>
              <a href="#contact" className="service-link">
                Learn more <ArrowRight size={12} />
              </a>
            </div>

            <div className="service-card">
              <div className="service-icon">
                <Layers size={24} />
              </div>
              <h3 className="font-heading">Laminate & Vinyl</h3>
              <p>Durable, water-resistant, and budget-friendly. Modern luxury vinyl plank (LVP) offers the look of real wood with incredible resilience for active households.</p>
              <a href="#contact" className="service-link">
                Learn more <ArrowRight size={12} />
              </a>
            </div>

            <div className="service-card">
              <div className="service-icon">
                <LayoutGrid size={24} />
              </div>
              <h3 className="font-heading">Tile & Stone</h3>
              <p>Perfect for kitchens, bathrooms, and entryways. We install ceramic, porcelain, and natural stone tiles with precision and care for a flawless finish.</p>
              <a href="#contact" className="service-link">
                Learn more <ArrowRight size={12} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="process" className="process-section">
        <div className="section-container process-flex">
          <div className="process-content">
            <h2 className="font-heading">Our Simple Process to Beautiful Floors</h2>
            <p>We've streamlined our installation process to ensure minimal disruption to your daily life while delivering exceptional results.</p>
            
            <div className="process-steps">
              <div className="step">
                <div className="step-number">1</div>
                <div>
                  <h4 className="font-heading">Free Consultation</h4>
                  <p>We visit your home, measure the space, and help you select the perfect materials.</p>
                </div>
              </div>
              <div className="step">
                <div className="step-number">2</div>
                <div>
                  <h4 className="font-heading">Detailed Estimate</h4>
                  <p>Receive a transparent, no-obligation quote outlining all costs and timelines.</p>
                </div>
              </div>
              <div className="step">
                <div className="step-number">3</div>
                <div>
                  <h4 className="font-heading">Professional Installation</h4>
                  <p>Our expert team installs your new floors with precision, respecting your home throughout.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="process-images">
            <img src="https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=600" alt="Flooring installation process" />
            <img src="https://images.unsplash.com/photo-1581858726105-021b191c7820?auto=format&fit=crop&q=80&w=600" alt="Finished floor" />
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="portfolio-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="font-heading">Marketing Portfolio</h2>
            <p>See the high-fidelity marketing assets our generator creates for flooring professionals.</p>
          </div>
          
          <div className="portfolio-grid">
            <div className="portfolio-item">
              <div className="portfolio-img-wrapper">
                <img src="/portfolio_flyer.png" alt="Marketing Flyer Example" />
                <div className="portfolio-overlay">
                  <span>View Flyer</span>
                </div>
              </div>
              <h3 className="font-heading">Print Flyers</h3>
            </div>

            <div className="portfolio-item">
              <div className="portfolio-img-wrapper">
                <img src="/portfolio_social.png" alt="Social Media Post Example" />
                <div className="portfolio-overlay">
                  <span>View Social Post</span>
                </div>
              </div>
              <h3 className="font-heading">Social Media</h3>
            </div>

            <div className="portfolio-item">
              <div className="portfolio-img-wrapper">
                <img src="/portfolio_brochure.png" alt="Tri-fold Brochure Example" />
                <div className="portfolio-overlay">
                  <span>View Brochure</span>
                </div>
              </div>
              <h3 className="font-heading">Tri-Fold Brochures</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact-section">
        <div className="contact-container">
          <div className="contact-card">
            <div className="contact-header">
              <h2 className="font-heading">Ready to upgrade your floors?</h2>
              <p>Fill out the form below and we'll get back to you within 24 hours.</p>
            </div>
            
            <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
              <div className="form-row">
                <div className="form-group">
                  <label>First Name</label>
                  <input type="text" className="form-input" placeholder="John" />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input type="text" className="form-input" placeholder="Doe" />
                </div>
              </div>
              
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" className="form-input" placeholder="john@example.com" />
              </div>
              
              <div className="form-group">
                <label>Project Details</label>
                <textarea rows={4} className="form-input" placeholder="Tell us about your flooring project..."></textarea>
              </div>
              
              <button type="submit" className="btn-submit font-heading">
                Request Free Estimate
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-container">
          <div className="footer-brand">
            <div className="footer-icon">
              <Layers size={14} />
            </div>
            <span>Fargo Flooring</span>
          </div>
          
          <div className="footer-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <span className="footer-copyright">© 2026 Fargo Flooring Professionals.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
