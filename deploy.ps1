param(
  [switch]$Publish
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$publishDir = Join-Path $repoRoot ".pages-dist"
$worktreeDir = Join-Path $repoRoot ".pages-worktree"
$remoteName = "origin"
$pagesBranch = "gh-pages"

Push-Location $repoRoot
try {
  Push-Location (Join-Path $repoRoot "lcal")
  try {
    npm run build
  } finally {
    Pop-Location
  }

  Push-Location (Join-Path $repoRoot "lcal3")
  try {
    npm run build
  } finally {
    Pop-Location
  }

  if (Test-Path $publishDir) {
    Remove-Item -LiteralPath $publishDir -Recurse -Force
  }

  New-Item -ItemType Directory -Path (Join-Path $publishDir "lcal") | Out-Null
  New-Item -ItemType Directory -Path (Join-Path $publishDir "lcal3") | Out-Null

  Copy-Item -Path (Join-Path $repoRoot "lcal/dist/*") -Destination (Join-Path $publishDir "lcal") -Recurse
  Copy-Item -Path (Join-Path $repoRoot "lcal3/dist/*") -Destination (Join-Path $publishDir "lcal3") -Recurse

  New-Item -ItemType File -Path (Join-Path $publishDir ".nojekyll") -Force | Out-Null

  @"
<!doctype html>
<html lang="ja">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>LunaCalculator</title>
    <meta http-equiv="refresh" content="0; url=./lcal3/">
  </head>
  <body>
    <p><a href="./lcal/">LunaCalculator</a></p>
    <p><a href="./lcal3/">LunaCalculator3</a></p>
  </body>
</html>
"@ | Set-Content -Path (Join-Path $publishDir "index.html") -Encoding UTF8

  Write-Host "Built GitHub Pages content at $publishDir"
  if (-not $Publish) {
    Write-Host "Run ./deploy.ps1 -Publish to publish this content to gh-pages."
    return
  }

  if (Test-Path $worktreeDir) {
    Remove-Item -LiteralPath $worktreeDir -Recurse -Force
  }

  git fetch $remoteName $pagesBranch
  git worktree add $worktreeDir "$remoteName/$pagesBranch"

  try {
    Get-ChildItem -LiteralPath $worktreeDir -Force |
      Where-Object { $_.Name -ne ".git" } |
      Remove-Item -Recurse -Force

    Copy-Item -Path (Join-Path $publishDir "*") -Destination $worktreeDir -Recurse -Force
    Copy-Item -LiteralPath (Join-Path $publishDir ".nojekyll") -Destination $worktreeDir -Force

    Push-Location $worktreeDir
    try {
      git add -A
      git commit -m "deploy"
      git push $remoteName "HEAD:$pagesBranch"
    } finally {
      Pop-Location
    }
  } finally {
    git worktree remove $worktreeDir --force
  }
} finally {
  Pop-Location
}
