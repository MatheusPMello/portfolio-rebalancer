import api from './api';

export interface UpdateEmailData {
  email: string;
}

export interface UpdatePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface DeleteAccountData {
  password: string;
}

export interface UserResponse {
  message: string;
  email?: string;
}

const updateEmail = async (emailData: UpdateEmailData): Promise<UserResponse> => {
  const response = await api.put('/users/email', emailData);
  return response.data;
};

const updatePassword = async (passwordData: UpdatePasswordData): Promise<UserResponse> => {
  const response = await api.put('/users/password', passwordData);
  return response.data;
};

const deleteAccount = async (accountData: DeleteAccountData): Promise<UserResponse> => {
  const response = await api.delete('/users/account', { data: accountData });
  return response.data;
};

const userService = {
  updateEmail,
  updatePassword,
  deleteAccount,
};

export default userService;
