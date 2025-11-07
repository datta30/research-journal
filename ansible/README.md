# Ansible Automation Guide

## Quick Start Commands

### 1. Setup Docker on Servers
```bash
cd /home/datta/Documents/cicd3/ansible

# Setup on localhost (development)
ansible-playbook -i inventory/dev.yml playbooks/setup-docker.yml

# Setup on production servers
ansible-playbook -i inventory/prod.yml playbooks/setup-docker.yml
```

### 2. Deploy Application
```bash
# Deploy to development
ansible-playbook -i inventory/dev.yml playbooks/deploy-app.yml

# Deploy to production
ansible-playbook -i inventory/prod.yml playbooks/deploy-app.yml
```

### 3. Update Application
```bash
ansible-playbook -i inventory/prod.yml playbooks/update-app.yml
```

### 4. Backup Database
```bash
ansible-playbook -i inventory/prod.yml playbooks/backup-database.yml
```

### 5. Health Check
```bash
ansible-playbook -i inventory/prod.yml playbooks/health-check.yml
```

### 6. Stop Application
```bash
ansible-playbook -i inventory/prod.yml playbooks/stop-app.yml
```

## Available Playbooks

| Playbook | Purpose |
|----------|---------|
| `setup-docker.yml` | Install Docker and Docker Compose on servers |
| `deploy-app.yml` | Deploy the application for first time |
| `update-app.yml` | Update running application with new code |
| `backup-database.yml` | Backup MySQL database |
| `health-check.yml` | Check application and server health |
| `stop-app.yml` | Stop all containers |

## Inventory Files

- `inventory/hosts.yml` - Main inventory with all servers
- `inventory/dev.yml` - Development environment
- `inventory/prod.yml` - Production environment

## Testing Playbooks

Run in check mode (dry-run):
```bash
ansible-playbook -i inventory/prod.yml playbooks/deploy-app.yml --check
```

## Deploy to Specific Servers

```bash
# Deploy only to prod-1
ansible-playbook -i inventory/prod.yml playbooks/deploy-app.yml --limit prod-1

# Deploy to all production except prod-3
ansible-playbook -i inventory/prod.yml playbooks/deploy-app.yml --limit 'production:!prod-3'
```

## Common Options

- `--check` - Dry run (don't make changes)
- `--diff` - Show differences
- `--limit HOST` - Run on specific hosts
- `--tags TAG` - Run specific tagged tasks
- `-v, -vv, -vvv` - Increase verbosity

## Example Workflow

### First-time Setup
```bash
# 1. Setup Docker on all servers
ansible-playbook -i inventory/prod.yml playbooks/setup-docker.yml

# 2. Deploy application
ansible-playbook -i inventory/prod.yml playbooks/deploy-app.yml

# 3. Verify deployment
ansible-playbook -i inventory/prod.yml playbooks/health-check.yml
```

### Daily Operations
```bash
# Update application
ansible-playbook -i inventory/prod.yml playbooks/update-app.yml

# Backup database
ansible-playbook -i inventory/prod.yml playbooks/backup-database.yml
```

## Configuration

Edit `ansible.cfg` to customize Ansible behavior
Edit `group_vars/` to set environment-specific variables
