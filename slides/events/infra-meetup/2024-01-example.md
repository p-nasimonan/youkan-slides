---
marp: true
theme: youkan
paginate: true
header: ''
footer: 'インフラ集会 2024/01 | @youkan'
---

<!-- _class: title infra -->

# GitOpsで始める
# インフラ自動化

## ArgoCD実践入門

**youkan** | インフラ集会 2024年1月

---

<!-- _class: lead -->

# 自己紹介

- **名前**: youkan
- **仕事**: SRE / インフラエンジニア
- **最近の興味**: GitOps, Platform Engineering
- **SNS**: @youkan

---

# 今日のゴール

<div class="highlight">

**GitOpsとArgoCDの基本を理解する**

1. GitOpsとは何か
2. なぜGitOpsなのか
3. ArgoCDの使い方
4. 実践Tips

</div>

---

# GitOpsとは？

> Gitをシングルソースオブトゥルースとして
> インフラとアプリケーションを管理する手法

```
┌─────────┐    push     ┌─────────┐
│   Dev   │ ──────────> │   Git   │
└─────────┘             └────┬────┘
                             │ sync
                        ┌────▼────┐
                        │  ArgoCD │
                        └────┬────┘
                             │ deploy
                        ┌────▼────┐
                        │   K8s   │
                        └─────────┘
```

---

# 従来のCI/CDとの違い

## Push型（従来）
- CIツールがクラスターにデプロイ
- クラスターへの認証情報が必要

## Pull型（GitOps）
- クラスター内のエージェントが同期
- 外部からの認証不要

---

# ArgoCDとは

- Kubernetes用のGitOpsツール
- CNCF graduated project
- 宣言的なデプロイ管理
- WebUIで状態を可視化

---

# インストール

```bash
# namespace作成
kubectl create namespace argocd

# ArgoCDインストール
kubectl apply -n argocd -f \
  https://raw.githubusercontent.com/argoproj/\
  argo-cd/stable/manifests/install.yaml

# CLIインストール
brew install argocd
```

---

# Applicationリソース

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: my-app
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/user/repo.git
    targetRevision: HEAD
    path: manifests
  destination:
    server: https://kubernetes.default.svc
    namespace: my-app
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
```

---

# 実践Tips

<div class="success">

1. **App of Apps パターン**: アプリ定義も Git で管理
2. **Helm + Kustomize**: 環境差分を吸収
3. **Sync Waves**: デプロイ順序の制御
4. **Notifications**: Slack連携で通知

</div>

---

<div class="warning">

**注意点**
- Secretの管理は別途考える（Sealed Secrets等）
- 大規模環境ではApplicationSetを検討
- Gitリポジトリの権限管理を忘れずに

</div>

---

<!-- _class: lead -->

# まとめ

- GitOps = Git をソースオブトゥルースに
- ArgoCD で宣言的デプロイ
- 小さく始めて育てていく

---

<!-- _class: title infra -->

# ありがとうございました！

GitOps、一緒に語りましょう！

**@youkan**
