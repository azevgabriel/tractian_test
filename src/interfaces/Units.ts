import { api } from '../lib/api';

export interface IUnit {
  id: number;
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
