import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { servicesApi, graphApi } from '../api/client';
import { Service, ImpactAnalysisRequest } from '../types/graph';
import { Loader2, Activity, AlertCircle, ArrowRight } from 'lucide-react';

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Impact Analysis</h1>
        <p className="text-gray-600 mt-1">Analyze the impact of service failures across the dependency graph</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls */}
        <div className="card space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Service
            </label>
            {servicesLoading ? (
              <div className="flex items-center justify-center h-32">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Traversal Depth: {depth}
            </label>
            <input
              type="range"
              min="1"
              max="6"
              value={depth}
              onChange={(e) => setDepth(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1 hop</span>
              <span>6 hops</span>
            </div>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={!selectedService || impactMutation.isPending}
            className="btn btn-primary w-full flex items-center justify-center space-x-2"
          >
            {impactMutation.isPending ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Activity className="h-5 w-5" />
                <span>Analyze Impact</span>
              </>
            )}
          </button>
        </div>

        {/* Results */}
        <div className="lg:col-span-2 space-y-6">
          {impactMutation.isError && (
            <div className="card bg-red-50 border border-red-200">
              <div className="flex items-center space-x-2 text-red-700">
                <AlertCircle className="h-5 w-5" />
                <span>Failed to analyze impact. Please try again.</span>
              </div>
            </div>
          )}

          {result && (
            <>
              <div className="card">
                <h2 className="text-xl font-semibold mb-4">Impact Summary</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-600">Affected Services</p>
                    <p className="text-3xl font-bold text-blue-700">{result.total_affected}</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <p className="text-sm text-purple-600">Max Hops</p>
                    <p className="text-3xl font-bold text-purple-700">{result.max_hops}</p>
                  </div>
                </div>
              </div>

              <div className="card">
                <h2 className="text-xl font-semibold mb-4">Affected Services</h2>
                {result.affected_services.length > 0 ? (
                  <div className="space-y-3">
                    {result.affected_services.map((service, index) => (
                      <div
                        key={service.service_id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-1">
                            <span className="text-sm font-medium text-gray-500">
                              {index + 1}.
                            </span>
                            <ArrowRight className="h-4 w-4 text-gray-400" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">{service.service_name}</h3>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                service.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                              }`}>
                                {service.status}
                              </span>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                service.criticality === 'high' ? 'bg-red-100 text-red-700' :
                                service.criticality === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {service.criticality}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">{service.hops} hop{service.hops > 1 ? 's' : ''}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No affected services found</p>
                )}
              </div>
            </>
          )}

          {!result && !impactMutation.isPending && (
            <div className="card flex items-center justify-center h-64">
              <div className="text-center">
                <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Select a service and click "Analyze Impact" to see results</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Impact;
