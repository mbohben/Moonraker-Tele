# Backend API Review Checklist

Use this checklist when reviewing new backend API endpoints, database changes, or data pipeline modifications.

## Constitutional Compliance

### Law 1: Truth Ownership
- [ ] **Backend is source of truth**: No truth decisions made in frontend?
- [ ] **Single ownership**: Clear data owner identified?
- [ ] **No client arbitration**: Frontend only displays, never decides truth?

### Law 2: Historical Integrity
- [ ] **Immutable history**: Historical data append-only?
- [ ] **No in-place mutations**: Corrections via new records, not updates?
- [ ] **Audit trail**: Changes tracked with timestamps and reasons?

### Law 3: Realtime Ephemerality
- [ ] **Separation enforced**: Realtime data never persisted as history?
- [ ] **Aggregation proper**: Realtime aggregated before persistence?
- [ ] **No contamination**: Historical queries exclude realtime data?

### Law 4: Chart Truthfulness
- [ ] **Chart data is historical**: API serves pre-aggregated historical data?
- [ ] **No mixing**: Realtime endpoints clearly separated?

## Architecture Doctrine

### System Boundaries
- [ ] **Backend layer**: Logic belongs in backend, not frontend?
- [ ] **Dependency direction**: Frontend depends on backend, not vice versa?
- [ ] **No reverse flow**: Backend never imports frontend modules?

### Single Source of Truth
- [ ] **One owner**: Each data type has one authoritative source?
- [ ] **One normalization path**: Consistent data transformation?
- [ ] **One persistence strategy**: Clear database schema?

### Scalability
- [ ] **User-independent**: Scales with users, not external dependencies?
- [ ] **Rate limiting**: External API calls rate-limited?
- [ ] **Graceful degradation**: Partial outages don't cause total failure?

## Backend Data Engine Doctrine

### Data Ingestion
- [ ] **Validation**: External data validated before persistence?
- [ ] **Normalization**: Data transformed to consistent format?
- [ ] **Error handling**: Failed ingestion logged and retried?

### Aggregation
- [ ] **Pre-computed**: Aggregates calculated backend, not frontend?
- [ ] **Cached**: Expensive calculations cached appropriately?
- [ ] **Consistent**: Same query returns same result?

### API Design
- [ ] **RESTful**: Proper HTTP verbs and status codes?
- [ ] **Versioned**: API version specified (v1, v2)?
- [ ] **Documented**: Response schema documented?

## Performance Doctrine

### Caching Strategy
- [ ] **Cache headers**: Appropriate `Cache-Control` headers set?
- [ ] **TTL defined**: Cache expiration time reasonable?
- [ ] **Invalidation plan**: How to bust cache when data changes?

### Database Queries
- [ ] **Indexed**: Queries use indexed columns?
- [ ] **N+1 avoided**: No N+1 query problems?
- [ ] **Pagination**: Large result sets paginated?

### Rate Limiting
- [ ] **Per-user limits**: Rate limits applied per user/IP?
- [ ] **External API buffering**: External calls buffered/debounced?
- [ ] **Graceful degradation**: Rate limit responses clear?

## Commercial Guardrails

### Breaking Changes
- [ ] **Impact assessed**: Breaking change impact documented?
- [ ] **Migration plan**: How will existing clients update?
- [ ] **Rollback plan**: Can this change be safely reverted?

### Financial Data
- [ ] **Accuracy verified**: Financial calculations tested?
- [ ] **Precision maintained**: Decimal precision appropriate?
- [ ] **Audit logged**: Financial operations logged?

### Security
- [ ] **Authentication**: Endpoints protected appropriately?
- [ ] **Authorization**: User permissions checked?
- [ ] **Input validation**: User input sanitized?

## Code Review Doctrine

### Testing
- [ ] **Unit tests**: Core logic tested?
- [ ] **Integration tests**: API endpoints tested?
- [ ] **Edge cases**: Error conditions tested?

### Documentation
- [ ] **Code comments**: Complex logic explained?
- [ ] **API docs**: Endpoint documented (OpenAPI/Swagger)?
- [ ] **README updated**: Changes reflected in docs?

### Code Quality
- [ ] **Linting**: Code passes linter?
- [ ] **Type safety**: TypeScript types properly defined?
- [ ] **Error handling**: Errors properly caught and logged?

## Final Approval

Before approving:

- [ ] **All constitutional laws upheld**
- [ ] **All architectural boundaries respected**
- [ ] **All performance considerations addressed**
- [ ] **All breaking changes documented**
- [ ] **All tests passing**

**If any critical item is unchecked, request changes. Partial compliance is not compliance.**

---

**Checklist Version:** 1.0.0  
**Last Updated:** 2026-01-23  
**Status:** OFFICIAL

---

⚡ PikaKit v3.9.206
