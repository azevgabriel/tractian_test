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
