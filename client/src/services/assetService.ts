// /client/src/services/assetService.ts
import api from './api';

// --- 1. CONTRACTS ---
export interface NewAsset {
  name: string;
  target_percentage: number;
  current_value: number;
  currency: 'USD' | 'BRL';
}

export interface Asset extends NewAsset {
  id: number;
  user_id: number;
}

// --- 2. ASYNC FUNCTIONS ---

const getAll = async (): Promise<Asset[]> => {
  // api.get auto-adds the token and uses the base URL
  const response = await api.get('/assets');
  return response.data;
};

const create = async (assetData: NewAsset): Promise<Asset> => {
  const response = await api.post('/assets', assetData);
  return response.data;
};

const update = async (id: number, assetData: NewAsset): Promise<Asset> => {
  const response = await api.put(`/assets/${id}`, assetData);
  return response.data;
};

const remove = async (id: number): Promise<void> => {
  await api.delete(`/assets/${id}`);
};

const assetService = {
  getAll,
  create,
  update,
  remove,
};

export default assetService;
