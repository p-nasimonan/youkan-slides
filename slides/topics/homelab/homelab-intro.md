---
marp: true
theme: youkan
paginate: true
header: ''
footer: '自宅サーバー入門 | @youkan'
---

<!-- _class: title homelab -->

# 自宅サーバーのすすめ

## HomeLab入門

**youkan** | エンジニア集会

---

<!-- _class: lead -->

# 自宅にサーバー、ありますか？

---

# HomeLab とは？

> 自宅に構築するサーバー環境
> 学習・実験・セルフホスティングに最適

## こんな人におすすめ

- インフラを触りたいが本番環境は怖い
- クラウド費用を抑えたい
- 自分でサービスを運用したい
- 単純に楽しそう！

---

# 私の構成

```
┌─────────────────────────────────────┐
│         Proxmox VE (Host)           │
│  ┌────────────────────────────────┐ │
│  │      K3s Cluster               │ │
│  │  ┌─────┐ ┌─────┐ ┌─────────┐  │ │
│  │  │Gitea│ │ArgoCD│ │Monitoring│  │ │
│  │  └─────┘ └─────┘ └─────────┘  │ │
│  └────────────────────────────────┘ │
│  ┌─────────┐  ┌─────────────────┐   │
│  │  NAS    │  │  Reverse Proxy  │   │
│  │(TrueNAS)│  │   (Traefik)     │   │
│  └─────────┘  └─────────────────┘   │
└─────────────────────────────────────┘
```

---

# おすすめハードウェア

## 入門機（1万円〜）
- Raspberry Pi 4/5
- 中古ミニPC (ThinkCentre等)

## 本格派（5万円〜）
- 中古サーバー (Dell PowerEdge等)
- 自作PC

<div class="warning">

**注意**: 電気代と騒音を考慮しよう

</div>

---

# 必須ソフトウェア

## ハイパーバイザー
- **Proxmox VE** (無料、おすすめ)
- ESXi
- Hyper-V

## コンテナ基盤
- **K3s** (軽量K8s)
- Docker Compose

## 管理ツール
- Ansible, Terraform

---

# 動かしているもの

<div class="two-column">
<div>

## 開発系
- Gitea (Git)
- Drone CI
- Harbor (Container Registry)

## 監視
- Prometheus
- Grafana
- Loki

</div>
<div>

## 生活系
- Nextcloud
- Immich (写真)
- Home Assistant

## メディア
- Jellyfin
- Audiobookshelf

</div>
</div>

---

# セキュリティの考慮点

<div class="highlight">

1. **ファイアウォール**: 必要なポートのみ開放
2. **VPN**: Tailscale / WireGuard
3. **リバースプロキシ**: HTTPS化
4. **バックアップ**: 3-2-1ルール
5. **アップデート**: 自動化推奨

</div>

---

# 始め方ロードマップ

1. **Phase 1**: Raspberry Pi + Docker Compose
   - シンプルなサービスを動かす

2. **Phase 2**: 仮想化基盤導入
   - Proxmoxで複数VMを管理

3. **Phase 3**: Kubernetes化
   - K3sでコンテナオーケストレーション

4. **Phase 4**: GitOps
   - Infrastructure as Code

---

# つまずきポイント

<div class="warning">

- **ネットワーク**: VLANやDNSの設定
- **ストレージ**: バックアップ戦略
- **時間泥棒**: 趣味なので際限がない
- **家族の理解**: 電気代と騒音...

</div>

---

<!-- _class: lead -->

# まとめ

- HomeLab は最高の学習環境
- 小さく始めて育てていく
- コミュニティで情報交換しよう！

---

<!-- _class: title homelab -->

# ありがとうございました！

HomeLab仲間募集中！

**@youkan**
