#!/bin/bash

# Quick Kubernetes Setup with Minikube (Alternative to Docker Desktop K8s)

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║   Installing Minikube - Local Kubernetes Cluster            ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# Install Minikube
if ! command -v minikube &> /dev/null; then
    echo "📦 Installing Minikube..."
    curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
    sudo install minikube-linux-amd64 /usr/local/bin/minikube
    rm minikube-linux-amd64
    echo "✅ Minikube installed!"
else
    echo "✅ Minikube already installed"
fi

echo ""
echo "🚀 Starting Minikube cluster..."
echo "(This may take 2-3 minutes on first run)"
echo ""

# Start Minikube with Docker driver
minikube start --driver=docker

echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║              ✅ Kubernetes Cluster Ready!                    ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# Verify
kubectl get nodes

echo ""
echo "🎉 You can now deploy to Kubernetes!"
echo ""
echo "Next steps:"
echo "  cd /home/datta/Documents/cicd3"
echo "  ./deploy-to-kubernetes.sh"
echo ""
