#Requires -Version 5.1
<#
.SYNOPSIS
  Откатывает отслеживаемые файлы к состоянию на git-теге snapshot.
.PARAMETER Tag
  Имя тега, например snapshot/site-20260513-1430
.PARAMETER ForcePushMain
  После reset выполнить git push --force-with-lease origin main (ОПАСНО для общей ветки).
#>
param(
  [Parameter(Mandatory = $true)]
  [string]$Tag,

  [switch]$ForcePushMain
)

$ErrorActionPreference = "Stop"
Set-Location (Resolve-Path (Join-Path $PSScriptRoot ".."))

if (-not (Test-Path ".git")) {
  Write-Error "Запускайте скрипт из корня репозитория."
}

git fetch --tags 2>$null

$exists = git tag -l $Tag
if (-not $exists) {
  Write-Error "Тег не найден: $Tag. Список: git tag -l 'snapshot/*'"
}

Write-Host "Сброс к $Tag ..." -ForegroundColor Yellow
git reset --hard $Tag

Write-Host "OK. Установите зависимости: npm install" -ForegroundColor Green

if ($ForcePushMain) {
  $confirm = Read-Host "Выполнить git push --force-with-lease origin main? (yes/NO)"
  if ($confirm -eq "yes") {
    git push --force-with-lease origin main
    Write-Host "main обновлён на удалённом репозитории." -ForegroundColor Green
  } else {
    Write-Host "Push отменён."
  }
}
