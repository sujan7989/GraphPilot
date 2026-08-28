import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { servicesApi, graphApi } from '../api/client';
import { Service, ImpactAnalysisRequest } from '../types/graph';
import { Loader2, Activity, AlertCircle, Zap, Layers } from 'lucide-react';

const Impact = () => {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [depth, setDepth] = useState(4);

  const { data: services, isLoading: servicesLoading } = useQuery<Service[]>({
    queryKey: ['services'],
    queryFn: servicesApi.getAll,
  });

  const impactMutation = useMutation({
    mutationFn: (data: ImpactAnalysisRequest) => graphApi.analyzeImpact(data),
  });

  const handleAnalyze = () => {
    if (selectedService) {
      impactMutation.mutate({ service_id: selectedService, depth });
    }
  };

  const result = impactMutation.data;

  const getHopColor = (hops: number) => {
    if (hops === 1) return 'bg-[#fee2e2] text-[#b91c1c] border-[#ef4444]';
    if (hops === 2) return 'bg-[#fef3c7] text-[#b45309] border-[#f59e0b]';
    if (hops === 3) return 'bg-[#e0f2fe] text-[#0369a1] border-[#0ea5e9]';
    return 'bg-[#f5f5f5] text-[#525252] border-[#a3a3a3]';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[#171717]">Impact Analysis</h1>
        <p className="text-sm text-[#525252] mt-1">Analyze the impact of service failures across the dependency graph</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls */}
        <div className="card space-y-6">
          <div>
            <label className="block text-sm font-medium text-[#525252] mb-2">
              Select Service
            </label>
            {servicesLoading ? (
              <div className="flex items-center justify-center h-32">
                <Loader2 className="h-6 w-6 loading-spinner" />
              </div>
            ) : (
              <select
                className="input w-full"
                value={selectedService || ''}
                onChange={(e) => setSelectedService(e.target.value)}
              >
                <option value="">Choose a service...</option>
                {services?.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#525252] mb-2">
              Traversal Depth: <span className="font-semibold text-[#171717]">{depth} hops</span>
            </label>
            <input
              type="range"
              min="1"
              max="6"
              value={depth}
              onChange={(e) => setDepth(Number(e.target.value))}
              className="w-full h-2 bg-[#e5e5e5] rounded-lg appearance-none cursor-pointer accent-[#0ea5e9]"
            />
            <div className="flex justify-between text-xs text-[#a3a3a3] mt-2">
              <span>1 hop</span>
              <span>6 hops</span>
            </div>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={!selectedService || impactMutation.isPending}
            className="btn btn-primary w-full"
          >
            {impactMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 loading-spinner mr-2" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Activity className="h-4 w-4 mr-2" />
                <span>Analyze Impact</span>
              </>
            )}
          </button>

          <div className="pt-4 border-t border-[#e5e5e5]">
            <div className="flex items-start space-x-2 text-xs text-[#525252]">
              <Zap className="h-4 w-4 text-[#f59e0b] flex-shrink-0 mt-0.5" />
              <p>
                Higher depth values analyze more indirect dependencies but may take longer to compute.
              </p>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-2 space-y-6">
          {impactMutation.isError && (
            <div className="card bg-[#fef2f2] border-[#fecaca]">
              <div className="flex items-center space-x-3">
                <AlertCircle className="h-5 w-5 text-[#ef4444]" />
                <span className="text-sm text-[#b91c1c]">Failed to analyze impact. Please try again.</span>
              </div>
            </div>
          )}

          {result && (
            <>
              {/* Impact Summary */}
              <div className="card">
                <div className="section-header">
                  <h2 className="section-title flex items-center space-x-2">
                    <Layers className="h-5 w-5" />
                    <span>Impact Summary</span>
                  </h2>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-[#e0f2fe] rounded-lg border border-[#bae6fd]">
                    <p className="text-xs font-medium text-[#0369a1] uppercase tracking-wide">Affected Services</p>
                    <p className="text-3xl font-bold text-[#0c4a6e] mt-1">{result.total_affected}</p>
                  </div>
                  <div className="p-4 bg-[#f0fdf4] rounded-lg border border-[#bbf7d0]">
                    <p className="text-xs font-medium text-[#15803d] uppercase tracking-wide">Max Hops</p>
                    <p className="text-3xl font-bold text-[#14532d] mt-1">{result.max_hops}</p>
                  </div>
                </div>
              </div>

              {/* Affected Services */}
              <div className="card">
                <div className="section-header">
                  <h2 className="section-title">Affected Services</h2>
                  <span className="badge badge-neutral">{result.affected_services.length} total</span>
                </div>
                {result.affected_services.length > 0 ? (
                  <div className="space-y-2">
                    {result.affected_services.map((service) => (
                      <div
                        key={service.service_id}
                        className="flex items-center justify-between p-4 bg-[#fafafa] rounded-lg hover:bg-[#f5f5f5] transition-colors border-l-4"
                        style={{ borderLeftColor: service.hops === 1 ? '#ef4444' : service.hops === 2 ? '#f59e0b' : '#0ea5e9' }}
                      >
                        <div className="flex items-center space-x-4 flex-1">
                          <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold border ${getHopColor(service.hops)}`}>
                            {service.hops}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-[#171717]">{service.service_name}</h3>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className={`badge ${
                                service.status === 'active' ? 'badge-success' : 'badge-neutral'
                              }`}>
                                {service.status}
                              </span>
                              <span className={`badge ${
                                service.criticality === 'high' ? 'badge-danger' :
                                service.criticality === 'medium' ? 'badge-warning' :
                                'badge-neutral'
                              }`}>
                                {service.criticality}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <p className="text-sm text-[#525252]">{service.hops} hop{service.hops > 1 ? 's' : ''}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <Activity className="empty-state-icon" />
                    <h3 className="empty-state-title">No affected services</h3>
                    <p className="empty-state-description">This service has no dependencies at the selected depth</p>
                  </div>
                )}
              </div>
            </>
          )}
          {!result && !impactMutation.isPending && (
            <div className="card flex items-center justify-center h-64">
              <div className="empty-state">
                <Activity className="empty-state-icon" />
                <h3 className="empty-state-title">Ready to analyze</h3>
                <p className="empty-state-description">Select a service and click "Analyze Impact" to see results</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Impact;
