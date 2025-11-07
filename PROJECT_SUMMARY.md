# Research Journal Management System - Project Summary

## Overview
A complete full-stack web application for managing academic research paper submissions, peer review workflows, revisions, and publication management.

## Architecture

### Backend (Spring Boot)
```
Spring Boot 3.2.0
├── Security Layer (JWT + Spring Security)
├── REST API Layer (Controllers)
├── Service Layer (Business Logic)
├── Repository Layer (JPA)
└── Database Layer (MySQL)
```

### Frontend (React)
```
React 18 + Vite
├── Pages (Dashboards)
├── Components (Reusable UI)
├── Services (API Integration)
└── Context (State Management)
```

## Key Components

### 1. Authentication & Authorization
- JWT-based authentication
- Role-based access control (RBAC)
- BCrypt password hashing
- Token expiration management

### 2. Author Module
- Paper submission with file upload
- Status tracking
- Revision submission
- Version history
- Plagiarism check results

### 3. Editor Module
- Paper triage and assignment
- Reviewer assignment (multi-reviewer support)
- Review aggregation
- Final decision making
- Publication management

### 4. Reviewer Module
- Review assignment tracking
- Review submission with scoring
- Status updates
- Comment system

### 5. Plagiarism Detection
- Automated similarity checking (simulated)
- Integration-ready for external APIs
- Flagging system
- Manual review support

### 6. File Management
- Secure file upload/storage
- Version control
- File type validation
- Size limits

## Database Schema

### Core Tables
1. **users** - User accounts with authentication
2. **user_roles** - Role assignments (AUTHOR, EDITOR, REVIEWER)
3. **papers** - Paper submissions and metadata
4. **reviews** - Peer review records
5. **revisions** - Version history
6. **plagiarism_checks** - Similarity detection results

### Relationships
- User → Papers (1:N) - Author relationship
- User → Papers (1:N) - Editor assignment
- User → Reviews (1:N) - Reviewer assignment
- Paper → Reviews (1:N) - Multiple reviewers
- Paper → Revisions (1:N) - Version tracking
- Paper → PlagiarismCheck (1:1) - Similarity score

## API Endpoints

### Authentication (Public)
- POST /api/auth/register
- POST /api/auth/login

### Author (Requires AUTHOR role)
- POST /api/author/papers/submit
- GET /api/author/papers
- GET /api/author/papers/{id}
- POST /api/author/papers/{id}/revise
- GET /api/author/papers/{id}/revisions
- GET /api/author/papers/{id}/plagiarism

### Editor (Requires EDITOR role)
- GET /api/editor/papers/unassigned
- GET /api/editor/papers
- PUT /api/editor/papers/{id}/assign
- POST /api/editor/papers/{paperId}/assign-reviewer
- GET /api/editor/reviewers
- GET /api/editor/papers/{id}/reviews
- PUT /api/editor/papers/{id}/decision

### Reviewer (Requires REVIEWER role)
- GET /api/reviewer/reviews
- GET /api/reviewer/reviews/pending
- GET /api/reviewer/reviews/{id}
- PUT /api/reviewer/reviews/{id}/submit
- PUT /api/reviewer/reviews/{id}/status

### Public
- GET /api/papers/published
- GET /api/papers/{id}

## Workflow States

### Paper Status Flow
```
SUBMITTED → UNDER_REVIEW → REVISION_REQUIRED → REVISED
                         ↓
                     ACCEPTED → PUBLISHED
                         ↓
                     REJECTED
```

### Review Status Flow
```
PENDING → IN_PROGRESS → COMPLETED
```

### Review Recommendations
- ACCEPT
- MINOR_REVISION
- MAJOR_REVISION
- REJECT

## Security Features

1. **Authentication**
   - JWT tokens with 24-hour expiration
   - Secure password storage (BCrypt)
   - Token refresh capability

2. **Authorization**
   - Role-based access control
   - Endpoint-level security
   - Resource ownership verification

