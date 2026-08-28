import { useQuery } from '@tanstack/react-query';
import { graphApi, incidentsApi, servicesApi } from '../api/client';
import { GraphStats, Service, Incident } from '../types/graph';
import { Loader2, AlertCircle, Activity, Network, Database, AlertTriangle } from 'lucide-react';

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

  if (statsError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Failed to load dashboard data. Please check your connection.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Overview of NovaCart engineering dependencies</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Services"
          value={stats?.services || 0}
          icon={<Network className="h-6 w-6" />}
          loading={statsLoading}
          color="blue"
        />
        <StatCard
          title="Teams"
          value={stats?.teams || 0}
          icon={<Activity className="h-6 w-6" />}
          loading={statsLoading}
          color="green"
        />
        <StatCard
          title="Incidents"
          value={stats?.incidents || 0}
          icon={<AlertTriangle className="h-6 w-6" />}
          loading={statsLoading}
          color="red"
        />
        <StatCard
          title="Databases"
          value={stats?.databases || 0}
          icon={<Database className="h-6 w-6" />}
          loading={statsLoading}
          color="purple"
        />
      </div>

      {/* Recent Incidents */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Recent Incidents</h2>
        {incidentsLoading ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : incidents && incidents.length > 0 ? (
          <div className="space-y-3">
            {incidents.slice(0, 5).map((incident) => (
              <div
                key={incident.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <h3 className="font-medium text-gray-900">{incident.title}</h3>
                  <p className="text-sm text-gray-600">{incident.severity} • {incident.status}</p>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(incident.created_at).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No incidents recorded</p>
        )}
      </div>

      {/* Services Overview */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Services Overview</h2>
        {servicesLoading ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : services && services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {services.slice(0, 6).map((service) => (
              <div
                key={service.id}
                className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <h3 className="font-medium text-gray-900">{service.name}</h3>
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
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No services available</p>
        )}
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  loading: boolean;
  color: string;
}

const StatCard = ({ title, value, icon, loading, color }: StatCardProps) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    red: 'bg-red-50 text-red-600',
    purple: 'bg-purple-50 text-purple-600',
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm">{title}</p>
          {loading ? (
            <Loader2 className="h-8 w-8 animate-spin text-gray-400 mt-2" />
          ) : (
            <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color as keyof typeof colorClasses]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
