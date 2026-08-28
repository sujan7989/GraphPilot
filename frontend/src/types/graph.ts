export interface Service {
  id: string;
  name: string;
  description?: string;
  status: string;
  criticality: string;
}

export interface Incident {
  id: string;
  title: string;
  severity: string;
  status: string;
  created_at: string;
  description?: string;
  affected_services?: Array<{id: string; name: string}>;
}

export interface Node {
  id: string;
  label: string;
  properties: Record<string, any>;
}

export interface Relationship {
  id?: string;
  type: string;
  source: string;
  target: string;
  properties: Record<string, any>;
}

export interface GraphData {
  nodes: Node[];
  relationships: Relationship[];
}

export interface ImpactAnalysisRequest {
  service_id: string;
  depth: number;
}

export interface ImpactAnalysisResult {
  target_service: string;
  affected_services: Array<{
    service_id: string;
    service_name: string;
    status: string;
    criticality: string;
    hops: number;
  }>;
  total_affected: number;
  max_hops: number;
}

export interface AIAnalysisRequest {
  question: string;
}

export interface AIAnalysisResult {
  answer: string;
  evidence: any[];
  query_type: string;
}

export interface GraphStats {
  services: number;
  teams: number;
  incidents: number;
  databases: number;
  relationships: number;
}
