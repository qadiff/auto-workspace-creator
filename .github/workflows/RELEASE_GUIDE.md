# リリースガイド

## 自動リリースの仕組み

このプロジェクトはGitHub Actionsを使用して、タグプッシュ時に自動的に拡張機能をビルド・リリースします。

## リリース手順

### 1. バージョンの更新

`package.json`のバージョンを更新：

```bash
# バージョン番号を手動で更新
# 例: "version": "0.0.4" → "version": "0.0.5"
```

または

```bash
# npmを使用して自動更新
npm version patch  # 0.0.4 → 0.0.5
npm version minor  # 0.0.4 → 0.1.0
npm version major  # 0.0.4 → 1.0.0
```

### 2. 変更をコミット

```bash
git add package.json
git commit -m "chore: bump version to v0.0.5"
```

### 3. タグの作成とプッシュ

```bash
# タグを作成
git tag v0.0.5

# タグをプッシュ
git push origin v0.0.5
```

### 4. 自動処理

タグがプッシュされると、GitHub Actionsが自動的に：

1. ✅ プロジェクトをビルド
2. ✅ 拡張機能（.vsix）をパッケージング
3. ✅ GitHub Releaseを作成
4. ✅ .vsixファイルをアップロード
5. ✅ VS Code Marketplaceに公開（オプション）
6. ✅ Open VSX Registryに公開（オプション）

## Marketplaceへの公開設定

VS Code MarketplaceとOpen VSX Registryへ公開するには、GitHubリポジトリのSecretsに以下を設定：

### VS Code Marketplace

1. [Visual Studio Marketplace](https://marketplace.visualstudio.com/manage)でPersonal Access Tokenを作成
2. GitHubリポジトリの Settings → Secrets → Actions で追加：
   - Name: `VSCE_PAT`
   - Value: 作成したトークン

### Open VSX Registry

1. [Open VSX Registry](https://open-vsx.org/)でAccess Tokenを作成
2. GitHubリポジトリの Settings → Secrets → Actions で追加：
   - Name: `OVSX_PAT`
   - Value: 作成したトークン

## 注意事項

- タグ名は必ず `v` で始める（例: `v0.0.5`）
- `alpha`、`beta`を含むタグはMarketplaceに公開されません
- Marketplace公開は `continue-on-error: true` なので、失敗してもリリースは続行されます

## CI/CD概要

### CI Workflow（`.github/workflows/ci.yml`）

- **トリガー**: main/masterブランチへのpush・PR
- **処理内容**:
  - Lint
  - コンパイル
  - テスト
  - パッケージングのテスト

### Release Workflow（`.github/workflows/release.yml`）

- **トリガー**: `v*`形式のタグpush
- **処理内容**:
  - コンパイル
  - パッケージング
  - GitHub Releaseの作成
  - Marketplaceへの公開

## トラブルシューティング

### パッケージングが失敗する場合

```bash
# ローカルで確認
pnpm install
pnpm compile
pnpm package
```

### タグを削除して再作成する場合

```bash
# ローカルのタグを削除
git tag -d v0.0.5

# リモートのタグを削除
git push origin :refs/tags/v0.0.5

# 再度タグを作成してプッシュ
git tag v0.0.5
git push origin v0.0.5
```

