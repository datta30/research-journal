# Kubernetes Deployment Guide

## Quick Start Commands

### Deploy Everything
```bash
# Apply all configurations at once
kubectl apply -f kubernetes/

# Or apply in order:
kubectl apply -f kubernetes/namespace.yaml
kubectl apply -f kubernetes/mysql-secret.yaml
kubectl apply -f kubernetes/backend-secret.yaml
kubectl apply -f kubernetes/backend-configmap.yaml
kubectl apply -f kubernetes/mysql-pvc.yaml
kubectl apply -f kubernetes/backend-pvc.yaml
kubectl apply -f kubernetes/mysql-statefulset.yaml
kubectl apply -f kubernetes/mysql-service.yaml
kubectl apply -f kubernetes/backend-deployment.yaml
kubectl apply -f kubernetes/backend-service.yaml
kubectl apply -f kubernetes/frontend-deployment.yaml
kubectl apply -f kubernetes/frontend-service.yaml
kubectl apply -f kubernetes/ingress.yaml
```

### Check Status
```bash
# View all resources
kubectl get all -n research-journal

# Watch pods starting up
kubectl get pods -n research-journal -w

# Check service endpoints
kubectl get svc -n research-journal
```

### Access the Application
```bash
# Get the external IP (for LoadBalancer)
kubectl get svc frontend-service -n research-journal

# Port forward for local testing
kubectl port-forward -n research-journal svc/frontend-service 8080:80
# Then access: http://localhost:8080
```

### Cleanup
```bash
# Delete everything
kubectl delete namespace research-journal
```

## What's Running

- **Frontend**: 3 replicas (load balanced)
- **Backend**: 2 replicas (high availability)
- **MySQL**: 1 replica (stateful, persistent storage)

## Architecture

```
Internet → LoadBalancer → Frontend (3 pods)
                              ↓
                          Backend (2 pods)
                              ↓
                          MySQL (1 pod)
```
