import { useState, useCallback, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import ReactFlow, { Background, Controls, MiniMap, Node, Edge, useNodesState, useEdgesState, addEdge, Connection } from 'reactflow';
import 'reactflow/dist/style.css';
import { servicesApi } from '../api/client';
import { Service } from '../types/graph';
import { Loader2, Search, Network, ArrowUpRight, ArrowDownRight } from 'lucide-react';

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
        style: {
          background: node.criticality === 'high' ? '#fee2e2' : '#e0f2fe',
          border: '2px solid',
          borderColor: node.criticality === 'high' ? '#ef4444' : '#0ea5e9',
          borderRadius: '8px',
          padding: '8px',
          width: 150,
        },
      }));
      const flowEdges: Edge[] = graphData.relationships.map((rel: any, index: number) => ({
        id: rel.id || `edge-${index}`,
        source: rel.source,
        target: rel.target,
        label: rel.type,
        animated: true,
        style: { stroke: '#0ea5e9', strokeWidth: 2 },
        labelStyle: { fontSize: 10, fontWeight: 600 },
        labelBgStyle: { fill: '#ffffff', color: '#171717' },
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

  const selectedServiceData = services?.find((s) => s.id === selectedService);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[#171717]">Graph Explorer</h1>
        <p className="text-sm text-[#525252] mt-1">Explore service dependencies and relationships</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Service List */}
        <div className="lg:col-span-1">
          <div className="card">
            <div className="flex items-center space-x-2 mb-4">
              <Search className="h-4 w-4 text-[#a3a3a3]" />
              <input
                type="text"
                placeholder="Search services..."
                className="input flex-1"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="space-y-2 max-h-[600px] overflow-y-auto custom-scrollbar">
              {servicesLoading ? (
                <div className="flex items-center justify-center h-32">
                  <Loader2 className="h-6 w-6 loading-spinner" />
                </div>
              ) : filteredServices.length > 0 ? (
                filteredServices.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => setSelectedService(service.id)}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      selectedService === service.id
                        ? 'bg-[#e0f2fe] border border-[#0ea5e9]'
                        : 'bg-[#fafafa] hover:bg-[#f5f5f5] border border-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-[#171717] text-sm">{service.name}</span>
                      <div className={`w-2 h-2 rounded-full ${
                        service.criticality === 'high' ? 'bg-[#ef4444]' :
                        service.criticality === 'medium' ? 'bg-[#f59e0b]' :
                        'bg-[#22c55e]'
                      }`} />
                    </div>
                    <div className="text-xs text-[#525252]">{service.id}</div>
                  </button>
                ))
              ) : (
                <div className="empty-state">
                  <Search className="empty-state-icon" />
                  <h3 className="empty-state-title">No services found</h3>
                  <p className="empty-state-description">Try a different search term</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Service Details */}
        <div className="lg:col-span-3 space-y-6">
          {selectedService ? (
            <>
              {/* View Toggle */}
              <div className="flex items-center space-x-2 bg-[#fafafa] p-1 rounded-lg w-fit">
                <button
                  onClick={() => setShowGraph(false)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    !showGraph ? 'bg-white text-[#171717] shadow-sm' : 'text-[#525252] hover:text-[#171717]'
                  }`}
                >
                  Details
                </button>
                <button
                  onClick={() => setShowGraph(true)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    showGraph ? 'bg-white text-[#171717] shadow-sm' : 'text-[#525252] hover:text-[#171717]'
                  }`}
                >
                  Graph View
                </button>
              </div>

              {!showGraph ? (
                <>
                  {/* Service Details Card */}
                  <div className="card">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center space-x-3">
                        <div className="bg-[#e0f2fe] p-3 rounded-lg">
                          <Network className="h-6 w-6 text-[#0ea5e9]" />
                        </div>
                        <div>
                          <h2 className="text-lg font-semibold text-[#171717]">{selectedServiceData?.name}</h2>
                          <p className="text-sm text-[#525252]">{selectedServiceData?.id}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`badge ${
                          selectedServiceData?.status === 'active' ? 'badge-success' : 'badge-neutral'
                        }`}>
                          {selectedServiceData?.status}
                        </span>
                        <span className={`badge ${
                          selectedServiceData?.criticality === 'high' ? 'badge-danger' :
                          selectedServiceData?.criticality === 'medium' ? 'badge-warning' :
                          'badge-neutral'
                        }`}>
                          {selectedServiceData?.criticality}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-medium text-[#525252] uppercase tracking-wide">Description</label>
                        <p className="text-sm text-[#171717] mt-1">{selectedServiceData?.description || 'No description available'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Dependencies and Dependents */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="card">
                      <div className="section-header">
                        <h3 className="section-title flex items-center space-x-2">
                          <ArrowUpRight className="h-4 w-4" />
                          <span>Dependencies</span>
                        </h3>
                        <span className="badge badge-neutral">{dependencies?.length || 0}</span>
                      </div>
                      {depsLoading ? (
                        <div className="flex items-center justify-center h-32">
                          <Loader2 className="h-6 w-6 loading-spinner" />
                        </div>
                      ) : dependencies && dependencies.length > 0 ? (
                        <div className="space-y-2">
                          {dependencies.map((dep) => (
                            <div key={dep.id} className="flex items-center justify-between p-3 bg-[#fafafa] rounded-lg hover:bg-[#f5f5f5] transition-colors">
                              <div>
                                <div className="font-medium text-sm text-[#171717]">{dep.name}</div>
                                <div className="text-xs text-[#525252]">{dep.id}</div>
                              </div>
                              <span className={`badge ${
                                dep.status === 'active' ? 'badge-success' : 'badge-neutral'
                              }`}>
                                {dep.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="empty-state">
                          <ArrowUpRight className="empty-state-icon" />
                          <h3 className="empty-state-title">No dependencies</h3>
                          <p className="empty-state-description">This service has no upstream dependencies</p>
                        </div>
                      )}
                    </div>

                    <div className="card">
                      <div className="section-header">
                        <h3 className="section-title flex items-center space-x-2">
                          <ArrowDownRight className="h-4 w-4" />
                          <span>Dependents</span>
                        </h3>
                        <span className="badge badge-neutral">{dependents?.length || 0}</span>
                      </div>
                      {dependentsLoading ? (
                        <div className="flex items-center justify-center h-32">
                          <Loader2 className="h-6 w-6 loading-spinner" />
                        </div>
                      ) : dependents && dependents.length > 0 ? (
                        <div className="space-y-2">
                          {dependents.map((dep) => (
                            <div key={dep.id} className="flex items-center justify-between p-3 bg-[#fafafa] rounded-lg hover:bg-[#f5f5f5] transition-colors">
                              <div>
                                <div className="font-medium text-sm text-[#171717]">{dep.name}</div>
                                <div className="text-xs text-[#525252]">{dep.id}</div>
                              </div>
                              <span className={`badge ${
                                dep.status === 'active' ? 'badge-success' : 'badge-neutral'
                              }`}>
                                {dep.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="empty-state">
                          <ArrowDownRight className="empty-state-icon" />
                          <h3 className="empty-state-title">No dependents</h3>
                          <p className="empty-state-description">No services depend on this one</p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="card h-[600px]">
                  <div className="section-header">
                    <h2 className="section-title flex items-center space-x-2">
                      <Network className="h-5 w-5" />
                      <span>Dependency Graph</span>
                    </h2>
                    <div className="flex items-center space-x-2 text-xs text-[#525252]">
                      <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 rounded bg-[#fee2e2] border-2 border-[#ef4444]" />
                        <span>High Criticality</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 rounded bg-[#e0f2fe] border-2 border-[#0ea5e9]" />
                        <span>Standard</span>
                      </div>
                    </div>
                  </div>
                  {graphLoading ? (
                    <div className="flex items-center justify-center h-[500px]">
                      <Loader2 className="h-8 w-8 loading-spinner" />
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
                        <Background color="#e5e5e5" gap={16} />
                        <Controls className="bg-white border border-[#e5e5e5]" />
                        <MiniMap 
                          className="bg-white border border-[#e5e5e5]"
                          nodeColor={() => '#0ea5e9'}
                        />
                      </ReactFlow>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="card flex items-center justify-center h-64">
              <div className="empty-state">
                <Network className="empty-state-icon" />
                <h3 className="empty-state-title">Select a service</h3>
                <p className="empty-state-description">Choose a service from the list to view its dependencies</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Explorer;
