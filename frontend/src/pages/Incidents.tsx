import { useQuery } from '@tanstack/react-query';
import { incidentsApi } from '../api/client';
import { Incident } from '../types/graph';
import { Loader2, AlertTriangle, AlertCircle } from 'lucide-react';

const Incidents = () => {
  const { data: incidents, isLoading, error } = useQuery<Incident[]>({
    queryKey: ['incidents'],
    queryFn: incidentsApi.getAll,
  });

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return 'bg-red-100 text-red-700';
      case 'high':
        return 'bg-orange-100 text-orange-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'low':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'investigating':
        return 'bg-purple-100 text-purple-700';
      case 'resolved':
        return 'bg-green-100 text-green-700';
      case 'open':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Failed to load incidents. Please check your connection.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Incidents</h1>
        <p className="text-gray-600 mt-1">Track and investigate engineering incidents</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : incidents && incidents.length > 0 ? (
        <div className="space-y-4">
          {incidents.map((incident) => (
            <div key={incident.id} className="card">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{incident.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${getSeverityColor(incident.severity)}`}>
                      {incident.severity}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(incident.status)}`}>
                      {incident.status}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3">{incident.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>Created: {new Date(incident.created_at).toLocaleString()}</span>
                    {incident.affected_services && incident.affected_services.length > 0 && (
                      <span>
                        Affected Services: {incident.affected_services.length}
                      </span>
                    )}
                  </div>
                  {incident.affected_services && incident.affected_services.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-sm font-medium text-gray-700 mb-2">Affected Services:</p>
                      <div className="flex flex-wrap gap-2">
                        {incident.affected_services.map((service) => (
                          <span
                            key={service.id}
                            className="text-xs px-2 py-1 bg-gray-100 rounded"
                          >
                            {service.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <AlertTriangle className="h-6 w-6 text-orange-500 flex-shrink-0 ml-4" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card flex items-center justify-center h-64">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No incidents recorded</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Incidents;
