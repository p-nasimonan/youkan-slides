---
marp: true
theme: youkan
paginate: true
header: ''
footer: 'Kubernetes入門 | youkan.uk'
---

<!-- _class: title k8s -->

# Kubernetes入門

## とりあえず使えるようにする

**ようかん** | インフラ好きな学生エンジニア（猫）

---

<!-- _class: lead -->

# その前に、「コンテナ」って説明できる？
---
# 復習）コンテナとは


---

# Kubernetesとは？

> コンテナ化されたアプリケーションの
> デプロイ、スケーリング、管理を自動化する
> オープンソースプラットフォーム

- 略称: **K8s**（K + 8文字 + s）
- Googleが開発、現在はCNCFが管理

---

# なぜKubernetesを使うのか？

## コンテナだけだと...

- どのサーバーで動かす？
- コンテナが落ちたら？
- スケールしたいときは？
- 設定の管理は？

---

# Kubernetesが解決すること

<div class="success">

- **スケジューリング**: 適切なノードに配置
- **自己修復**: 落ちたら自動で再起動
- **スケーリング**: 負荷に応じて増減
- **宣言的管理**: YAMLで状態を定義

</div>

---

# 基本的な構成要素

```
┌────────────────────────────────────┐
│           Kubernetes Cluster        │
│  ┌──────────────────────────────┐  │
│  │     Control Plane            │  │
│  │  - API Server                │  │
│  │  - Scheduler                 │  │
│  │  - Controller Manager        │  │
│  └──────────────────────────────┘  │
│  ┌────────┐ ┌────────┐ ┌────────┐  │
│  │ Node 1 │ │ Node 2 │ │ Node 3 │  │
│  │  Pod   │ │  Pod   │ │  Pod   │  │
│  └────────┘ └────────┘ └────────┘  │
└────────────────────────────────────┘
```

---

# 最初に覚える3つのリソース

| リソース | 説明 |
|---------|------|
| **Pod** | コンテナの最小単位 |
| **Deployment** | Podの管理（レプリカ数など） |
| **Service** | Podへのアクセス方法 |

---

# 実際のマニフェスト例

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:latest
```

---

# 始め方

1. **ローカル環境**: Docker Desktop / minikube / kind
2. **チュートリアル**: kubernetes.io/docs
3. **ハンズオン**: 実際に触ってみる
4. **CKA/CKAD**: 資格で体系的に学ぶ

---

<div class="warning">

**初心者あるある**
- 最初からマイクロサービスにしない
- まずは1つのアプリを動かすところから
- YAMLは怖くない（慣れる）

</div>

---

<!-- _class: lead -->

# まとめ

- Kubernetesはコンテナ管理の標準
- Pod / Deployment / Service から始める
- ローカル環境で実際に触ってみよう

---

<!-- _class: title k8s -->

# ありがとうございました！

K8sの話、一緒にしましょう！

**@youkan**
