export default {
  // Marp基本設定
  html: true,
  allowLocalFiles: true,

  // カスタムエンジン
  engine: ({ marp }) => {
    // ショートコード展開プラグイン
    marp.use((md) => {
      md.core.ruler.before('normalize', 'shortcode_expansion', (state) => {
        let content = state.src;

        // @logo(name, size?) - 技術ロゴ挿入
        content = content.replace(
          /@logo\(([^,)]+)(?:,\s*(\d+))?\)/g,
          (match, name, size) => {
            const width = size || '200';
            return `<!-- @include components/tech-logos.md ${name.trim()} -->`.replace(
              'width:200px',
              `width:${width}px`
            );
          }
        );

        // @intro - 自己紹介スライド（フル）
        content = content.replace(
          /@intro\b/g,
          '<!-- @include components/self-intro.md intro -->'
        );

        // @intro(compact) - 自己紹介（コンパクト）
        content = content.replace(
          /@intro\(compact\)/g,
          '<!-- @include components/self-intro.md compact -->'
        );

        // @closing - クロージング（シンプル）
        content = content.replace(
          /@closing\b(?!\()/g,
          '<!-- @include components/closing.md simple -->'
        );

        // @closing(social) - クロージング（SNS付き）
        content = content.replace(
          /@closing\(social\)/g,
          '<!-- @include components/closing.md social -->'
        );

        // @closing(qr) - クロージング（QR付き）
        content = content.replace(
          /@closing\(qr\)/g,
          '<!-- @include components/closing.md withqr -->'
        );

        state.src = content;
      });
    });

    return marp;
  }
};
