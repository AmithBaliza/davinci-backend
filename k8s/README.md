# Davinci Backend Kubernetes Deployment

This directory contains all the Kubernetes manifests and scripts for deploying the Davinci Backend to Digital Ocean Kubernetes.

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Digital Ocean Kubernetes                 │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │   Load Balancer │  │   Ingress       │  │   SSL/TLS   │ │
│  └─────────────────┘  └─────────────────┘  └─────────────┘ │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────┐ │
│  │              Backend Pods (3-10 replicas)              │ │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐   │ │
│  │  │ Pod 1   │  │ Pod 2   │  │ Pod 3   │  │ Pod N   │   │ │
│  │  └─────────┘  └─────────┘  └─────────┘  └─────────┘   │ │
│  └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────┐ │
│  │              Redis Cluster (3 replicas)                │ │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐                │ │
│  │  │Redis-0  │  │Redis-1  │  │Redis-2  │                │ │
│  │  └─────────┘  └─────────┘  └─────────┘                │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              Digital Ocean Managed PostgreSQL              │
│                     (External Service)                     │
└─────────────────────────────────────────────────────────────┘
```

## 📁 Files Overview

| File                      | Purpose                                    |
| ------------------------- | ------------------------------------------ |
| `namespace.yaml`          | Creates the `davinci-backend` namespace    |
| `secrets.yaml`            | Contains database credentials and API keys |
| `redis.yaml`              | Redis StatefulSet with persistent storage  |
| `migration-job.yaml`      | Automated database migration job           |
| `backend-deployment.yaml` | Main backend deployment with auto-scaling  |
| `deploy.sh`               | Automated deployment script                |

## 🚀 Quick Start

### Prerequisites

1. **Digital Ocean Kubernetes cluster** created and running
2. **kubectl** configured to connect to your cluster
3. **Database credentials** from Digital Ocean PostgreSQL
4. **Firebase credentials** for authentication

### Step 1: Configure kubectl

```bash
# Download kubeconfig from Digital Ocean
doctl kubernetes cluster kubeconfig save your-cluster-name

# Verify connection
kubectl cluster-info
```

### Step 2: Update Secrets

Edit `k8s/secrets.yaml` and replace:

- `YOUR_PASSWORD` with your actual database password
- `YOUR_HOST` with your database host
- Firebase credentials with your actual values

### Step 3: Deploy Everything

```bash
# Run the automated deployment
./k8s/deploy.sh
```

That's it! The script will:

1. ✅ Create namespace
2. ✅ Deploy Redis cluster
3. ✅ Run database migrations
4. ✅ Deploy backend application
5. ✅ Configure auto-scaling
6. ✅ Set up load balancer

## 🔧 Manual Deployment (Alternative)

If you prefer manual control:

```bash
# 1. Create namespace
kubectl apply -f k8s/namespace.yaml

# 2. Apply secrets
kubectl apply -f k8s/secrets.yaml

# 3. Deploy Redis
kubectl apply -f k8s/redis.yaml

# 4. Wait for Redis
kubectl wait --for=condition=ready pod -l app=redis -n davinci-backend --timeout=300s

# 5. Run migrations
kubectl apply -f k8s/migration-job.yaml

# 6. Wait for migration
kubectl wait --for=condition=complete job/davinci-migration -n davinci-backend --timeout=600s

# 7. Deploy backend
kubectl apply -f k8s/backend-deployment.yaml
```

## 📊 Monitoring & Management

### Check Deployment Status

```bash
# View all resources
kubectl get all -n davinci-backend

# Check pod logs
kubectl logs -f deployment/davinci-backend -n davinci-backend

# Check Redis status
kubectl exec -it redis-0 -n davinci-backend -- redis-cli ping
```

### Scaling

```bash
# Manual scaling
kubectl scale deployment davinci-backend --replicas=5 -n davinci-backend

# Check auto-scaler status
kubectl get hpa -n davinci-backend
```

### Troubleshooting

```bash
# Check pod status
kubectl describe pod <pod-name> -n davinci-backend

# View migration logs
kubectl logs job/davinci-migration -n davinci-backend

# Check events
kubectl get events -n davinci-backend --sort-by='.lastTimestamp'
```

## 🔒 Security Features

- **Secrets management** - Credentials stored in Kubernetes secrets
- **Network policies** - Pod-to-pod communication restrictions
- **Resource limits** - CPU and memory limits for all containers
- **Health checks** - Liveness and readiness probes
- **Rate limiting** - Nginx ingress rate limiting (100 req/min)

## 📈 Performance Features

- **Auto-scaling** - 3-10 replicas based on CPU/memory usage
- **Redis caching** - 3-node Redis cluster for high availability
- **Load balancing** - Traffic distributed across backend pods
- **Resource optimization** - Proper CPU/memory requests and limits

## 💰 Cost Optimization

**Monthly Costs:**

- **Kubernetes cluster**: $36-60/month (3-5 nodes)
- **Database**: $24/month (Digital Ocean PostgreSQL)
- **Load balancer**: Included with Digital Ocean K8s
- **Storage**: ~$5/month (Redis persistent volumes)

**Total**: ~$65-90/month for production-ready infrastructure

## 🔄 Updates & Rollbacks

### Rolling Updates

```bash
# Update image
kubectl set image deployment/davinci-backend backend=your-registry/davinci-backend:v2.0 -n davinci-backend

# Check rollout status
kubectl rollout status deployment/davinci-backend -n davinci-backend
```

### Rollbacks

```bash
# View rollout history
kubectl rollout history deployment/davinci-backend -n davinci-backend

# Rollback to previous version
kubectl rollout undo deployment/davinci-backend -n davinci-backend
```

## 🌐 Domain & SSL Setup

1. **Get Load Balancer IP**:

   ```bash
   kubectl get ingress -n davinci-backend
   ```

2. **Update DNS**: Point your domain to the load balancer IP

3. **SSL Certificate**: The ingress is configured for Let's Encrypt SSL

## 📞 Support Commands

```bash
# Port forward for local testing
kubectl port-forward service/davinci-backend-service 8080:80 -n davinci-backend

# Access Redis CLI
kubectl exec -it redis-0 -n davinci-backend -- redis-cli

# View resource usage
kubectl top pods -n davinci-backend

# Clean up everything
kubectl delete namespace davinci-backend
```

## 🎯 Production Checklist

- [ ] Database credentials updated in secrets.yaml
- [ ] Firebase credentials configured
- [ ] Domain name configured in ingress
- [ ] SSL certificate working
- [ ] Monitoring set up
- [ ] Backup strategy in place
- [ ] Auto-scaling tested
- [ ] Load testing completed

Your Davinci Backend is now production-ready! 🚀
