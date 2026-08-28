import type { Service, Incident, GraphStats, ImpactAnalysisRequest, ImpactAnalysisResult, AIAnalysisRequest, AIAnalysisResult } from '../types/graph';

// API Base URL configuration
// In local development: uses /api with Vite proxy to http://localhost:8000
// In production: uses full backend URL
const API_BASE = import.meta.env.VITE_API_URL 
  ? import.meta.env.VITE_API_URL 
  : (import.meta.env.MODE === 'production' ? 'https://graphpilot.onrender.com/api' : '/api');

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
  getAll: () => api.get<Service[]>('/services'),
  getById: (id: string) => api.get<Service>(`/services/${id}`),
  getDependencies: (id: string) => api.get<Service[]>(`/services/${id}/dependencies`),
  getDependents: (id: string) => api.get<Service[]>(`/services/${id}/dependents`),
  getGraph: (id: string, depth: number = 2) => api.get<any>(`/services/${id}/graph?depth=${depth}`),
};

export const incidentsApi = {
  getAll: () => api.get<Incident[]>('/incidents'),
  getById: (id: string) => api.get<Incident>(`/incidents/${id}`),
  getDependencies: (id: string) => api.get<any>(`/incidents/${id}/dependencies`),
};

export const graphApi = {
  getStats: () => api.get<GraphStats>('/graph/stats'),
  search: (q: string) => api.get<any[]>(`/graph/search?q=${encodeURIComponent(q)}`),
  getNode: (id: string, type: string = 'Service') => api.get<any>(`/graph/node/${id}?node_type=${type}`),
  analyzeImpact: (data: ImpactAnalysisRequest) => api.post<ImpactAnalysisResult>('/graph/impact-analysis', data),
  getDatabaseImpact: (id: string, depth: number = 4) => api.get<any[]>(`/graph/database/${id}/impact?depth=${depth}`),
};

export const aiApi = {
  analyze: (data: AIAnalysisRequest) => api.post<AIAnalysisResult>('/ai/analyze', data),
};
