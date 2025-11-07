# Research Journal Management System

A comprehensive full-stack web application for managing research paper submissions, peer review workflows, revisions, plagiarism detection, and publication management.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [User Roles & Workflows](#user-roles--workflows)
- [Database Schema](#database-schema)
- [Screenshots](#screenshots)

## ✨ Features

### Author Portal
- **Submit Papers**: Upload research papers with title, abstract, keywords, and PDF files
- **Track Status**: Monitor submission status (Submitted, Under Review, Revision Required, etc.)
- **Submit Revisions**: Upload revised versions with change logs
- **Version History**: View all revisions and version history
- **Plagiarism Check**: View automated plagiarism detection results

### Editor Dashboard
- **Triage Submissions**: View and assign unassigned papers
- **Assign Reviewers**: Select and assign multiple reviewers per paper
- **Review Management**: Monitor review progress and reviewer recommendations
- **Final Decision**: Accept, reject, or request revisions based on reviews
- **Publishing**: Publish accepted papers for public access

### Reviewer Panel
- **Review Assignments**: View papers assigned for review
- **Submit Reviews**: Provide detailed reviews with recommendations
- **Scoring System**: Rate papers on quality, originality, clarity, and significance (1-10 scale)
- **Comments**: Add comprehensive feedback for authors and editors
- **Status Tracking**: Update review status (Pending, In Progress, Completed)

### Additional Features
- **Plagiarism Detection**: Automated similarity checking (simulated, integrable with real APIs)
- **Revision Tracking**: Complete version control with change logs
- **Multi-Reviewer Support**: Assign multiple reviewers per paper
- **Decision Aggregation**: Editors can view all reviews before making decisions
- **Public Archive**: Published papers accessible to everyone
- **Role-Based Access Control**: Secure authentication with JWT

## 🛠 Tech Stack

### Backend
- **Framework**: Spring Boot 3.2.0
- **Language**: Java 17
- **Build Tool**: Maven
- **Security**: Spring Security + JWT
- **ORM**: Spring Data JPA + Hibernate
- **Database**: MySQL 8.0+
- **File Upload**: Apache Commons IO

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **UI Library**: Material-UI (MUI) v5
- **HTTP Client**: Axios
- **Routing**: React Router v6
- **State Management**: React Context API

## 📁 Project Structure

```
cicd3/
├── backend/                    # Spring Boot Backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/research/journal/
│   │   │   │   ├── config/              # Security & App Configuration
│   │   │   │   ├── controller/          # REST Controllers
│   │   │   │   ├── dto/                 # Data Transfer Objects
│   │   │   │   ├── model/               # JPA Entities
│   │   │   │   ├── repository/          # JPA Repositories
│   │   │   │   ├── security/            # JWT & Authentication
│   │   │   │   ├── service/             # Business Logic
│   │   │   │   └── JournalManagementApplication.java
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/
│   ├── database/
│   │   └── schema.sql              # Database schema reference
│   └── pom.xml                      # Maven dependencies
│
└── frontend/                   # React Frontend
    ├── src/
    │   ├── components/              # Reusable components
    │   ├── context/                 # Auth Context
    │   ├── pages/                   # Page components
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── AuthorDashboard.jsx
    │   │   ├── EditorDashboard.jsx
    │   │   ├── ReviewerDashboard.jsx
    │   │   └── PublicPapers.jsx
    │   ├── services/                # API service layer
    │   ├── App.jsx
    │   └── main.jsx
    ├── index.html
    ├── package.json
    └── vite.config.js
```

## 📦 Prerequisites

Before running this application, ensure you have:

1. **Java Development Kit (JDK) 17** or higher
   ```bash
   java -version
   ```

2. **Maven 3.6+** (or use the included Maven wrapper)
   ```bash
   mvn -version
   ```

3. **MySQL 8.0+**
   ```bash
   mysql --version
   ```

4. **Node.js 18+** and **npm**
   ```bash
   node -version
   npm -version
   ```

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
cd /home/datta/Documents/cicd3
```

### 2. Database Setup

Create a MySQL database:

```sql
CREATE DATABASE research_journal_db;
CREATE USER 'root'@'localhost' IDENTIFIED BY 'root';
GRANT ALL PRIVILEGES ON research_journal_db.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
```

**Note**: The application will auto-create tables on first run using Hibernate DDL.

### 3. Backend Configuration

Edit `backend/src/main/resources/application.properties` if needed:

```properties
# Database credentials (change if different)
spring.datasource.username=root
spring.datasource.password=root

# JWT Secret (change in production!)
jwt.secret=yourSecretKeyForJWTTokenGenerationMustBeLongEnoughForHS512Algorithm

# File upload directory
file.upload-dir=./uploads
```

### 4. Install Backend Dependencies

```bash
cd backend
mvn clean install
```

### 5. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

## 🏃 Running the Application

### Start Backend (Port 8080)

**Option 1: Using Maven**
```bash
cd backend
mvn spring-boot:run
```

**Option 2: Using Java**
```bash
cd backend
mvn clean package
java -jar target/journal-management-1.0.0.jar
```

Backend will start at: `http://localhost:8080`

### Start Frontend (Port 5173)

```bash
cd frontend
npm run dev
```

Frontend will start at: `http://localhost:5173`

## 🔐 Default Test Users

Register users with different roles:

**Author**:
- Email: author@example.com
- Password: password123
- Roles: AUTHOR

**Editor**:
- Email: editor@example.com
- Password: password123
- Roles: EDITOR

**Reviewer**:
- Email: reviewer@example.com
- Password: password123
- Roles: REVIEWER

## 📡 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "affiliation": "University Name",
  "roles": ["AUTHOR"]
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "token": "jwt_token_here",
  "type": "Bearer",
  "userId": 1,
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe"
}
```

### Author Endpoints

#### Submit Paper
```http
POST /api/author/papers/submit
Authorization: Bearer {token}
Content-Type: multipart/form-data

title: Research Paper Title
abstractText: Paper abstract...
keywords: keyword1, keyword2
file: [PDF file]
```

#### Get My Papers
```http
GET /api/author/papers
Authorization: Bearer {token}
```

#### Submit Revision
```http
POST /api/author/papers/{id}/revise
Authorization: Bearer {token}
Content-Type: multipart/form-data

file: [PDF file]
changeLog: Changes made in this revision...
```

#### Get Paper Revisions
```http
GET /api/author/papers/{id}/revisions
Authorization: Bearer {token}
```

#### Get Plagiarism Check
```http
GET /api/author/papers/{id}/plagiarism
Authorization: Bearer {token}
```

### Editor Endpoints

#### Get Unassigned Papers
```http
GET /api/editor/papers/unassigned
Authorization: Bearer {token}
```

#### Get My Papers
```http
GET /api/editor/papers
Authorization: Bearer {token}
```

#### Assign Paper to Self
```http
PUT /api/editor/papers/{id}/assign
Authorization: Bearer {token}
```

#### Assign Reviewer
```http
POST /api/editor/papers/{paperId}/assign-reviewer
Authorization: Bearer {token}
Content-Type: application/json

{
  "reviewerId": 5
}
```

#### Get Available Reviewers
```http
GET /api/editor/reviewers
Authorization: Bearer {token}
```

#### Get Paper Reviews
```http
GET /api/editor/papers/{id}/reviews
Authorization: Bearer {token}
```

#### Make Final Decision
```http
PUT /api/editor/papers/{id}/decision
Authorization: Bearer {token}
Content-Type: application/json

{
  "decision": "ACCEPTED",
  "comments": "Paper accepted for publication"
}
```

### Reviewer Endpoints

#### Get My Reviews
```http
GET /api/reviewer/reviews
Authorization: Bearer {token}
```

#### Get Pending Reviews
```http
GET /api/reviewer/reviews/pending
Authorization: Bearer {token}
```

#### Submit Review
```http
PUT /api/reviewer/reviews/{id}/submit
Authorization: Bearer {token}
Content-Type: application/json

{
  "recommendation": "ACCEPT",
  "comments": "Excellent research work...",
  "qualityScore": 9,
  "originalityScore": 8,
  "clarityScore": 9,
  "significanceScore": 8
}
```

#### Update Review Status
```http
PUT /api/reviewer/reviews/{id}/status?status=IN_PROGRESS
Authorization: Bearer {token}
```

### Public Endpoints

#### Get Published Papers
```http
GET /api/papers/published
```

#### Get Paper Details
```http
GET /api/papers/{id}
```

## 👥 User Roles & Workflows

### Author Workflow
1. Register with AUTHOR role
2. Login to access Author Dashboard
3. Submit new paper with PDF file
4. Track submission status
5. View plagiarism check results
6. If revision required, upload revised version
7. View published papers in public archive

### Editor Workflow
1. Register with EDITOR role
2. Login to access Editor Dashboard
3. View unassigned papers and assign to self
4. Assign multiple reviewers to each paper
5. Monitor review progress
6. View all reviewer recommendations
7. Make final decision (Accept/Reject/Revise)
8. Publish accepted papers

### Reviewer Workflow
1. Register with REVIEWER role
2. Login to access Reviewer Dashboard
3. View assigned papers
4. Start review process
5. Submit detailed review with scores and recommendations
6. Track review status

## 🗄 Database Schema

### Main Tables

**users**: User accounts with roles
- id, email, password, firstName, lastName, affiliation, orcidId, active, timestamps

**user_roles**: User role assignments
- user_id, role (AUTHOR, EDITOR, REVIEWER, ADMIN)

**papers**: Research paper submissions
- id, title, abstractText, keywords, author_id, assigned_editor_id, status, filePath, currentVersion, timestamps

**reviews**: Peer reviews
- id, paper_id, reviewer_id, recommendation, comments, scores, status, timestamps

**revisions**: Paper version history
- id, paper_id, versionNumber, filePath, changeLog, uploadedAt

**plagiarism_checks**: Plagiarism detection results
- id, paper_id, similarityScore, status, matchedSources, remarks, checkedAt

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access Control**: Separate permissions for Authors, Editors, Reviewers
- **Password Encryption**: BCrypt hashing for passwords
- **CORS Configuration**: Controlled cross-origin access
- **Input Validation**: Bean validation on all inputs
- **File Upload Security**: Type checking and size limits

## 📝 Notes

1. **File Storage**: Uploaded files are stored in `./uploads` directory by default
2. **Plagiarism Detection**: Currently simulated; can integrate with Turnitin, iThenticate, or similar APIs
3. **Email Notifications**: Not implemented but can be added using Spring Mail
4. **File Download**: Can be implemented by serving files from upload directory
5. **Advanced Search**: Can be added for published papers
6. **Analytics Dashboard**: Can track submission rates, review times, etc.

## 🚧 Production Considerations

Before deploying to production:

1. Change JWT secret in `application.properties`
2. Use environment variables for sensitive data
3. Configure proper MySQL user with limited privileges
4. Enable HTTPS
5. Set up proper file storage (S3, Azure Blob, etc.)
6. Implement rate limiting
7. Add comprehensive logging
8. Set up monitoring and alerts
9. Implement email notifications
10. Add data backup strategies

## 🤝 Contributing

This is a complete working system. To extend:

1. Add real plagiarism detection API integration
2. Implement file download functionality
3. Add email notifications for status changes
4. Create admin dashboard for system management
5. Add advanced search and filtering
6. Implement analytics and reporting
7. Add support for supplementary materials
8. Implement discussion/comment threads

## 📄 License

This project is provided as-is for educational and development purposes.

## 🆘 Troubleshooting

**Database Connection Error**:
- Ensure MySQL is running
- Verify credentials in application.properties
- Check if database exists

**Port Already in Use**:
- Backend: Change `server.port` in application.properties
- Frontend: Change port in vite.config.js

**JWT Token Errors**:
- Ensure JWT secret is long enough (minimum 256 bits for HS512)
- Check token expiration settings

**File Upload Errors**:
- Ensure upload directory exists and has write permissions
- Check file size limits in application.properties

## 📞 Support

For issues or questions, please check:
1. Application logs in console
2. Browser console for frontend errors
3. MySQL logs for database issues
4. Network tab for API call failures

---

**Built with ❤️ using Spring Boot and React**
