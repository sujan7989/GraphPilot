import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { incidentsApi } from '../api/client';
import { Incident } from '../types/graph';
import { Loader2, AlertTriangle, AlertCircle, Clock, CheckCircle2, Filter, X } from 'lucide-react';

const Incidents = () => {
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const { data: incidents, isLoading, error } = useQuery<Incident[]>({
    queryKey: ['incidents'],
    queryFn: incidentsApi.getAll,
  });

  const filteredIncidents = incidents?.filter(incident => {
    if (severityFilter !== 'all' && incident.severity !== severityFilter) return false;
    if (statusFilter !== 'all' && incident.status !== statusFilter) return false;
    return true;
  }) || [];

  const activeIncidents = filteredIncidents.filter(i => i.status !== 'resolved');
  const resolvedIncidents = filteredIncidents.filter(i => i.status === 'resolved');

  const getSeverityBadge = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return 'badge-danger';
      case 'high':
        return 'badge-warning';
      case 'medium':
        return 'badge-warning';
      case 'low':
        return 'badge-primary';
      default:
        return 'badge-neutral';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'investigating':
        return 'badge-primary';
      case 'resolved':
        return 'badge-success';
      case 'open':
        return 'badge-danger';
      default:
        return 'badge-neutral';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'resolved':
        return <CheckCircle2 className="h-4 w-4 text-[#22c55e]" />;
      case 'investigating':
        return <Clock className="h-4 w-4 text-[#0ea5e9]" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-[#ef4444]" />;
    }
  };

  if (error) {
    return (
      <div className="error-state">
        <AlertCircle className="error-state-icon" />
        <h3 className="error-state-title">Unable to load incidents</h3>
        <p className="error-state-description">We couldn't retrieve incident data right now.</p>
        <button 
          onClick={() => window.location.reload()}
          className="btn btn-primary mt-4"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="section-header">
        <div>
          <h1 className="text-2xl font-semibold text-[#171717]">Incidents</h1>
          <p className="text-sm text-[#525252] mt-1">Track and investigate engineering incidents</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-[#ef4444]" />
            <span className="text-sm text-[#525252]">{activeIncidents.length} active</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-[#22c55e]" />
            <span className="text-sm text-[#525252]">{resolvedIncidents.length} resolved</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex items-center space-x-2 mb-4">
          <Filter className="h-4 w-4 text-[#525252]" />
          <h3 className="text-sm font-medium text-[#171717]">Filters</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-[#525252] mb-2">Severity</label>
            <select
              className="input w-full"
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#525252] mb-2">Status</label>
            <select
              className="input w-full"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="open">Open</option>
              <option value="investigating">Investigating</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>
        {(severityFilter !== 'all' || statusFilter !== 'all') && (
          <button
            onClick={() => { setSeverityFilter('all'); setStatusFilter('all'); }}
            className="mt-4 text-xs text-[#0ea5e9] hover:text-[#0284c7] flex items-center space-x-1"
          >
            <X className="h-3 w-3" />
            <span>Clear filters</span>
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 loading-spinner" />
        </div>
      ) : incidents && incidents.length > 0 ? (
        <div className="space-y-6">
          {/* Active Incidents */}
          {activeIncidents.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-[#171717] mb-4 flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-[#ef4444]" />
                <span>Active Incidents</span>
                <span className="badge badge-danger">{activeIncidents.length}</span>
              </h2>
              <div className="space-y-3">
                {activeIncidents.map((incident) => (
                  <div key={incident.id} className="card card-hover border-l-4" style={{ borderLeftColor: incident.severity === 'critical' ? '#ef4444' : '#f59e0b' }}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-[#171717]">{incident.title}</h3>
                          <span className={`badge ${getSeverityBadge(incident.severity)}`}>
                            {incident.severity}
                          </span>
                          <span className={`badge ${getStatusBadge(incident.status)}`}>
                            {incident.status}
                          </span>
                        </div>
                        <p className="text-sm text-[#525252] mb-3">{incident.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-[#a3a3a3]">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{new Date(incident.created_at).toLocaleString()}</span>
                          </div>
                          {incident.affected_services && incident.affected_services.length > 0 && (
                            <span>{incident.affected_services.length} affected services</span>
                          )}
                        </div>
                        {incident.affected_services && incident.affected_services.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-[#e5e5e5]">
                            <p className="text-xs font-medium text-[#525252] mb-2">Affected Services:</p>
                            <div className="flex flex-wrap gap-2">
                              {incident.affected_services.map((service) => (
                                <span
                                  key={service.id}
                                  className="badge badge-neutral"
                                >
                                  {service.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        {getStatusIcon(incident.status)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Resolved Incidents */}
          {resolvedIncidents.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-[#171717] mb-4 flex items-center space-x-2">
                <CheckCircle2 className="h-5 w-5 text-[#22c55e]" />
                <span>Resolved Incidents</span>
                <span className="badge badge-success">{resolvedIncidents.length}</span>
              </h2>
              <div className="space-y-3">
                {resolvedIncidents.map((incident) => (
                  <div key={incident.id} className="card card-hover opacity-75">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-medium text-[#171717]">{incident.title}</h3>
                          <span className={`badge ${getSeverityBadge(incident.severity)}`}>
                            {incident.severity}
                          </span>
                          <span className={`badge ${getStatusBadge(incident.status)}`}>
                            {incident.status}
                          </span>
                        </div>
                        <p className="text-sm text-[#525252] mb-2">{incident.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-[#a3a3a3]">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{new Date(incident.created_at).toLocaleString()}</span>
                          </div>
                          {incident.affected_services && incident.affected_services.length > 0 && (
                            <span>{incident.affected_services.length} affected services</span>
                          )}
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        {getStatusIcon(incident.status)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="card">
          <div className="empty-state">
            <CheckCircle2 className="empty-state-icon text-[#22c55e]" />
            <h3 className="empty-state-title">No incidents match your filters</h3>
            <p className="empty-state-description">Try adjusting your filters or clear them to see all incidents</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Incidents;
