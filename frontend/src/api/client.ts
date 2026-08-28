import type { Service, Incident, GraphStats, ImpactAnalysisRequest, ImpactAnalysisResult, AIAnalysisRequest, AIAnalysisResult } from '../types/graph';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export const api = {
  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_BASE}${endpoint}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  async post<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },
};

export const servicesApi = {
  getAll: () => api.get<Service[]>('/api/services'),
  getById: (id: string) => api.get<Service>(`/api/services/${id}`),
  getDependencies: (id: string) => api.get<Service[]>(`/api/services/${id}/dependencies`),
  getDependents: (id: string) => api.get<Service[]>(`/api/services/${id}/dependents`),
  getGraph: (id: string, depth: number = 2) => api.get<any>(`/api/services/${id}/graph?depth=${depth}`),
};

export const incidentsApi = {
  getAll: () => api.get<Incident[]>('/api/incidents'),
  getById: (id: string) => api.get<Incident>(`/api/incidents/${id}`),
  getDependencies: (id: string) => api.get<any>(`/api/incidents/${id}/dependencies`),
};

export const graphApi = {
  getStats: () => api.get<GraphStats>('/api/graph/stats'),
  search: (q: string) => api.get<any[]>(`/api/graph/search?q=${encodeURIComponent(q)}`),
  getNode: (id: string, type: string = 'Service') => api.get<any>(`/api/graph/node/${id}?node_type=${type}`),
  analyzeImpact: (data: ImpactAnalysisRequest) => api.post<ImpactAnalysisResult>('/api/graph/impact-analysis', data),
  getDatabaseImpact: (id: string, depth: number = 4) => api.get<any[]>(`/api/graph/database/${id}/impact?depth=${depth}`),
};

export const aiApi = {
  analyze: (data: AIAnalysisRequest) => api.post<AIAnalysisResult>('/api/ai/analyze', data),
};
