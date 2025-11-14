# リリーススクリプト (PowerShell版)
# 使用方法: .\scripts\release.ps1 [patch|minor|major]

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("patch", "minor", "major")]
    [string]$VersionType
)

$ErrorActionPreference = "Stop"

Write-Host "現在のバージョンを取得中..."
$packageJson = Get-Content "package.json" | ConvertFrom-Json
$currentVersion = $packageJson.version
Write-Host "現在のバージョン: $currentVersion"

# 変更されていないことを確認
$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-Host "エラー: 未コミットの変更があります。先にコミットしてください。" -ForegroundColor Red
    exit 1
}

# ビルドとテストを実行
Write-Host "🔨 ビルドとテストを実行中..."
pnpm install --frozen-lockfile
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

pnpm lint
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

pnpm compile
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

pnpm test
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

# パッケージングのテスト
Write-Host "📦 パッケージングのテスト中..."
pnpm package
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

# バージョンを更新
Write-Host "📝 バージョンを更新中..."
npm version $VersionType --no-git-tag-version
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

# 新しいバージョンを取得
$packageJson = Get-Content "package.json" | ConvertFrom-Json
$newVersion = $packageJson.version
Write-Host "新しいバージョン: $newVersion"

# 変更をコミット
Write-Host "💾 変更をコミット中..."
git add package.json
git commit -m "chore: bump version to v$newVersion"
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

# タグを作成
Write-Host "🏷️  タグを作成中..."
git tag "v$newVersion"
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host ""
Write-Host "✅ リリース準備が完了しました！" -ForegroundColor Green
Write-Host ""
Write-Host "次のコマンドでリリースを実行してください："
Write-Host "  git push origin main && git push origin v$newVersion"
Write-Host ""

$response = Read-Host "今すぐプッシュしますか？ (y/N)"
if ($response -eq 'y' -or $response -eq 'Y') {
    Write-Host "🚀 プッシュ中..."
    git push origin main
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
    
    git push origin "v$newVersion"
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
    
    Write-Host ""
    Write-Host "🎉 リリースが開始されました！" -ForegroundColor Green
    
    # GitHubのURLを取得
    $remoteUrl = git remote get-url origin
    $repoPath = $remoteUrl -replace '.*github.com[:/]', '' -replace '\.git$', ''
    Write-Host "GitHub Actionsの進行状況を確認："
    Write-Host "  https://github.com/$repoPath/actions"
}

