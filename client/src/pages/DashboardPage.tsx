// /client/src/pages/DashboardPage.tsx
import React, { useEffect, useState } from 'react';
import assetService, { type Asset } from '../services/assetService';
import { AddAssetModal } from '../components/AddAssetModal';
import { RebalanceModal } from '../components/RebalanceModal';
import { PortfolioCharts } from '../components/PortfolioCharts';

export function DashboardPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRebalanceModal, setShowRebalanceModal] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);

  const loadAssets = async () => {
    try {
      const data = await assetService.getAll();
      setAssets(data);
    } catch (err) {
      console.error('Failed to load assets', err);
      setError('Failed to load your portfolio.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssets();
  }, []);

  const formatCurrency = (value: number, currency: string) => {
    return new Intl.NumberFormat(currency === 'BRL' ? 'pt-BR' : 'en-US', {
      style: 'currency',
      currency: currency,
    }).format(value);
  };

  const handleEdit = (asset: Asset) => {
    setEditingAsset(asset);
    setShowAddModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this asset?')) return;
    try {
      await assetService.remove(id);
      setAssets(assets.filter((asset) => asset.id !== id));
    } catch (err) {
      alert('Failed to delete asset');
    }
  };

  const handleAddNew = () => {
    setEditingAsset(null);
    setShowAddModal(true);
  };

  // Totals Calculation
  const totalBRL = assets
    .filter(a => a.currency === 'BRL')
    .reduce((sum, a) => sum + Number(a.current_value), 0);

  const totalUSD = assets
    .filter(a => a.currency === 'USD')
    .reduce((sum, a) => sum + Number(a.current_value), 0);

  const totalValue = totalBRL + (totalUSD * 6.00); // Approximate total for display

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <div className="alert alert-danger m-4">{error}</div>;

  return (
    <div className="pb-5">
      
      <div className="col-md-4 mb-3 mb-md-0">
        <div className="card-custom p-3 h-100 border-start border-primary border-4">
          <small className="text-muted text-uppercase fw-bold">Total Balance</small>
          <h3 className="fw-bold text-dark mb-0">{formatCurrency(totalValue, 'BRL')}</h3>
        </div>
      </div>
      <div className="row mb-4">
        <div className="col-md-4 mb-3 mb-md-0">
          <div className="card-custom p-3 h-100 border-start border-primary border-4">
            <small className="text-muted text-uppercase fw-bold">BRL Total</small>
            <h3 className="fw-bold text-dark mb-0">{formatCurrency(totalBRL, 'BRL')}</h3>
          </div>
        </div>
        
        <div className="col-md-4 mb-3 mb-md-0">
           <div className="card-custom p-3 h-100">
            <small className="text-muted text-uppercase fw-bold">USD Total</small>
            <h4 className="fw-bold text-dark mb-0">{formatCurrency(totalUSD, 'USD')}</h4>
          </div>
        </div>
      </div>

      {assets.length > 0 && (
        <PortfolioCharts assets={assets} />
      )}

      <div className="card-custom p-0 overflow-hidden">
        

        <div className="d-flex justify-content-between align-items-center p-4 bg-white border-bottom">
          <div>
            <h4 className="fw-bold mb-0">My Assets</h4>
            <small className="text-muted">Manage your allocation</small>
          </div>
          
          <div className="d-flex gap-2">
            <button 
              className="btn btn-outline-primary"
              onClick={() => setShowRebalanceModal(true)}
            >
              Rebalance
            </button>
            <button 
              className="btn btn-primary"
              onClick={handleAddNew}
            >
              + Add Asset
            </button>
          </div>
        </div>

        {assets.length === 0 ? (
           <div className="text-center py-5">
             <p className="text-muted">No assets found.</p>
           </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="bg-light text-muted text-uppercase small">
                <tr>
                  <th className="py-3 ps-4">Asset</th>
                  <th className="py-3">Category</th>
                  <th className="py-3">Target</th>
                  <th className="py-3">Value</th>
                  <th className="text-end py-3 pe-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {assets.map((asset) => (
                  <tr key={asset.id}>
                    <td className="ps-4 py-3 fw-bold text-dark">{asset.name}</td>
                    <td><span className="badge bg-light text-dark border">{asset.currency}</span></td>
                    <td>
                      <div className="d-flex align-items-center" style={{maxWidth: '150px'}}>
                         <span className="me-2 text-muted small">{asset.target_percentage}%</span>
                         <div className="progress flex-grow-1" style={{height: '4px'}}>
                           <div className="progress-bar bg-primary" style={{width: `${asset.target_percentage}%`}}></div>
                         </div>
                      </div>
                    </td>
                    <td className="fw-medium">{formatCurrency(Number(asset.current_value), asset.currency)}</td>
                    <td className="text-end pe-4">
                      <button 
                        className="btn btn-sm btn-link text-primary text-decoration-none me-2"
                        onClick={(e) => { e.stopPropagation(); handleEdit(asset); }}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn btn-sm btn-link text-danger text-decoration-none p-0"
                        onClick={(e) => { e.stopPropagation(); handleDelete(asset.id); }}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AddAssetModal 
        show={showAddModal} 
        onClose={() => setShowAddModal(false)} 
        onAssetSaved={loadAssets} 
        assetToEdit={editingAsset}
      />
      
      <RebalanceModal 
        show={showRebalanceModal} 
        onClose={() => setShowRebalanceModal(false)} 
      />
    </div>
  );
}