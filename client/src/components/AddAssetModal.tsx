// /client/src/components/AddAssetModal.tsx
import React, { useState, useEffect } from 'react';
import assetService, { type NewAsset, type Asset } from '../services/assetService';
import { getErrorMessage } from '../utils/errorHandler';

interface AddAssetModalProps {
  show: boolean;
  onClose: () => void;
  onAssetSaved: () => void;
  assetToEdit?: Asset | null;
}

export function AddAssetModal({
  show,
  onClose,
  onAssetSaved,
  assetToEdit,
}: Readonly<AddAssetModalProps>) {
  const [name, setName] = useState('');
  const [currency, setCurrency] = useState<'USD' | 'BRL'>('BRL');
  const [targetPercentage, setTargetPercentage] = useState('');
  const [currentValue, setCurrentValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (show && assetToEdit) {
      setName(assetToEdit.name);
      setCurrency(assetToEdit.currency);
      setTargetPercentage(assetToEdit.target_percentage.toString());
      setCurrentValue(assetToEdit.current_value.toString());
    } else if (show && !assetToEdit) {
      setName('');
      setCurrency('BRL');
      setTargetPercentage('');
      setCurrentValue('');
    }
    setError(null);
  }, [show, assetToEdit]);

  if (!show) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const assetData: NewAsset = {
        name,
        currency,
        target_percentage: Number.parseFloat(targetPercentage),
        current_value: Number.parseFloat(currentValue),
      };

      if (assetToEdit) {
        await assetService.update(assetToEdit.id, assetData);
      } else {
        await assetService.create(assetData);
      }

      onAssetSaved();
      onClose();
    } catch (err) {
      const message = getErrorMessage(err, 'Failed to save asset');
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{assetToEdit ? 'Edit Asset' : 'Add New Asset'}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body">
            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="assetName" className="form-label">
                  Asset Name
                </label>
                <input
                  id="assetName"
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="currency" className="form-label">
                  Currency
                </label>
                <select
                  id="currency"
                  className="form-select"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as 'USD' | 'BRL')}
                >
                  <option value="BRL">BRL (R$)</option>
                  <option value="USD">USD ($)</option>
                </select>
              </div>

              <div className="mb-3">
                <label htmlFor="targetPercentage" className="form-label">
                  Target Allocation (%)
                </label>
                <input
                  id="targetPercentage"
                  type="number"
                  step="0.01"
                  className="form-control"
                  value={targetPercentage}
                  onChange={(e) => setTargetPercentage(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="currentValue" className="form-label">
                  Current Value
                </label>
                <input
                  id="currentValue"
                  type="number"
                  step="0.01"
                  className="form-control"
                  value={currentValue}
                  onChange={(e) => setCurrentValue(e.target.value)}
                  required
                />
              </div>

              <div className="d-flex justify-content-end gap-2">
                <button type="button" className="btn btn-secondary" onClick={onClose}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : assetToEdit ? 'Update Asset' : 'Save Asset'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
