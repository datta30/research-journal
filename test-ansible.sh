#!/bin/bash

# Test Ansible Locally (on localhost)

cd /home/datta/Documents/cicd3/ansible

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║         Testing Ansible Playbooks (Localhost)                ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

echo "📋 Available playbooks:"
echo ""
echo "1) Health Check - Check system and Docker status"
echo "2) Deploy App - Deploy the application"
echo "3) Setup Docker - Install Docker (if not installed)"
echo ""
read -p "Enter choice (1-3): " choice

case $choice in
    1)
        echo ""
        echo "🏥 Running Health Check..."
        ansible-playbook -i inventory/dev.yml playbooks/health-check.yml
        ;;
    2)
        echo ""
        echo "🚀 Deploying Application..."
        ansible-playbook -i inventory/dev.yml playbooks/deploy-app.yml
        ;;
    3)
        echo ""
        echo "🐳 Setting up Docker..."
        ansible-playbook -i inventory/dev.yml playbooks/setup-docker.yml
        ;;
    *)
        echo "Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║              ✅ Ansible Playbook Complete!                   ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""
