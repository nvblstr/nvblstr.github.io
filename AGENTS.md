# AGENTS.md

このリポジトリでCodex/AIエージェントが作業するときの共有メモ。各セッションで同じ確認を繰り返さないため、構成、デプロイ手順、詰まりやすい点をここに集約する。

## 基本方針

- 成果物、説明文、Skill、AGENTS.mdなどは、英語であることが必須または明らかに望ましい場合を除き、日本語で書く。
- 既存の構成と手順を優先する。新しいデプロイ経路やビルド手順を勝手に増やさない。
- `lcal` と `lcal3` を混同しない。変更対象がどちらかを確認してから編集する。
- ユーザーの未コミット変更を戻さない。不要な整形や無関係なリファクタは避ける。
- 生成物や一時ディレクトリをソース変更として扱わない。

## リポジトリ構成

- `lcal/`: スプラトゥーン2用LunaCalculator。Vue 3 + ViteのJavaScriptプロジェクト。
  - 主要ファイル: `src/main.js`, `src/App.vue`, `src/components/Calculator.vue`, `src/style.css`
  - Vite base: `/lcal/`
  - dev server: port `5501`
  - build output: `lcal/dist`
- `lcal3/`: スプラトゥーン3用LunaCalculator。Vue 3 + Vite + TypeScriptプロジェクト。
  - 主要ファイル: `src/main.ts`, `src/App.vue`, `src/components/Calculator.vue`, `src/components/Header.vue`, `src/composables/useDarkMode.ts`, `src/style.css`
  - Vite base: `/lcal3/`
  - dev server: port `5500`
  - build output: `lcal3/dist`
- `deploy.ps1`: GitHub Pages用の統合ビルド/公開スクリプト。
- `.pages-dist/`: `deploy.ps1` が作るGitHub Pages公開用の生成物。`.gitignore`対象。
- `.pages-worktree/`: `deploy.ps1 -Publish` が使う一時worktree。`.gitignore`対象。

## 開発コマンド

`lcal` と `lcal3` は、どちらも対象ディレクトリへ移動して同じnpm scriptを使う。

```powershell
cd <lcal または lcal3>
npm.cmd run dev
npm.cmd run build
npm.cmd run preview
npm.cmd run lint
```

注意:

- dev serverのポートは `lcal` が `5501`、`lcal3` が `5500`。
- `lcal3` の `build` は `vue-tsc -b && vite build` を実行するため、TypeScriptエラーも検出される。
- `lint` はどちらも `eslint . --fix` なので、実行すると自動修正が入る。必要なときだけ実行し、差分を確認する。
- 依存関係のインストールやネットワークアクセスが必要な場合は、実行前に承認を得る。

## GitHub Pagesデプロイ

GitHub Pagesへの公開は、基本的にリポジトリ直下の `deploy.ps1` を使う。

```powershell
./deploy.ps1
```

- `lcal` と `lcal3` の両方で `npm.cmd run build` を実行する。
- `lcal/dist` を `.pages-dist/lcal` へコピーする。
- `lcal3/dist` を `.pages-dist/lcal3` へコピーする。
- `lcal3/dist/index.html` を `.pages-dist/index.html` へコピーする。サイトルートは `lcal3` の内容になる。
- `.pages-dist/.nojekyll` を作成する。

公開する場合:

```powershell
./deploy.ps1 -Publish
```

- `origin/gh-pages` をfetchする。
- `.pages-worktree` に `gh-pages` のworktreeを作る。
- `.pages-worktree` 内の `.git` 以外を削除し、`.pages-dist` の内容で置き換える。
- worktree内で `git add -A`, `git commit -m "deploy"`, `git push origin HEAD:gh-pages` を実行する。
- 最後に `git worktree remove .pages-worktree --force` を実行する。

デプロイ時の注意:

- `gh-pages` は公開用ブランチ。ソースブランチへmergeしない。
- `.pages-dist` と `.pages-worktree` は生成物/一時領域として扱う。
- `deploy.ps1 -Publish` は削除を伴うため、対象パスがリポジトリ内の `.pages-dist` と `.pages-worktree` であることを確認する。
- 未コミットのソース変更がある状態で公開すると、その変更がビルド成果物へ含まれる可能性がある。必要に応じて公開前にユーザーへ確認する。

## 権限付き実行のパターン

このWindows環境では、通常の読み取りコマンドでもサンドボックスの `CreateProcessAsUserW failed: 5` に当たることがある。その場合は、同じコマンドを `sandbox_permissions: "require_escalated"` で再実行する。

よく権限付きが必要になる操作:

- `Get-Content` や `Get-ChildItem` によるファイル確認
- `rg` によるリポジトリ内検索
- `git status` などの状態確認
- `C:\Users\qsrms\.codex\skills` 配下のSkill確認や編集
- `deploy.ps1 -Publish` のようにgit fetch/pushやworktree操作を含む公開処理

権限付きで実行する場合は、実行目的を短く具体的に説明する。ネットワークアクセス、依存関係インストール、公開push、破壊的な削除を伴う操作は特に慎重に扱う。

## Skill運用メモ

- GitHub Pages関連の作業では、ローカルSkill `github-pages-deploy` を参照する。
- Skillの場所: `C:\Users\qsrms\.codex\skills\github-pages-deploy\SKILL.md`
- このSkillは日本語化済み。今後Skillを追加/修正する場合も、英語が必須または明らかに望ましい場合を除き日本語で書く。
- Skill検証で日本語を含む場合、Windowsのcp932読み込みで失敗することがある。その場合はUTF-8モードで検証する。

```powershell
python -X utf8 C:\Users\qsrms\.codex\skills\.system\skill-creator\scripts\quick_validate.py C:\Users\qsrms\.codex\skills\github-pages-deploy
```

## AGENTS.mdの更新ルール

- セッション中に詰まった点、ユーザーから訂正された点、今後も再発しそうな判断材料は、このファイルへ短く追記する。
- コマンド、ポート、ディレクトリ、公開ブランチなどは具体名で書く。
- 推測ではなく、確認した事実と運用ルールを分けて書く。
- 長大なファイル内容を丸ごと貼らず、次回の作業判断に必要な要点をまとめる。
- 新しいプロジェクトや公開手順を追加したら、構成、build/devコマンド、deploy手順、生成物の扱いを更新する。
