import { api } from '../lib/api';

export interface ICompany {
  id: number;
  name: string;
}

export const getCompanies = async (): Promise<ICompany[]> => {
  const response = await api.get('/companies').catch((err) => {
    throw err;
  });
  return response.data;
};

export const getCompany = async (id: number): Promise<ICompany> => {
  const response = await api.get(`/companies/${id}`).catch((err) => {
    throw err;
  });
  return response.data;
};
