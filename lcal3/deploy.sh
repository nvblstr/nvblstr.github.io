#!/usr/bin/env sh

# エラーが発生したら停止
set -e

# ビルド
npm run build

# ビルド出力ディレクトリに移動
cd dist

# カスタムドメインの場合はCNAMEファイルを作成
# echo 'www.example.com' > CNAME

git init
git add -A
git commit -m 'deploy'

# https://<USERNAME>.github.io/<REPO> にデプロイ
git push -f git@github.com:nvblstr/lcal3.git main:gh-pages

cd - 