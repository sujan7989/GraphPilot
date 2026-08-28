# GraphPilot Graph Diagram

This document provides visual representations of the GraphPilot graph data model.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        NovaCart System                          │
└─────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
   ┌────▼────┐         ┌─────▼─────┐        ┌────▼────┐
   │  Teams  │         │ Services  │        │Incidents│
   └────┬────┘         └─────┬─────┘        └────┬────┘
        │                     │                     │
        │                     │                     │
   ┌────▼────┐         ┌─────▼─────┐              │
   │Developers│         │  APIs    │              │
   └─────────┘         └─────┬─────┘              │
                             │                     │
                        ┌─────▼─────┐              │
                        │ Databases │              │
                        └───────────┘              │
                             │                     │
                        ┌─────▼─────┐              │
                        │Deployments│              │
                        └─────┬─────┘              │
                              │                     │
                        ┌─────▼─────┐              │
                        │Environments│              │
                        └───────────┘              │
                                                   │
                              ┌────────────────────┘
                              │
                        ┌─────▼─────┐
                        │   AFFECTS  │
                        └───────────┘
```

## Detailed Relationship Diagram

```
                    ┌─────────────┐
                    │    Team     │
                    │             │
                    │ - id        │
                    │ - name      │
                    │ - desc      │
                    └──────┬──────┘
                           │
         ┌─────────────────┼─────────────────┐
         │ OWNS                            │
         │                                 │
    ┌────▼────┐                      ┌────▼────┐
    │Developer │                      │ Service │
    │          │                      │         │
    │ - id     │                      │ - id    │
    │ - name   │                      │ - name  │
    │ - role   │                      │ - desc  │
    └────┬────┘                      │ - status│
         │ MEMBER_OF                  │ - crit  │
         │                           └────┬────┘
         │                                │
         │                    ┌───────────┼───────────┐
         │                    │ DEPENDS_ON           │
         │                    │                       │
         │              ┌─────▼─────┐         ┌─────▼─────┐
         │              │  Service  │         │  Service  │
         │              │           │         │           │
         │              └─────┬─────┘         └─────┬─────┘
         │                    │                     │
         │                    │ EXPOSES             │ USES
         │                    │                     │
         │              ┌─────▼─────┐         ┌─────▼─────┐
         │              │    API    │         │ Database  │
         │              │           │         │           │
         │              │ - id      │         │ - id      │
         │              │ - name    │         │ - name    │
         │              │ - method  │         │ - engine  │
         │              │ - endpoint│         │ - env     │
         │              └───────────┘         └─────┬─────┘
         │                                         │
         │                                         │
         │                    ┌────────────────────┘
         │                    │
         │              ┌─────▼─────┐
         │              │Deployment │
         │              │           │
         │              │ - id      │
         │              │ - version │
         │              │ - date    │
         │              │ - status  │
         │              └─────┬─────┘
         │                    │
         │                    │ DEPLOYED_TO
         │                    │
         │              ┌─────▼─────┐
         │              │Environment│
         │              │           │
         │              │ - id      │
         │              │ - name    │
         │              └───────────┘
         │
         │
    ┌────▼──────────────────────────────────────────────────────┐
    │                      Incident                             │
    │                                                           │
    │  - id                                                    │
    │  - title                                                 │
    │  - severity (critical/high/medium/low)                   │
    │  - status (investigating/resolved/open)                  │
    │  - created_at                                            │
    │  - description                                          │
    └────┬────────────────────────────────────────────────────┘
         │
         │ AFFECTS
         │
         ▼
    ┌─────────┐
    │ Service │
    └─────────┘
```

## Service Dependency Flow Example

```
┌─────────────────────────────────────────────────────────────────┐
│                    Checkout Flow Example                        │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┐
│   Checkout   │
│   Service    │
└──────┬───────┘
       │ DEPENDS_ON
       ├──────────────────┬──────────────────┬──────────────┐
       │                  │                  │              │
┌──────▼──────┐   ┌──────▼──────┐   ┌──────▼──────┐  ┌─────▼─────┐
│   Payment   │   │  Inventory  │   │    User     │  │    Cart   │
│   Service   │   │   Service   │   │   Service   │  │  Service  │
└──────┬──────┘   └──────┬──────┘   └──────┬──────┘  └─────┬─────┘
       │                 │                 │              │
       │                 │                 │              │
