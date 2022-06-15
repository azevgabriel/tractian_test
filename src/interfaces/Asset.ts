import { api } from '../lib/api';

interface IMetrics {
  totalCollectsUptime: number;
  totalUptime: number;
  lastUptimeAt: string;
}

interface ISpecifications {
  maxTemp: number;
  power?: number;
  rpm?: number;
}

export interface IAsset {
  id: number;
  sensors: string[];
  model: string;
  status: string;
  healthscore: number;
  name: string;
  image: string;
  specifications: ISpecifications;
  metrics: IMetrics;
  unitId: number;
  companyId: number;
}

export interface CreateOrAlterAssetDTO {
  sensors: string[];
  model: string;
  status: string;
  healthscore: number;
  name: string;
  image: string;
  specifications: ISpecifications;
  metrics: IMetrics;
  unitId: number;
  companyId: number;
}

export const getAssets = async (): Promise<IAsset[]> => {
  const response = await api.get('/assets').catch((err) => {
    throw err;
  });
  return response.data;
};

export const getAsset = async (id: number): Promise<IAsset> => {
  const response = await api.get(`/assets/${id}`).catch((err) => {
    throw err;
  });
  return response.data;
};

export const postAsset = async (
  data: CreateOrAlterAssetDTO
): Promise<IAsset> => {
  const response = await api.post(`/assets`, data).catch((err) => {
    throw err;
  });
  return response.data;
};

export const putAsset = async (
  id: number,
  data: CreateOrAlterAssetDTO
): Promise<IAsset> => {
  const response = await api.put(`/assets/${id}`, data).catch((err) => {
    throw err;
  });
  return response.data;
};

export const deleteAsset = async (id: number): Promise<IAsset> => {
  const response = await api.delete(`/assets/${id}`).catch((err) => {
    throw err;
  });
  return response.data;
};
