import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Layout, LogOut, ArrowLeft, Trash2, Edit2, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import './Dashboard.css';

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    const fetchAssets = async () => {
      try {
        const { data, error } = await supabase
          .from('saved_assets')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setAssets(data || []);
      } catch (err) {
        console.error("Error fetching assets:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssets();
  }, [user, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleEdit = (asset) => {
    // Load the asset data into localStorage to resume editing
    localStorage.setItem('fargo-form', JSON.stringify(asset.form_data));
    navigate('/generator');
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this asset?")) return;

    try {
      const { error } = await supabase
        .from('saved_assets')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setAssets(assets.filter(a => a.id !== id));
    } catch (err) {
      console.error("Error deleting asset:", err);
      alert("Failed to delete asset.");
    }
  };

  if (!user) return null;

  return (
    <div className="dashboard-page">
      <Helmet>
        <title>Dashboard | Fargo Flooring</title>
      </Helmet>

      <nav className="dashboard-nav">
        <div className="nav-brand">
          <Layout className="logo-icon" size={24} />
          <span className="font-heading">Fargo Dashboard</span>
        </div>
        <div className="nav-actions">
          <span className="user-email">{user.email}</span>
          <button className="btn btn-outline" onClick={() => navigate('/generator')}>
            New Campaign
          </button>
          <button className="btn btn-outline" onClick={handleSignOut}>
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </nav>

      <main className="dashboard-main">
        <div className="dashboard-header">
          <button className="back-link" onClick={() => navigate('/')}>
            <ArrowLeft size={16} /> Back to Home
          </button>
          <h1 className="font-heading">My Portfolio</h1>
          <p>View and manage your saved marketing assets.</p>
        </div>

        {loading ? (
          <div className="loading-state">
            <Loader2 className="spin" size={32} />
            <p>Loading your portfolio...</p>
          </div>
        ) : assets.length === 0 ? (
          <div className="empty-state">
            <Layout size={48} className="empty-icon" />
            <h3>No assets found</h3>
            <p>You haven't saved any marketing campaigns yet.</p>
            <button className="btn btn-primary" onClick={() => navigate('/generator')}>
              Create Your First Campaign
            </button>
          </div>
        ) : (
          <div className="assets-grid">
            {assets.map((asset) => (
              <div key={asset.id} className="asset-card">
                <div className="asset-header">
                  <span className="asset-type">{asset.asset_type.toUpperCase()}</span>
                  <span className="asset-date">
                    {new Date(asset.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="asset-body">
                  <h4>{asset.form_data.productName || 'Untitled Product'}</h4>
                  <p>{asset.form_data.partnerName || 'Unknown Partner'}</p>
                </div>
                <div className="asset-footer">
                  <button className="action-btn" onClick={() => handleEdit(asset)} title="Edit">
                    <Edit2 size={16} /> Edit
                  </button>
                  <button className="action-btn delete" onClick={() => handleDelete(asset.id)} title="Delete">
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
