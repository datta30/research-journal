# AWS Deployment Plan Using Ansible

## Overview
This document outlines the plan for deploying the Research Journal application to AWS using Ansible. The deployment will use GitHub Container Registry (GHCR) images and will be automated through GitHub Actions.

## Architecture

### AWS Infrastructure Components
1. **EC2 Instances**
   - Application Server (t3.medium or larger)
   - Database Server (t3.medium with EBS volumes for MySQL data)
   - Load Balancer (AWS ALB)

2. **Networking**
   - VPC with public and private subnets
   - Security Groups for web traffic, application, and database
   - Elastic IPs for persistent addressing

3. **Storage**
   - EBS volumes for MySQL data persistence
   - S3 bucket for uploaded research papers and backups

4. **Container Registry**
   - GitHub Container Registry (GHCR) for Docker images
   - Images: frontend, backend, and mysql

## Ansible Playbook Structure

### Inventory Files
- `ansible/inventory/aws-dev.yml` - Development environment
- `ansible/inventory/aws-staging.yml` - Staging environment
- `ansible/inventory/aws-prod.yml` - Production environment

### Playbooks Required

#### 1. `provision-aws-infrastructure.yml`
Provisions AWS infrastructure using boto3:
- Create VPC and subnets
- Configure security groups
- Launch EC2 instances
- Set up EBS volumes
- Configure ALB

#### 2. `setup-docker.yml` (Already exists)
Updates needed:
- Install Docker and Docker Compose on EC2 instances
- Configure Docker to authenticate with GHCR
- Set up Docker daemon options

#### 3. `deploy-app.yml` (Already exists)
Updates needed:
- Pull images from GHCR instead of building locally
- Use `docker-compose.prod.yml` with GHCR images
- Configure environment variables from AWS Systems Manager Parameter Store
- Set up log forwarding to CloudWatch

#### 4. `configure-database.yml`
- Set up MySQL container with persistent EBS storage
- Configure automated backups to S3
- Set up replication (for production)

#### 5. `setup-monitoring.yml`
- Install CloudWatch agent
- Configure application metrics
- Set up alerting via SNS

## GitHub Actions Workflow

### Workflow: `deploy-aws.yml`

```yaml
name: Deploy to AWS with Ansible

on:
  workflow_dispatch:
    inputs:
      environment:
        description: 'Environment to deploy to'
        required: true
        type: choice
        options:
          - dev
          - staging
          - prod
      action:
        description: 'Deployment action'
        required: true
        type: choice
        options:
          - provision-infrastructure
          - deploy-application
          - update-application
          - rollback
          - destroy-infrastructure

jobs:
  deploy:
    name: Deploy to AWS
    runs-on: ubuntu-latest
    environment: aws-${{ inputs.environment }}
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      
    - name: Setup Python
      uses: actions/setup-python@v5
      with:
        python-version: '3.11'
        
    - name: Install Ansible and AWS dependencies
      run: |
        pip install ansible boto3 botocore
        
    - name: Configure AWS credentials
      uses: aws-actions/configure-aws-credentials@v4
      with:
        aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        aws-region: ${{ secrets.AWS_REGION }}
        
    - name: Setup SSH key for EC2
      run: |
        mkdir -p ~/.ssh
        echo "${{ secrets.AWS_SSH_PRIVATE_KEY }}" > ~/.ssh/id_rsa
        chmod 600 ~/.ssh/id_rsa
        
    - name: Run Ansible playbook
      working-directory: ./ansible
      run: |
        ansible-playbook \
          -i inventory/aws-${{ inputs.environment }}.yml \
          playbooks/${{ inputs.action }}.yml \
          --extra-vars "environment=${{ inputs.environment }}"
```

## Required Ansible Roles

### 1. `roles/aws-infrastructure`
- Creates AWS resources using boto3
- Manages VPC, subnets, security groups
- Provisions EC2 instances

### 2. `roles/docker` (Update existing)
- Install Docker on Ubuntu/Amazon Linux
- Configure Docker daemon
- Set up GHCR authentication

