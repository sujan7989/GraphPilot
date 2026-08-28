import { useQuery } from '@tanstack/react-query';
import { graphApi, incidentsApi, servicesApi } from '../api/client';
import { GraphStats, Service, Incident } from '../types/graph';
import { Loader2, AlertCircle, Activity, Network, Database, AlertTriangle, CheckCircle2 } from 'lucide-react';

const Dashboard = () => {
  const { data: stats, isLoading: statsLoading, error: statsError } = useQuery<GraphStats>({
    queryKey: ['graph-stats'],
    queryFn: graphApi.getStats,
  });

  const { data: services, isLoading: servicesLoading } = useQuery<Service[]>({
    queryKey: ['services'],
    queryFn: servicesApi.getAll,
  });

  const { data: incidents, isLoading: incidentsLoading } = useQuery<Incident[]>({
    queryKey: ['incidents'],
    queryFn: incidentsApi.getAll,
  });

  const criticalServices = services?.filter(s => s.criticality === 'high' && s.status === 'active') || [];
  const activeIncidents = incidents?.filter(i => i.status !== 'resolved') || [];

  if (statsError) {
    return (
      <div className="error-state">
        <AlertCircle className="error-state-icon" />
        <h3 className="error-state-title">Unable to load dashboard</h3>
        <p className="error-state-description">We couldn't retrieve your dashboard data right now.</p>
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
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-[#171717]">Dashboard</h1>
        <p className="text-sm text-[#525252] mt-1">Overview of your engineering infrastructure</p>
      </div>

      {/* System Health Banner */}
      <div className="bg-gradient-to-r from-[#e0f2fe] to-[#f0fdf4] border border-[#bae6fd] rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white p-2 rounded-lg">
              <CheckCircle2 className="h-5 w-5 text-[#22c55e]" />
            </div>
            <div>
              <h3 className="font-semibold text-[#171717]">System Healthy</h3>
              <p className="text-sm text-[#525252]">All services operating normally</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center space-x-6 text-sm">
            <div className="text-center">
              <p className="font-semibold text-[#171717]">{stats?.services || 0}</p>
              <p className="text-[#525252]">Services</p>
            </div>
            <div className="text-center">
              <p className="font-semibold text-[#171717]">{stats?.relationships || 0}</p>
              <p className="text-[#525252]">Dependencies</p>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Services"
          value={stats?.services || 0}
          icon={<Network className="h-5 w-5" />}
          loading={statsLoading}
        />
        <KPICard
          title="Teams"
          value={stats?.teams || 0}
          icon={<Activity className="h-5 w-5" />}
          loading={statsLoading}
        />
        <KPICard
          title="Active Incidents"
          value={activeIncidents.length}
          icon={<AlertTriangle className="h-5 w-5" />}
          loading={incidentsLoading}
        />
        <KPICard
          title="Databases"
          value={stats?.databases || 0}
          icon={<Database className="h-5 w-5" />}
          loading={statsLoading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Incidents */}
        <div className="card">
          <div className="section-header">
            <h2 className="section-title">Recent Incidents</h2>
            <span className="badge badge-neutral">{incidents?.length || 0} total</span>
          </div>
          {incidentsLoading ? (
            <div className="flex items-center justify-center h-48">
              <Loader2 className="h-8 w-8 loading-spinner" />
            </div>
          ) : incidents && incidents.length > 0 ? (
            <div className="space-y-3">
              {incidents.slice(0, 5).map((incident) => (
                <div
                  key={incident.id}
                  className="flex items-start justify-between p-4 bg-[#fafafa] rounded-lg hover:bg-[#f5f5f5] transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-medium text-[#171717] truncate">{incident.title}</h3>
                      <span className={`badge ${
                        incident.severity === 'critical' ? 'badge-danger' :
                        incident.severity === 'high' ? 'badge-warning' :
                        incident.severity === 'medium' ? 'badge-warning' :
                        'badge-neutral'
                      }`}>
                        {incident.severity}
                      </span>
                    </div>
                    <p className="text-sm text-[#525252] line-clamp-2">{incident.description}</p>
                    <div className="flex items-center space-x-3 mt-2 text-xs text-[#a3a3a3]">
                      <span>{new Date(incident.created_at).toLocaleDateString()}</span>
                      {incident.affected_services && incident.affected_services.length > 0 && (
                        <span>{incident.affected_services.length} affected</span>
                      )}
                    </div>
                  </div>
                  <div className="ml-4">
                    <span className={`badge ${
                      incident.status === 'resolved' ? 'badge-success' :
                      incident.status === 'investigating' ? 'badge-primary' :
                      'badge-danger'
                    }`}>
                      {incident.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <AlertTriangle className="empty-state-icon" />
              <h3 className="empty-state-title">No incidents recorded</h3>
              <p className="empty-state-description">Your system is running smoothly</p>
            </div>
          )}
        </div>

        {/* Critical Services */}
        <div className="card">
          <div className="section-header">
            <h2 className="section-title">Critical Services</h2>
            <span className="badge badge-neutral">{criticalServices.length} high priority</span>
          </div>
          {servicesLoading ? (
            <div className="flex items-center justify-center h-48">
              <Loader2 className="h-8 w-8 loading-spinner" />
            </div>
          ) : criticalServices.length > 0 ? (
            <div className="space-y-2">
              {criticalServices.slice(0, 6).map((service) => (
                <div
                  key={service.id}
                  className="flex items-center justify-between p-4 bg-[#fafafa] rounded-lg hover:bg-[#f5f5f5] transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full bg-[#22c55e]" />
                    <div>
                      <h3 className="font-medium text-[#171717]">{service.name}</h3>
                      <p className="text-xs text-[#525252]">{service.id}</p>
                    </div>
                  </div>
                  <span className="badge badge-success">Active</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <Network className="empty-state-icon" />
              <h3 className="empty-state-title">No critical services</h3>
              <p className="empty-state-description">All services are running normally</p>
            </div>
          )}
        </div>
      </div>

      {/* Services Overview */}
      <div className="card">
        <div className="section-header">
          <h2 className="section-title">All Services</h2>
          <span className="badge badge-neutral">{services?.length || 0} total</span>
        </div>
        {servicesLoading ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="h-8 w-8 loading-spinner" />
          </div>
        ) : services && services.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {services.slice(0, 8).map((service) => (
              <div
                key={service.id}
                className="p-4 bg-[#fafafa] rounded-lg hover:bg-[#f5f5f5] transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-[#171717] truncate">{service.name}</h3>
                  <div className="w-2 h-2 rounded-full bg-[#22c55e]" />
                </div>
                <div className="flex items-center space-x-2">
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
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <Network className="empty-state-icon" />
            <h3 className="empty-state-title">No services available</h3>
            <p className="empty-state-description">Start by adding services to your infrastructure</p>
          </div>
        )}
      </div>
    </div>
  );
};

interface KPICardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  loading: boolean;
}

const KPICard = ({ title, value, icon, loading }: KPICardProps) => {
  return (
    <div className="kpi-card">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium text-[#525252] uppercase tracking-wide">{title}</p>
          {loading ? (
            <Loader2 className="h-8 w-8 loading-spinner mt-3" />
          ) : (
            <p className="text-3xl font-bold text-[#171717] mt-2">{value}</p>
          )}
        </div>
        <div className="bg-[#e0f2fe] p-3 rounded-lg">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
