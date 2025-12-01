import axios from 'axios';

const API_URL = 'http://localhost:5001/api/assets';

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

// --- 2. HELPERS ---

const getAuthConfig = () => {
  const token = localStorage.getItem('token');

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  console.log('getAuthConfig generated:', config);

  return config;
};

// --- 3. ASYNC FUNCTIONS ---

const getAll = async (): Promise<Asset[]> => {
  console.log('Calling axios.get...');

  const config = getAuthConfig();
  console.log('onfig being passed to axios:', config);

  const response = await axios.get(API_URL, config);

  return response.data;
};

const create = async (assetData: NewAsset): Promise<Asset> => {
  const response = await axios.post(API_URL, assetData, getAuthConfig());
  return response.data;
};

const update = async (id: number, assetData: NewAsset): Promise<Asset> => {
  const response = await axios.put(
    `${API_URL}/${id}`,
    assetData,
    getAuthConfig(),
  );
  return response.data;
};

const remove = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`, getAuthConfig());
};

const assetService = {
  getAll,
  create,
  update,
  remove,
};

export default assetService;