┌──────▼──────┐   ┌──────▼──────┐   ┌──────▼──────┐  ┌─────▼─────┐
│     Fraud    │   │  Database   │   │  Database   │  │  Product  │
│   Service   │   │  Inventory  │   │    Users    │  │  Service  │
└──────┬──────┘   └─────────────┘   └─────────────┘  └─────┬─────┘
       │                                                 │
       │                                                 │
┌──────▼──────┐                                   ┌──────▼──────┐
│   Billing   │                                   │  Inventory  │
│   Service   │                                   │  Database   │
└──────┬──────┘                                   └─────────────┘
       │
       │
┌──────▼──────┐
│  Database   │
│  Payments   │
└─────────────┘
```

## Team-Service Ownership

```
┌─────────────────────────────────────────────────────────────────┐
│                      Team Structure                              │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│  Payments Team  │      │  Identity Team  │      │ Commerce Team   │
│                 │      │                 │      │                 │
│ • Payment Svc   │      │ • Auth Svc      │      │ • Checkout Svc  │
│ • Fraud Svc     │      │ • User Svc      │      │ • Order Svc     │
│ • Billing Svc   │      │                 │      │ • Catalog Svc   │
│                 │      │                 │      │ • Cart Svc      │
│ Dev: Alice, Bob │      │ Dev: Carol, Dave │      │ • Product Svc   │
│                 │      │                 │      │ • Pricing Svc   │
└─────────────────┘      └─────────────────┘      │ • Promotion Svc │
                                                  │                 │
                                                  │ Dev: Eva, Frank │
                                                  └─────────────────┘

┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│ Platform Team   │      │   Data Team     │      │ Infrastructure  │
│                 │      │                 │      │                 │
│ • Notification  │      │ • Inventory Svc  │      │ • Shipping Svc   │
│ • Search Svc    │      │ • Analytics Svc  │      │ • File Svc      │
│ • Config Svc    │      │ • Recommendation │      │ • Email Svc     │
│ • Webhook Svc   │      │                 │      │ • SMS Svc       │
│ • Scheduler Svc │      │ Dev: Ivy, Jack  │      │                 │
│ • Logging Svc   │      │                 │      │ Dev: Kate, Leo  │
│                 │      └─────────────────┘      └─────────────────┘
│ Dev: Grace,     │
│     Henry       │
└─────────────────┘
```

## Incident Impact Flow

```
┌─────────────────────────────────────────────────────────────────┐
│              Incident Impact Analysis Example                     │
└─────────────────────────────────────────────────────────────────┘

                    ┌──────────────┐
                    │   Incident   │
                    │ "Payment     │
                    │  Gateway     │
                    │  Timeout"    │
                    │  (High)      │
                    └──────┬───────┘
                           │ AFFECTS
                           │
                    ┌──────▼───────┐
                    │ Payment Svc   │
                    │ (1 hop)       │
                    └──────┬───────┘
                           │ DEPENDS_ON (reverse)
                           │
         ┌─────────────────┼─────────────────┐
         │                 │                 │
    ┌────▼────┐      ┌────▼────┐      ┌────▼────┐
    │ Checkout │      │  Order  │      │ Billing │
    │  Svc    │      │  Svc    │      │  Svc    │
    │ (2 hops)│      │(2 hops) │      │(2 hops) │
    └────┬────┘      └────┬────┘      └────┬────┘
         │                 │                 │
         │                 │                 │
    ┌────▼────┐      ┌────▼────┐      ┌────▼────┐
    │   Cart  │      │ Shipping│      │  Fraud  │
    │  Svc    │      │  Svc    │      │  Svc    │
    │ (3 hops)│      │(3 hops) │      │(3 hops) │
    └─────────┘      └─────────┘      └─────────┘

Total Affected: 8 services
Max Hops: 3
```

## Database Usage Pattern

```
┌─────────────────────────────────────────────────────────────────┐
│                  Database Usage Patterns                         │
└─────────────────────────────────────────────────────────────────┘

