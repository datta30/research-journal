# 🚀 GitHub Setup & CI/CD Guide

## ✅ What We've Created

### GitHub Actions Workflows (5 pipelines)

1. **`ci.yml`** - Continuous Integration
   - Builds frontend (Node.js) and backend (Java/Maven)
   - Runs tests automatically
   - Validates Docker builds
   - Validates Kubernetes manifests
   - Lints Helm charts
   - Syntax checks Ansible playbooks
   - **Triggers**: On push/PR to main/master/develop

2. **`docker-build.yml`** - Docker Image Publishing
   - Builds frontend and backend Docker images
   - Pushes to GitHub Container Registry (ghcr.io)
   - Auto-tags with branch, SHA, and version
   - Creates build attestations
   - **Triggers**: On push to main, on tags, manual

3. **`deploy-k8s.yml`** - Kubernetes Deployment
   - Deploys to dev/staging/prod environments
   - Supports kubectl or Helm deployment
   - Creates namespace and secrets
   - Verifies rollout and runs smoke tests
   - **Triggers**: Manual only (workflow_dispatch)

4. **`deploy-ansible.yml`** - Ansible Automation
   - Runs any playbook (setup, deploy, update, backup, health-check, stop)
   - Supports dev/staging/prod inventories
   - Uploads execution logs
   - **Triggers**: Manual only (workflow_dispatch)

5. **`security.yml`** - Security Scanning
   - Dependency vulnerability scanning (npm audit, Maven)
   - Docker image scanning (Trivy)
   - Code security analysis (CodeQL)
   - Kubernetes manifest security (Checkov)
   - **Triggers**: On push/PR, weekly schedule, manual

---

## 📦 Step-by-Step GitHub Setup

### Step 1: Initialize Git and Commit

```bash
cd /home/datta/Documents/cicd3

# Initialize git (already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Full DevOps suite with Docker, Kubernetes, Helm, Ansible, and CI/CD"
```

### Step 2: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `cicd3` (or `research-journal`)
3. Description: "Full-stack research journal with 4 deployment methods + CI/CD"
4. Choose **Public** or **Private**
5. **DO NOT** initialize with README (we have one)
6. Click **Create repository**

### Step 3: Push to GitHub

```bash
# Add remote (replace datta30 with your GitHub username)
git remote add origin https://github.com/datta30/cicd3.git

# Rename branch to main (if needed)
git branch -M main

# Push
git push -u origin main
```

### Step 4: Enable GitHub Actions

**Actions are enabled by default!** But verify:

1. Go to your repo on GitHub
2. Click **Actions** tab
3. You should see workflows listed
4. First push will trigger `ci.yml` automatically

---

## 🔑 Required GitHub Secrets

For workflows to work, you need to set up secrets:

### For Kubernetes Deployment (`deploy-k8s.yml`)

Go to: **Settings → Secrets and variables → Actions → New repository secret**

| Secret Name | Description | How to Get |
|-------------|-------------|------------|
| `KUBE_CONFIG` | Base64-encoded kubeconfig | `cat ~/.kube/config \| base64 -w 0` |
| `MYSQL_ROOT_PASSWORD` | MySQL root password | Choose a strong password |

### For Ansible Deployment (`deploy-ansible.yml`)

| Secret Name | Description | How to Get |
|-------------|-------------|------------|
| `SSH_PRIVATE_KEY` | SSH private key for servers | `cat ~/.ssh/id_rsa` |
| `SSH_USER` | SSH username | Usually `ubuntu` or `ec2-user` |
| `SERVER_HOST` | Server hostname/IP | Your server IP |

### For Docker Image Publishing (automatic)

| Secret Name | Description | Notes |
|-------------|-------------|-------|
| `GITHUB_TOKEN` | GitHub auth token | **Auto-provided** by GitHub Actions |

---

## 🎯 How to Use Each Workflow

### 1. CI Pipeline (Automatic)

