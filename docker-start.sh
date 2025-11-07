#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "=========================================="
echo "Research Journal Management System"
echo "Docker Container Startup Script"
echo "=========================================="
echo ""

# Function to print colored messages
print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi
print_success "Docker found"

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi
print_success "Docker Compose found"

# Check if Docker daemon is running
if ! docker info &> /dev/null; then
    print_error "Docker daemon is not running. Please start Docker first."
    exit 1
fi
print_success "Docker daemon is running"

echo ""
echo "=========================================="
echo "Building and Starting Containers"
echo "=========================================="
echo ""

# Stop any running containers
print_info "Stopping any existing containers..."
docker-compose down 2>/dev/null || docker compose down 2>/dev/null

# Remove old volumes (optional - comment out to preserve data)
# print_warning "Removing old volumes..."
# docker-compose down -v 2>/dev/null || docker compose down -v 2>/dev/null

# Build and start containers
print_info "Building and starting containers (this may take a few minutes)..."
if docker-compose up --build -d 2>/dev/null || docker compose up --build -d 2>/dev/null; then
    print_success "Containers started successfully"
else
    print_error "Failed to start containers"
    exit 1
fi

echo ""
echo "=========================================="
echo "Container Status"
echo "=========================================="
echo ""

# Wait a moment for containers to initialize
sleep 5

# Show container status
docker-compose ps 2>/dev/null || docker compose ps 2>/dev/null

echo ""
echo "=========================================="
echo "Waiting for Services to be Ready"
echo "=========================================="
echo ""

# Wait for MySQL to be ready
print_info "Waiting for MySQL to be ready..."
MAX_RETRIES=30
RETRY_COUNT=0
while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if docker exec research-journal-mysql mysqladmin ping -h localhost -u root -proot --silent &> /dev/null; then
        print_success "MySQL is ready"
        break
    fi
    RETRY_COUNT=$((RETRY_COUNT+1))
    if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
        print_error "MySQL failed to start within expected time"
        exit 1
    fi
    sleep 2
done

# Wait for Backend to be ready
print_info "Waiting for Backend to be ready..."
RETRY_COUNT=0
while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if curl -sf http://localhost:8080/actuator/health &> /dev/null; then
        print_success "Backend is ready"
        break
    fi
    RETRY_COUNT=$((RETRY_COUNT+1))
    if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
        print_warning "Backend may not be fully ready yet, but continuing..."
        break
    fi
    sleep 2
done

# Wait for Frontend to be ready
print_info "Waiting for Frontend to be ready..."
RETRY_COUNT=0
while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if curl -sf http://localhost:80 &> /dev/null; then
        print_success "Frontend is ready"
        break
    fi
    RETRY_COUNT=$((RETRY_COUNT+1))
    if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
        print_warning "Frontend may not be fully ready yet, but continuing..."
        break
    fi
    sleep 2
done

echo ""
echo "=========================================="
echo "Application URLs"
echo "=========================================="
echo ""
print_success "Frontend:  http://localhost"
print_success "Backend:   http://localhost:8080"
print_success "MySQL:     localhost:3306"
echo ""
echo "=========================================="
echo "Useful Commands"
echo "=========================================="
echo ""
echo "View logs:"
echo "  docker-compose logs -f [service]"
echo ""
echo "Stop containers:"
echo "  docker-compose down"
echo ""
echo "Stop and remove volumes:"
echo "  docker-compose down -v"
echo ""
echo "Restart a service:"
echo "  docker-compose restart [service]"
echo ""
echo "View container status:"
echo "  docker-compose ps"
echo ""
echo "=========================================="
print_success "Setup complete! Open http://localhost in your browser"
echo "=========================================="
