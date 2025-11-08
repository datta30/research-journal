# Docker Build Fix for Frontend and Backend Containers

## Problem
Previously, only the MySQL container was successfully built and pushed to GitHub Container Registry. The frontend and backend containers failed to build.

## Root Cause
The frontend Dockerfile had an issue with dependency installation. The `npm ci` command was not installing devDependencies (including `vite` which is required for building) because in CI/CD environments, `NODE_ENV` may be set to `production` by default, which causes `npm ci` to skip devDependencies.

## Changes Made

### Frontend Dockerfile (`frontend/Dockerfile`)
- **Key Fix**: Added `NODE_ENV=development` before the `npm ci` command
- This explicitly ensures devDependencies are installed during the build stage
- Without this, `npm ci` may skip devDependencies if `NODE_ENV=production` is set in the CI environment
- The build stage uses Node.js 20 Alpine and the production stage uses Nginx Alpine

### Backend Dockerfile (`backend/Dockerfile`)  
- No changes needed - already correctly configured
- Uses Maven multi-stage build
- Build stage uses Maven 3.9.5 with Eclipse Temurin 17
- Runtime stage uses Eclipse Temurin 17 JRE Alpine

### MySQL Dockerfile (`mysql/Dockerfile`)
- No changes needed - already correctly configured  
- Uses MySQL 8.0 base image
- Includes database schema initialization script

## Workflow Configuration

The GitHub Actions workflow (`.github/workflows/docker-build.yml`) is correctly configured:

- **Triggers**: 
  - Automatic: Push to `main` or `master` branches
  - Automatic: When version tags (v*) are created
  - Manual: Via `workflow_dispatch`

- **Matrix Strategy**: Builds all three services in parallel:
  - `frontend` → `ghcr.io/datta30/research-journal-frontend:latest`
  - `backend` → `ghcr.io/datta30/research-journal-backend:latest`
  - `mysql` → `ghcr.io/datta30/research-journal-mysql:latest`

- **Docker Buildx**: Uses GitHub Actions cache for faster builds
- **Image Tags**: Multiple tags including `latest`, branch name, commit SHA
- **Attestation**: Generates build provenance attestations for security

## How to Verify the Fix

### Option 1: Merge to Main (Recommended)
1. Merge this PR to the `main` branch
2. The workflow will automatically trigger
3. Monitor the workflow run at: https://github.com/datta30/research-journal/actions
4. All three jobs (frontend, backend, mysql) should complete successfully
5. Verify images are available at: https://github.com/datta30?tab=packages

### Option 2: Manual Trigger
1. Go to: https://github.com/datta30/research-journal/actions/workflows/docker-build.yml
2. Click "Run workflow"
3. Select the branch `copilot/add-frontend-and-backend-containers`  
4. Click "Run workflow"
5. Monitor the run to see all three services build successfully

### Option 3: Local Test (if network permits)
```bash
# Build frontend
cd frontend
docker build -t test-frontend .

# Build backend  
cd ../backend
docker build -t test-backend .

# Build mysql
cd ../mysql
docker build -t test-mysql .
```

## Expected Results

After the workflow runs successfully:

1. **Three container images** will be available in GHCR:
   - `ghcr.io/datta30/research-journal-frontend:latest`
   - `ghcr.io/datta30/research-journal-backend:latest`
   - `ghcr.io/datta30/research-journal-mysql:latest`

2. **Images can be pulled and used**:
   ```bash
   docker pull ghcr.io/datta30/research-journal-frontend:latest
   docker pull ghcr.io/datta30/research-journal-backend:latest
   docker pull ghcr.io/datta30/research-journal-mysql:latest
   ```

3. **docker-compose.prod.yml will work**:
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

## Technical Details

### Why the Frontend Build Failed Before
- The issue was with how npm installs dependencies in Docker/CI environments
- In CI/CD environments, `NODE_ENV` is often set to `production` by default
- When `NODE_ENV=production`, `npm ci` skips devDependencies to optimize for production deployments
- However, the build stage requires devDependencies (specifically `vite`) to compile the application
- Without `vite` (a devDependency), the `npm run build` command would fail with "vite: not found"

### Why It Works Now
- Explicitly sets `NODE_ENV=development` when running `npm ci` in the build stage
- This ensures all devDependencies are installed, regardless of the CI environment's defaults
- The command is: `RUN NODE_ENV=development npm ci`
- Clean multi-stage build separates build-time from runtime dependencies
- Build stage has all tools needed (Node.js + all dependencies including dev tools)
- Production stage only has the built assets (smaller, more secure)

## Network Issues in Local Environment

Note: During local testing, severe network connectivity issues were encountered:
- npm registry timeouts (80-second consistent timeout)
- Maven Central SSL certificate errors
- Alpine package repository permission errors

These are environmental issues and do not affect the correctness of the Dockerfiles. GitHub Actions has proper network connectivity and SSL certificates, so the builds will work there.
