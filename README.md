# Auto Workspace Creator

[![Build](https://img.shields.io/badge/build-GitHub%20Actions-brightgreen)](#) [![License](https://img.shields.io/badge/license-Apache--2.0-blue)](LICENSE)

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

## Build
```bash
npm i
npm run compile
npx vsce package
```
A `.vsix` will be created in the project root.

---

## 日本語

フォルダを開いた際、**安全な条件**を満たす場合のみ `.code-workspace` を**上品に自動作成**し、ワークスペースとして**開き直し**ます。

### 機能
- 親/子の `*.code-workspace` を探索して**重複作成を回避**
- Git や言語別ファイル等の**プロジェクトシグナル**がある場合のみ作成
- **確認ポリシー**：`alwaysAsk`（既定）/ `askOncePerRepo` / `silentIfSafe` / `never`
- **レポジトリルートに作成**して自動的に**再オープン**も可能

### コマンド
- `Auto Workspace Creator: Create Now`（今すぐ作成）
- `Auto Workspace Creator: Find & Open Nearest`（近傍を開く）
- `Auto Workspace Creator: Enable/Disable`（有効/無効切替）

### ビルド
```bash
npm i
npm run compile
npx vsce package
```
ルートに `.vsix` が生成されます。


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
