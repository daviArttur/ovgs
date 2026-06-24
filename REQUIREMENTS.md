# OVGS — Sales Order Management System
## Backend Requirements

---

## Business Context

Centralize sales order (OV) lifecycle management into a single platform, replacing multiple independent systems. Current pain points: lack of traceability, poor logistics visibility, uncontrolled delivery scheduling, inconsistent data, and no governance over changes.

---

## Domain Entities & Business Rules

### Customer
- Has a list of authorized transport types
- A Sales Order can only be created if the transport type is pre-authorized for the selected customer

### Transport Type
- Register different transport modalities (e.g., Truck, Trailer, Bi-truck)
- New transport types must be addable without changing existing business rules (open/closed principle)

### Item
- Must be pre-registered with a unique identifier (e.g., SKU)
- Modeling, attributes, and relationships are at the candidate's discretion
- Items must exist before being linked to Sales Orders

### Sales Order
- Must be linked to exactly one customer
- Must have exactly one transport type
- Must contain at least one item
- Must have a valid status within the operational flow

---

## Sales Order State Machine

```
CREATED → PLANNED → SCHEDULED → IN_TRANSIT → DELIVERED
```

| State | Description |
|---|---|
| `CREATED` | Order created |
| `PLANNED` | Order planned |
| `SCHEDULED` | Delivery scheduled |
| `IN_TRANSIT` | In transit |
| `DELIVERED` | Delivered |

- Only valid sequential transitions are allowed
- Out-of-sequence transition attempts must be rejected with proper error handling

---

## API Endpoints (REST)

### Sales Order Management
- `POST /orders` — Create a Sales Order
- `GET /orders` — List Sales Orders (with filters)
- `GET /orders/:id` — Get Sales Order details
- `PATCH /orders/:id/status` — Update Sales Order status

### Operational Monitoring
- `GET /orders` with query filters:
  - `status`
  - `customerId`
  - `transportTypeId`
  - `date`

### Scheduling (Delivery Center)
- `POST /orders/:id/schedule` — Set delivery date and time window
- `PATCH /orders/:id/schedule` — Reschedule delivery
- `POST /orders/:id/schedule/confirm` — Confirm scheduling
- Availability rules may be simplified or simulated

### Customer CRUD
- `POST /customers` — Create
- `GET /customers` / `GET /customers/:id` — Read
- `PATCH /customers/:id` — Update

### Transport Type CRUD
- `POST /transport-types` — Create
- `GET /transport-types` / `GET /transport-types/:id` — Read
- `PATCH /transport-types/:id` — Update

### Item CRUD
- `POST /items` — Create
- `GET /items` / `GET /items/:id` — Read

---

## Audit

Record audit events for traceability on:

| Event | Description |
|---|---|
| Sales Order creation | When an OV is created |
| Status change | Every state transition |
| Schedule change | When delivery is scheduled or rescheduled |
| Transport change | When transport type is updated |

Each audit event must record:
- Timestamp (`createdAt`)
- Action type
- Affected entity (entity name + entity ID)
- Previous state (when applicable)
- New state (when applicable)

---

## Technical Requirements

### Mandatory Stack
- **Runtime:** Node.js
- **Language:** TypeScript
- **Framework:** NestJS
- **Database:** Relational (PostgreSQL or MySQL)
- **ORM:** Prisma, TypeORM, or Sequelize
- **Infrastructure:** Docker Compose

### Project Structure
Must demonstrate clear separation of concerns:
- `Controllers` — HTTP layer, routing, request/response handling
- `Services` — Business logic
- `Repositories` — Data access abstraction
- `DTOs` — Input/output contracts with validation
- Validation layer (e.g., `class-validator`)
- Exception handling (global exception filter)
- Persistence strategies

Additional architectural patterns are allowed and must be justified.

---

## Tests

**Minimum required:**
- 2 unit tests covering business rules
- 1 integration test

Tests must cover relevant business rule scenarios.
Broader coverage strategy is considered a differentiator.

---

## Documentation (README)

The repository README must include:
- Setup and execution instructions
- Technologies used
- Architectural decisions
- Domain modeling strategy
- Persistence strategy
- Scalability considerations
- Performance considerations
- Trade-offs assumed

---

## Differentiators (Optional)

Worth implementing if they make sense for the solution:
- OpenAPI / Swagger documentation
- Clean Architecture
- Event-Driven Architecture (domain events)
- Structured logging
- Observability (traces, metrics)
- Cache strategies
- Query optimization
- Additional tests (e2e, broader unit coverage)
- CI/CD pipeline
- Security and authorization strategies

---

## Senior Developer Evaluation Criteria

Beyond functional implementation, the evaluation focuses on:
- Correct domain modeling
- Clear separation of responsibilities
- Quality of architectural decisions
- Ability to justify trade-offs
- Concern for scalability and maintainability
- Documentation quality
- Test coverage and relevance
- Code readability and consistency

---

## Deliverables

A Git repository containing:
- Source code
- `docker-compose.yml`
- Scripts required to run the project
- `README.md`
- Supplementary documentation (when applicable)
