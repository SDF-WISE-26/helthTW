# Arbeitsweise mit Git

Kurzfassung der Regeln, die Git-Hooks und CI durchsetzen. Die PR-Prüfungen kommen mit PR #27.

## Branches

- `main` ist geschützt, niemand pusht direkt darauf.
- Pro Ticket ein Branch von `main`: `feature/<nr>`, `bug/<nr>` oder `hotfix/<nr>`, nur mit der Ticketnummer, z. B. `feature/28`. Andere Namen lehnt die PR-Pipeline ab.
- Commits aus diesen Branches werden gesquasht: Pro PR landet genau ein Commit auf `main`, damit die History sauber bleibt.

## Commits

Commit-Nachrichten und PR-Titel folgen dem Conventional-Commits-Standard: `<typ>(<bereich>): <beschreibung>`

- Mögliche Typen: `feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert`
- Bereich ist Pflicht, klein geschrieben, z. B. `frontend`, `backend`, `db`, `repo`
- Beispiel: `feat(frontend): add login page`

## Vom Ticket zum Merge

1. Ticket auf dem Board übernehmen.
2. Branch anlegen: `git switch -c feature/<nr>`
3. Arbeiten und committen.
4. Vor dem PR selbst auf einen Commit zusammenfassen:
   `git fetch && git rebase origin/main`, dann `git reset --soft origin/main` und neu committen.
   Nach Änderungen aus dem Review wieder squashen und mit `git push --force-with-lease` hochladen.
5. Ticket auf dem Board nach „In review“ schieben.
6. PR gegen `main` öffnen, Titel im Commit-Format, mindestens ein Review.
7. Nach dem Merge verschiebt die Pipeline das Ticket nach „PO Abnahme“.

## Was automatisch geprüft wird

| Wann                                   | Was                                                                                         |
| -------------------------------------- | ------------------------------------------------------------------------------------------- |
| vor jedem Commit                       | `vp check --fix` und secretlint auf geänderten Dateien; sind `.ts`/`.tsx` dabei, alle Tests |
| Commit-Nachricht                       | Format wie oben                                                                             |
| vor jedem Push                         | `vp run ready`: Check, secretlint, Tests, Build                                             |
| Push auf `feature/`, `bug/`, `hotfix/` | CI: `vp run ready` und gitleaks über die ganze History                                      |
| PR gegen `main`                        | Titel, Branchname, Ticket steht in „In review“, genau ein Commit                            |

Die lokalen Hooks sind erst aktiv, wenn `vp install` einmal gelaufen ist.
