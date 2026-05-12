#Requires -Version 5.1
<#
.SYNOPSIS
  Создаёт аннотированный git-тег snapshot/site-<штамп> на текущем HEAD.
.PARAMETER Note
  Короткий суффикс для тега (латиница/цифры/дефис), например: before-redesign
.PARAMETER Push
  Сразу отправить тег на origin.
#>
param(
  [string]$Note = "",
  [switch]$Push
)

$ErrorActionPreference = "Stop"
Set-Location (Resolve-Path (Join-Path $PSScriptRoot ".."))

if (-not (Test-Path ".git")) {
  Write-Error "Запускайте скрипт из клона репозитория (рядом с .git)."
}

$dirty = git status --porcelain
if ($dirty) {
  Write-Warning "Рабочее дерево не чистое — тег всё равно будет на текущем HEAD, но лучше закоммитьте или спрячьте изменения."
}

$stamp = Get-Date -Format "yyyyMMdd-HHmm"
$tag = if ($Note) { "snapshot/site-$stamp-$Note" } else { "snapshot/site-$stamp" }

$msg = "Site snapshot $stamp$(if ($Note) { " ($Note)" })"

git tag -a $tag -m $msg
Write-Host "OK: создан тег $tag" -ForegroundColor Green
Write-Host "Просмотр: git show $tag"

if ($Push) {
  git push origin $tag
  Write-Host "Тег отправлен на origin." -ForegroundColor Green
} else {
  Write-Host "Отправить на GitHub: git push origin $tag"
}
