---
marp: true
theme: youkan
paginate: true
header: ''
footer: 'Kubernetes入門 | @youkan'
---

<!-- _class: title k8s -->

# Kubernetes入門

## コンテナオーケストレーションの基礎

**youkan** | 技術共有会

---

<!-- _class: lead -->

# Kubernetesとは？

---

# Kubernetesの概要

> コンテナ化されたアプリケーションの
> デプロイ、スケーリング、管理を自動化する
> オープンソースのプラットフォーム

- Google発、現在はCNCFが管理
- 略称: K8s (K + 8文字 + s)
- 2014年リリース、現在業界標準

---

# なぜKubernetesが必要？

## コンテナだけでは解決できない問題

- 複数コンテナの管理
- 負荷分散
- 自動復旧
- ローリングアップデート
- 設定・シークレット管理

---

# 基本コンポーネント

```
┌─────────────────────────────────────────┐
│            Control Plane                │
│  ┌──────────┐ ┌──────────┐ ┌─────────┐ │
│  │ API Server│ │ Scheduler│ │  etcd   │ │
│  └──────────┘ └──────────┘ └─────────┘ │
└─────────────────────────────────────────┘
         │
┌────────▼────────┐  ┌────────────────────┐
│     Node 1      │  │      Node 2        │
│  ┌──────────┐   │  │   ┌──────────┐     │
│  │  kubelet │   │  │   │  kubelet │     │
│  └──────────┘   │  │   └──────────┘     │
│  ┌────┐ ┌────┐  │  │   ┌────┐ ┌────┐   │
│  │ Pod│ │ Pod│  │  │   │ Pod│ │ Pod│   │
│  └────┘ └────┘  │  │   └────┘ └────┘   │
└─────────────────┘  └────────────────────┘
```

---

# 重要な概念: Pod

- Kubernetesの最小デプロイ単位
- 1つ以上のコンテナを含む
- 同じPod内のコンテナはネットワークを共有

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-pod
spec:
  containers:
    - name: nginx
      image: nginx:latest
      ports:
        - containerPort: 80
```

---

# 重要な概念: Deployment

- Podのレプリカ数を管理
- ローリングアップデート
- ロールバック機能

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    # Pod template...
```

---

# 重要な概念: Service

- Podへのアクセスを抽象化
- 負荷分散
- サービスディスカバリ

```yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx-service
spec:
  selector:
    app: nginx
  ports:
    - port: 80
      targetPort: 80
  type: ClusterIP
```

---

# よく使うkubectlコマンド

```bash
# クラスター情報
kubectl cluster-info
kubectl get nodes

# リソース操作
kubectl get pods
kubectl describe pod <name>
kubectl logs <pod-name>

# 適用・削除
kubectl apply -f manifest.yaml
kubectl delete -f manifest.yaml

# デバッグ
kubectl exec -it <pod> -- /bin/sh
```

---

# 始めるには？

<div class="success">

## ローカル環境
- **minikube**: シンプル、学習向き
- **kind**: Docker上で動作、CI向き
- **Docker Desktop**: GUI付き

## クラウド
- GKE / EKS / AKS
- マネージドで運用楽

</div>

---

# 学習リソース

- [公式ドキュメント](https://kubernetes.io/ja/docs/home/)
- [Kubernetes The Hard Way](https://github.com/kelseyhightower/kubernetes-the-hard-way)
- [Play with Kubernetes](https://labs.play-with-k8s.com/)

<div class="highlight">

**まずはminikubeで触ってみよう！**

</div>

---

<!-- _class: title k8s -->

# ありがとうございました！

Kubernetesの世界へようこそ！

**@youkan**
