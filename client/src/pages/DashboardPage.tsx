// /client/src/pages/DashboardPage.tsx
import React, { useEffect, useState } from 'react';
import assetService, { type Asset } from '../services/assetService';
import { AddAssetModal } from '../components/AddAssetModal';

export function DashboardPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

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

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this asset?')) return;
    try {
      await assetService.remove(id);
      setAssets(assets.filter((asset) => asset.id !== id));
    } catch (err) {
      alert('Failed to delete asset');
    }
  };

  // Calculate Total Portfolio Value ---
  const totalValue = assets.reduce((sum, asset) => sum + Number(asset.current_value), 0);

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div>
      <div className="row align-items-center mb-4">
        <div className="col">
          <h1 className="fw-bold mb-0">My Portfolio</h1>
          <p className="text-muted">Overview of your asset allocation.</p>
        </div>
        <div className="col-auto">
          <button 
            className="btn btn-primary px-4 py-2"
            onClick={() => setShowAddModal(true)}
          >
            + Add Asset
          </button>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card-custom p-4 d-flex flex-column justify-content-center h-100">
            <h6 className="text-uppercase text-muted fw-bold" style={{ fontSize: '0.8rem' }}>Total Balance</h6>
            <h2 className="fw-bold text-primary mb-0">
              {formatCurrency(totalValue, 'BRL')}
            </h2>
            <small className="text-muted mt-2">{assets.length} Assets tracked</small>
          </div>
        </div>
      </div>

      {assets.length === 0 ? (
        <div className="card-custom text-center py-5">
          <h4 className="fw-bold text-muted">Your portfolio is empty</h4>
          <p className="text-muted mb-4">Add assets to see your balance and rebalancing suggestions.</p>
          <button className="btn btn-outline-primary" onClick={() => setShowAddModal(true)}>
            Add Your First Asset
          </button>
        </div>
      ) : (
        <div className="card-custom p-0 overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="bg-light">
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
                    <td className="ps-4 py-3 fw-bold">{asset.name}</td>
                    <td><span className="badge bg-light text-dark border">{asset.currency}</span></td>
                    <td>
                      <div className="d-flex align-items-center">
                        <span className="me-2" style={{ width: '40px' }}>{asset.target_percentage}%</span>
                        <div className="progress flex-grow-1" style={{ height: '6px' }}>
                          <div className="progress-bar" style={{ width: `${asset.target_percentage}%` }}></div>
                        </div>
                      </div>
                    </td>
                    <td className="fw-medium">{formatCurrency(Number(asset.current_value), asset.currency)}</td>
                    <td className="text-end pe-4">
                      <button className="btn btn-sm btn-link text-danger text-decoration-none" onClick={() => handleDelete(asset.id)}>
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <AddAssetModal 
        show={showAddModal} 
        onClose={() => setShowAddModal(false)} 
        onAssetAdded={loadAssets} 
      />
    </div>
  );
}