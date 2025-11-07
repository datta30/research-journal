# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Prerequisites Check
- ✅ Java 17+ installed
- ✅ Maven 3.6+ installed (or use wrapper)
- ✅ MySQL 8.0+ running
- ✅ Node.js 18+ installed

### Step 1: Database Setup (1 minute)

```sql
mysql -u root -p
CREATE DATABASE research_journal_db;
exit;
```

### Step 2: Automated Setup (2 minutes)

**Linux/Mac:**
```bash
cd /home/datta/Documents/cicd3
./setup.sh
```

**Windows:**
```cmd
cd C:\path\to\cicd3
setup.bat
```

### Step 3: Start Backend (1 minute)

```bash
cd backend
mvn spring-boot:run
```

Wait for: `Started JournalManagementApplication`

### Step 4: Start Frontend (1 minute)

Open new terminal:
```bash
cd frontend
npm run dev
```

### Step 5: Access Application

Open browser: `http://localhost:5173`

---

## 🎯 Quick Test

1. **Register an Author**
   - Email: author@test.com
   - Password: password123
   - Role: AUTHOR

2. **Submit a Paper**
   - Click "Submit New Paper"
   - Fill in details
   - Upload a PDF file

3. **Register an Editor**
   - Open incognito/private window
   - Email: editor@test.com
   - Password: password123
   - Role: EDITOR

4. **Assign Paper**
   - View unassigned papers
   - Assign paper to yourself

5. **Register a Reviewer**
   - Email: reviewer@test.com
   - Password: password123
   - Role: REVIEWER

6. **Assign Reviewer** (as Editor)
   - Select paper
   - Assign reviewer

7. **Submit Review** (as Reviewer)
   - View assigned reviews
   - Submit review with scores

8. **Make Decision** (as Editor)
   - View reviews
   - Accept/Reject paper

9. **View Published Papers**
   - Go to `/papers`
   - Browse published research

---

## 📱 API Quick Test (Using curl)

### Register
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe",
    "roles": ["AUTHOR"]
  }'
```

### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Get My Papers (Replace TOKEN)
```bash
curl -X GET http://localhost:8080/api/author/papers \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 🔧 Common Issues

**Database Connection Failed**
```bash
# Check MySQL is running
sudo systemctl status mysql  # Linux
brew services list          # Mac

# Verify credentials in application.properties
backend/src/main/resources/application.properties
```

**Port 8080 Already in Use**
```bash
# Find process using port
lsof -i :8080  # Mac/Linux
netstat -ano | findstr :8080  # Windows

# Kill process or change port in application.properties
server.port=8081
```

**Port 5173 Already in Use**
```bash
# Change port in vite.config.js
server: {
  port: 5174
}
```

**npm install fails**
```bash
# Clear cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

---

## 🎨 Features Overview

| Feature | Author | Editor | Reviewer | Public |
|---------|--------|--------|----------|--------|
| Submit Paper | ✅ | ❌ | ❌ | ❌ |
| Track Status | ✅ | ❌ | ❌ | ❌ |
| Submit Revision | ✅ | ❌ | ❌ | ❌ |
| Assign Papers | ❌ | ✅ | ❌ | ❌ |
| Assign Reviewers | ❌ | ✅ | ❌ | ❌ |
| Make Decision | ❌ | ✅ | ❌ | ❌ |
| Submit Review | ❌ | ❌ | ✅ | ❌ |
| View Published | ✅ | ✅ | ✅ | ✅ |

---

## 📊 Default Configuration

- **Backend Port**: 8080
- **Frontend Port**: 5173
- **Database**: research_journal_db
- **Upload Directory**: ./uploads
- **JWT Expiration**: 24 hours
- **Max File Size**: 10MB

---

## 🌟 What's Next?

- Add email notifications
- Integrate real plagiarism API (Turnitin, iThenticate)
- Implement file download
- Add search functionality
- Create analytics dashboard
- Add admin panel
- Implement discussion threads
- Add support for supplementary materials

---

**Need Help?** Check the main README.md for detailed documentation.
