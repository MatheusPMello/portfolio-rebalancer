// /client/src/components/RebalanceModal.tsx
import React, { useState } from 'react';
import rebalanceService, {
  type RebalanceResponse,
} from '../services/rebalanceService';

interface RebalanceModalProps {
  show: boolean;
  onClose: () => void;
}

export function RebalanceModal({ show, onClose }: RebalanceModalProps) {
  // UI State
  const [step, setStep] = useState<'INPUT' | 'RESULT'>('INPUT');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<'BRL' | 'USD'>('BRL');

  // Data State
  const [result, setResult] = useState<RebalanceResponse | null>(null);

  if (!show) return null;

  // Helper to format money
  const formatMoney = (val: number, curr: string) => {
    return new Intl.NumberFormat(curr === 'BRL' ? 'pt-BR' : 'en-US', {
      style: 'currency',
      currency: curr,
    }).format(val);
  };

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await rebalanceService.calculate(Number(amount), currency);
      setResult(data);
      setStep('RESULT');
    } catch (err: any) {
      console.error(err);
      setError('Failed to calculate. check if your portfolio is valid.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep('INPUT');
    setResult(null);
    setAmount('');
    onClose();
  };

  return (
    <div
      className="modal d-block"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title fw-bold">
              {step === 'INPUT'
                ? 'Rebalance Calculator'
                : 'Smart Allocation Plan'}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={handleReset}
            ></button>
          </div>

          <div className="modal-body">
            {error && <div className="alert alert-danger">{error}</div>}

            {step === 'INPUT' && (
              <form onSubmit={handleCalculate}>
                <p className="text-muted">
                  Enter the amount you want to invest. We will calculate the
                  perfect distribution to hit your targets.
                </p>
                <div className="row mb-3">
                  <div className="col-md-8">
                    <label className="form-label">Contribution Amount</label>
                    <input
                      type="number"
                      className="form-control form-control-lg"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Currency</label>
                    <select
                      className="form-select form-select-lg"
                      value={currency}
                      onChange={(e) =>
                        setCurrency(e.target.value as 'BRL' | 'USD')
                      }
                    >
                      <option value="BRL">BRL (R$)</option>
                      <option value="USD">USD ($)</option>
                    </select>
                  </div>
                </div>
                <div className="d-flex justify-content-end">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    disabled={loading}
                  >
                    {loading ? 'Calculating...' : 'Calculate Plan'}
                  </button>
                </div>
              </form>
            )}

            {step === 'RESULT' && result && (
              <div>
                <div className="alert alert-success d-flex align-items-center">
                  <i className="bi bi-check-circle-fill me-2"></i>
                  <div>
                    <strong>Plan Ready:</strong> Distribute your
                    <strong>
                      {' '}
                      {formatMoney(
                        result.contribution,
                        result.mainCurrency,
                      )}{' '}
                    </strong>
                    as follows:
                  </div>
                </div>

                {result.suggestions.length === 0 ? (
                  <div className="text-center py-4">
                    <h5>Nothing to do! 🎉</h5>
                    <p className="text-muted">
                      Your portfolio is already perfectly balanced.
                    </p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover align-middle">
                      <thead className="table-light">
                        <tr>
                          <th>Asset to Buy</th>
                          <th>Target %</th>
                          <th>Current %</th>
                          <th className="text-end text-success">
                            Amount to Buy
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.suggestions.map((item) => (
                          <tr key={item.assetId}>
                            <td className="fw-bold">{item.name}</td>
                            <td>{item.targetPercentage}%</td>
                            <td className="text-muted">
                              {item.currentPercentage}%
                            </td>
                            <td className="text-end fw-bold text-success fs-5">
                              + {formatMoney(item.amountToBuy, item.currency)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>

          {step === 'RESULT' && (
            <div className="modal-footer bg-light">
              <button
                className="btn btn-outline-secondary"
                onClick={() => setStep('INPUT')}
              >
                Back
              </button>
              <button className="btn btn-success" onClick={handleReset}>
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
