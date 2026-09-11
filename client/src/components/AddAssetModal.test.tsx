import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AddAssetModal } from './AddAssetModal';
import assetService, { type Asset } from '../services/assetService';

vi.mock('../services/assetService', () => ({
  default: {
    create: vi.fn(),
    update: vi.fn(),
  },
}));

describe('AddAssetModal Component', () => {
  const onClose = vi.fn();
  const onAssetSaved = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders modal in Add mode with empty fields', () => {
    render(
      <AddAssetModal
        show={true}
        onClose={onClose}
        onAssetSaved={onAssetSaved}
      />,
    );

    expect(screen.getByText('Add New Asset')).toBeInTheDocument();
    expect(screen.getByLabelText('Asset Name')).toHaveValue('');
    expect(screen.getByLabelText('Currency')).toHaveValue('BRL');
    expect(screen.getByLabelText('Target Allocation (%)')).toHaveValue(null);
    expect(screen.getByLabelText('Current Value')).toHaveValue(null);
    expect(screen.getByRole('button', { name: 'Save Asset' })).toBeInTheDocument();
  });

  it('renders modal in Edit mode with populated fields', () => {
    const assetToEdit: Asset = {
      id: 10,
      user_id: 1,
      name: 'Bitcoin',
      currency: 'USD',
      target_percentage: 20,
      current_value: 50000,
    };

    render(
      <AddAssetModal
        show={true}
        onClose={onClose}
        onAssetSaved={onAssetSaved}
        assetToEdit={assetToEdit}
      />,
    );

    expect(screen.getByText('Edit Asset')).toBeInTheDocument();
    expect(screen.getByLabelText('Asset Name')).toHaveValue('Bitcoin');
    expect(screen.getByLabelText('Currency')).toHaveValue('USD');
    expect(screen.getByLabelText('Target Allocation (%)')).toHaveValue(20);
    expect(screen.getByLabelText('Current Value')).toHaveValue(50000);
    expect(screen.getByRole('button', { name: 'Update Asset' })).toBeInTheDocument();
  });

  const submitNewAssetForm = (name: string, targetAllocation: string, currentValue: string) => {
    render(<AddAssetModal show={true} onClose={onClose} onAssetSaved={onAssetSaved} />);
    fireEvent.change(screen.getByLabelText('Asset Name'), { target: { value: name } });
    fireEvent.change(screen.getByLabelText('Target Allocation (%)'), { target: { value: targetAllocation } });
    fireEvent.change(screen.getByLabelText('Current Value'), { target: { value: currentValue } });
    fireEvent.click(screen.getByRole('button', { name: 'Save Asset' }));
  };

  it('creates a new asset when submitted in Add mode', async () => {
    vi.mocked(assetService.create).mockResolvedValueOnce({
      id: 1,
      user_id: 1,
      name: 'Ethereum',
      currency: 'BRL',
      target_percentage: 15,
      current_value: 3000,
    });

    submitNewAssetForm('Ethereum', '15', '3000');

    await waitFor(() => {
      expect(assetService.create).toHaveBeenCalledWith({
        name: 'Ethereum',
        currency: 'BRL',
        target_percentage: 15,
        current_value: 3000,
      });
      expect(onAssetSaved).toHaveBeenCalledTimes(1);
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  it('updates asset when submitted in Edit mode', async () => {
    const assetToEdit: Asset = {
      id: 10,
      user_id: 1,
      name: 'Bitcoin',
      currency: 'USD',
      target_percentage: 20,
      current_value: 50000,
    };

    vi.mocked(assetService.update).mockResolvedValueOnce({
      ...assetToEdit,
      current_value: 60000,
    });

    render(
      <AddAssetModal
        show={true}
        onClose={onClose}
        onAssetSaved={onAssetSaved}
        assetToEdit={assetToEdit}
      />,
    );

    fireEvent.change(screen.getByLabelText('Current Value'), { target: { value: '60000' } });
    fireEvent.click(screen.getByRole('button', { name: 'Update Asset' }));

    await waitFor(() => {
      expect(assetService.update).toHaveBeenCalledWith(10, {
        name: 'Bitcoin',
        currency: 'USD',
        target_percentage: 20,
        current_value: 60000,
      });
      expect(onAssetSaved).toHaveBeenCalledTimes(1);
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  it('displays error message when saving fails', async () => {
    vi.mocked(assetService.create).mockRejectedValueOnce(new Error('Network error'));

    submitNewAssetForm('Failed Asset', '10', '100');

    await waitFor(() => {
      expect(screen.getByText('Failed to save asset')).toBeInTheDocument();
    });
  });
});