3. **Data Protection**
   - SQL injection prevention (JPA)
   - XSS protection
   - CORS configuration
   - Input validation

4. **File Security**
   - Type validation
   - Size limits
   - Secure storage

## Technology Choices

### Backend
- **Spring Boot**: Enterprise-grade framework, extensive ecosystem
- **Spring Security**: Robust authentication/authorization
- **JPA/Hibernate**: ORM for database abstraction
- **MySQL**: Reliable relational database
- **JWT**: Stateless authentication

### Frontend
- **React**: Popular, component-based UI library
- **Material-UI**: Professional UI components
- **Vite**: Fast build tool and dev server
- **Axios**: Promise-based HTTP client
- **React Router**: Client-side routing

## Scalability Considerations

### Current Implementation
- Monolithic architecture
- Single database instance
- Local file storage
- In-memory session management

### Future Enhancements
- Microservices architecture
- Database sharding/replication
- Cloud file storage (S3, Azure Blob)
- Redis for caching
- Message queue for async processing
- Elasticsearch for advanced search
- CDN for static assets

## Testing Strategy

### Unit Tests
- Service layer logic
- Repository queries
- Utility functions

### Integration Tests
- API endpoints
- Database operations
- Authentication flow

### E2E Tests
- User workflows
- File upload/download
- Multi-user scenarios

## Deployment

### Development
```bash
Backend: mvn spring-boot:run
Frontend: npm run dev
```

### Production
```bash
Backend: java -jar journal-management.jar
Frontend: npm run build → serve dist/
```

### Docker (Future)
```yaml
services:
  - database (MySQL)
  - backend (Spring Boot)
  - frontend (Nginx)
```

## Performance Metrics

### Expected Load
- 100-1000 concurrent users
- 10-50 paper submissions/day
- 20-100 reviews/week
- 1-10 MB file uploads

### Optimization
- Database indexing on foreign keys
- Lazy loading for relationships
- Pagination for large result sets
- File chunking for uploads
- Caching for published papers

## Monitoring & Logging

### Application Logs
- Spring Boot logging (Logback)
- Request/response logging
- Error tracking
- Authentication events

### Metrics (To Implement)
- API response times
- Database query performance
- File upload success rate
- User activity analytics

## Maintenance

### Regular Tasks
- Database backups
- Log rotation
- Security updates
- Dependency updates
- Performance monitoring

### Data Retention
- Active papers: Indefinite
- Published papers: Permanent
- User data: GDPR compliant
- Logs: 90 days

## Compliance

### Data Protection
- GDPR considerations
- User data encryption
- Right to be forgotten
- Data export capability

### Academic Standards
- Peer review ethics
- Plagiarism detection
- Version control
- Audit trail

## Future Enhancements

### Phase 2
1. Email notifications (submission, review, decision)
2. Real plagiarism API integration
3. File download functionality
4. Advanced search and filters
5. Analytics dashboard

### Phase 3
1. Discussion/comment threads
2. Supplementary materials support
3. Conference management
4. Special issue handling
5. Author collaboration tools

### Phase 4
1. Machine learning for paper classification
2. Automated reviewer matching
3. Citation network analysis
4. Impact factor calculation
5. Open peer review option

## Documentation

- **README.md**: Complete setup and usage guide
- **QUICKSTART.md**: Fast setup for developers
- **API Documentation**: REST endpoint details
- **Code Comments**: Inline documentation
- **Database Schema**: ERD and relationships

## Support & Maintenance

### Issue Tracking
- Bug reports
- Feature requests
- Security vulnerabilities
- Performance issues

### Version Control
- Git for source control
- Semantic versioning
- Branch strategy (main, develop, feature)
- Pull request reviews

---

**Version**: 1.0.0  
**Last Updated**: 2025-11-07  
**Maintainers**: Development Team  
**License**: Educational/Development Use
