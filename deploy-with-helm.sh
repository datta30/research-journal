#!/bin/bash

# Deploy with Helm

set -e

cd /home/datta/Documents/cicd3

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║        Deploying with Helm Chart                             ║"
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
minikube image load cicd3-backend:latest 2>/dev/null || echo "Backend image already loaded"
minikube image load cicd3-frontend:latest 2>/dev/null || echo "Frontend image already loaded"
echo ""

# Choose environment
echo "🎯 Choose deployment environment:"
echo "  1) Development (1 replica, small resources)"
echo "  2) Production (5 replicas, large resources)"
echo "  3) Default (2-3 replicas)"
echo ""
read -p "Enter choice (1-3): " choice

case $choice in
    1)
        echo "📝 Deploying DEVELOPMENT environment..."
        helm install research-journal-dev ./helm-chart/research-journal -f ./helm-chart/research-journal/values-dev.yaml
        RELEASE_NAME="research-journal-dev"
        NAMESPACE="research-journal-dev"
        ;;
    2)
        echo "📝 Deploying PRODUCTION environment..."
        helm install research-journal-prod ./helm-chart/research-journal -f ./helm-chart/research-journal/values-prod.yaml
        RELEASE_NAME="research-journal-prod"
        NAMESPACE="research-journal-prod"
        ;;
    *)
        echo "📝 Deploying DEFAULT environment..."
        helm install research-journal ./helm-chart/research-journal
        RELEASE_NAME="research-journal"
        NAMESPACE="research-journal"
        ;;
esac

echo ""
echo "⏳ Waiting for deployment..."
sleep 10

echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║              ✅ Helm Deployment Complete!                    ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# Show Helm status
echo "📊 Helm Release Status:"
helm status $RELEASE_NAME

echo ""
echo "📊 Kubernetes Resources:"
kubectl get all -n $NAMESPACE

echo ""
echo "🌐 Access the application:"
echo "  kubectl port-forward -n $NAMESPACE svc/frontend-service 8080:80"
echo "  Then open: http://localhost:8080"
echo ""

echo "🎉 Helm deployment successful!"
echo ""
echo "Useful commands:"
echo "  helm list                          # List all releases"
echo "  helm status $RELEASE_NAME          # Check release status"
echo "  helm upgrade $RELEASE_NAME ./helm-chart/research-journal  # Update"
echo "  helm rollback $RELEASE_NAME        # Rollback"
echo "  helm uninstall $RELEASE_NAME       # Remove"
echo ""
