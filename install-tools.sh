#!/bin/bash

# Installation Script for Kubernetes, Helm, and Ansible
# For Fedora Linux

set -e

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║   Installing Kubernetes, Helm & Ansible Tools               ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# Install kubectl
echo "📦 Installing kubectl..."
if ! command -v kubectl &> /dev/null; then
    curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
    chmod +x kubectl
    sudo mv kubectl /usr/local/bin/
    echo "✅ kubectl installed successfully!"
else
    echo "✅ kubectl already installed"
fi

echo ""

# Install Helm
echo "📦 Installing Helm..."
if ! command -v helm &> /dev/null; then
    curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
    echo "✅ Helm installed successfully!"
else
    echo "✅ Helm already installed"
fi

echo ""

# Install Ansible
echo "📦 Installing Ansible..."
if ! command -v ansible &> /dev/null; then
    sudo dnf install -y ansible
    echo "✅ Ansible installed successfully!"
else
    echo "✅ Ansible already installed"
fi

echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                   ✅ Installation Complete!                  ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# Verify installations
echo "📋 Verifying installations:"
echo ""
kubectl version --client --short 2>/dev/null || kubectl version --client
echo ""
helm version --short
echo ""
ansible --version | head -1
echo ""

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║              Next Steps: Enable Kubernetes                   ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""
echo "1. Open Docker Desktop"
echo "2. Go to Settings → Kubernetes"
echo "3. Check 'Enable Kubernetes'"
echo "4. Click 'Apply & Restart'"
echo "5. Wait for Kubernetes to start (green light)"
echo ""
echo "Then run: kubectl get nodes"
echo ""
