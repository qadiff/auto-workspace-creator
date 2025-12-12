# Auto Workspace Creator

[![CI](https://github.com/qadiff/auto-workspace-creator/actions/workflows/ci.yml/badge.svg)](https://github.com/qadiff/auto-workspace-creator/actions/workflows/ci.yml) [![Release](https://github.com/qadiff/auto-workspace-creator/actions/workflows/release.yml/badge.svg)](https://github.com/qadiff/auto-workspace-creator/actions/workflows/release.yml) [![License](https://img.shields.io/badge/license-Apache--2.0-blue)](LICENSE)

# Auto Workspace Creator

**EN** | [日本語は下へ](#日本語)

Politely auto-create a `.code-workspace` when opening a folder, using safe heuristics, and reopen VS Code on it.

## Features
- Scans ancestors/children for existing `*.code-workspace` to avoid duplicates
- Only creates when project signals exist (git or key files)
- Confirmation policy: `alwaysAsk` (default), `askOncePerRepo`, `silentIfSafe`, `never`
- Optional: create at repository root and reopen

## Commands
- `Auto Workspace Creator: Create Now`
- `Auto Workspace Creator: Find & Open Nearest`
- `Auto Workspace Creator: Enable/Disable`

## Settings (excerpt)
- `autoWorkspaceCreator.enabled` (boolean, default `true`)
- `autoWorkspaceCreator.confirmationMode` (`alwaysAsk`|`askOncePerRepo`|`silentIfSafe`|`never`)
- `autoWorkspaceCreator.writeToRepoRootIfDetected` (boolean, default `true`)
- `autoWorkspaceCreator.ignorePaths` (array) — safety
- `autoWorkspaceCreator.keyProjectFiles` (array) — project signals

## Development

### Setup
```bash
npm ci
npm run compile
npm test
```

### Build
```bash
npm run package
```
A `.vsix` will be created in the project root.

### Release

#### Quick Release
```bash
# Automatically bump version, commit, tag, and push
./scripts/release.sh patch  # 0.0.4 → 0.0.5
./scripts/release.sh minor  # 0.0.4 → 0.1.0
./scripts/release.sh major  # 0.0.4 → 1.0.0
```

#### Manual Release
```bash
# Update version in package.json
npm version patch

# Push tag to trigger GitHub Actions
git push origin main
git push origin v0.0.5
```

See [Release Guide](.github/workflows/RELEASE_GUIDE.md) for details.

### CI/CD
- **CI**: Runs on every push/PR (lint, compile, test, package)
- **Release**: Automatically triggered on tag push (`v*`)
  - Builds extension
  - Creates GitHub Release
  - Publishes to VS Code Marketplace (optional)
  - Publishes to Open VSX Registry (optional)

---

## 日本語

フォルダを開いた際、**安全な条件**を満たす場合のみ `.code-workspace` を**自動作成**し、ワークスペースとして**開き直し**ます。

### 機能
- 親/子の `*.code-workspace` を探索して**重複作成を回避**
- Git や言語別ファイル等の**プロジェクトシグナル**がある場合のみ作成
- **確認ポリシー**：`alwaysAsk`（既定）/ `askOncePerRepo` / `silentIfSafe` / `never`
- **レポジトリルートに作成**して自動的に**再オープン**も可能

### コマンド
- `Auto Workspace Creator: Create Now`（今すぐ作成）
- `Auto Workspace Creator: Find & Open Nearest`（近傍を開く）
- `Auto Workspace Creator: Enable/Disable`（有効/無効切替）

### 開発

#### セットアップ
```bash
npm ci
npm run compile
npm test
```

#### ビルド
```bash
npm run package
```
ルートに `.vsix` が生成されます。

#### リリース

##### 簡単リリース
```bash
# バージョン更新、コミット、タグ作成、プッシュを自動実行
./scripts/release.sh patch  # 0.0.4 → 0.0.5
./scripts/release.sh minor  # 0.0.4 → 0.1.0
./scripts/release.sh major  # 0.0.4 → 1.0.0
```

##### 手動リリース
```bash
# package.jsonのバージョンを更新
npm version patch

# タグをプッシュしてGitHub Actionsを起動
git push origin main
git push origin v0.0.1
```

詳細は[リリースガイド](.github/workflows/RELEASE_GUIDE.md)を参照。

### CI/CD
- **CI**: 全てのpush/PRで実行（lint、コンパイル、テスト、パッケージング）
- **Release**: タグプッシュ（`v*`）で自動実行
  - 拡張機能のビルド
  - GitHub Releaseの作成
  - VS Code Marketplaceへ公開（オプション）
  - Open VSX Registryへ公開（オプション）


## Policy File (per-repo overrides)
Create a `.workspacepolicy.json` at repo root to override settings:
```json
{
  "confirmationMode": "askOncePerRepo",
  "writeToRepoRootIfDetected": true,
  "ignorePaths": ["~","/etc","/var","/tmp","node_modules"],
  "searchDepth": {"up": 10, "down": 2}
}
```

## Localization
Runtime messages use `vscode-nls`. Add translations and bundle with `vscode-nls-dev` if needed.


## Nearby Workspace QuickPick
If an ancestor or child folder contains one or more `*.code-workspace`, you'll be offered a QuickPick to choose which to open.

## Package Localization
This extension localizes `package.json` via `package.nls.json` (EN) and `package.nls.ja.json` (JA).
