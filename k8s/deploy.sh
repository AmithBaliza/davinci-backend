#!/bin/bash

# Automated Kubernetes Deployment Script for Davinci Backend
# This script handles the complete deployment process

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if kubectl is configured
if ! kubectl cluster-info &> /dev/null; then
    print_error "kubectl is not configured or cluster is not accessible"
    print_warning "Please configure kubectl to connect to your Digital Ocean cluster"
    exit 1
fi

print_status "🚀 Starting Davinci Backend Kubernetes Deployment..."

# Step 1: Create namespace
print_status "Step 1: Creating namespace..."
kubectl apply -f k8s/namespace.yaml

# Step 2: Apply secrets (user needs to update these first)
print_status "Step 2: Applying secrets and config..."
if ! grep -q "YOUR_PASSWORD" k8s/secrets.yaml; then
    kubectl apply -f k8s/secrets.yaml
    print_success "Secrets applied successfully"
else
    print_error "Please update k8s/secrets.yaml with your actual credentials first!"
    print_warning "Update DATABASE_URL, FIREBASE credentials, etc."
    exit 1
fi

# Step 3: Deploy Redis
print_status "Step 3: Deploying Redis cluster..."
kubectl apply -f k8s/redis.yaml

print_status "Waiting for Redis to be ready..."
kubectl wait --for=condition=ready pod -l app=redis -n davinci-backend --timeout=300s

print_success "Redis cluster is ready!"

# Step 4: Run database migration
print_status "Step 4: Running database migration..."
kubectl apply -f k8s/migration-job.yaml

print_status "Waiting for migration to complete..."
kubectl wait --for=condition=complete job/davinci-migration -n davinci-backend --timeout=600s

if kubectl get job davinci-migration -n davinci-backend -o jsonpath='{.status.conditions[?(@.type=="Complete")].status}' | grep -q "True"; then
    print_success "Database migration completed successfully!"
else
    print_error "Migration job failed!"
    kubectl logs job/davinci-migration -n davinci-backend
    exit 1
fi

# Step 5: Deploy backend application
print_status "Step 5: Deploying backend application..."
kubectl apply -f k8s/backend-deployment.yaml

print_status "Waiting for backend deployment to be ready..."
kubectl wait --for=condition=available deployment/davinci-backend -n davinci-backend --timeout=300s

print_success "Backend deployment is ready!"

# Step 6: Check pod status
print_status "Step 6: Checking deployment status..."
kubectl get pods -n davinci-backend

# Step 7: Get service information
print_status "Step 7: Getting service information..."
kubectl get services -n davinci-backend

# Step 8: Show ingress information
print_status "Step 8: Ingress configuration..."
kubectl get ingress -n davinci-backend

print_success "🎉 Deployment completed successfully!"

echo ""
echo "📋 Deployment Summary:"
echo "  ✅ Namespace created"
echo "  ✅ Redis cluster deployed (3 replicas)"
echo "  ✅ Database migration completed"
echo "  ✅ Backend application deployed (3 replicas)"
echo "  ✅ Auto-scaling configured (3-10 replicas)"
echo "  ✅ Load balancer configured"
echo ""

print_status "🔗 Next steps:"
echo "  1. Update DNS to point to your load balancer IP"
echo "  2. Configure SSL certificate (if using custom domain)"
echo "  3. Monitor application logs: kubectl logs -f deployment/davinci-backend -n davinci-backend"
echo "  4. Scale if needed: kubectl scale deployment davinci-backend --replicas=5 -n davinci-backend"

echo ""
print_status "📊 Useful commands:"
echo "  • Check pods: kubectl get pods -n davinci-backend"
echo "  • View logs: kubectl logs -f deployment/davinci-backend -n davinci-backend"
echo "  • Check Redis: kubectl exec -it redis-0 -n davinci-backend -- redis-cli ping"
echo "  • Port forward for testing: kubectl port-forward service/davinci-backend-service 8080:80 -n davinci-backend"
