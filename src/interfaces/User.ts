import { api } from '../lib/api';

export interface IUser {
  id: number;
  email: string;
  name: string;
  unitId: number;
  companyId: number;
}

export const getUsers = async (): Promise<IUser[]> => {
  const response = await api.get('/users').catch((err) => {
    throw err;
  });
  return response.data;
};

export const getUser = async (id: number): Promise<IUser> => {
  const response = await api.get(`/users/${id}`).catch((err) => {
    throw err;
  });
  return response.data;
};
