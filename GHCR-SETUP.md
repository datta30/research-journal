# GitHub Container Registry (GHCR) Setup

This repository uses GitHub Container Registry (GHCR) to store and distribute Docker images for the Research Journal application.

## Available Images

The following images are automatically built and published by GitHub Actions:

1. **Frontend**: `ghcr.io/YOUR_GITHUB_USERNAME/research-journal-frontend:latest`
2. **Backend**: `ghcr.io/YOUR_GITHUB_USERNAME/research-journal-backend:latest`
3. **MySQL**: `ghcr.io/YOUR_GITHUB_USERNAME/research-journal-mysql:latest`

Replace `YOUR_GITHUB_USERNAME` with your actual GitHub username or organization name.

## Image Tags

Images are tagged with the following patterns:
- `latest` - Latest build from the main branch
- `main` - Latest build from the main branch
- `v1.0.0` - Semantic version tags
- `main-<sha>` - Build from specific commit

## Pulling Images

### Public Access (if repository is public)
```bash
docker pull ghcr.io/YOUR_GITHUB_USERNAME/research-journal-frontend:latest
docker pull ghcr.io/YOUR_GITHUB_USERNAME/research-journal-backend:latest
docker pull ghcr.io/YOUR_GITHUB_USERNAME/research-journal-mysql:latest
```

### Authenticated Access (for private repositories)

1. **Create a Personal Access Token (PAT)**
   - Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Click "Generate new token (classic)"
   - Select scopes: `read:packages`
   - Generate and copy the token

2. **Login to GHCR**
   ```bash
   echo $GHCR_TOKEN | docker login ghcr.io -u YOUR_GITHUB_USERNAME --password-stdin
   ```

3. **Pull images**
   ```bash
   docker pull ghcr.io/YOUR_GITHUB_USERNAME/research-journal-frontend:latest
   ```

## Using with Docker Compose

### Development (build locally)
```bash
docker-compose up -d
```

### Production (use GHCR images)
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## Building and Pushing Images

Images are automatically built and pushed by GitHub Actions on:
- Push to `main` or `master` branches
- Creation of version tags (e.g., `v1.0.0`)
- Manual workflow dispatch

### Manual Build and Push

If you need to manually build and push:

```bash
# Login to GHCR
echo $GHCR_TOKEN | docker login ghcr.io -u YOUR_GITHUB_USERNAME --password-stdin

# Build and tag images
docker build -t ghcr.io/YOUR_GITHUB_USERNAME/research-journal-frontend:latest ./frontend
docker build -t ghcr.io/YOUR_GITHUB_USERNAME/research-journal-backend:latest ./backend
docker build -t ghcr.io/YOUR_GITHUB_USERNAME/research-journal-mysql:latest ./mysql

# Push images
docker push ghcr.io/YOUR_GITHUB_USERNAME/research-journal-frontend:latest
docker push ghcr.io/YOUR_GITHUB_USERNAME/research-journal-backend:latest
docker push ghcr.io/YOUR_GITHUB_USERNAME/research-journal-mysql:latest
```

## Image Details

### Frontend Image
- **Base**: nginx:alpine
- **Size**: ~50 MB
- **Exposed Port**: 80
- **Built with**: Node.js 20, Vite

### Backend Image
- **Base**: eclipse-temurin:17-jre-alpine
- **Size**: ~200 MB
- **Exposed Port**: 8080
- **Built with**: Maven, Spring Boot

### MySQL Image
- **Base**: mysql:8.0
- **Size**: ~500 MB
- **Exposed Port**: 3306
- **Includes**: Pre-configured schema

## Security

### Image Scanning
All images are automatically scanned for vulnerabilities using:
- **Trivy** - Comprehensive vulnerability scanner
- **CodeQL** - Static code analysis
- **Dependency scanning** - NPM and Maven dependency checks

### Best Practices
1. Images are built from official base images
2. Multi-stage builds reduce final image size
3. Non-root users in containers (where applicable)
4. Regular updates of base images
5. Automated security scanning in CI/CD

## Troubleshooting

### Authentication Issues
```bash
# Check if you're logged in
cat ~/.docker/config.json | grep ghcr.io

# Re-authenticate
docker logout ghcr.io
echo $GHCR_TOKEN | docker login ghcr.io -u YOUR_GITHUB_USERNAME --password-stdin
```

### Image Pull Errors
```bash
# Check if image exists
docker manifest inspect ghcr.io/YOUR_GITHUB_USERNAME/research-journal-frontend:latest

# Try with explicit tag
docker pull ghcr.io/YOUR_GITHUB_USERNAME/research-journal-frontend:main
```

### Permission Issues
- Ensure your GitHub token has `read:packages` scope
- Check repository visibility settings
- Verify package permissions in repository settings

## GitHub Actions Workflow

The Docker build workflow (`.github/workflows/docker-build.yml`) handles:
1. Building multi-architecture images (amd64/arm64)
2. Tagging with multiple tags
3. Pushing to GHCR
4. Generating build provenance attestations
5. Caching layers for faster builds

## Local Development

For local development, use the standard `docker-compose.yml`:
```bash
docker-compose up -d
```

This builds images locally without needing GHCR authentication.

## Production Deployment

See `AWS-DEPLOYMENT-PLAN.md` for detailed information on deploying to AWS using these GHCR images.
