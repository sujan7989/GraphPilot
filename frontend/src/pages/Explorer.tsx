import { useState, useCallback, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import ReactFlow, { Background, Controls, MiniMap, Node, Edge, useNodesState, useEdgesState, addEdge, Connection } from 'reactflow';
import 'reactflow/dist/style.css';
import { servicesApi } from '../api/client';
import { Service } from '../types/graph';
import { Loader2, Search, Network } from 'lucide-react';

const Explorer = () => {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showGraph, setShowGraph] = useState(false);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onConnect = useCallback((params: Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const { data: services, isLoading: servicesLoading } = useQuery<Service[]>({
    queryKey: ['services'],
    queryFn: servicesApi.getAll,
  });

  const { data: dependencies, isLoading: depsLoading } = useQuery<Service[]>({
    queryKey: ['dependencies', selectedService],
    queryFn: () => servicesApi.getDependencies(selectedService!),
    enabled: !!selectedService,
  });

  const { data: graphData, isLoading: graphLoading } = useQuery({
    queryKey: ['graph', selectedService],
    queryFn: () => servicesApi.getGraph(selectedService!, 2),
    enabled: !!selectedService && showGraph,
  });

  useEffect(() => {
    if (graphData) {
      const flowNodes: Node[] = graphData.nodes.map((node: any) => ({
        id: node.id,
        data: { label: node.label },
        position: { x: Math.random() * 400, y: Math.random() * 400 },
      }));
      const flowEdges: Edge[] = graphData.relationships.map((rel: any, index: number) => ({
        id: rel.id || `edge-${index}`,
        source: rel.source,
        target: rel.target,
        label: rel.type,
        animated: true,
      }));
      setNodes(flowNodes);
      setEdges(flowEdges);
    }
  }, [graphData, setNodes, setEdges]);

  const { data: dependents, isLoading: dependentsLoading } = useQuery<Service[]>({
    queryKey: ['dependents', selectedService],
    queryFn: () => servicesApi.getDependents(selectedService!),
    enabled: !!selectedService,
  });

  const filteredServices = services?.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.id.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Graph Explorer</h1>
        <p className="text-gray-600 mt-1">Explore service dependencies and relationships</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Service List */}
        <div className="card">
          <div className="flex items-center space-x-2 mb-4">
            <Search className="h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search services..."
              className="input flex-1"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {servicesLoading ? (
              <div className="flex items-center justify-center h-32">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            ) : filteredServices.length > 0 ? (
              filteredServices.map((service) => (
                <button
                  key={service.id}
                  onClick={() => setSelectedService(service.id)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedService === service.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="font-medium">{service.name}</div>
                  <div className="text-sm text-gray-600">{service.id}</div>
                </button>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No services found</p>
            )}
          </div>
        </div>

        {/* Service Details */}
        <div className="lg:col-span-2 space-y-6">
          {selectedService ? (
            <>
              <div className="flex space-x-2 mb-4">
                <button
                  onClick={() => setShowGraph(false)}
                  className={`px-4 py-2 rounded-lg ${!showGraph ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  Details
                </button>
                <button
                  onClick={() => setShowGraph(true)}
                  className={`px-4 py-2 rounded-lg ${showGraph ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  Graph View
                </button>
              </div>

              {!showGraph ? (
                <div className="card">
                  <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
                    <Network className="h-6 w-6" />
                    <span>Service Details</span>
                  </h2>
                  {services?.find((s) => s.id === selectedService) && (
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Name</label>
                        <p className="text-gray-900">{services.find((s) => s.id === selectedService)?.name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Description</label>
                        <p className="text-gray-900">{services.find((s) => s.id === selectedService)?.description || 'No description'}</p>
                      </div>
                      <div className="flex space-x-4">
                        <div>
                          <label className="text-sm font-medium text-gray-600">Status</label>
                          <p className="text-gray-900">{services.find((s) => s.id === selectedService)?.status}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">Criticality</label>
                          <p className="text-gray-900">{services.find((s) => s.id === selectedService)?.criticality}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="card h-[600px]">
                  <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
                    <Network className="h-6 w-6" />
                    <span>Dependency Graph</span>
                  </h2>
                  {graphLoading ? (
                    <div className="flex items-center justify-center h-96">
                      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                    </div>
                  ) : (
                    <div className="h-[500px]">
                      <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        fitView
                      >
                        <Background />
                        <Controls />
                        <MiniMap />
                      </ReactFlow>
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card">
                  <h3 className="text-lg font-semibold mb-3">Dependencies</h3>
                  {depsLoading ? (
                    <div className="flex items-center justify-center h-32">
                      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                    </div>
                  ) : dependencies && dependencies.length > 0 ? (
                    <div className="space-y-2">
                      {dependencies.map((dep) => (
                        <div key={dep.id} className="p-2 bg-gray-50 rounded">
                          <div className="font-medium">{dep.name}</div>
                          <div className="text-sm text-gray-600">{dep.status}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">No dependencies</p>
                  )}
                </div>

                <div className="card">
                  <h3 className="text-lg font-semibold mb-3">Dependents</h3>
                  {dependentsLoading ? (
                    <div className="flex items-center justify-center h-32">
                      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                    </div>
                  ) : dependents && dependents.length > 0 ? (
                    <div className="space-y-2">
                      {dependents.map((dep) => (
                        <div key={dep.id} className="p-2 bg-gray-50 rounded">
                          <div className="font-medium">{dep.name}</div>
                          <div className="text-sm text-gray-600">{dep.status}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">No dependents</p>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="card flex items-center justify-center h-64">
              <div className="text-center">
                <Network className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Select a service to view its dependencies</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Explorer;