┌─────────────┐
│ db-users    │◄──┬── User Service
│ PostgreSQL  │   │   └── Auth Service
└─────────────┘   │   └── Config Service
                  │
┌─────────────┐   │
│ db-orders   │◄──┼── Order Service
│ PostgreSQL  │   │   └── Billing Service
└─────────────┘   │
                  │
┌─────────────┐   │
│ db-inventory│◄──┼── Inventory Service
│ PostgreSQL  │   │   └── Product Service
└─────────────┘   │   └── Pricing Service
                  │
┌─────────────┐   │
│ db-payments │◄──┼── Payment Service
│ PostgreSQL  │   │
└─────────────┘   │
                  │
┌─────────────┐   │
│ db-cache    │◄──┼── Notification Service
│ Redis       │   │   └── Fraud Service
└─────────────┘   │   └── Logging Service
                  │   └── Search Service
                  │   └── Catalog Service
                  │   └── Recommendation Service
                  │   └── Pricing Service
                  │
┌─────────────┐   │
│ db-search   │◄──┼── Search Service
│ Elasticsearch│  │
└─────────────┘   │
                  │
┌─────────────┐   │
│ db-analytics │◄──┼── Analytics Service
│ MongoDB     │   │   └── Fraud Service
└─────────────┘   │
                  │
┌─────────────┐   │
│ db-logs     │◄──┼── Analytics Service
│ PostgreSQL  │   │   └── Logging Service
└─────────────┘   │   └── Email Service
                  │   └── SMS Service
                  │   └── Fraud Service
                  │   └── Billing Service
                  │
┌─────────────┐   │
│ db-sessions │◄──┼── Auth Service
│ Redis       │   │   └── User Service
└─────────────┘   │   └── Cart Service
                  │   └── Payment Service
                  │
┌─────────────┐   │
│ db-events   │◄──┼── Order Service
│ PostgreSQL  │   │   └── Inventory Service
└─────────────┘   │   └── Payment Service
                  │   └── Notification Service
                  │   └── Checkout Service
                  │   └── Shipping Service
                  │   └── Webhook Service
                  │   └── Scheduler Service
                  │   └── Email Service
                  │   └── SMS Service
                  │   └── Pricing Service
                  │   └── Promotion Service
```

## Deployment Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    Deployment Flow                               │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┐
│ Deployment   │
│ v1.2.3       │
│ success      │
└──────┬───────┘
       │
       │ DEPLOYED_TO
       │
       ▼
┌──────────────┐
│ Production   │
│ Environment  │
└──────────────┘
       ▲
       │ TRIGGERED
       │
┌──────┴───────┐
│ Payment Svc  │
└──────────────┘
```

## API Exposure Pattern

```
┌─────────────────────────────────────────────────────────────────┐
│                    API Exposure Pattern                          │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┐
│ Payment Svc  │
└──────┬───────┘
       │ EXPOSES
       │
       ├──────────────────┬──────────────────┬──────────────────┐
       │                  │                  │                  │
┌──────▼──────┐   ┌──────▼──────┐   ┌──────▼──────┐  ┌──────▼──────┐
│ POST /api/   │   │ POST /api/   │   │ GET  /api/   │  │ GET  /api/   │
│ v1/payments/ │   │ v1/payments/ │   │ v1/payments/ │  │ v1/payments/ │
│ process      │   │ refund       │   │ status       │  │ history      │
└──────────────┘   └──────────────┘   └──────────────┘  └──────────────┘
```

## Summary Statistics

**Nodes:**
- Teams: 6
- Developers: 18
- Services: 25
- APIs: 28
- Databases: 10
- Incidents: 8
- Deployments: 12
- Environments: 3
- **Total: 110 nodes**

**Relationships:**
- OWNS (Team → Service): 25
- MEMBER_OF (Developer → Team): 18
- DEPENDS_ON (Service → Service): 102
- EXPOSES (Service → API): 28
- USES (Service → Database): 56
- AFFECTS (Incident → Service): 8
- DEPLOYED_TO (Deployment → Environment): 12
- TRIGGERED (Deployment → Service): 24
- **Total: 273 relationships**
