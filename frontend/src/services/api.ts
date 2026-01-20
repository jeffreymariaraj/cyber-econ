import axios from 'axios';
import type { Asset, AssetCreate, RiskReport } from '../types';

// Assuming backend is running on port 8000
const API_URL = 'http://localhost:8000';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const createAsset = async (asset: AssetCreate): Promise<Asset> => {
    const response = await api.post<Asset>('/assets', asset);
    return response.data;
};

export const triggerScan = async (assetId: string): Promise<string> => {
    const response = await api.get<{ message: string; scan_id: string }>(`/scan/${assetId}`);
    return response.data.scan_id;
};

export const getRiskReport = async (assetId: string): Promise<RiskReport> => {
    const response = await api.get<RiskReport>(`/report/${assetId}`);
    return response.data;
};

export const exportReport = async (assetId: string): Promise<Blob> => {
    const response = await api.get(`/report/${assetId}/export`, {
        responseType: 'blob',
    });
    return response.data;
};


export default api;
