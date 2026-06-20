#!/bin/bash

set -e

# オプション解析
PUBLISH=false
while [[ "$#" -gt 0 ]]; do
  case $1 in
    -p|--publish|-P|--Publish) PUBLISH=true ;;
    *) echo "Unknown parameter: $1"; exit 1 ;;
  esac
  shift
done

# パス設定
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PUBLISH_DIR="$REPO_ROOT/.pages-dist"
WORKTREE_DIR="$REPO_ROOT/.pages-worktree"
REMOTE_NAME="origin"
PAGES_BRANCH="gh-pages"

cd "$REPO_ROOT"

# lcalのビルド
echo "Building lcal..."
cd "$REPO_ROOT/lcal"
npm run build

# lcal3のビルド
echo "Building lcal3..."
cd "$REPO_ROOT/lcal3"
npm run build

cd "$REPO_ROOT"

# .pages-distの準備
if [ -d "$PUBLISH_DIR" ]; then
  rm -rf "$PUBLISH_DIR"
fi

mkdir -p "$PUBLISH_DIR/lcal"
mkdir -p "$PUBLISH_DIR/lcal3"

# ビルド成果物のコピー
cp -r "$REPO_ROOT/lcal/dist/"* "$PUBLISH_DIR/lcal/"
cp -r "$REPO_ROOT/lcal3/dist/"* "$PUBLISH_DIR/lcal3/"
cp "$REPO_ROOT/lcal3/dist/index.html" "$PUBLISH_DIR/index.html"

# .nojekyllファイルの作成
touch "$PUBLISH_DIR/.nojekyll"

echo "Built GitHub Pages content at $PUBLISH_DIR"

if [ "$PUBLISH" = false ]; then
  echo "Run ./deploy.sh --publish to publish this content to gh-pages."
  exit 0
fi

# Publish処理
if [ -d "$WORKTREE_DIR" ]; then
  rm -rf "$WORKTREE_DIR"
fi

git fetch "$REMOTE_NAME" "$PAGES_BRANCH"
git worktree add "$WORKTREE_DIR" "$REMOTE_NAME/$PAGES_BRANCH"

cd "$WORKTREE_DIR"

# .git以外のファイルを削除
find . -maxdepth 1 -not -name '.git' -not -name '.' -exec rm -rf {} +

# .pages-distの内容をコピー
cp -r "$PUBLISH_DIR/"* "$WORKTREE_DIR/"
cp "$PUBLISH_DIR/.nojekyll" "$WORKTREE_DIR/"

# コミットとプッシュ
git add -A
git commit -m "deploy"
git push "$REMOTE_NAME" "HEAD:$PAGES_BRANCH"

# worktreeの削除
cd "$REPO_ROOT"
git worktree remove "$WORKTREE_DIR" --force

echo "Deployed to gh-pages successfully!"