**Triggers automatically** on every push/PR to main/master/develop.

**What it does:**
- ✅ Builds frontend and backend
- ✅ Runs tests
- ✅ Validates all configs
- ✅ Reports failures in PR

**No action needed** - just push code!

```bash
git add .
git commit -m "Update frontend"
git push
# Watch Actions tab for results
```

---

### 2. Build Docker Images (Automatic on main)

**Triggers automatically** when you push to main branch.

**What it does:**
- 🐳 Builds frontend and backend images
- 📦 Pushes to `ghcr.io/datta30/cicd3-frontend:latest`
- 📦 Pushes to `ghcr.io/datta30/cicd3-backend:latest`

**Images available at:**
```
ghcr.io/datta30/cicd3-frontend:latest
ghcr.io/datta30/cicd3-backend:latest
```

**To use in Kubernetes:**
```yaml
image: ghcr.io/datta30/cicd3-frontend:latest
```

---

### 3. Deploy to Kubernetes (Manual)

**How to trigger:**

1. Go to **Actions** tab
2. Click **Deploy to Kubernetes**
3. Click **Run workflow** (top right)
4. Choose:
   - Environment: `dev`, `staging`, or `prod`
   - Method: `kubectl` or `helm`
5. Click **Run workflow**

**What it does:**
- ☸️ Connects to your Kubernetes cluster
- 🚀 Deploys/updates application
- ✅ Verifies pods are running
- 🧪 Runs smoke tests

---

### 4. Deploy with Ansible (Manual)

**How to trigger:**

1. Go to **Actions** tab
2. Click **Deploy with Ansible**
3. Click **Run workflow**
4. Choose:
   - Environment: `dev`, `staging`, or `prod`
   - Action: `setup-docker`, `deploy-app`, `health-check`, etc.
5. Click **Run workflow**

**What it does:**
- 📜 Runs chosen Ansible playbook
- 🔧 Executes on remote servers
- 📊 Uploads logs as artifacts

---

### 5. Security Scanning (Automatic Weekly)

**Triggers:**
- On push/PR to main
- Every Monday at midnight (scheduled)
- Manual run

**What it does:**
- 🔒 Scans dependencies for vulnerabilities
- 🐳 Scans Docker images (Trivy)
- 🔍 Analyzes code (CodeQL)
- ☸️ Checks Kubernetes security (Checkov)
- 📊 Reports in Security tab

**View results:**
- Go to **Security** tab → **Code scanning alerts**

---

## 🔧 Customization Guide

### Update Docker Registry

If using DockerHub instead of GitHub Container Registry:

**Edit `.github/workflows/docker-build.yml`:**
```yaml
env:
  REGISTRY: docker.io  # Change this
  IMAGE_NAME: your-dockerhub-username/cicd3  # Change this
```

**Add DockerHub secrets:**
- `DOCKERHUB_USERNAME`
- `DOCKERHUB_TOKEN`

### Add More Environments

**For Kubernetes:**

1. Create new values file: `helm-chart/research-journal/values-qa.yaml`
2. Update workflow to include `qa` in choices

**For Ansible:**

1. Create new inventory: `ansible/inventory/qa.yml`
2. Update workflow to include `qa` in choices

### Customize Build Commands

**Edit `.github/workflows/ci.yml`:**

```yaml
- name: Build frontend
  working-directory: ./frontend
  run: |
    npm ci
    npm run build
    npm run test  # Add your custom commands
```

---

## 📊 Monitoring Workflow Status

### GitHub Actions Dashboard

1. Go to repo → **Actions** tab
2. See all workflow runs
3. Click any run to see logs
4. Click job to see detailed logs

### Status Badges

Add to your README.md:

