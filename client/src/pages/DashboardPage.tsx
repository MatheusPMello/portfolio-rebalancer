// /client/src/pages/DashboardPage.tsx
import { useEffect, useState } from 'react';
import assetService, { type Asset } from '../services/assetService';
import { fetchExchangeRate } from '../services/currencyService';
import { AddAssetModal } from '../components/AddAssetModal';
// NEW: Import the Drawer instead of the Modal
import { RebalanceDrawer } from '../components/RebalanceDrawer';
import { PortfolioCharts } from '../components/PortfolioCharts';
import { Button } from '../components/Button';
import { CurrencyBadge } from '../components/CurrencyBadge';

/**
 * The main dashboard page for authenticated users.
 * Displays the estimated total portfolio value, currency breakdowns,
 * visual allocation drift charts, and a detailed list of asset holdings with edit/delete options.
 *
 * @returns React page component rendering the dashboard views.
 */
export function DashboardPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [usdRate, setUsdRate] = useState<number>(6);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  // Renamed state for clarity
  const [showRebalanceDrawer, setShowRebalanceDrawer] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);

  const loadAssets = async () => {
    try {
      const [assetsData, rate] = await Promise.all([
        assetService.getAll(),
        fetchExchangeRate(),
      ]);
      setAssets(assetsData);
      setUsdRate(rate);
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

  const formatNumberUnified = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const handleEdit = (asset: Asset) => {
    setEditingAsset(asset);
    setShowAddModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!globalThis.confirm('Are you sure you want to delete this asset?')) return;
    try {
      await assetService.remove(id);
      setAssets(assets.filter((asset) => asset.id !== id));
    } catch (err) {
      console.error('Failed to delete asset', err);
      alert('Failed to delete asset');
    }
  };

  const handleAddNew = () => {
    setEditingAsset(null);
    setShowAddModal(true);
  };

  // Calculate Totals
  const totalBRL = assets
    .filter((a) => a.currency === 'BRL')
    .reduce((sum, a) => sum + Number(a.current_value), 0);

  const totalUSD = assets
    .filter((a) => a.currency === 'USD')
    .reduce((sum, a) => sum + Number(a.current_value), 0);

  const estimatedTotalInBRL = totalBRL + totalUSD * usdRate;

  if (loading)
    return (
      <div className="text-center mt-5 pt-5">
        <output className="spinner-border text-primary"></output>
        <p className="mt-2 text-muted">Loading your portfolio...</p>
      </div>
    );
  if (error) return <div className="alert alert-danger m-4 shadow-sm">{error}</div>;

  return (
    <div className="pb-5">
      {/* ================= MAIN HEADER SECTION ================= */}
      {/* Layout: Total Value on Left | Distinct Rebalance Button on Right */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-start mb-5 gap-4">
        {/* LEFT: Total Portfolio Value */}
        <div>
          <h6 className="text-muted text-uppercase fw-bold mb-2" style={{ letterSpacing: '1px' }}>
            Estimated Total Value
          </h6>

          {/* Big Total Number */}
          <h1 className="fw-bold text-dark display-4 mb-3" style={{ letterSpacing: '-1px' }}>
            {formatCurrency(estimatedTotalInBRL, 'BRL')}
          </h1>

          {/* Currency Breakdowns using clean badges */}
          <div className="d-flex gap-3">
            <div className="d-flex align-items-center py-1 pe-3 rounded-pill bg-white border shadow-sm">
              <CurrencyBadge currency="BRL" className="me-2 fs-6 px-3" />
              <span className="fw-bold text-dark">
                {formatNumberUnified(totalBRL)}
              </span>
            </div>
            <div className="d-flex align-items-center py-1 pe-3 rounded-pill bg-white border shadow-sm">
              <CurrencyBadge currency="USD" className="me-2 fs-6 px-3" />
              <span className="fw-bold text-dark">
                {formatNumberUnified(totalUSD)}
              </span>
            </div>
          </div>

          <div
            className="text-muted-dark mt-1"
            style={{ fontSize: '0.75rem', fontStyle: 'italic' }}
          >
            1 USD = R$ {usdRate.toFixed(2)}
          </div>
        </div>

        {/* RIGHT: Distinct "Hero" Rebalance Button */}
        <div className="mt-3 mt-md-0">
          <Button
            variant="solid"
            color="primary"
            size="lg"
            rounded="pill"
            className="px-5 py-3 shadow-none d-flex align-items-center gap-3 hover-scale"
            onClick={() => setShowRebalanceDrawer(true)}
          >
            <i className="bi bi-stars fs-3"></i> {/* Changed icon to "stars" for a "magic" feel */}
            <div className="text-start">
              <div className="fw-bold fs-5">Rebalance Portfolio</div>
              <small className="opacity-75" style={{ fontSize: '0.75rem' }}>
                Calculate your next trades
              </small>
            </div>
          </Button>
        </div>
      </div>

      {/* ================= MIDDLE SECTION: CHARTS ================= */}
      <div className="mb-5">
        {assets.length > 0 ? (
          <PortfolioCharts assets={assets} usdRate={usdRate} />
        ) : (
          <div className="alert alert-info shadow-sm p-4 text-center">
            <i className="bi bi-info-circle-fill fs-4 text-info d-block mb-3"></i>
            <h5 className="fw-bold">Your portfolio is empty!</h5>
            <p className="mb-0">
              Add your first asset below to see your allocation charts and start rebalancing.
            </p>
          </div>
        )}
      </div>

      {/* ================= BOTTOM SECTION: ASSET TABLE ================= */}
      <div className="card-custom p-0 overflow-hidden shadow">
        {/* Header: Title + "Add Asset" Button (secondary action) */}
        <div className="d-flex justify-content-between align-items-center p-4 bg-white border-bottom">
          <div>
            <h5 className="fw-bold mb-0">Asset Holdings</h5>
            <p className="text-muted small mb-0">
              Detailed view of your current assets and targets.
            </p>
          </div>

          <Button
            variant="outline"
            color="primary"
            className="border-2 fw-bold d-flex align-items-center gap-2"
            onClick={handleAddNew}
          >
            <i className="bi bi-plus-lg"></i>
            Add Asset
          </Button>
        </div>

        {/* Table Content */}
        {assets.length === 0 ? (
          <div className="text-center py-5 bg-light">
            <i className="bi bi-wallet2 text-muted" style={{ fontSize: '3rem' }}></i>
            <p className="text-muted mt-3 fw-bold">No assets to display.</p>
            <Button variant="solid" color="primary" size="sm" className="px-4" onClick={handleAddNew}>
              Add One Now
            </Button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead
                className="bg-light text-secondary text-uppercase small fw-bold"
                style={{ letterSpacing: '0.5px' }}
              >
                <tr>
                  <th className="py-3 ps-4">Asset</th>
                  <th className="py-3">Currency</th>
                  <th className="py-3">Target Allocation</th>
                  <th className="py-3 text-end">Current Value</th>
                  <th className="text-end py-3 pe-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {assets.map((asset) => (
                  <tr key={asset.id}>
                    <td className="ps-4 py-4">
                      <span className="fw-bold text-dark fs-5">{asset.name}</span>
                    </td>
                    <td>
                      <CurrencyBadge currency={asset.currency} />
                    </td>
                    <td style={{ minWidth: '220px' }}>
                      {(() => {
                        const assetBrlValue = asset.currency === 'USD' ? Number(asset.current_value) * usdRate : Number(asset.current_value);
                        const currentPercentage = estimatedTotalInBRL > 0 ? (assetBrlValue / estimatedTotalInBRL) * 100 : 0;
                        return (
                          <div className="d-flex flex-column">
                            <div className="d-flex justify-content-between small fw-bold mb-1">
                              <span>{currentPercentage.toFixed(1)}% Current</span>
                              <span className="text-muted">{asset.target_percentage}% Target</span>
                            </div>
                            <div className="progress position-relative" style={{ height: '12px', borderRadius: '6px', backgroundColor: '#e9ecef', overflow: 'hidden' }}>
                              {/* Target bar (grey) */}
                              <div
                                className="position-absolute top-0 bottom-0 start-0 bg-secondary"
                                style={{
                                  width: `${asset.target_percentage}%`,
                                  zIndex: 1,
                                  opacity: 0.4,
                                }}
                              ></div>
                              {/* Current progress bar (blue) */}
                              <div
                                className="position-absolute top-0 bottom-0 start-0 bg-primary"
                                style={{
                                  width: `${currentPercentage}%`,
                                  zIndex: 2,
                                  transition: 'width 0.3s ease',
                                }}
                              ></div>
                            </div>
                          </div>
                        );
                      })()}
                    </td>
                    <td className="fw-bold fs-5 text-dark text-end">
                      {formatCurrency(Number(asset.current_value), asset.currency)}
                    </td>
                    <td className="text-end pe-4">
                      <div className="btn-group shadow-sm">
                        <Button
                          variant="outline"
                          color="secondary"
                          size="sm"
                          title="Edit Asset"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(asset);
                          }}
                        >
                          EDIT
                        </Button>
                        <Button
                          variant="outline"
                          color="danger"
                          size="sm"
                          title="Remove Asset"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(asset.id);
                          }}
                        >
                          REMOVE
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals & Drawers */}
      <AddAssetModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAssetSaved={loadAssets}
        assetToEdit={editingAsset}
      />

      {/* NEW DRAWER */}
      <RebalanceDrawer show={showRebalanceDrawer} onClose={() => setShowRebalanceDrawer(false)} />
    </div>
  );
}
