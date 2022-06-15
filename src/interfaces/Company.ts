import { api } from '../lib/api';

export interface ICompany {
  id: number;
  name: string;
}

export interface CreateOrAlterCompanyDTO {
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

export const postCompany = async (
  data: CreateOrAlterCompanyDTO
): Promise<ICompany> => {
  const response = await api.post(`/companies`, data).catch((err) => {
    throw err;
  });
  return response.data;
};

export const putCompany = async (
  id: number,
  data: CreateOrAlterCompanyDTO
): Promise<ICompany> => {
  const response = await api.put(`/companies/${id}`, data).catch((err) => {
    throw err;
  });
  return response.data;
};

export const deleteCompany = async (id: number): Promise<ICompany> => {
  const response = await api.delete(`/companies/${id}`).catch((err) => {
    throw err;
  });
  return response.data;
};
