// /client/src/components/AddAssetModal.tsx
import React, { useState } from 'react';
import assetService, { type NewAsset } from '../services/assetService';

interface AddAssetModalProps {
  show: boolean;
  onClose: () => void;
  onAssetAdded: () => void;
}

export function AddAssetModal({ show, onClose, onAssetAdded }: AddAssetModalProps) {
  // FORM STATE
  const [name, setName] = useState('');
  const [currency, setCurrency] = useState<'USD' | 'BRL'>('BRL');
  const [targetPercentage, setTargetPercentage] = useState('');
  const [currentValue, setCurrentValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!show) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const newAsset: NewAsset = {
        name,
        currency,
        target_percentage: parseFloat(targetPercentage),
        current_value: parseFloat(currentValue),
      };


      await assetService.create(newAsset);


      setName('');
      setTargetPercentage('');
      setCurrentValue('');
      onAssetAdded();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add asset');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (

    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add New Asset</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          
          <div className="modal-body">
            {error && <div className="alert alert-danger">{error}</div>}
            
            <form onSubmit={handleSubmit}>

              <div className="mb-3">
                <label className="form-label">Asset Name (Ticker)</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="e.g., AAPL, PETR4, Tesouro Selic"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required 
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Currency</label>
                <select 
                  className="form-select" 
                  value={currency} 
                  onChange={e => setCurrency(e.target.value as 'USD' | 'BRL')}
                >
                  <option value="BRL">BRL (R$)</option>
                  <option value="USD">USD ($)</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Target Allocation (%)</label>
                <input 
                  type="number" 
                  step="0.01" 
                  className="form-control" 
                  placeholder="e.g., 25.5"
                  value={targetPercentage}
                  onChange={e => setTargetPercentage(e.target.value)}
                  required 
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Current Value</label>
                <input 
                  type="number" 
                  step="0.01" 
                  className="form-control" 
                  placeholder="e.g., 1000.00"
                  value={currentValue}
                  onChange={e => setCurrentValue(e.target.value)}
                  required 
                />
              </div>

              <div className="d-flex justify-content-end gap-2">
                <button type="button" className="btn btn-secondary" onClick={onClose}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save Asset'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}