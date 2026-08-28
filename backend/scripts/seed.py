import sys
import os
from datetime import datetime, timedelta
from neo4j import GraphDatabase
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

COGNODB_URI = os.getenv("COGNODB_URI")
COGNODB_USERNAME = os.getenv("COGNODB_USERNAME")
COGNODB_PASSWORD = os.getenv("COGNODB_PASSWORD")


class SeedData:
    def __init__(self):
        self.driver = GraphDatabase.driver(
            COGNODB_URI,
            auth=(COGNODB_USERNAME, COGNODB_PASSWORD)
        )
    
    def close(self):
        self.driver.close()
    
    def clear_existing_data(self):
        """Clear existing data - use with caution"""
        with self.driver.session() as session:
            session.run("MATCH (n) DETACH DELETE n")
            print("Cleared existing data")
    
    def seed_teams(self):
        """Seed team nodes"""
        teams = [
            {"id": "team-payments", "name": "Payments"},
            {"id": "team-identity", "name": "Identity"},
            {"id": "team-commerce", "name": "Commerce"},
            {"id": "team-platform", "name": "Platform"},
            {"id": "team-data", "name": "Data"},
            {"id": "team-infrastructure", "name": "Infrastructure"},
        ]
        
        with self.driver.session() as session:
            for team in teams:
                session.run(
                    "MERGE (t:Team {id: $id}) "
                    "SET t.name = $name",
                    **team
                )
        print(f"Seeded {len(teams)} teams")
    
    def seed_developers(self):
        """Seed developer nodes"""
        developers = [
            {"id": "dev-1", "name": "Alice Chen", "role": "Senior Engineer"},
            {"id": "dev-2", "name": "Bob Smith", "role": "Tech Lead"},
            {"id": "dev-3", "name": "Carol Davis", "role": "Staff Engineer"},
            {"id": "dev-4", "name": "David Wilson", "role": "Senior Engineer"},
            {"id": "dev-5", "name": "Eva Martinez", "role": "Engineer"},
            {"id": "dev-6", "name": "Frank Johnson", "role": "Senior Engineer"},
            {"id": "dev-7", "name": "Grace Lee", "role": "Tech Lead"},
            {"id": "dev-8", "name": "Henry Brown", "role": "Engineer"},
            {"id": "dev-9", "name": "Ivy Wang", "role": "Senior Engineer"},
            {"id": "dev-10", "name": "Jack Miller", "role": "Engineer"},
            {"id": "dev-11", "name": "Kate Taylor", "role": "Staff Engineer"},
            {"id": "dev-12", "name": "Leo Anderson", "role": "Tech Lead"},
            {"id": "dev-13", "name": "Maria Garcia", "role": "Senior Engineer"},
            {"id": "dev-14", "name": "Nathan White", "role": "Engineer"},
            {"id": "dev-15", "name": "Olivia Harris", "role": "Senior Engineer"},
            {"id": "dev-16", "name": "Peter Clark", "role": "Tech Lead"},
            {"id": "dev-17", "name": "Quinn Lewis", "role": "Engineer"},
            {"id": "dev-18", "name": "Rachel Young", "role": "Staff Engineer"},
        ]
        
        with self.driver.session() as session:
            for dev in developers:
                session.run(
                    "MERGE (d:Developer {id: $id}) "
                    "SET d.name = $name, d.role = $role",
                    **dev
                )
        print(f"Seeded {len(developers)} developers")
    
    def seed_environments(self):
        """Seed environment nodes"""
        environments = [
            {"id": "env-prod", "name": "Production"},
            {"id": "env-staging", "name": "Staging"},
            {"id": "env-dev", "name": "Development"},
        ]
        
        with self.driver.session() as session:
            for env in environments:
                session.run(
                    "MERGE (e:Environment {id: $id}) "
                    "SET e.name = $name",
                    **env
                )
        print(f"Seeded {len(environments)} environments")
    
    def seed_services(self):
        """Seed service nodes"""
        services = [
            {"id": "svc-payment", "name": "Payment Service", "description": "Handles payment processing and transactions", "status": "active", "criticality": "high"},
            {"id": "svc-checkout", "name": "Checkout Service", "description": "Manages checkout flow and cart operations", "status": "active", "criticality": "high"},
            {"id": "svc-order", "name": "Order Service", "description": "Order management and processing", "status": "active", "criticality": "high"},
            {"id": "svc-auth", "name": "Auth Service", "description": "Authentication and authorization", "status": "active", "criticality": "high"},
            {"id": "svc-user", "name": "User Service", "description": "User profile and account management", "status": "active", "criticality": "medium"},
            {"id": "svc-inventory", "name": "Inventory Service", "description": "Inventory tracking and management", "status": "active", "criticality": "high"},
            {"id": "svc-notification", "name": "Notification Service", "description": "Email and push notifications", "status": "active", "criticality": "medium"},
            {"id": "svc-fraud", "name": "Fraud Service", "description": "Fraud detection and prevention", "status": "active", "criticality": "high"},
            {"id": "svc-billing", "name": "Billing Service", "description": "Billing and invoicing", "status": "active", "criticality": "medium"},
            {"id": "svc-search", "name": "Search Service", "description": "Product search and indexing", "status": "active", "criticality": "medium"},
            {"id": "svc-catalog", "name": "Catalog Service", "description": "Product catalog management", "status": "active", "criticality": "medium"},
            {"id": "svc-shipping", "name": "Shipping Service", "description": "Shipping and fulfillment", "status": "active", "criticality": "high"},
            {"id": "svc-cart", "name": "Cart Service", "description": "Shopping cart management", "status": "active", "criticality": "high"},
            {"id": "svc-product", "name": "Product Service", "description": "Product information management", "status": "active", "criticality": "medium"},
            {"id": "svc-pricing", "name": "Pricing Service", "description": "Price calculation and discounts", "status": "active", "criticality": "medium"},
            {"id": "svc-promotion", "name": "Promotion Service", "description": "Promotional campaigns and coupons", "status": "active", "criticality": "medium"},
            {"id": "svc-recommendation", "name": "Recommendation Service", "description": "Product recommendations", "status": "active", "criticality": "low"},
            {"id": "svc-analytics", "name": "Analytics Service", "description": "Business analytics and reporting", "status": "active", "criticality": "medium"},
            {"id": "svc-logging", "name": "Logging Service", "description": "Centralized logging and monitoring", "status": "active", "criticality": "medium"},
            {"id": "svc-config", "name": "Config Service", "description": "Configuration management", "status": "active", "criticality": "high"},
            {"id": "svc-webhook", "name": "Webhook Service", "description": "Webhook delivery and management", "status": "active", "criticality": "medium"},
            {"id": "svc-scheduler", "name": "Scheduler Service", "description": "Job scheduling and execution", "status": "active", "criticality": "medium"},
            {"id": "svc-file", "name": "File Service", "description": "File storage and management", "status": "active", "criticality": "medium"},
            {"id": "svc-email", "name": "Email Service", "description": "Email sending and templates", "status": "active", "criticality": "medium"},
            {"id": "svc-sms", "name": "SMS Service", "description": "SMS messaging and notifications", "status": "active", "criticality": "low"},
        ]
        
        with self.driver.session() as session:
            for svc in services:
                session.run(
                    "MERGE (s:Service {id: $id}) "
                    "SET s.name = $name, s.description = $description, "
                    "s.status = $status, s.criticality = $criticality",
                    **svc
                )
        print(f"Seeded {len(services)} services")
    
    def seed_apis(self):
        """Seed API nodes"""
        apis = [
            {"id": "api-payment-process", "name": "Process Payment", "method": "POST", "endpoint": "/api/v1/payments/process"},
            {"id": "api-payment-refund", "name": "Refund Payment", "method": "POST", "endpoint": "/api/v1/payments/refund"},
            {"id": "api-auth-login", "name": "Login", "method": "POST", "endpoint": "/api/v1/auth/login"},
            {"id": "api-auth-verify", "name": "Verify Token", "method": "GET", "endpoint": "/api/v1/auth/verify"},
            {"id": "api-user-profile", "name": "Get Profile", "method": "GET", "endpoint": "/api/v1/users/profile"},
            {"id": "api-inventory-check", "name": "Check Stock", "method": "GET", "endpoint": "/api/v1/inventory/check"},
            {"id": "api-order-create", "name": "Create Order", "method": "POST", "endpoint": "/api/v1/orders"},
            {"id": "api-search-query", "name": "Search Products", "method": "GET", "endpoint": "/api/v1/search"},
            {"id": "api-catalog-products", "name": "List Products", "method": "GET", "endpoint": "/api/v1/catalog/products"},
            {"id": "api-notification-send", "name": "Send Notification", "method": "POST", "endpoint": "/api/v1/notifications/send"},
            {"id": "api-cart-add", "name": "Add to Cart", "method": "POST", "endpoint": "/api/v1/cart/items"},
            {"id": "api-cart-remove", "name": "Remove from Cart", "method": "DELETE", "endpoint": "/api/v1/cart/items"},
            {"id": "api-product-details", "name": "Get Product", "method": "GET", "endpoint": "/api/v1/products/{id}"},
            {"id": "api-pricing-calculate", "name": "Calculate Price", "method": "POST", "endpoint": "/api/v1/pricing/calculate"},
            {"id": "api-promotion-validate", "name": "Validate Coupon", "method": "POST", "endpoint": "/api/v1/promotions/validate"},
            {"id": "api-recommendation-get", "name": "Get Recommendations", "method": "GET", "endpoint": "/api/v1/recommendations"},
            {"id": "api-analytics-report", "name": "Get Analytics", "method": "GET", "endpoint": "/api/v1/analytics/report"},
            {"id": "api-config-get", "name": "Get Config", "method": "GET", "endpoint": "/api/v1/config"},
            {"id": "api-webhook-create", "name": "Create Webhook", "method": "POST", "endpoint": "/api/v1/webhooks"},
            {"id": "api-webhook-delete", "name": "Delete Webhook", "method": "DELETE", "endpoint": "/api/v1/webhooks/{id}"},
            {"id": "api-schedule-job", "name": "Schedule Job", "method": "POST", "endpoint": "/api/v1/scheduler/jobs"},
            {"id": "api-file-upload", "name": "Upload File", "method": "POST", "endpoint": "/api/v1/files/upload"},
            {"id": "api-file-download", "name": "Download File", "method": "GET", "endpoint": "/api/v1/files/{id}"},
            {"id": "api-email-send", "name": "Send Email", "method": "POST", "endpoint": "/api/v1/emails/send"},
            {"id": "api-sms-send", "name": "Send SMS", "method": "POST", "endpoint": "/api/v1/sms/send"},
            {"id": "api-shipping-track", "name": "Track Shipment", "method": "GET", "endpoint": "/api/v1/shipping/track"},
            {"id": "api-billing-invoice", "name": "Get Invoice", "method": "GET", "endpoint": "/api/v1/billing/invoices/{id}"},
            {"id": "api-fraud-check", "name": "Fraud Check", "method": "POST", "endpoint": "/api/v1/fraud/check"},
        ]
        
        with self.driver.session() as session:
            for api in apis:
                session.run(
                    "MERGE (a:API {id: $id}) "
                    "SET a.name = $name, a.method = $method, a.endpoint = $endpoint",
                    **api
                )
        print(f"Seeded {len(apis)} APIs")
    
    def seed_databases(self):
        """Seed database nodes"""
        databases = [
            {"id": "db-users", "name": "Users Database", "engine": "PostgreSQL", "environment": "Production"},
            {"id": "db-orders", "name": "Orders Database", "engine": "PostgreSQL", "environment": "Production"},
            {"id": "db-inventory", "name": "Inventory Database", "engine": "PostgreSQL", "environment": "Production"},
            {"id": "db-payments", "name": "Payments Database", "engine": "PostgreSQL", "environment": "Production"},
            {"id": "db-cache", "name": "Redis Cache", "engine": "Redis", "environment": "Production"},
            {"id": "db-search", "name": "Elasticsearch", "engine": "Elasticsearch", "environment": "Production"},
            {"id": "db-analytics", "name": "Analytics Database", "engine": "MongoDB", "environment": "Production"},
            {"id": "db-logs", "name": "Logs Database", "engine": "PostgreSQL", "environment": "Production"},
            {"id": "db-sessions", "name": "Sessions Database", "engine": "Redis", "environment": "Production"},
            {"id": "db-events", "name": "Events Database", "engine": "PostgreSQL", "environment": "Production"},
        ]
        
        with self.driver.session() as session:
            for db in databases:
                session.run(
                    "MERGE (d:Database {id: $id}) "
                    "SET d.name = $name, d.engine = $engine, d.environment = $environment",
                    **db
                )
        print(f"Seeded {len(databases)} databases")
    
    def seed_incidents(self):
        """Seed incident nodes"""
        base_date = datetime.now()
        incidents = [
            {
                "id": "inc-001",
                "title": "Payment Gateway Timeout",
                "severity": "high",
                "status": "resolved",
                "created_at": (base_date - timedelta(days=5)).isoformat(),
                "description": "Payment gateway experienced timeouts affecting checkout flow"
            },
            {
                "id": "inc-002",
                "title": "Auth Service Latency",
                "severity": "medium",
                "status": "resolved",
                "created_at": (base_date - timedelta(days=3)).isoformat(),
                "description": "Authentication service showed increased latency during peak hours"
            },
            {
                "id": "inc-003",
                "title": "Inventory Sync Failure",
                "severity": "high",
                "status": "resolved",
                "created_at": (base_date - timedelta(days=7)).isoformat(),
                "description": "Inventory synchronization failed causing stock discrepancies"
            },
            {
                "id": "inc-004",
                "title": "Search Index Outage",
                "severity": "medium",
                "status": "resolved",
                "created_at": (base_date - timedelta(days=10)).isoformat(),
                "description": "Elasticsearch cluster experienced brief outage"
            },
            {
                "id": "inc-005",
                "title": "Fraud Detection Alert",
                "severity": "critical",
                "status": "investigating",
                "created_at": (base_date - timedelta(days=1)).isoformat(),
                "description": "Unusual payment patterns detected requiring investigation"
            },
            {
                "id": "inc-006",
                "title": "Cart Service Degradation",
                "severity": "medium",
                "status": "resolved",
                "created_at": (base_date - timedelta(days=12)).isoformat(),
                "description": "Cart service experienced performance degradation"
            },
            {
                "id": "inc-007",
                "title": "Notification Delivery Failure",
                "severity": "low",
                "status": "resolved",
                "created_at": (base_date - timedelta(days=15)).isoformat(),
                "description": "Email notifications were delayed for several hours"
            },
            {
                "id": "inc-008",
                "title": "Config Service Outage",
                "severity": "high",
                "status": "resolved",
                "created_at": (base_date - timedelta(days=20)).isoformat(),
                "description": "Configuration service was unavailable causing cascade failures"
            },
        ]
        
        with self.driver.session() as session:
            for inc in incidents:
                session.run(
                    "MERGE (i:Incident {id: $id}) "
                    "SET i.title = $title, i.severity = $severity, "
                    "i.status = $status, i.created_at = $created_at, i.description = $description",
                    **inc
                )
        print(f"Seeded {len(incidents)} incidents")
    
    def seed_deployments(self):
        """Seed deployment nodes"""
        base_date = datetime.now()
        deployments = [
            {"id": "dep-001", "version": "v1.2.3", "deployed_at": (base_date - timedelta(days=1)).isoformat(), "status": "success"},
            {"id": "dep-002", "version": "v1.2.2", "deployed_at": (base_date - timedelta(days=7)).isoformat(), "status": "success"},
            {"id": "dep-003", "version": "v1.2.1", "deployed_at": (base_date - timedelta(days=14)).isoformat(), "status": "success"},
            {"id": "dep-004", "version": "v1.2.0", "deployed_at": (base_date - timedelta(days=21)).isoformat(), "status": "success"},
            {"id": "dep-005", "version": "v1.1.9", "deployed_at": (base_date - timedelta(days=28)).isoformat(), "status": "rolled_back"},
            {"id": "dep-006", "version": "v1.1.8", "deployed_at": (base_date - timedelta(days=35)).isoformat(), "status": "success"},
            {"id": "dep-007", "version": "v1.1.7", "deployed_at": (base_date - timedelta(days=42)).isoformat(), "status": "success"},
            {"id": "dep-008", "version": "v1.1.6", "deployed_at": (base_date - timedelta(days=49)).isoformat(), "status": "success"},
            {"id": "dep-009", "version": "v1.1.5", "deployed_at": (base_date - timedelta(days=56)).isoformat(), "status": "success"},
            {"id": "dep-010", "version": "v1.1.4", "deployed_at": (base_date - timedelta(days=63)).isoformat(), "status": "success"},
            {"id": "dep-011", "version": "v1.1.3", "deployed_at": (base_date - timedelta(days=70)).isoformat(), "status": "success"},
            {"id": "dep-012", "version": "v1.1.2", "deployed_at": (base_date - timedelta(days=77)).isoformat(), "status": "success"},
        ]
        
        with self.driver.session() as session:
            for dep in deployments:
                session.run(
                    "MERGE (d:Deployment {id: $id}) "
                    "SET d.version = $version, d.deployed_at = $deployed_at, d.status = $status",
                    **dep
                )
        print(f"Seeded {len(deployments)} deployments")
    
    def seed_team_relationships(self):
        """Seed team-service ownership relationships"""
        team_services = {
            "team-payments": ["svc-payment", "svc-fraud", "svc-billing"],
            "team-identity": ["svc-auth", "svc-user"],
            "team-commerce": ["svc-checkout", "svc-order", "svc-catalog", "svc-cart", "svc-product", "svc-pricing", "svc-promotion"],
            "team-platform": ["svc-notification", "svc-search", "svc-config", "svc-logging", "svc-webhook", "svc-scheduler"],
            "team-data": ["svc-inventory", "svc-analytics", "svc-recommendation"],
            "team-infrastructure": ["svc-shipping", "svc-file", "svc-email", "svc-sms"],
        }
        
        with self.driver.session() as session:
            for team_id, service_ids in team_services.items():
                for service_id in service_ids:
                    session.run(
                        "MATCH (t:Team {id: $team_id}) "
                        "MATCH (s:Service {id: $service_id}) "
                        "MERGE (t)-[:OWNS]->(s)",
                        team_id=team_id, service_id=service_id
                    )
        print("Seeded team ownership relationships")
    
    def seed_developer_relationships(self):
        """Seed developer-team membership relationships"""
        developer_teams = {
            "dev-1": "team-payments",
            "dev-2": "team-payments",
            "dev-3": "team-payments",
            "dev-4": "team-identity",
            "dev-5": "team-identity",
            "dev-6": "team-identity",
            "dev-7": "team-commerce",
            "dev-8": "team-commerce",
            "dev-9": "team-commerce",
            "dev-10": "team-platform",
            "dev-11": "team-platform",
            "dev-12": "team-platform",
            "dev-13": "team-data",
            "dev-14": "team-data",
            "dev-15": "team-infrastructure",
            "dev-16": "team-infrastructure",
            "dev-17": "team-infrastructure",
            "dev-18": "team-platform",
        }
        
        with self.driver.session() as session:
            for dev_id, team_id in developer_teams.items():
                session.run(
                    "MATCH (d:Developer {id: $dev_id}) "
                    "MATCH (t:Team {id: $team_id}) "
                    "MERGE (d)-[:MEMBER_OF]->(t)",
                    dev_id=dev_id, team_id=team_id
                )
        print("Seeded developer membership relationships")
    
    def seed_service_dependencies(self):
        """Seed service dependency relationships"""
        dependencies = [
            ("svc-checkout", "svc-payment"),
            ("svc-checkout", "svc-inventory"),
            ("svc-checkout", "svc-user"),
            ("svc-checkout", "svc-cart"),
            ("svc-checkout", "svc-pricing"),
            ("svc-checkout", "svc-auth"),
            ("svc-checkout", "svc-config"),
            ("svc-order", "svc-payment"),
            ("svc-order", "svc-inventory"),
            ("svc-order", "svc-shipping"),
            ("svc-order", "svc-notification"),
            ("svc-order", "svc-auth"),
            ("svc-order", "svc-billing"),
            ("svc-order", "svc-config"),
            ("svc-payment", "svc-fraud"),
            ("svc-payment", "svc-billing"),
            ("svc-payment", "svc-config"),
            ("svc-payment", "svc-logging"),
            ("svc-auth", "svc-user"),
            ("svc-auth", "svc-config"),
            ("svc-auth", "svc-logging"),
            ("svc-user", "db-users"),
            ("svc-user", "svc-config"),
            ("svc-user", "svc-logging"),
            ("svc-order", "db-orders"),
            ("svc-order", "svc-logging"),
            ("svc-inventory", "db-inventory"),
            ("svc-inventory", "svc-config"),
            ("svc-inventory", "svc-logging"),
            ("svc-payment", "db-payments"),
            ("svc-search", "db-search"),
            ("svc-search", "svc-catalog"),
            ("svc-search", "svc-config"),
            ("svc-catalog", "svc-product"),
            ("svc-catalog", "db-users"),
            ("svc-catalog", "svc-config"),
            ("svc-notification", "db-cache"),
            ("svc-notification", "svc-config"),
            ("svc-notification", "svc-logging"),
            ("svc-fraud", "db-cache"),
            ("svc-fraud", "svc-analytics"),
            ("svc-fraud", "svc-logging"),
            ("svc-shipping", "svc-order"),
            ("svc-shipping", "svc-config"),
            ("svc-shipping", "svc-logging"),
            ("svc-billing", "svc-payment"),
            ("svc-billing", "db-orders"),
            ("svc-billing", "svc-user"),
            ("svc-billing", "svc-logging"),
            ("svc-cart", "svc-product"),
            ("svc-cart", "svc-inventory"),
            ("svc-cart", "svc-pricing"),
            ("svc-cart", "svc-auth"),
            ("svc-cart", "svc-config"),
            ("svc-product", "svc-catalog"),
            ("svc-product", "svc-inventory"),
            ("svc-product", "svc-pricing"),
            ("svc-product", "svc-config"),
            ("svc-pricing", "svc-promotion"),
            ("svc-pricing", "svc-product"),
            ("svc-pricing", "svc-config"),
            ("svc-promotion", "svc-catalog"),
            ("svc-promotion", "svc-user"),
            ("svc-promotion", "svc-config"),
            ("svc-recommendation", "svc-search"),
            ("svc-recommendation", "svc-analytics"),
            ("svc-recommendation", "svc-user"),
            ("svc-recommendation", "svc-config"),
            ("svc-analytics", "db-analytics"),
            ("svc-analytics", "svc-logging"),
            ("svc-analytics", "svc-config"),
            ("svc-logging", "db-cache"),
            ("svc-logging", "svc-config"),
            ("svc-config", "db-users"),
            ("svc-config", "svc-logging"),
            # Additional cross-dependencies
            ("svc-checkout", "svc-recommendation"),
            ("svc-order", "svc-recommendation"),
            ("svc-cart", "svc-promotion"),
            ("svc-product", "svc-search"),
            ("svc-catalog", "svc-search"),
            ("svc-user", "svc-notification"),
            ("svc-order", "svc-user"),
            ("svc-checkout", "svc-notification"),
            ("svc-payment", "svc-user"),
            ("svc-fraud", "svc-user"),
            ("svc-billing", "svc-fraud"),
            ("svc-shipping", "svc-inventory"),
            ("svc-analytics", "svc-search"),
            ("svc-analytics", "svc-catalog"),
            ("svc-recommendation", "svc-catalog"),
            ("svc-pricing", "svc-inventory"),
            # New service dependencies
            ("svc-webhook", "svc-config"),
            ("svc-webhook", "svc-logging"),
            ("svc-webhook", "svc-notification"),
            ("svc-scheduler", "svc-config"),
            ("svc-scheduler", "svc-logging"),
            ("svc-scheduler", "svc-analytics"),
            ("svc-file", "svc-config"),
            ("svc-file", "svc-logging"),
            ("svc-email", "svc-notification"),
            ("svc-email", "svc-config"),
            ("svc-email", "svc-logging"),
            ("svc-sms", "svc-notification"),
            ("svc-sms", "svc-config"),
            ("svc-sms", "svc-logging"),
            ("svc-notification", "svc-email"),
            ("svc-notification", "svc-sms"),
            ("svc-order", "svc-webhook"),
            ("svc-checkout", "svc-webhook"),
            ("svc-analytics", "svc-scheduler"),
            ("svc-billing", "svc-scheduler"),
            ("svc-user", "svc-file"),
            ("svc-product", "svc-file"),
            ("svc-config", "svc-file"),
        ]
        
        with self.driver.session() as session:
            for source, target in dependencies:
                session.run(
                    "MATCH (s1:Service {id: $source}) "
                    "MATCH (s2:Service {id: $target}) "
                    "MERGE (s1)-[:DEPENDS_ON]->(s2)",
                    source=source, target=target
                )
        print(f"Seeded {len(dependencies)} service dependencies")
    
    def seed_api_relationships(self):
        """Seed API-service relationships"""
        api_services = {
            "api-payment-process": "svc-payment",
            "api-payment-refund": "svc-payment",
            "api-auth-login": "svc-auth",
            "api-auth-verify": "svc-auth",
            "api-user-profile": "svc-user",
            "api-inventory-check": "svc-inventory",
            "api-order-create": "svc-order",
            "api-search-query": "svc-search",
            "api-catalog-products": "svc-catalog",
            "api-notification-send": "svc-notification",
            "api-cart-add": "svc-cart",
            "api-cart-remove": "svc-cart",
            "api-product-details": "svc-product",
            "api-pricing-calculate": "svc-pricing",
            "api-promotion-validate": "svc-promotion",
            "api-recommendation-get": "svc-recommendation",
            "api-analytics-report": "svc-analytics",
            "api-config-get": "svc-config",
            "api-webhook-create": "svc-webhook",
            "api-webhook-delete": "svc-webhook",
            "api-schedule-job": "svc-scheduler",
            "api-file-upload": "svc-file",
            "api-file-download": "svc-file",
            "api-email-send": "svc-email",
            "api-sms-send": "svc-sms",
            "api-shipping-track": "svc-shipping",
            "api-billing-invoice": "svc-billing",
            "api-fraud-check": "svc-fraud",
        }
        
        with self.driver.session() as session:
            for api_id, service_id in api_services.items():
                session.run(
                    "MATCH (a:API {id: $api_id}) "
                    "MATCH (s:Service {id: $service_id}) "
                    "MERGE (s)-[:EXPOSES]->(a)",
                    api_id=api_id, service_id=service_id
                )
        print("Seeded API-service relationships")
    
    def seed_database_relationships(self):
        """Seed service-database usage relationships"""
        service_databases = [
            ("svc-user", "db-users"),
            ("svc-user", "db-sessions"),
            ("svc-order", "db-orders"),
            ("svc-order", "db-events"),
            ("svc-inventory", "db-inventory"),
            ("svc-inventory", "db-events"),
            ("svc-payment", "db-payments"),
            ("svc-payment", "db-events"),
            ("svc-notification", "db-cache"),
            ("svc-notification", "db-events"),
            ("svc-search", "db-search"),
            ("svc-fraud", "db-cache"),
            ("svc-fraud", "db-analytics"),
            ("svc-billing", "db-orders"),
            ("svc-billing", "db-payments"),
            ("svc-analytics", "db-analytics"),
            ("svc-analytics", "db-logs"),
            ("svc-logging", "db-logs"),
            ("svc-logging", "db-cache"),
            ("svc-config", "db-users"),
            ("svc-auth", "db-sessions"),
            ("svc-auth", "db-users"),
            ("svc-cart", "db-sessions"),
            ("svc-checkout", "db-events"),
            ("svc-shipping", "db-events"),
            # Additional database relationships
            ("svc-webhook", "db-events"),
            ("svc-webhook", "db-logs"),
            ("svc-scheduler", "db-events"),
            ("svc-scheduler", "db-logs"),
            ("svc-file", "db-users"),
            ("svc-file", "db-logs"),
            ("svc-email", "db-events"),
            ("svc-email", "db-logs"),
            ("svc-sms", "db-events"),
            ("svc-sms", "db-logs"),
            ("svc-recommendation", "db-analytics"),
            ("svc-recommendation", "db-cache"),
            ("svc-pricing", "db-events"),
            ("svc-pricing", "db-cache"),
            ("svc-promotion", "db-users"),
            ("svc-promotion", "db-events"),
            ("svc-product", "db-inventory"),
            ("svc-catalog", "db-search"),
            ("svc-checkout", "db-sessions"),
            ("svc-order", "db-sessions"),
            ("svc-payment", "db-sessions"),
            ("svc-fraud", "db-logs"),
            ("svc-billing", "db-logs"),
            ("svc-shipping", "db-orders"),
            ("svc-inventory", "db-cache"),
            ("svc-search", "db-cache"),
            ("svc-catalog", "db-cache"),
            ("svc-user", "db-logs"),
            ("svc-auth", "db-logs"),
            ("svc-config", "db-cache"),
            ("svc-config", "db-logs"),
        ]
        
        with self.driver.session() as session:
            for service_id, db_id in service_databases:
                session.run(
                    "MATCH (s:Service {id: $service_id}) "
                    "MATCH (d:Database {id: $db_id}) "
                    "MERGE (s)-[:USES]->(d)",
                    service_id=service_id, db_id=db_id
                )
        print("Seeded service-database relationships")
    
    def seed_incident_relationships(self):
        """Seed incident-service relationships"""
        incident_services = [
            ("inc-001", "svc-payment"),
            ("inc-002", "svc-auth"),
            ("inc-003", "svc-inventory"),
            ("inc-004", "svc-search"),
            ("inc-005", "svc-fraud"),
            ("inc-006", "svc-cart"),
            ("inc-007", "svc-notification"),
            ("inc-008", "svc-config"),
        ]
        
        with self.driver.session() as session:
            for incident_id, service_id in incident_services:
                session.run(
                    "MATCH (i:Incident {id: $incident_id}) "
                    "MATCH (s:Service {id: $service_id}) "
                    "MERGE (i)-[:AFFECTS]->(s)",
                    incident_id=incident_id, service_id=service_id
                )
        print("Seeded incident-service relationships")
    
    def seed_deployment_relationships(self):
        """Seed deployment-service-environment relationships"""
        deployment_service_env = [
            ("dep-001", "svc-payment", "env-prod"),
            ("dep-002", "svc-auth", "env-prod"),
            ("dep-003", "svc-order", "env-prod"),
            ("dep-004", "svc-inventory", "env-prod"),
            ("dep-005", "svc-checkout", "env-staging"),
            ("dep-006", "svc-user", "env-prod"),
            ("dep-007", "svc-notification", "env-prod"),
            ("dep-008", "svc-search", "env-prod"),
            ("dep-009", "svc-fraud", "env-prod"),
            ("dep-010", "svc-billing", "env-prod"),
            ("dep-011", "svc-config", "env-prod"),
            ("dep-012", "svc-analytics", "env-prod"),
            ("dep-001", "svc-cart", "env-prod"),
            ("dep-002", "svc-product", "env-prod"),
            ("dep-003", "svc-pricing", "env-prod"),
            ("dep-004", "svc-promotion", "env-prod"),
            ("dep-005", "svc-recommendation", "env-staging"),
            ("dep-006", "svc-logging", "env-prod"),
            ("dep-007", "svc-webhook", "env-prod"),
            ("dep-008", "svc-scheduler", "env-prod"),
            ("dep-009", "svc-file", "env-prod"),
            ("dep-010", "svc-email", "env-prod"),
            ("dep-011", "svc-sms", "env-prod"),
            ("dep-012", "svc-shipping", "env-prod"),
        ]
        
        with self.driver.session() as session:
            for dep_id, service_id, env_id in deployment_service_env:
                session.run(
                    "MATCH (d:Deployment {id: $dep_id}) "
                    "MATCH (s:Service {id: $service_id}) "
                    "MATCH (e:Environment {id: $env_id}) "
                    "MERGE (d)-[:DEPLOYED_TO]->(e) "
                    "MERGE (d)-[:TRIGGERED]->(s)",
                    dep_id=dep_id, service_id=service_id, env_id=env_id
                )
        print("Seeded deployment relationships")
    
    def get_counts(self):
        """Get node and relationship counts"""
        with self.driver.session() as session:
            node_count = session.run("MATCH (n) RETURN count(n) AS count").single()["count"]
            rel_count = session.run("MATCH ()-[r]->() RETURN count(r) AS count").single()["count"]
            
            # Count by label
            labels = session.run("MATCH (n) RETURN labels(n)[0] AS label, count(n) AS count")
            label_counts = {record["label"]: record["count"] for record in labels}
            
            # Count by relationship type
            rel_types = session.run("MATCH ()-[r]->() RETURN type(r) AS type, count(r) AS count")
            rel_type_counts = {record["type"]: record["count"] for record in rel_types}
            
            return {
                "total_nodes": node_count,
                "total_relationships": rel_count,
                "nodes_by_label": label_counts,
                "relationships_by_type": rel_type_counts
            }
    
    def seed_all(self):
        """Seed all data"""
        print("Starting seed process...")
        
        # Clear existing data
        self.clear_existing_data()
        
        # Seed nodes
        self.seed_teams()
        self.seed_developers()
        self.seed_environments()
        self.seed_services()
        self.seed_apis()
        self.seed_databases()
        self.seed_incidents()
        self.seed_deployments()
        
        # Seed relationships
        self.seed_team_relationships()
        self.seed_developer_relationships()
        self.seed_service_dependencies()
        self.seed_api_relationships()
        self.seed_database_relationships()
        self.seed_incident_relationships()
        self.seed_deployment_relationships()
        
        # Get counts
        counts = self.get_counts()
        print("\n=== Seed Complete ===")
        print(f"Total Nodes: {counts['total_nodes']}")
        print(f"Total Relationships: {counts['total_relationships']}")
        print("\nNodes by Label:")
        for label, count in counts['nodes_by_label'].items():
            print(f"  {label}: {count}")
        print("\nRelationships by Type:")
        for rel_type, count in counts['relationships_by_type'].items():
            print(f"  {rel_type}: {count}")


if __name__ == "__main__":
    if not COGNODB_URI or not COGNODB_USERNAME or not COGNODB_PASSWORD:
        print("Error: Missing CognoDB credentials. Please check your .env file.")
        sys.exit(1)
    
    seeder = SeedData()
    try:
        seeder.seed_all()
    except Exception as e:
        print(f"Error during seeding: {e}")
        import traceback
        traceback.print_exc()
    finally:
        seeder.close()
