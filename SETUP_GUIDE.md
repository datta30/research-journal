# 🚀 Complete Setup & Run Guide - Research Journal Management System

## ✅ Issues Fixed:
1. ✅ Maven wrapper created (no Maven installation needed)
2. ✅ Java compilation errors fixed
3. ✅ Setup script updated to use Maven wrapper
4. ✅ All imports cleaned up

---

## 📋 Prerequisites

Before starting, ensure you have:

1. **Java 17+** ✅ (You have Java 25 - Perfect!)
   ```bash
   java -version
   ```

2. **Node.js 18+** ✅ (You have Node 24 - Perfect!)
   ```bash
   node -v
   ```

3. **MySQL 8.0+** (Required - Install if not present)
   ```bash
   # Check if MySQL is installed
   mysql --version
   
   # If not installed, install MySQL:
   # Fedora/RHEL:
   sudo dnf install mysql-server
   sudo systemctl start mysqld
   sudo systemctl enable mysqld
   ```

---

## 🔧 Step-by-Step Setup

### Step 1: Install and Start MySQL (if needed)

```bash
# Install MySQL Server
sudo dnf install mysql-server

# Start MySQL service
sudo systemctl start mysqld
sudo systemctl enable mysqld

# Check status
sudo systemctl status mysqld

# Secure MySQL installation (optional but recommended)
sudo mysql_secure_installation
```

### Step 2: Create Database

```bash
# Login to MySQL (default password might be empty or 'root')
sudo mysql -u root -p

# Or if no password set:
sudo mysql -u root

# In MySQL console, run:
CREATE DATABASE research_journal_db;
CREATE USER 'root'@'localhost' IDENTIFIED BY 'root';
GRANT ALL PRIVILEGES ON research_journal_db.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Step 3: Navigate to Project Directory

```bash
cd /home/datta/Documents/cicd3
```

### Step 4: Run the Setup Script

```bash
./setup.sh
```

**Expected Output:**
```
==========================================
Research Journal Management System
Quick Setup Script
==========================================

Checking Java installation...
✓ Java found: openjdk version "25.0.1"
Checking Maven installation...
⚠ Maven not found. Will use Maven wrapper.
Checking Node.js installation...
✓ Node.js found: v24.11.0
Checking MySQL installation...
✓ MySQL found

==========================================
Setting up Backend...
==========================================
✓ Created uploads directory
Installing Maven dependencies...
[INFO] Downloading Maven (first time only)...
[INFO] Building jar: ...
✓ Backend dependencies installed

==========================================
Setting up Frontend...
==========================================
Installing npm dependencies...
✓ Frontend dependencies installed

==========================================
Setup Complete!
==========================================
```

### Step 5: Start the Backend (Terminal 1)

```bash
cd /home/datta/Documents/cicd3/backend

# Use Maven wrapper
./mvnw spring-boot:run
```

**Wait for this message:**
```
Started JournalManagementApplication in X.XXX seconds
```

### Step 6: Start the Frontend (Terminal 2 - Open NEW terminal)

```bash
cd /home/datta/Documents/cicd3/frontend

# Start frontend
npm run dev
```

**Expected Output:**
```
  VITE v5.0.8  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### Step 7: Open Browser

Visit: **http://localhost:5173**

---

## 🧪 Quick Test

### 1. Register a Test User

- Click "Don't have an account? Sign Up"
- Fill in:
  - Email: `test@example.com`
  - Password: `password123`
  - First Name: `Test`
  - Last Name: `User`
  - Roles: Select **AUTHOR**
- Click **Register**

### 2. Login

- Use the credentials you just created
- Click **Sign In**

### 3. Submit a Paper

- Click **Submit New Paper**
- Fill in:
  - Title: `Test Paper`
  - Abstract: `This is a test paper for the system`
  - Keywords: `test, demo`
  - Upload a PDF file (any PDF)
- Click **Submit**

### 4. Check Status

- You should see your paper in the "My Papers" table
- Status will be "SUBMITTED"
- Plagiarism check will be automatically performed

---

