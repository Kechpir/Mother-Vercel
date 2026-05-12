# Снимки состояния сайта (snapshots)

Снимок здесь — это **не копия файлов в папке**, а **метка на коммите в Git** (`annotated tag`). Так принято делать: в репозитории не дублируется весь фронт, зато можно **одной командой** откатить весь отслеживаемый код к зафиксированному состоянию.

## Что входит в снимок

- Все файлы, которые уже в Git (включая `src/`, конфиги Next и т.д.).
- **Не входит:** секреты в `.env` / `.env.local` (они в `.gitignore`). После восстановления их нужно положить вручную, как и сейчас.

## Структура

| Путь | Назначение |
|------|------------|
| [README.md](./README.md) | Эта справка |
| [create-snapshot.ps1](./create-snapshot.ps1) | Создать новый снимок (тег) от текущего `HEAD` |
| [restore-from-tag.ps1](./restore-from-tag.ps1) | Восстановить рабочую копию к тегу (опционально с push) |
| `bundles/` | Сюда по желанию кладутся `*.bundle` (в .gitignore), если делаете офлайн-архив |

## Текущий зафиксированный снимок

Имя тега вида: `snapshot/site-YYYYMMDD-HHmm` или с суффиксом `-<note>` (см. `git tag -l "snapshot/*"`).

Пример зафиксированного «базового» снимка на дату работ:

`snapshot/site-2026-05-13-baseline`

## Восстановление локально (весь сайт в файлах как на снимке)

Из корня репозитория:

```powershell
cd путь\к\Mother
.\snapshots\restore-from-tag.ps1 -Tag snapshot/site-2026-05-13-baseline
```

Или вручную:

```powershell
git fetch --tags
git reset --hard snapshot/site-2026-05-13-baseline
npm install
```

## Если нужно перезаписать удалённый `main` этим состоянием

Осторожно: перепишет историю на GitHub для ветки.

```powershell
git reset --hard snapshot/site-2026-05-13-baseline
git push --force-with-lease origin main
```

Предпочтительнее `--force-with-lease`, чем голый `--force`.

## Офлайн-архив одним файлом (опционально)

Из корня репозитория:

```powershell
mkdir snapshots\bundles -Force
git bundle create snapshots/bundles/site-2026-05-13.bundle --all
```

Клон из бандла:

```powershell
git clone snapshots/bundles/site-2026-05-13.bundle Mother-restored
```

Файл `*.bundle` большой — в Git не коммитим (см. `.gitignore`).
