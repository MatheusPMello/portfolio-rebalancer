import api from './api';

export interface UpdateEmailData {
  email: string;
  currentPassword?: string;
}

export interface UpdatePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface DeleteAccountData {
  password: string;
}

export interface UserProfile {
  id: number;
  email: string;
}

export interface UserResponse {
  message: string;
  email?: string;
}

const getProfile = async (): Promise<UserProfile> => {
  const response = await api.get('/user/profile');
  return response.data;
};

const updateEmail = async (emailData: UpdateEmailData): Promise<UserResponse> => {
  const response = await api.put('/user/email', emailData);
  return response.data;
};

const updatePassword = async (passwordData: UpdatePasswordData): Promise<UserResponse> => {
  const response = await api.put('/user/password', passwordData);
  return response.data;
};

const deleteAccount = async (accountData: DeleteAccountData): Promise<UserResponse> => {
  const response = await api.delete('/user/account', { data: accountData });
  return response.data;
};

const userService = {
  getProfile,
  updateEmail,
  updatePassword,
  deleteAccount,
};

export default userService;
