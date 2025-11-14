#!/bin/bash

# リリーススクリプト
# 使用方法: ./scripts/release.sh [patch|minor|major]

set -e

# 引数チェック
if [ -z "$1" ]; then
  echo "使用方法: ./scripts/release.sh [patch|minor|major]"
  echo "  patch: 0.0.4 → 0.0.5"
  echo "  minor: 0.0.4 → 0.1.0"
  echo "  major: 0.0.4 → 1.0.0"
  exit 1
fi

VERSION_TYPE=$1

# 現在のバージョンを取得
CURRENT_VERSION=$(node -p "require('./package.json').version")
echo "現在のバージョン: $CURRENT_VERSION"

# 変更されていないことを確認
if [ -n "$(git status --porcelain)" ]; then
  echo "エラー: 未コミットの変更があります。先にコミットしてください。"
  exit 1
fi

# ビルドとテストを実行
echo "🔨 ビルドとテストを実行中..."
pnpm install --frozen-lockfile
pnpm lint
pnpm compile
pnpm test

# パッケージングのテスト
echo "📦 パッケージングのテスト中..."
pnpm package

# バージョンを更新
echo "📝 バージョンを更新中..."
npm version $VERSION_TYPE --no-git-tag-version

# 新しいバージョンを取得
NEW_VERSION=$(node -p "require('./package.json').version")
echo "新しいバージョン: $NEW_VERSION"

# 変更をコミット
echo "💾 変更をコミット中..."
git add package.json
git commit -m "chore: bump version to v$NEW_VERSION"

# タグを作成
echo "🏷️  タグを作成中..."
git tag "v$NEW_VERSION"

echo ""
echo "✅ リリース準備が完了しました！"
echo ""
echo "次のコマンドでリリースを実行してください："
echo "  git push origin main && git push origin v$NEW_VERSION"
echo ""
echo "または、すぐにプッシュする場合："
read -p "今すぐプッシュしますか？ (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo "🚀 プッシュ中..."
  git push origin main
  git push origin "v$NEW_VERSION"
  echo ""
  echo "🎉 リリースが開始されました！"
  echo "GitHub Actionsの進行状況を確認："
  echo "  https://github.com/$(git remote get-url origin | sed -E 's/.*github.com[:/]([^/]+\/[^.]+).*/\1/')/actions"
fi

