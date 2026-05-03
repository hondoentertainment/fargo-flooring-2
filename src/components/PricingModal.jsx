import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import './PricingModal.css';

// Load Stripe with public key from env
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_placeholder');

export default function PricingModal({ isOpen, onClose }) {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubscribe = async (tier) => {
    setLoading(true);
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier })
      });
      
      const { sessionId, error } = await response.json();
      if (error) throw new Error(error);

      const stripe = await stripePromise;
      await stripe.redirectToCheckout({ sessionId });
    } catch (error) {
      console.error('Error redirecting to checkout:', error);
      alert('Failed to initiate checkout. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content pricing-modal">
        <button className="modal-close" onClick={onClose}><X size={20} /></button>
        <h2 className="font-heading">Upgrade Your Plan</h2>
        <p className="pricing-subtitle">Remove watermarks and get access to premium export features.</p>
        
        <div className="pricing-grid">
          {/* Free Tier */}
          <div className="pricing-card">
            <h3>Starter</h3>
            <div className="price">$0<span>/mo</span></div>
            <ul className="features">
              <li><Check size={16} /> 10 AI Generations/mo</li>
              <li><Check size={16} /> Standard Templates</li>
              <li><Check size={16} /> Web-quality PNG export</li>
              <li className="missing">Fargo Flooring Watermark</li>
            </ul>
            <button className="pricing-btn secondary" onClick={onClose}>Current Plan</button>
          </div>

          {/* Pro Tier */}
          <div className="pricing-card premium">
            <div className="popular-badge">Most Popular</div>
            <h3>Pro</h3>
            <div className="price">$29<span>/mo</span></div>
            <ul className="features">
              <li><Check size={16} /> Unlimited AI Generations</li>
              <li><Check size={16} /> High-fidelity PDF exports</li>
              <li><Check size={16} /> Custom Logos</li>
              <li><Check size={16} /> No Watermarks</li>
            </ul>
            <button 
              className="pricing-btn primary" 
              onClick={() => handleSubscribe('pro')}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Upgrade to Pro'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
