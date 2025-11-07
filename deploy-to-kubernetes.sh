#!/bin/bash

# Deploy Research Journal to Kubernetes

set -e

cd /home/datta/Documents/cicd3

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║   Deploying Research Journal to Kubernetes                   ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# Check if kubectl is connected
if ! kubectl get nodes &> /dev/null; then
    echo "❌ Kubernetes cluster not running!"
    echo ""
    echo "Please run: ./setup-minikube.sh first"
    exit 1
fi

echo "✅ Kubernetes cluster detected"
echo ""

# Load Docker images into Minikube
echo "📦 Loading Docker images into Minikube..."
minikube image load cicd3-backend:latest || docker save cicd3-backend:latest | (eval $(minikube docker-env) && docker load)
minikube image load cicd3-frontend:latest || docker save cicd3-frontend:latest | (eval $(minikube docker-env) && docker load)
echo "✅ Images loaded"
echo ""

# Deploy to Kubernetes
echo "🚀 Deploying to Kubernetes..."
kubectl apply -f kubernetes/

echo ""
echo "⏳ Waiting for pods to start..."
kubectl wait --for=condition=ready pod -l app=mysql -n research-journal --timeout=180s || true
kubectl wait --for=condition=ready pod -l app=backend -n research-journal --timeout=180s || true
kubectl wait --for=condition=ready pod -l app=frontend -n research-journal --timeout=180s || true

echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║              ✅ Deployment Complete!                         ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# Show status
echo "📊 Current Status:"
kubectl get all -n research-journal

echo ""
echo "🌐 Access the application:"
echo ""
echo "  Option 1: Port Forward"
echo "    kubectl port-forward -n research-journal svc/frontend-service 8080:80"
echo "    Then open: http://localhost:8080"
echo ""
echo "  Option 2: Minikube Service"
echo "    minikube service frontend-service -n research-journal"
echo ""

# Get the Minikube service URL
echo "📍 Getting service URL..."
minikube service list -n research-journal

echo ""
echo "🎉 Kubernetes deployment successful!"
echo ""
