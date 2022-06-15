import { api } from '../lib/api';

export interface IUnit {
  id: number;
  name: string;
  companyId: number;
}

export interface CreateOrAlterUnitDTO {
  name: string;
  companyId: number;
}

export const getUnits = async (): Promise<IUnit[]> => {
  const response = await api.get('/units').catch((err) => {
    throw err;
  });
  return response.data;
};

export const getUnit = async (id: number): Promise<IUnit> => {
  const response = await api.get(`/units/${id}`).catch((err) => {
    throw err;
  });
  return response.data;
};

export const postUnit = async (data: CreateOrAlterUnitDTO): Promise<IUnit> => {
  const response = await api.post(`/units`, data).catch((err) => {
    throw err;
  });
  return response.data;
};

export const putUnit = async (
  id: number,
  data: CreateOrAlterUnitDTO
): Promise<IUnit> => {
  const response = await api.put(`/units/${id}`, data).catch((err) => {
    throw err;
  });
  return response.data;
};

export const deleteUnit = async (id: number): Promise<IUnit> => {
  const response = await api.delete(`/units/${id}`).catch((err) => {
    throw err;
  });
  return response.data;
};
