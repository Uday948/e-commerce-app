# E-Commerce App — DevOps Learning Project

A basic e-commerce app built as a vehicle for learning Prometheus, Grafana, ArgoCD, and OpenSearch.

## Stack

| Layer | Technology |
|---|---|
| Backend | Python 3.12 + FastAPI + PostgreSQL |
| Frontend | React 18 + Vite + TypeScript |
| Orchestration | Kubernetes (Docker Desktop) |
| Monitoring | Prometheus + Grafana |
| Logging | OpenSearch + Fluent Bit |
| GitOps | ArgoCD |

## Local Dev (Docker Compose)

```bash
cp backend/.env.example backend/.env
docker compose up
```

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8000 |
| API Docs | http://localhost:8000/docs |
| Prometheus | http://localhost:9090 |
| Grafana | http://localhost:3000 (admin/admin) |
| OpenSearch | http://localhost:9200 |
| OpenSearch Dashboards | http://localhost:5601 |

## Kubernetes (Docker Desktop)

Prerequisites: Docker Desktop with Kubernetes enabled, `kubectl`, `helm`.

```bash
# Deploy the app
kubectl apply -k k8s/overlays/dev/

# Install monitoring (Prometheus + Grafana)
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update
helm install kube-prom prometheus-community/kube-prometheus-stack \
  -n monitoring --create-namespace \
  -f helm/kube-prometheus-stack-values.yaml

# Install logging (OpenSearch + Fluent Bit)
helm repo add opensearch https://opensearch-project.github.io/helm-charts
helm repo update
helm install opensearch opensearch/opensearch -n logging --create-namespace -f helm/opensearch-values.yaml
helm install opensearch-dashboards opensearch/opensearch-dashboards -n logging -f helm/opensearch-dashboards-values.yaml
kubectl apply -f k8s/base/logging/

# Install ArgoCD
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# Bootstrap App-of-Apps
kubectl apply -f argocd/root-app.yaml

# Get ArgoCD initial admin password
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d

# Port-forward ArgoCD UI
kubectl port-forward svc/argocd-server -n argocd 8080:443
# Visit https://localhost:8080 (admin / password from above)
```

## GitOps Flow

Push any change to `main` → ArgoCD detects the diff → auto-syncs to the cluster.

## Project Structure

```
e-commerce-app/
├── backend/          # FastAPI app
├── frontend/         # React + Vite
├── k8s/
│   ├── base/         # Raw Kubernetes manifests
│   └── overlays/dev/ # Kustomize dev overlay
├── argocd/           # ArgoCD Application CRDs (App-of-Apps)
├── helm/             # Helm value overrides for 3rd-party charts
├── monitoring/       # Grafana dashboard JSON files
└── docker-compose.yml
```
