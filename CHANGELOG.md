# Changelog

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