```markdown
[![CI/CD](https://github.com/datta30/cicd3/actions/workflows/ci.yml/badge.svg)](https://github.com/datta30/cicd3/actions/workflows/ci.yml)
[![Docker Build](https://github.com/datta30/cicd3/actions/workflows/docker-build.yml/badge.svg)](https://github.com/datta30/cicd3/actions/workflows/docker-build.yml)
[![Security](https://github.com/datta30/cicd3/actions/workflows/security.yml/badge.svg)](https://github.com/datta30/cicd3/actions/workflows/security.yml)
```

Replace `datta30` with your GitHub username.

---

## 🚀 Complete Demo Flow

### Scenario: Deploy to Production

1. **Develop locally**
   ```bash
   git checkout -b feature/new-feature
   # Make changes
   git add .
   git commit -m "Add new feature"
   git push origin feature/new-feature
   ```

2. **Create Pull Request**
   - Go to GitHub → Pull Requests → New
   - CI pipeline runs automatically ✅
   - Reviews code and tests
   - Merge if tests pass

3. **Automatic Docker Build**
   - Main branch updated
   - Docker images built and pushed automatically
   - Tagged with SHA and `latest`

4. **Manual Kubernetes Deployment**
   - Actions → Deploy to Kubernetes
   - Select `prod` environment
   - Select `helm` method
   - Run workflow
   - Application deployed to production! 🎉

5. **Verify with Ansible**
   - Actions → Deploy with Ansible
   - Select `prod` environment
   - Select `health-check` action
   - Confirms everything is running

6. **Security Check**
   - Security tab → View scan results
   - No vulnerabilities = ready to go! ✅

---

## 🎓 For Your Project Review

### Show These:

1. **GitHub Actions Dashboard**
   - "Here are 5 automated pipelines"
   - Show green checkmarks (passing builds)

2. **CI Pipeline Logs**
   - "Every commit triggers automatic testing"
   - Show build logs, test results

3. **Docker Images in Registry**
   - Settings → Packages
   - "Images automatically built and versioned"

4. **Manual Deployment Demo**
   - Run `Deploy to Kubernetes` workflow live
   - Show logs as it deploys
   - "Production deployment in 2 minutes!"

5. **Security Scanning Results**
   - Security tab
   - "Automated security checks on every commit"

### Talking Points:

- ✅ **Continuous Integration**: Every code change is automatically built and tested
- ✅ **Continuous Delivery**: Docker images automatically built and ready to deploy
- ✅ **Continuous Deployment**: Can deploy to any environment with one click
- ✅ **Security**: Automated vulnerability scanning and code analysis
- ✅ **GitOps**: Infrastructure as code, version controlled
- ✅ **Multi-Environment**: Separate pipelines for dev/staging/prod

---

## 🔥 Quick Commands Reference

```bash
# Initial setup
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/datta30/cicd3.git
git branch -M main
git push -u origin main

# Daily workflow
git add .
git commit -m "Description of changes"
git push

# Create feature branch
git checkout -b feature/name
git push -u origin feature/name

# Check workflow status
# Go to: https://github.com/datta30/cicd3/actions

# View Docker images
# Go to: https://github.com/datta30?tab=packages

# Run manual deployment
# Go to: Actions → Choose workflow → Run workflow
```

---

## ✅ Checklist Before Project Review

- [ ] Repository created on GitHub
- [ ] All code pushed to main branch
- [ ] CI pipeline passing (green checkmark)
- [ ] Docker images built successfully
- [ ] At least one manual deployment tested
- [ ] Security scan completed (no critical issues)
- [ ] README.md has status badges
- [ ] Secrets configured (if demonstrating deployment)
- [ ] Screenshots taken of Actions dashboard
- [ ] Practiced explaining each workflow

---

## 🎉 You're All Set!

You now have:
- ✅ 5 GitHub Actions workflows
- ✅ Automated CI/CD pipeline
- ✅ Docker image publishing
- ✅ Kubernetes/Ansible deployment automation
- ✅ Security scanning
- ✅ Professional DevOps setup

**This is production-grade CI/CD!** 🚀
