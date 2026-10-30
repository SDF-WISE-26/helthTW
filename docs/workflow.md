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
| Release veröffentlicht                 | CI, dann Deploy auf die prod-vm (siehe unten)                                               |
| von Hand unter Actions → Deploy        | Rollback auf den Commit-Hash im Feld `rollback`                                             |

Die lokalen Hooks sind erst aktiv, wenn `vp install` einmal gelaufen ist.

## Deployment und Datenbank

- Ein Merge geht nicht live, erst ein Release von `main`. Wann, entscheidet das Team. Die Release-Notizen bestehen aus den Titeln der PRs seit dem letzten Release, deshalb PR-Titel so schreiben, dass man sie dort versteht. Kommt die neue Version nicht hoch, startet `deploy.sh` die vorige wieder und der Job wird rot. Release, Rollback und Einrichtung der VMs: [`deployment.md`](deployment.md).
- Schema ändern: `apps/backend/src/db/schema.ts` anpassen, `vp run backend#db:generate`, die erzeugte Migration in `apps/backend/drizzle/` im selben PR committen. Der Deploy spielt sie ein. Lokal bleibt `db:push`.
- Eine Migration muss auch mit der vorigen Version funktionieren, denn ein Rollback holt nur den Code zurück: neue Spalten nullable oder mit Default, Spalten erst ein Release später löschen. Eingespielte Migrationen nie ändern, sondern eine neue anlegen.
- Wer `deploy/compose.yml` oder `deploy/deploy.sh` ändert, muss sie beim nächsten Release von Hand auf der prod-vm installieren. Bis dahin bricht der Deploy mit einem Hinweis ab.
