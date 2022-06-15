import { api } from '../lib/api';

export interface IUser {
  id: number;
  email: string;
  name: string;
  unitId: number;
  companyId: number;
  type: 'user' | 'admin';
}

export interface CreateOrAlterUserDTO {
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

export const postUser = async (data: CreateOrAlterUserDTO): Promise<IUser> => {
  const response = await api.post(`/users`, data).catch((err) => {
    throw err;
  });
  return response.data;
};

export const putUser = async (
  id: number,
  data: CreateOrAlterUserDTO
): Promise<IUser> => {
  const response = await api.put(`/users/${id}`, data).catch((err) => {
    throw err;
  });
  return response.data;
};

export const deleteUser = async (id: number): Promise<IUser> => {
  const response = await api.delete(`/users/${id}`).catch((err) => {
    throw err;
  });
  return response.data;
};
