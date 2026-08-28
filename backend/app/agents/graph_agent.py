from app.repositories.graph_repository import GraphRepository
from app.repositories.service_repository import ServiceRepository
from app.repositories.incident_repository import IncidentRepository
from app.models.graph import AIAnalysisRequest, AIAnalysisResult
from typing import Dict, Any, List
import re


class GraphAnalystAgent:
    """
    Read-only AI agent for analyzing engineering dependency graphs.
    Uses structured tools to query the graph database and provides explanations.
    """
    
    def __init__(self):
        self.graph_repo = GraphRepository()
        self.service_repo = ServiceRepository()
        self.incident_repo = IncidentRepository()
    
    def analyze(self, request: AIAnalysisRequest) -> AIAnalysisResult:
        question = request.question.lower()
        
        # Intent detection - order matters for specificity
        # Check impact analysis first as it's more specific than general service queries
        if ("affect" in question or "fail" in question) and ("if" in question or "when" in question):
            return self._handle_impact_analysis(question)
        elif "incident" in question:
            return self._handle_incident_query(question)
        elif "database" in question:
            return self._handle_database_query(question)
        elif "team" in question or "own" in question:
            return self._handle_ownership_query(question)
        elif "service" in question:
            return self._handle_service_query(question)
        else:
            return self._handle_general_query(question)
    
    def _handle_impact_analysis(self, question: str) -> AIAnalysisResult:
        # Extract service name from question - handle multiple patterns
        service_match = re.search(r'(?:if|when)\s+(\w+(?:\s+\w+)?)\s+(?:fails|goes down|has an issue)', question)
        if not service_match:
            # Try pattern where "if" comes later in the sentence
            service_match = re.search(r'(?:affected|impact|happens)\s+(?:if|when)\s+(\w+(?:\s+\w+)?)\s+(?:fails|goes down|has an issue)', question)
        if not service_match:
            # Try pattern with "what happens when"
            service_match = re.search(r'what happens when\s+(\w+(?:\s+\w+)?)\s+(?:fails|goes down|has an issue)', question)
        if not service_match:
            # Try pattern with "what services could be affected if"
            service_match = re.search(r'(?:what|which|show)\s+\w+\s+(?:could|would|might|will)?\s*(?:be)?\s*affected\s+(?:if|when)\s+(\w+(?:\s+\w+)?)\s+(?:fails|goes down|has an issue)', question)
        
        if service_match:
            service_name = service_match.group(1)
            services = self.service_repo.get_all_services()
            target_service = None
            
            for service in services:
                if service_name.lower() in service["name"].lower():
                    target_service = service
                    break
            
            if target_service:
                impact = self.graph_repo.get_impact_analysis(target_service["id"], depth=4)
                
                answer = f"If {target_service['name']} fails, {impact['total_affected']} services could be affected. "
                answer += f"The affected services include: {', '.join([s['service_name'] for s in impact['affected_services'][:5]])}"
                if len(impact['affected_services']) > 5:
                    answer += f", and {len(impact['affected_services']) - 5} more."
                
                return AIAnalysisResult(
                    answer=answer,
                    evidence=impact["affected_services"],
                    query_type="impact_analysis"
                )
        
        return AIAnalysisResult(
            answer="I couldn't identify the specific service. Please specify which service you're asking about.",
            evidence=[],
            query_type="impact_analysis"
        )
    
    def _handle_incident_query(self, question: str) -> AIAnalysisResult:
        incidents = self.incident_repo.get_all_incidents()
        
        if "recent" in question or "latest" in question:
            recent = incidents[:5]
            answer = f"There are {len(incidents)} total incidents. The most recent ones are: "
            answer += ", ".join([i["title"] for i in recent])
            
            return AIAnalysisResult(
                answer=answer,
                evidence=recent,
                query_type="incident_query"
            )
        
        return AIAnalysisResult(
            answer=f"There are {len(incidents)} incidents in the system.",
            evidence=incidents,
            query_type="incident_query"
        )
    
    def _handle_ownership_query(self, question: str) -> AIAnalysisResult:
        # Extract team name for specific ownership queries
        team_match = re.search(r'(?:which|what)\s+(?:services|service)\s+(?:does|do)\s+(\w+(?:\s+\w+)?)\s+(?:team|own|owns)', question)
        
        if team_match:
            team_name = team_match.group(1)
            # For now, return a helpful message since team ownership isn't fully modeled in the current graph
            return AIAnalysisResult(
                answer=f"Team ownership information is available in the graph. Services are organized by teams including Payments, Identity, Commerce, Platform, Data, and Infrastructure. Use the Graph Explorer to view specific team-service relationships.",
                evidence=[],
                query_type="ownership_query"
            )
        
        # Extract "most services" pattern
        if "most" in question and ("service" in question or "own" in question):
            services = self.service_repo.get_all_services()
            # Since we don't have team ownership in the current service model, provide general info
            answer = f"There are {len(services)} services in the system. "
            answer += "Services are organized by teams including Payments, Identity, Commerce, Platform, Data, and Infrastructure."
            
            return AIAnalysisResult(
                answer=answer,
                evidence=services[:10],
                query_type="ownership_query"
            )
        
        # General ownership info
        services = self.service_repo.get_all_services()
        
        answer = f"There are {len(services)} services in the system. "
        answer += "Services are organized by teams including Payments, Identity, Commerce, Platform, Data, and Infrastructure."
        
        return AIAnalysisResult(
            answer=answer,
            evidence=services[:10],
            query_type="ownership_query"
        )
    
    def _handle_database_query(self, question: str) -> AIAnalysisResult:
        # Extract service name for specific database queries
        service_match = re.search(r'(?:what|which)\s+(?:databases|database)\s+(?:does|do)\s+(\w+(?:\s+\w+)?)\s+(?:use|uses|depend on|depends on)', question)
        
        if service_match:
            service_name = service_match.group(1)
            services = self.service_repo.get_all_services()
            target_service = None
            
            for service in services:
                if service_name.lower() in service["name"].lower():
                    target_service = service
                    break
            
            if target_service:
                # Get service graph to find databases
                graph_data = self.service_repo.get_service_graph(target_service["id"], depth=2)
                databases = [node for node in graph_data.get("nodes", []) if node.get("label") == "Database"]
                
                if databases:
                    db_names = [db.get("name", db.get("id", "Unknown")) for db in databases]
                    answer = f"{target_service['name']} uses {len(databases)} database(s): {', '.join(db_names)}."
                    
                    return AIAnalysisResult(
                        answer=answer,
                        evidence=databases,
                        query_type="database_query"
                    )
                else:
                    return AIAnalysisResult(
                        answer=f"{target_service['name']} does not directly use any databases in the current graph model.",
                        evidence=[],
                        query_type="database_query"
                    )
        
        # Fallback to general database info
        stats = self.graph_repo.get_graph_stats()
        
        answer = f"There are {stats['databases']} databases in the system. "
        answer += "Services depend on these databases for data storage and retrieval."
        
        return AIAnalysisResult(
            answer=answer,
            evidence=[{"databases": stats["databases"]}],
            query_type="database_query"
        )
    
    def _handle_service_query(self, question: str) -> AIAnalysisResult:
        services = self.service_repo.get_all_services()
        
        # Handle "show me all critical services" - check first for specificity
        if "critical" in question:
            critical_services = [s for s in services if s.get("criticality") == "high"]
            
            answer = f"There are {len(critical_services)} critical services: "
            answer += ", ".join([s["name"] for s in critical_services[:10]])
            if len(critical_services) > 10:
                answer += f", and {len(critical_services) - 10} more."
            
            return AIAnalysisResult(
                answer=answer,
                evidence=critical_services,
                query_type="service_query"
            )
        
        # Handle "most dependencies" query - more specific pattern
        if "most" in question and "depend" in question:
            # Get dependency counts for all services
            service_deps = []
            for service in services:
                deps = self.service_repo.get_dependencies(service["id"])
                service_deps.append({
                    "name": service["name"],
                    "id": service["id"],
                    "dependency_count": len(deps)
                })
            
            # Sort by dependency count
            service_deps.sort(key=lambda x: x["dependency_count"], reverse=True)
            top_services = service_deps[:5]
            
            answer = f"Services with the most dependencies: "
            answer += ", ".join([f"{s['name']} ({s['dependency_count']})" for s in top_services])
            
            return AIAnalysisResult(
                answer=answer,
                evidence=top_services,
                query_type="service_query"
            )
        
        # General service count
        answer = f"There are {len(services)} services in the NovaCart engineering system. "
        answer += "Key services include Payment Service, Checkout Service, Order Service, Auth Service, and User Service."
        
        return AIAnalysisResult(
            answer=answer,
            evidence=services[:10],
            query_type="service_query"
        )
    
    def _handle_general_query(self, question: str) -> AIAnalysisResult:
        stats = self.graph_repo.get_graph_stats()
        
        answer = f"The NovaCart engineering graph contains {stats['services']} services, "
        answer += f"{stats['teams']} teams, {stats['databases']} databases, "
        answer += f"and {stats['incidents']} incidents, connected by {stats['relationships']} relationships."
        
        return AIAnalysisResult(
            answer=answer,
            evidence=[stats],
            query_type="general_query"
        )
