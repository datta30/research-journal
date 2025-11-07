# CI/CD Pipeline Architecture

## 🔄 Complete CI/CD Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         DEVELOPER WORKFLOW                                   │
└─────────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
                    ┌────────────────────────────────┐
                    │  1. Code Changes (Local)       │
                    │  - Edit frontend/backend       │
                    │  - Test locally                │
                    │  - git add, commit, push       │
                    └────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              GITHUB REPOSITORY                               │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │  Code: frontend/, backend/, kubernetes/, helm-chart/, ansible/       │  │
│  │  Config: .github/workflows/*.yml                                     │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
                                     │
                    ┌────────────────┴────────────────┐
                    │                                 │
                    ▼                                 ▼
    ┌───────────────────────────┐     ┌──────────────────────────────┐
    │  AUTOMATIC TRIGGERS       │     │  MANUAL TRIGGERS             │
    ├───────────────────────────┤     ├──────────────────────────────┤
    │ • Push to main/develop    │     │ • Deploy to Kubernetes       │
    │ • Pull Request            │     │ • Run Ansible playbooks      │
    │ • Schedule (weekly)       │     │ • Security scan on-demand    │
    └───────────────────────────┘     └──────────────────────────────┘
                    │                                 │
                    └────────────────┬────────────────┘
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         GITHUB ACTIONS WORKFLOWS                             │
└─────────────────────────────────────────────────────────────────────────────┘

    ┌─────────────────────────────────────────────────────────────────────┐
    │  WORKFLOW 1: CI Pipeline (ci.yml)                                   │
    ├─────────────────────────────────────────────────────────────────────┤
    │  Trigger: Push/PR to main, develop                                  │
    │                                                                       │
    │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
    │  │  Frontend    │  │  Backend     │  │  Validation  │             │
    │  │  Build       │  │  Build       │  │              │             │
    │  ├──────────────┤  ├──────────────┤  ├──────────────┤             │
    │  │ • npm ci     │  │ • mvn clean  │  │ • Docker     │             │
    │  │ • npm build  │  │ • mvn test   │  │ • Kubernetes │             │
    │  │ • npm test   │  │ • Package    │  │ • Helm lint  │             │
    │  │              │  │   jar        │  │ • Ansible    │             │
    │  └──────────────┘  └──────────────┘  └──────────────┘             │
    │         │                  │                  │                     │
    │         └──────────────────┴──────────────────┘                     │
    │                            │                                         │
    │         ┌──────────────────▼──────────────────┐                     │
    │         │  ✅ All Tests Pass                  │                     │
    │         │  ✅ Artifacts Uploaded              │                     │
    │         └─────────────────────────────────────┘                     │
    └─────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
    ┌─────────────────────────────────────────────────────────────────────┐
    │  WORKFLOW 2: Docker Build (docker-build.yml)                        │
    ├─────────────────────────────────────────────────────────────────────┤
    │  Trigger: Push to main, tags, manual                                │
    │                                                                       │
    │  ┌──────────────────────┐       ┌──────────────────────┐           │
    │  │  Build Frontend      │       │  Build Backend       │           │
    │  │  Docker Image        │       │  Docker Image        │           │
    │  ├──────────────────────┤       ├──────────────────────┤           │
    │  │ • Multi-stage build  │       │ • Multi-stage build  │           │
    │  │ • Optimize layers    │       │ • Maven build        │           │
    │  │ • Tag versions       │       │ • Tag versions       │           │
    │  └──────────────────────┘       └──────────────────────┘           │
    │           │                               │                          │
    │           └───────────────┬───────────────┘                          │
    │                           ▼                                          │
    │       ┌───────────────────────────────────────┐                     │
    │       │  Push to GitHub Container Registry    │                     │
    │       │  ghcr.io/username/cicd3-frontend      │                     │
    │       │  ghcr.io/username/cicd3-backend       │                     │
    │       └───────────────────────────────────────┘                     │
    └─────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
    ┌─────────────────────────────────────────────────────────────────────┐
    │  WORKFLOW 3: Security Scanning (security.yml)                       │
    ├─────────────────────────────────────────────────────────────────────┤
    │  Trigger: Push/PR, weekly schedule, manual                          │
    │                                                                       │
    │  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐   │
    │  │ Dependency │  │   Docker   │  │   CodeQL   │  │ Kubernetes │   │
    │  │   Scan     │  │Image Scan  │  │   (SAST)   │  │  Security  │   │
    │  ├────────────┤  ├────────────┤  ├────────────┤  ├────────────┤   │
    │  │ npm audit  │  │   Trivy    │  │ Java/JS    │  │  Checkov   │   │
    │  │ Maven      │  │ vulnerab.  │  │  analysis  │  │  manifest  │   │
    │  │ check      │  │  scanner   │  │            │  │   check    │   │
    │  └────────────┘  └────────────┘  └────────────┘  └────────────┘   │
    │         │                │                │              │           │
    │         └────────────────┴────────────────┴──────────────┘           │
    │                              │                                       │
    │         ┌────────────────────▼────────────────────┐                 │
    │         │  📊 Security Dashboard & Alerts         │                 │
    │         │  Vulnerability reports in Security tab  │                 │
    │         └─────────────────────────────────────────┘                 │
    └─────────────────────────────────────────────────────────────────────┘
                                     │
                 ┌───────────────────┴───────────────────┐
                 ▼                                       ▼
    ┌──────────────────────────────────┐  ┌──────────────────────────────────┐
    │  WORKFLOW 4: Kubernetes Deploy   │  │  WORKFLOW 5: Ansible Deploy      │
    │  (deploy-k8s.yml) - MANUAL       │  │  (deploy-ansible.yml) - MANUAL   │
    ├──────────────────────────────────┤  ├──────────────────────────────────┤
    │  Manual Trigger with:            │  │  Manual Trigger with:            │
    │  • Environment: dev/staging/prod │  │  • Environment: dev/staging/prod │
    │  • Method: kubectl or helm       │  │  • Action: deploy/backup/etc     │
    │                                  │  │                                  │
    │  Steps:                          │  │  Steps:                          │
    │  1. Connect to cluster           │  │  1. Setup SSH connection         │
    │  2. Create namespace             │  │  2. Run selected playbook        │
    │  3. Apply manifests/helm         │  │  3. Execute tasks on servers     │
    │  4. Verify rollout               │  │  4. Upload logs                  │
    │  5. Run smoke tests              │  │                                  │
    └──────────────────────────────────┘  └──────────────────────────────────┘
                 │                                       │
                 └───────────────────┬───────────────────┘
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        DEPLOYMENT TARGETS                                    │
└─────────────────────────────────────────────────────────────────────────────┘

    ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
    │   Development   │     │     Staging     │     │   Production    │
    │   Environment   │     │   Environment   │     │   Environment   │
    ├─────────────────┤     ├─────────────────┤     ├─────────────────┤
    │ • 1 replica     │     │ • 2 replicas    │     │ • 5 replicas    │
    │ • Small resources│     │ • Medium res.   │     │ • Large res.    │
    │ • Dev database  │     │ • Staging DB    │     │ • Prod DB       │
    └─────────────────┘     └─────────────────┘     └─────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                         MONITORING & FEEDBACK                                │
└─────────────────────────────────────────────────────────────────────────────┘

    ┌────────────────┐  ┌────────────────┐  ┌────────────────┐
    │  GitHub        │  │  Container     │  │  Kubernetes    │
    │  Actions       │  │  Registry      │  │  Dashboard     │
    │  Dashboard     │  │  (ghcr.io)     │  │                │
    ├────────────────┤  ├────────────────┤  ├────────────────┤
    │ • Build status │  │ • Image tags   │  │ • Pod status   │
    │ • Test results │  │ • Versions     │  │ • Logs         │
    │ • Artifacts    │  │ • Downloads    │  │ • Metrics      │
    └────────────────┘  └────────────────┘  └────────────────┘
```

## 📊 Workflow Trigger Matrix

| Workflow | Push | PR | Tag | Schedule | Manual | Branch |
|----------|------|----|----|----------|--------|--------|
| CI Pipeline | ✅ | ✅ | ❌ | ❌ | ✅ | main, develop |
| Docker Build | ✅ | ❌ | ✅ | ❌ | ✅ | main |
| K8s Deploy | ❌ | ❌ | ❌ | ❌ | ✅ | any |
| Ansible Deploy | ❌ | ❌ | ❌ | ❌ | ✅ | any |
| Security Scan | ✅ | ✅ | ❌ | ✅ Weekly | ✅ | main, develop |

## 🔐 Required Secrets

| Secret | Used By | Purpose |
|--------|---------|---------|
| `GITHUB_TOKEN` | docker-build.yml | Push images to ghcr.io (auto-provided) |
| `KUBE_CONFIG` | deploy-k8s.yml | Connect to Kubernetes cluster |
| `MYSQL_ROOT_PASSWORD` | deploy-k8s.yml | MySQL database password |
| `SSH_PRIVATE_KEY` | deploy-ansible.yml | SSH to remote servers |
| `SSH_USER` | deploy-ansible.yml | SSH username |
| `SERVER_HOST` | deploy-ansible.yml | Server hostname/IP |

## 🎯 Deployment Flow Examples

### Example 1: Feature Development → Production

```
1. Developer creates feature branch
   └─▶ git checkout -b feature/new-auth

2. Make changes and push
   └─▶ git push origin feature/new-auth

3. Create Pull Request
   └─▶ CI Pipeline runs automatically
       ├─ Build frontend ✅
       ├─ Build backend ✅
       ├─ Run tests ✅
       └─ Validate configs ✅

4. Code review and merge to main
   └─▶ Triggers on main branch:
       ├─ CI Pipeline runs again ✅
       └─ Docker Build & Push ✅
           ├─ ghcr.io/.../frontend:latest
           └─ ghcr.io/.../backend:latest

5. Manual deployment to staging
   └─▶ Actions → Deploy to K8s
       ├─ Environment: staging
       └─ Method: helm

6. Run tests on staging
   └─▶ Actions → Deploy with Ansible
       ├─ Environment: staging
       └─ Action: health-check

7. Deploy to production
   └─▶ Actions → Deploy to K8s
       ├─ Environment: prod
       └─ Method: helm
```

### Example 2: Hotfix

```
1. Create hotfix branch
   └─▶ git checkout -b hotfix/critical-bug

2. Fix and push
   └─▶ CI runs, tests pass ✅

3. Merge to main
   └─▶ Docker images built ✅

4. Emergency deploy to prod
   └─▶ Actions → Deploy to K8s
       ├─ Environment: prod
       └─ Use new image with SHA tag
```

## 🚀 Performance & Optimization

- **Build Caching**: npm/Maven dependencies cached between runs
- **Docker Layer Caching**: Faster image builds using GitHub cache
- **Parallel Jobs**: Frontend/backend build simultaneously
- **Artifact Reuse**: Build once, deploy many times

## 📈 Metrics & Insights

GitHub Actions provides:
- ✅ Build success rate
- ⏱️ Build duration trends
- 🔄 Deployment frequency
- 📊 Test coverage
- 🔒 Security vulnerability count