### 3. `roles/application` (Update existing)
- Deploy containers using docker-compose
- Configure environment variables
- Set up SSL certificates (Let's Encrypt)
- Configure nginx reverse proxy

### 4. `roles/database`
- Configure MySQL container
- Set up EBS volume mounting
- Configure backups

### 5. `roles/monitoring`
- Install CloudWatch agent
- Configure log shipping
- Set up metrics collection

## Environment Variables and Secrets

### GitHub Secrets Required
- `AWS_ACCESS_KEY_ID` - AWS access key
- `AWS_SECRET_ACCESS_KEY` - AWS secret key
- `AWS_REGION` - AWS region (e.g., us-east-1)
- `AWS_SSH_PRIVATE_KEY` - SSH key for EC2 access
- `MYSQL_ROOT_PASSWORD` - MySQL root password
- `JWT_SECRET` - JWT secret for backend
- `GHCR_TOKEN` - GitHub token for pulling container images

### AWS Systems Manager Parameters
Store sensitive configuration in AWS Parameter Store:
- `/research-journal/dev/mysql-password`
- `/research-journal/dev/jwt-secret`
- `/research-journal/prod/mysql-password`
- `/research-journal/prod/jwt-secret`

## Deployment Process

### Initial Infrastructure Setup
1. Run `provision-infrastructure` action to create AWS resources
2. Run `setup-docker` to configure Docker on EC2 instances
3. Run `deploy-application` to deploy the containers

### Application Updates
1. Push code to GitHub
2. GitHub Actions builds and pushes new images to GHCR
3. Run `update-application` action to pull new images and restart containers

### Rollback Process
1. Run `rollback` action with previous image tag
2. Ansible pulls specified image version and restarts containers

## Security Considerations

1. **Network Security**
   - Use private subnets for database
   - Restrict security groups to minimum required ports
   - Use AWS WAF for web application firewall

2. **Secret Management**
   - Use AWS Systems Manager Parameter Store for secrets
   - Rotate credentials regularly
   - Use IAM roles for EC2 instances

3. **Container Security**
   - Scan images with Trivy before deployment
   - Use non-root users in containers
   - Keep base images updated

4. **SSL/TLS**
   - Use Let's Encrypt for SSL certificates
   - Configure HTTPS-only access
   - Set up certificate auto-renewal

## Monitoring and Logging

1. **Application Logs**
   - Ship container logs to CloudWatch Logs
   - Set up log retention policies
   - Create log-based metrics

2. **Metrics**
   - EC2 instance metrics (CPU, memory, disk)
   - Application metrics (response time, error rate)
   - Database metrics (connections, query performance)

3. **Alerting**
   - CloudWatch Alarms for critical metrics
   - SNS notifications for alerts
   - PagerDuty integration for production

## Cost Optimization

1. **Right-sizing**
   - Start with t3.medium instances
   - Monitor usage and adjust instance types
   - Use reserved instances for production

2. **Storage**
   - Use gp3 EBS volumes for better price/performance
   - Enable EBS snapshot lifecycle policies
   - Use S3 lifecycle policies for old backups

3. **Monitoring**
   - Set up cost alerts
   - Review AWS Cost Explorer monthly
   - Tag all resources for cost allocation

## Backup and Disaster Recovery

1. **Database Backups**
   - Automated daily backups to S3
   - Transaction log backups every 15 minutes
   - 30-day retention for production

2. **Infrastructure as Code**
   - All infrastructure in Ansible playbooks
   - Version controlled in Git
   - Can rebuild environment from scratch

3. **Disaster Recovery**
   - Document recovery procedures
   - Test recovery process quarterly
   - Maintain multi-region capability for production

## Implementation Timeline

### Phase 1: Infrastructure Setup (Week 1)
- [ ] Create AWS account and configure IAM
- [ ] Create Ansible playbooks for AWS provisioning
- [ ] Set up VPC and networking
- [ ] Provision EC2 instances

### Phase 2: Application Deployment (Week 2)
- [ ] Update Ansible playbooks for GHCR
- [ ] Deploy MySQL container with EBS storage
- [ ] Deploy backend and frontend containers
- [ ] Configure ALB and SSL

### Phase 3: Monitoring and Security (Week 3)
- [ ] Set up CloudWatch logging
- [ ] Configure alerts and notifications
- [ ] Implement security hardening
- [ ] Set up backup automation

### Phase 4: Testing and Documentation (Week 4)
- [ ] Perform load testing
- [ ] Test disaster recovery procedures
- [ ] Document operational procedures
- [ ] Train team on deployment process

## Maintenance

### Regular Tasks
- Weekly security updates
- Monthly dependency updates
- Quarterly disaster recovery testing
- Annual AWS cost review

### Monitoring Checklist
- Daily: Check CloudWatch dashboards
- Weekly: Review error logs
- Monthly: Analyze usage patterns
- Quarterly: Review and optimize costs
