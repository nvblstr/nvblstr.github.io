#!/usr/bin/env sh

set -e

cd "$(dirname "$0")/.."
powershell -ExecutionPolicy Bypass -File ./deploy.ps1 -Publish
