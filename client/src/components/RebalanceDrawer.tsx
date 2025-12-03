// /client/src/components/RebalanceDrawer.tsx
import React, { useState, useEffect } from 'react';
import rebalanceService, {
  type RebalanceResponse,
} from '../services/rebalanceService';

interface RebalanceDrawerProps {
  show: boolean;
  onClose: () => void;
}

export function RebalanceDrawer({ show, onClose }: RebalanceDrawerProps) {
  // UI State
  const [step, setStep] = useState<'INPUT' | 'RESULT'>('INPUT');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<'BRL' | 'USD'>('BRL');

  // Data State
  const [result, setResult] = useState<RebalanceResponse | null>(null);

  // Reset state automatically whenever the drawer opens
  useEffect(() => {
    if (show) {
      // Small delay to allow animation to start before resetting
      setTimeout(() => {
        setStep('INPUT');
        setResult(null);
        setAmount('');
        setError(null);
      }, 100);
    }
  }, [show]);

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
      setError('Failed to calculate. Please check your portfolio targets.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Backdrop - Click to close */}
      <div
        className={`drawer-backdrop ${show ? 'show' : ''}`}
        onClick={onClose}
      ></div>

      {/* The Sliding Drawer */}
      <div className={`drawer ${show ? 'show' : ''}`}>
        {/* HEADER */}
        <div className="p-4 border-bottom d-flex justify-content-between align-items-center bg-light">
          <h5 className="fw-bold mb-0">
            {step === 'INPUT' ? 'Rebalance Portfolio' : 'Your Action Plan'}
          </h5>
          <button
            type="button"
            className="btn-close"
            onClick={onClose}
          ></button>
        </div>

        {/* BODY (Scrollable) */}
        <div className="p-4 flex-grow-1 overflow-auto">
          {error && <div className="alert alert-danger shadow-sm">{error}</div>}

          {/* === STEP 1: INPUT FORM === */}
          {step === 'INPUT' && (
            <form onSubmit={handleCalculate}>
              <p className="text-muted mb-4">
                Enter the amount you wish to invest. We will calculate the
                optimal assets to buy to bring your portfolio back to its
                targets.
              </p>

              <div className="mb-4">
                <label className="form-label fw-bold">
                  Contribution Amount
                </label>
                <div className="input-group input-group-lg shadow-sm">
                  <span className="input-group-text bg-white text-muted">
                    {currency === 'BRL' ? 'R$' : '$'}
                  </span>
                  <input
                    type="number"
                    className="form-control fw-bold border-start-0 ps-0"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    min="0.01"
                    step="0.01"
                    style={{ fontSize: '1.5rem' }}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label fw-bold">Source Currency</label>
                <div className="d-flex gap-3">
                  <button
                    type="button"
                    className={`btn flex-grow-1 p-3 rounded-3 border shadow-sm d-flex flex-column align-items-center transition-all ${currency === 'BRL' ? 'btn-primary' : 'btn-light bg-white text-muted'}`}
                    onClick={() => setCurrency('BRL')}
                    style={{ transition: 'all 0.2s' }}
                  >
                    <span className="fs-4">🇧🇷</span>
                    <span className="fw-bold mt-1">Reais (BRL)</span>
                  </button>
                  <button
                    type="button"
                    className={`btn flex-grow-1 p-3 rounded-3 border shadow-sm d-flex flex-column align-items-center transition-all ${currency === 'USD' ? 'btn-primary' : 'btn-light bg-white text-muted'}`}
                    onClick={() => setCurrency('USD')}
                    style={{ transition: 'all 0.2s' }}
                  >
                    <span className="fs-4">🇺🇸</span>
                    <span className="fw-bold mt-1">Dollars (USD)</span>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* === STEP 2: RESULTS LIST === */}
          {step === 'RESULT' && result && (
            <div className="h-100 d-flex flex-column">
              <div className="alert alert-success shadow-sm mb-4 d-flex align-items-center">
                <i className="bi bi-check-circle-fill fs-4 me-3"></i>
                <div>
                  Plan calculated for an investment of <br />
                  <strong>
                    {formatMoney(result.contribution, result.mainCurrency)}
                  </strong>
                  .
                </div>
              </div>

              {result.suggestions.length === 0 ? (
                <div className="text-center py-5 my-auto">
                  <i
                    className="bi bi-stars text-warning"
                    style={{ fontSize: '4rem' }}
                  ></i>
                  <h4 className="fw-bold mt-3">Perfectly Balanced!</h4>
                  <p className="text-muted">
                    Your portfolio already matches your targets. No trades are
                    necessary right now.
                  </p>
                </div>
              ) : (
                <>
                  <h6 className="text-muted text-uppercase fw-bold mb-3">
                    Recommended Trades
                  </h6>
                  <ul className="list-group shadow-sm rounded-3 overflow-hidden">
                    {result.suggestions.map((item, index) => (
                      <li
                        key={item.assetId}
                        className={`list-group-item p-3 d-flex justify-content-between align-items-center ${index % 2 === 0 ? 'bg-light' : 'bg-white'}`}
                      >
                        <div>
                          <h5 className="fw-bold mb-1">{item.name}</h5>
                          <div className="small text-muted d-flex gap-3">
                            <span>
                              Target: <strong>{item.targetPercentage}%</strong>
                            </span>
                            <span>
                              Current:{' '}
                              <strong>{item.currentPercentage}%</strong>
                            </span>
                          </div>
                        </div>
                        <div className="text-end">
                          <div className="fs-5 fw-bold text-success text-nowrap">
                            + {formatMoney(item.amountToBuy, item.currency)}
                          </div>
                          <small
                            className="text-muted text-uppercase"
                            style={{ fontSize: '0.7rem' }}
                          >
                            to buy
                          </small>
                        </div>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          )}
        </div>

        {/* FOOTER (Fixed actions at bottom) */}
        <div className="p-4 border-top bg-white mt-auto">
          {step === 'INPUT' ? (
            <button
              className="btn btn-primary btn-lg w-100 py-3 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2"
              onClick={handleCalculate}
              disabled={loading || !amount || Number(amount) <= 0}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Calculating...
                </>
              ) : (
                <>
                  <i className="bi bi-calculator-fill"></i>
                  Calculate Action Plan
                </>
              )}
            </button>
          ) : (
            <div className="d-flex gap-3">
              <button
                className="btn btn-outline-secondary btn-lg flex-grow-1 py-3"
                onClick={() => setStep('INPUT')}
              >
                <i className="bi bi-arrow-left me-2"></i> Back
              </button>
              <button
                className="btn btn-success btn-lg flex-grow-1 py-3 fw-bold shadow-sm"
                onClick={onClose}
              >
                <i className="bi bi-check-lg me-2"></i> Done
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
