#!/bin/bash

# Quick verification script after Kubernetes is enabled in Docker Desktop

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║   Checking Kubernetes Status in Docker Desktop              ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

echo "🔍 Checking Kubernetes connection..."
if kubectl get nodes &> /dev/null; then
    echo "✅ Kubernetes is running!"
    echo ""
    kubectl get nodes
    echo ""
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║              🎉 Ready to Deploy!                             ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo ""
    echo "Next steps:"
    echo ""
    echo "1. Deploy to Kubernetes:"
    echo "   kubectl apply -f kubernetes/"
    echo ""
    echo "2. Check deployment status:"
    echo "   kubectl get all -n research-journal"
    echo ""
    echo "3. Or deploy with Helm:"
    echo "   helm install demo ./helm-chart/research-journal"
    echo ""
else
    echo "❌ Kubernetes is not ready yet"
    echo ""
    echo "Please wait for Docker Desktop to show:"
    echo "  - Green indicator next to 'Kubernetes'"
    echo "  - Status: 'Kubernetes is running'"
    echo ""
    echo "Then run this script again: ./check-kubernetes.sh"
    echo ""
fi
