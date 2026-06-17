# Changelog

## Unreleased
- **Breaking:** Minimum supported VS Code raised to **1.120.0** (`engines.vscode` and `@types/vscode` bumped from `^1.110.0`). Installs on VS Code older than 1.120 will stay on the previous release.
- **Maintenance:** Dev dependencies updated to latest — TypeScript 6, ESLint 10, `@vscode/test-electron` 3, `@vscode/vsce` 3.9, `@types/node` 25, `@typescript-eslint` 8.61, mocha, tsx, Chai, `glob`.
- **CI:** `actions/upload-artifact` v6 → v7; `softprops/action-gh-release` v2 → v3.

## 0.0.5
- **Fix:** Choosing **Not Now** on the create-workspace prompt no longer creates or reopens a workspace; the confirmation result was treated as a boolean while `confirmCreate` returns `'yes' | 'no'` ([#25](https://github.com/qadiff/auto-workspace-creator/issues/25)).
- **Maintenance:** Dev dependency updates (e.g. ESLint toolchain, TypeScript, `glob`, Chai, `@types/node`).
- **CI:** GitHub Actions updated (`actions/setup-node` v6, `actions/upload-artifact` v6).

## 0.0.4
- Fix: VSIX now bundles `vscode-nls` (activation failure/`command not found` in remote environments resolved).
- Packaging scripts updated to avoid `--no-dependencies` so runtime deps are included.
- Housekeeping: version bump and release notes.

## 0.0.3
- Dev tooling updates (pnpm 10.25.x, `@typescript-eslint/*`).
- Added VS Code test runner support via `@vscode/test-electron`.
- Test/CI utility improvements (added `glob` and related script updates).

## 0.0.2
- i18n scaffolding for package strings (ja)
- Improved prompts and ignore-path defaults
- Full Apache-2.0 LICENSE
- Added CONTRIBUTING, CODE_OF_CONDUCT, SECURITY
- CI: package on tag

## 0.0.1
- Initial minimal implementation
