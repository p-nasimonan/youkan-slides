# Assets

```
assets/
├── logos/      # ローカル保存用ロゴ（必要に応じて）
└── diagrams/   # draw.io図（.drawio.svg形式推奨）
```

## 技術ロゴの簡単な使い方

コンポーネントで1行挿入：

```markdown
<!-- @include ../components/tech-logos.md kubernetes -->
<!-- @include ../components/tech-logos.md docker -->
<!-- @include ../components/tech-logos.md aws -->
```

利用可能: kubernetes, docker, aws, gcp, azure, github, terraform, ansible, prometheus, grafana, nginx, redis, postgresql, mysql, python, go, rust, react, vue, linux 他

詳細は [components/tech-logos.md](../components/tech-logos.md)

## draw.io

VS Code拡張「Draw.io Integration」でSVG形式保存。

```markdown
![](../../assets/diagrams/architecture.drawio.svg)
```
