# Research Journal Management System - Docker Setup

## Docker Containers

This project includes a complete Docker setup with three containers:

1. **MySQL Database** - Stores all application data
2. **Spring Boot Backend** - REST API server
3. **React Frontend** - Web application UI

## Prerequisites

- Docker (version 20.10 or higher)
- Docker Compose (version 2.0 or higher)

## Quick Start

### Option 1: Using the startup script (Recommended)

```bash
./docker-start.sh
```

This script will:
- Check Docker installation
- Build all containers
- Start the services
- Wait for services to be ready
- Display access URLs

### Option 2: Manual Docker Compose commands

```bash
# Build and start all containers
docker-compose up --build -d

# View logs
docker-compose logs -f

# Stop all containers
docker-compose down

# Stop and remove volumes (deletes all data)
docker-compose down -v
```

## Accessing the Application

Once the containers are running:

- **Frontend**: http://localhost (port 80)
- **Backend API**: http://localhost:8080
- **MySQL Database**: localhost:3306
  - Username: `root`
  - Password: `root`
  - Database: `research_journal_db`

## Container Details

### MySQL Container
- Image: `mysql:8.0`
- Container name: `research-journal-mysql`
- Port: 3306
- Volume: `mysql_data` (persistent storage)
- Automatically initializes database schema

### Backend Container
- Built from: `./backend/Dockerfile`
- Container name: `research-journal-backend`
- Port: 8080
- Volume: `backend_uploads` (for uploaded files)
- Multi-stage build for optimized image size

### Frontend Container
- Built from: `./frontend/Dockerfile`
- Container name: `research-journal-frontend`
- Port: 80
- Nginx-based static file server
- Multi-stage build with Node.js and Nginx

## Useful Commands

### View container status
```bash
docker-compose ps
```

### View logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mysql
```

### Restart a service
```bash
docker-compose restart backend
docker-compose restart frontend
docker-compose restart mysql
```

### Execute commands in containers
```bash
# Access MySQL shell
docker exec -it research-journal-mysql mysql -u root -proot research_journal_db

# Access backend shell
docker exec -it research-journal-backend sh

# Access frontend shell
docker exec -it research-journal-frontend sh
```

### Rebuild specific container
```bash
docker-compose up --build -d backend
docker-compose up --build -d frontend
```

### Stop and remove everything
```bash
# Stop containers (keeps data)
docker-compose down

# Stop containers and remove volumes (deletes all data)
docker-compose down -v

# Stop containers and remove images
docker-compose down --rmi all
```

## Volume Management

The setup uses two persistent volumes:

1. **mysql_data**: Stores MySQL database files
2. **backend_uploads**: Stores uploaded paper files

To backup volumes:
```bash
# Backup MySQL data
docker run --rm -v cicd3_mysql_data:/data -v $(pwd):/backup alpine tar czf /backup/mysql-backup.tar.gz -C /data .

# Backup uploaded files
docker run --rm -v cicd3_backend_uploads:/data -v $(pwd):/backup alpine tar czf /backup/uploads-backup.tar.gz -C /data .
```

To restore volumes:
```bash
# Restore MySQL data
docker run --rm -v cicd3_mysql_data:/data -v $(pwd):/backup alpine tar xzf /backup/mysql-backup.tar.gz -C /data

# Restore uploaded files
docker run --rm -v cicd3_backend_uploads:/data -v $(pwd):/backup alpine tar xzf /backup/uploads-backup.tar.gz -C /data
```

## Troubleshooting

### Container fails to start
```bash
# Check logs for errors
docker-compose logs backend
docker-compose logs frontend
docker-compose logs mysql

# Rebuild from scratch
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

### Port conflicts
If ports 80, 8080, or 3306 are already in use, you can modify them in `docker-compose.yml`:

```yaml
services:
  frontend:
    ports:
      - "3000:80"  # Change 3000 to any available port
  backend:
    ports:
      - "8081:8080"  # Change 8081 to any available port
  mysql:
    ports:
      - "3307:3306"  # Change 3307 to any available port
```

### Database connection issues
```bash
# Verify MySQL is running
docker exec research-journal-mysql mysqladmin ping -h localhost -u root -proot

# Check if schema was initialized
docker exec -it research-journal-mysql mysql -u root -proot research_journal_db -e "SHOW TABLES;"
```

### Frontend not loading
```bash
# Check if Nginx is running
docker exec research-journal-frontend nginx -t

# Rebuild frontend
docker-compose up --build -d frontend
```

## Development Mode

For development with hot-reloading, you can mount local directories:

```yaml
services:
  backend:
    volumes:
      - ./backend/src:/app/src
  frontend:
    volumes:
      - ./frontend/src:/app/src
```

However, this requires configuring the containers for development mode.

## Production Considerations

Before deploying to production:

1. **Change default passwords** in `docker-compose.yml`
2. **Update JWT_SECRET** to a secure random value
3. **Enable HTTPS** using a reverse proxy (Nginx, Traefik)
4. **Set up backup strategy** for volumes
5. **Configure resource limits** for containers
6. **Enable Docker logging drivers**
7. **Use Docker secrets** for sensitive data

## Network Architecture

All containers are connected via a custom bridge network (`research-journal-network`) which allows:
- Service discovery by container name
- Isolated network communication
- Better security

## Health Checks

All containers include health checks:
- MySQL: `mysqladmin ping`
- Backend: Spring Boot Actuator health endpoint
- Frontend: HTTP response check

## Building for Production

To create optimized production builds:

```bash
# Build without cache
docker-compose build --no-cache

# Pull latest base images
docker-compose pull
docker-compose build

# Export images
docker save research-journal-backend:latest | gzip > backend-image.tar.gz
docker save research-journal-frontend:latest | gzip > frontend-image.tar.gz
```