## 🔍 Troubleshooting

### Issue: MySQL Connection Failed

**Solution:**
```bash
# Check if MySQL is running
sudo systemctl status mysqld

# If not running, start it
sudo systemctl start mysqld

# Check credentials in application.properties
cat backend/src/main/resources/application.properties | grep datasource
```

### Issue: Port 8080 Already in Use

**Solution:**
```bash
# Find what's using port 8080
sudo lsof -i :8080

# Kill the process (replace PID)
sudo kill -9 PID

# Or change backend port in application.properties
# Edit: backend/src/main/resources/application.properties
# Change: server.port=8080 to server.port=8081
```

### Issue: Port 5173 Already in Use

**Solution:**
```bash
# Kill process using 5173
sudo lsof -i :5173
sudo kill -9 PID

# Or change frontend port in vite.config.js
# Edit: frontend/vite.config.js
# Change port: 5173 to port: 5174
```

### Issue: Maven Wrapper Download Fails

**Solution:**
```bash
# Install Maven system-wide
sudo dnf install maven

# Then run setup again
./setup.sh
```

### Issue: Frontend npm install fails

**Solution:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

---

## 📊 Complete Command Summary

### One-Time Setup:

```bash
# 1. Install MySQL (if needed)
sudo dnf install mysql-server
sudo systemctl start mysqld

# 2. Create Database
sudo mysql -u root -p
CREATE DATABASE research_journal_db;
EXIT;

# 3. Run Setup
cd /home/datta/Documents/cicd3
./setup.sh
```

### Every Time You Run:

**Terminal 1 (Backend):**
```bash
cd /home/datta/Documents/cicd3/backend
./mvnw spring-boot:run
```

**Terminal 2 (Frontend):**
```bash
cd /home/datta/Documents/cicd3/frontend
npm run dev
```

**Browser:**
```
http://localhost:5173
```

---

## 🎯 Quick Commands Reference

### Backend Commands:
```bash
# Clean and build
./mvnw clean install

# Run backend
./mvnw spring-boot:run

# Run tests
./mvnw test

# Package as JAR
./mvnw package
```

### Frontend Commands:
```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### MySQL Commands:
```bash
# Start MySQL
sudo systemctl start mysqld

# Stop MySQL
sudo systemctl stop mysqld

# Check status
sudo systemctl status mysqld

# Login to MySQL
mysql -u root -p
```

---

## 📝 Default Configuration

- **Backend URL**: http://localhost:8080
- **Frontend URL**: http://localhost:5173
- **Database Name**: research_journal_db
- **Database User**: root
- **Database Password**: root (change in production!)
- **JWT Expiration**: 24 hours
- **Max File Size**: 10MB

---

## 🎉 Success Indicators

### Backend Started Successfully:
```
Started JournalManagementApplication in X.XXX seconds (JVM running for X.XXX)
```

### Frontend Started Successfully:
```
➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### Database Connected:
```
HikariPool-1 - Start completed.
Hibernate: create table if not exists users...
```

---

## 🔐 Test Users to Create

Create these users for full testing:

### Author:
- Email: author@test.com
- Password: password123
- Role: AUTHOR

### Editor:
- Email: editor@test.com
- Password: password123
- Role: EDITOR

### Reviewer:
- Email: reviewer@test.com
- Password: password123
- Role: REVIEWER

---

## 📞 Need Help?

1. **Check Logs**: Look at terminal output for error messages
2. **Verify MySQL**: Ensure MySQL is running and accessible
3. **Check Ports**: Make sure 8080 and 5173 are available
4. **Browser Console**: Open Developer Tools (F12) to see frontend errors

---

## ✅ Verification Checklist

- [ ] MySQL installed and running
- [ ] Database `research_journal_db` created
- [ ] Setup script completed successfully
- [ ] Backend started on port 8080
- [ ] Frontend started on port 5173
- [ ] Can access http://localhost:5173
- [ ] Can register a new user
- [ ] Can login
- [ ] Can submit a paper

---

**🎊 Once all steps are complete, your Research Journal Management System is ready to use!**
