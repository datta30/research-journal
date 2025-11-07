# Helm Chart Deployment Guide

## Quick Start

### Install for Development
```bash
cd /home/datta/Documents/cicd3
helm install research-journal-dev ./helm-chart/research-journal -f ./helm-chart/research-journal/values-dev.yaml
```

### Install for Production
```bash
helm install research-journal-prod ./helm-chart/research-journal -f ./helm-chart/research-journal/values-prod.yaml
```

### Install Default (Testing)
```bash
helm install research-journal ./helm-chart/research-journal
```

## Management Commands

### Check Installation
```bash
helm list
helm status research-journal-dev
```

### Upgrade Deployment
```bash
helm upgrade research-journal-dev ./helm-chart/research-journal -f ./helm-chart/research-journal/values-dev.yaml
```

### Rollback to Previous Version
```bash
helm rollback research-journal-dev
```

### Uninstall
```bash
helm uninstall research-journal-dev
```

## View What Will Be Deployed
```bash
# Dry run to see all resources
helm install research-journal-dev ./helm-chart/research-journal -f ./helm-chart/research-journal/values-dev.yaml --dry-run --debug
```

## Environment Comparison

| Feature | Development | Production |
|---------|------------|------------|
| Frontend Replicas | 1 | 5 |
| Backend Replicas | 1 | 5 |
| MySQL Storage | 2Gi | 20Gi |
| Service Type | NodePort | LoadBalancer |
| SQL Logging | Enabled | Disabled |
| Ingress/TLS | Disabled | Enabled |

## Configuration Files

- `values.yaml` - Default/base configuration
- `values-dev.yaml` - Development overrides
- `values-prod.yaml` - Production overrides

## Customization

Edit `values.yaml` or create your own values file:
```yaml
frontend:
  replicaCount: 10  # Scale to 10 instances
  
backend:
  replicaCount: 20
  
mysql:
  persistence:
    size: 50Gi  # Increase storage
```

Then install:
```bash
helm install my-release ./helm-chart/research-journal -f my-custom-values.yaml
```
