---
marp: true
theme: youkan
paginate: true
header: ''
footer: 'ECS知ってる人のためのK8s入門 | youkan.uk'
---

<!-- _class: title k8s -->

# ECS知ってる人のための
# Kubernetes入門

## 概念を対応させながら理解する

**ようかん** | インフラ好きな学生エンジニア（猫）

---

<!-- _class: lead -->

# ECSを使ったことがあれば <br> Kubernetesはすぐわかる

---

# どちらも「コンテナを動かすしくみ」

<div class="two-col">
<div>

## AWS ECS
- AWSマネージド
- シンプル・AWS親和性高い

</div>
<div>

## Kubernetes
@logo(kubernetes, 100)

- OSS・マルチクラウド
- 柔軟・業界標準

</div>
</div>

---

<!-- _class: lead -->

# 用語の対応表

---

# ECS → K8s 用語マッピング

| やりたいこと | ECS の用語 | K8s の用語 |
|------------|-----------|-----------|
| コンテナの最小単位 | **タスク** | **Pod** |
| 数を維持・自動復旧 | **ECS サービス** | **Deployment** |
| 固定名で通信を振り分ける | **TG / Cloud Map** | **Service** |
| 外の世界からアクセス | **ALB** | **Ingress / Service(LB)** |

---

<!-- _class: lead -->

# 1. タスク → Pod

---

# タスク ≒ Pod

<div class="two-col">
<div>

## ECS: タスク

- タスク定義でコンテナを定義
- タスク = 実行中のコンテナ群
- サイドカーは同じタスク定義に書く

</div>
<div>

## K8s: Pod

- PodSpecでコンテナを定義
- Pod = 実行中のコンテナ群
- サイドカーは同じPod内に書く

</div>
</div>

<div class="highlight">

ポイント: Podは**直接作らない** — DeploymentやJobで管理する

</div>

---

# Pod のマニフェスト

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-app
spec:
  containers:
    - name: app          # メインコンテナ
      image: nginx:latest
      ports:
        - containerPort: 80
    - name: sidecar      # ECSのサイドカーと同じ感覚
      image: fluent/fluent-bit
```

---

<!-- _class: lead -->

# 2. ECS サービス → Deployment

---

# ECS サービス ≒ Deployment

<div class="two-col">
<div>

## ECS: サービス

- タスク数（desired count）を維持
- タスクが落ちたら自動で再起動
- ローリングアップデート対応

</div>
<div>

## K8s: Deployment

- レプリカ数（replicas）を維持
- Podが落ちたら自動で再起動
- ローリングアップデート対応

</div>
</div>

---

# Deployment のマニフェスト

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
spec:
  replicas: 3          # ECSの desired count と同じ
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app    # ServiceがこのラベルでPodを選ぶ
    spec:
      containers:
        - name: app
          image: nginx:latest
```

---

<!-- _class: lead -->

# 3. TG / Cloud Map → Service

---

# ターゲットグループ / Cloud Map ≒ Service

<div class="two-col">
<div>

## ECS

- ALBターゲットグループでルーティング
- Cloud Mapでサービス間通信
- IPやポートを意識する必要あり

</div>
<div>

## K8s: Service

- **ラベル**でPodを選択してルーティング
- 固定のDNS名で通信できる
- Podが入れ替わっても名前は変わらない

</div>
</div>

---

# Service のマニフェスト

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-app-svc    # この名前でDNS解決できる
spec:
  selector:
    app: my-app       # このラベルのPodに転送
  ports:
    - port: 80
      targetPort: 80
  type: ClusterIP     # クラスタ内部向け（デフォルト）
```

<div class="highlight">

`http://my-app-svc` でクラスタ内から到達できる

</div>

---

<!-- _class: lead -->

# 4. ALB → Ingress / Service(LoadBalancer)

---

# ALB ≒ Ingress / Service(LoadBalancer)

<div class="two-col">
<div>

## ECS: ALB

- リスナー・ルールでパスルーティング
- ターゲットグループへ転送
- AWSコンソールで設定

</div>
<div>

## K8s: Ingress

- パス・ホストでルーティング
- Serviceへ転送
- YAMLで宣言的に設定

</div>
</div>

---

# Ingress のマニフェスト

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: my-ingress
spec:
  rules:
    - host: example.com
      http:
        paths:
          - path: /api
            pathType: Prefix
            backend:
              service:
                name: api-svc     # Serviceに転送
                port:
                  number: 80
          - path: /
            pathType: Prefix
            backend:
              service:
                name: frontend-svc
                port:
                  number: 80
```

---

# Service の type: LoadBalancer

外部公開が1サービスだけなら Ingress より簡単

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-app-svc
spec:
  selector:
    app: my-app
  ports:
    - port: 80
      targetPort: 80
  type: LoadBalancer   # クラウドのLBが自動で作られる
```

---

<!-- _class: lead -->

# まとめ

---

# 改めて：用語の対応表

| やりたいこと | ECS の用語 | K8s の用語 |
|------------|-----------|-----------|
| コンテナの最小単位 | タスク | **Pod** |
| 数を維持・自動復旧 | ECS サービス | **Deployment** |
| 固定名で通信を振り分ける | TG / Cloud Map | **Service** |
| 外の世界からアクセス | ALB | **Ingress / Service(LB)** |

<div class="success">

ECSの概念が頭にあれば、K8sのリソース設計はすぐ馴染む！

</div>

---

<!-- _class: title k8s -->

# ありがとうございました！

多分実際に触ったほうが早いかも？

**@youkan**
