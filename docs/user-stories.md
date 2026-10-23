# User Stories

**Aufbau:** Als … möchte ich …, damit …. Akzeptanzkriterien als Angenommen / Wenn / Dann. „MVP“ oder „danach“ ist Material für die Sprintplanung, keine Entscheidung.

**Definition of Ready:** Story hat Nutzen, Akzeptanzkriterien und Epic. Offene Fragen sind geklärt oder als Spike ausgelagert. Das Team hat sie geschätzt.

---

## E1 Sofort Hilfe

### US-01 Hilfe von überall

**Als** Einsatzkraft **möchte ich** von jedem Bildschirm mit einem Tipp Hilfe erreichen, **damit** ich in einer akuten Krise nicht suchen muss.

- Angenommen ich bin auf einem beliebigen Bildschirm, wenn ich den Hilfe-Button tippe, dann sehe ich sofort den Krisenbildschirm.
- Angenommen ich habe kein Konto und kein Netz, wenn ich den Hilfe-Button tippe, dann wird der Krisenbildschirm trotzdem angezeigt.
- Angenommen ich bin auf dem Krisenbildschirm, wenn ich eine Nummer tippe, dann startet der Anruf direkt.

MVP · NFR-01, NFR-08

### US-02 Ein Krisenbildschirm für alle Auslöser

**Als** Einsatzkraft in einer Krise **möchte ich** immer klare, ruhige Anweisungen sehen, **damit** ich mich auch unter Stress zurechtfinde.

- Angenommen der Krisenbildschirm wird ausgelöst, ob über den Button, die Sicherheitsfrage im Check-in oder ein Krisensignal im Chat, dann zeigt er immer denselben festen Inhalt.
- Der Bildschirm enthält 112, die Telefonseelsorge und meine eigenen Vertrauenspersonen.
- Kein Text auf dem Krisenbildschirm stammt aus der KI.

MVP · NFR-05

## E2 Infomaterial

### US-03 Infomaterial nach Themen

**Als** Einsatzkraft **möchte ich** Infomaterial nach Themen finden, zum Beispiel Schlaf, Bilder im Kopf, was hilft und was nicht, **damit** ich mich schnell erinnere, was ich tun und lassen sollte.

- Angenommen ich öffne das Infomaterial, dann sehe ich Themen statt einer langen Liste.
- Jeder Artikel beginnt mit einer kurzen Zusammenfassung, Details sind aufklappbar.
- Jeder Artikel zeigt seine Quelle und wann er zuletzt geprüft wurde.

MVP

### US-04 Suche

**Als** Einsatzkraft **möchte ich** im Infomaterial suchen, **damit** ich eine konkrete Frage schnell beantwortet bekomme.

- Angenommen ich suche nach einem Begriff wie „Albträume“, dann sehe ich passende Artikel.
- Angenommen nichts passt, dann bietet die App Kontakte und den Chat an.

MVP

### US-05 Offline lesen

**Als** Einsatzkraft **möchte ich** Infomaterial und Kontakte ohne Netz öffnen, **damit** ich sie auch im Fahrzeug oder bei schlechtem Empfang habe.

- Angenommen ich hatte die App einmal online geöffnet, wenn ich offline bin, dann sind Infomaterial, Kontakte und Krisenbildschirm verfügbar.

MVP · NFR-08

### US-06 Was ist normal?

**Als** Einsatzkraft nach einem belastenden Einsatz **möchte ich** erfahren, welche Reaktionen in den ersten Tagen und Wochen normal sind, **damit** ich mich nicht unnötig sorge und erkenne, wann es nicht mehr normal ist.

- Es gibt einen eigenen Bereich, der im Harter-Einsatz-Flow und nach einem gelben Check-in verlinkt wird.
- Er sagt klar, ab wann Reden mit jemandem sinnvoll ist, und verlinkt die passenden Kontakte.

MVP

---

## E3 Kontakte

### US-07 Passende Ansprechpartner

**Als** Einsatzkraft **möchte ich** passende Ansprechpartner sehen, zum Beispiel PSNV-E, Seelsorge, Unfallversicherungsträger und Beratungsstellen, **damit** ich weiß, wen ich wofür anrufen kann.

- Jeder Kontakt zeigt, für wen er gedacht ist, wann er erreichbar ist und was beim Kontakt passiert.
- Telefonnummern sind direkt anrufbar.
- Die Kontakte stammen aus der recherchierten Liste (S-07).

MVP

---

## E4 Harter Einsatz und Nachsorge

### US-08 Harten Einsatz festhalten

**Als** Einsatzkraft **möchte ich** nach einem belastenden Einsatz mit wenigen Tipps festhalten „Das war ein harter Einsatz“, **damit** die App mich in den nächsten Wochen begleitet.

- Angenommen ich starte den Flow, dann bin ich in höchstens drei Schritten fertig.
- Ich muss nichts über den Einsatz schreiben. Ein Datum reicht.
- Angenommen ich habe noch kein Konto, dann entsteht dabei das anonyme Konto (US-30).

MVP

### US-09 Sofort-Tipps

**Als** Einsatzkraft direkt nach einem Einsatz **möchte ich** ein paar kurze Tipps für die nächsten Stunden sehen, **damit** ich weiß, was mir jetzt hilft und was ich lassen sollte.

- Angenommen ich habe einen harten Einsatz festgehalten, dann sehe ich danach Sofort-Tipps aus dem Infomaterial.
- Von dort komme ich mit einem Tipp zu Kontakten und zum Chat.

MVP

### US-10 Check-ins planen

**Als** Einsatzkraft **möchte ich**, dass die App nach einem harten Einsatz Check-ins an Tag 1, 3, 7 und 28 einplant, **damit** ich nicht selbst daran denken muss.

- Angenommen ich habe einen harten Einsatz festgehalten, dann sind die vier Check-ins geplant.
- Ich kann einzelne Termine verschieben oder alle abschalten.

MVP

### US-11 Push-Erinnerung

**Als** Einsatzkraft **möchte ich** an geplante Check-ins erinnert werden, **damit** ich dranbleibe.

- Angenommen ein Check-in ist fällig und ich habe Benachrichtigungen erlaubt, dann bekomme ich eine Push-Nachricht.
- Die Nachricht verrät auf dem Sperrbildschirm nichts über Belastung oder Einsätze.
- Die App fragt erst nach der Erlaubnis, wenn ich Check-ins plane, nicht beim ersten Start.

MVP · NFR-11

### US-12 Nachfassen bei Stille

**Als** Einsatzkraft, die einen Check-in verpasst hat, **möchte ich** noch einmal behutsam erinnert werden, **damit** ich nicht einfach verschwinde.

- Angenommen ich habe einen Check-in verpasst, dann kommt eine weitere Erinnerung.
- Es kommen nie mehr als zwei Erinnerungen pro Check-in.
- Ich kann alle Erinnerungen pausieren.

danach

---

## E5 Check-ins und Fragebögen

Inhalt und Schwellen hängen an S-01.

### US-13 Kurzer Check-in

**Als** Einsatzkraft **möchte ich** in unter einer Minute angeben, wie es mir geht, **damit** ich den Check-in auch an einem schlechten Tag mache.

- Der Check-in hat drei bis vier Fragen und ist auf dem Handy mit einer Hand bedienbar.
- Ich kann ihn auch ohne geplanten Termin starten.

MVP

### US-14 Sicherheitsfrage

**Als** Einsatzkraft in einer Krise **möchte ich**, dass die App es merkt, wenn ich in Gefahr bin, **damit** ich sofort Hilfe angeboten bekomme.

- Jeder Check-in enthält eine Sicherheitsfrage.
- Angenommen ich beantworte sie mit Ja, dann erscheint direkt der Krisenbildschirm (US-02).

MVP · NFR-05

### US-15 Ampel-Ergebnis

**Als** Einsatzkraft **möchte ich** nach einem Check-in eine klare Einordnung bekommen, **damit** ich weiß, ob ich mit jemandem reden sollte.

- Das Ergebnis ist grün, gelb oder rot nach festen Regeln.
- Grün zeigt passende Tipps, gelb zeigt Infomaterial und Kontakte, rot empfiehlt konkret einen Kontakt.
- Kein Ergebnistext klingt nach Diagnose.
- In den ersten Tagen führen Belastungssymptome allein nicht zu Rot.

MVP

### US-16 Bewertungsregeln testbar

**Als** Team **möchten wir** die Bewertung als feste, getestete Regeln umsetzen, **damit** wir sie erklären können und sie sich nicht unbemerkt ändert.

- Die Bewertung ist Code ohne KI.
- Tests decken jeden Grenzwert ab.
- Die Schwellen sind mit Fachleuten aus dem Team abgestimmt und dokumentiert.

MVP

### US-17 Screener um Tag 28

**Als** Einsatzkraft **möchte ich** etwa vier Wochen nach dem Einsatz einen gründlicheren Fragebogen ausfüllen, **damit** auffällt, wenn es nicht besser geworden ist.

- Angenommen Tag 28 ist erreicht, dann wird mir der Screener angeboten.
- Das Ergebnis läuft über dieselbe Ampel (US-15).

danach

---

## E6 KI-Chat

### US-18 Chat ohne Konto

**Als** Einsatzkraft **möchte ich** ohne Konto mit der KI schreiben, **damit** ich ohne Hürde anfangen kann.

- Angenommen ich habe kein Konto, wenn ich den Chat öffne, dann kann ich sofort schreiben.
- Der Chat ist jederzeit sichtbar als KI gekennzeichnet.

MVP · NFR-06

### US-19 Antworten aus Infomaterial

**Als** Einsatzkraft **möchte ich**, dass die KI nur sagt, was im geprüften Material steht, und die Quelle nennt, **damit** ich der Antwort trauen kann.

- Jede inhaltliche Antwort nennt mindestens eine Quelle aus dem Infomaterial.
- Angenommen nichts im Material passt, dann sagt die KI das ehrlich und bietet Kontakte an.
- Jede Antwort endet mit einem möglichen nächsten Schritt.

MVP · NFR-04

### US-20 Keine Diagnose, keine Medikamente

**Als** Einsatzkraft, die nach Diagnose, Medikamenten oder Therapie fragt, **möchte ich** eine ehrliche Antwort bekommen, **damit** ich weiß, wer mir dabei wirklich helfen kann.

- Angenommen ich frage danach, dann antwortet die KI mit festem Text und passenden Kontakten.

MVP · NFR-05

### US-21 Krisensignal im Chat

**Als** Einsatzkraft in einer Krise **möchte ich**, dass der Chat es erkennt, wenn ich in Gefahr bin, **damit** ich sofort Hilfe angeboten bekomme.

- Angenommen meine Nachricht enthält ein Krisensignal, dann erscheint der Krisenbildschirm (US-02) statt einer generierten Antwort.
- Das wird protokolliert (US-35).

MVP · NFR-05

### US-22 Chat kennt meine Check-ins

**Als** Einsatzkraft mit Konto **möchte ich**, dass die KI meine letzten Check-in-Ergebnisse kennt, **damit** sie mich passend anspricht und ich nicht alles erklären muss.

- Die KI nutzt die Ergebnisse nur, wenn ich zugestimmt habe.
- Sie formuliert passend zur Ampel, gibt aber keinen Rat außerhalb des Materials.

danach

### US-23 Chatverlauf löschen

**Als** Einsatzkraft **möchte ich** meinen Chatverlauf löschen, **damit** nichts bleibt, was ich nicht will.

- Angenommen ich lösche den Verlauf, dann ist er auf dem Gerät und auf dem Server weg.

danach

---

## E7 Sprache und Avatar (Machbarkeitsstudie)

Pipeline offen (S-03), Avatar-Technik offen (S-04). Ein negatives Ergebnis ist ein gültiges Ergebnis, wenn es gemessen und dokumentiert ist.

### US-24 Sprechen statt tippen

**Als** Einsatzkraft **möchte ich** mit der KI sprechen, **damit** ich nicht tippen muss, wenn ich erschöpft bin.

- Angenommen ich halte oder tippe das Mikrofon, dann wird meine deutsche Sprache erkannt und als Nachricht gesendet.
- Die Antwort durchläuft dieselben Schutzregeln wie im Text-Chat.

MVP (Studie)

### US-25 Antworten hören

**Als** Einsatzkraft **möchte ich** die Antworten mit einer ruhigen deutschen Stimme hören, **damit** sich das Gespräch natürlicher anfühlt.

- Die Antwort wird vorgelesen, sobald der erste Satz fertig ist.
- Ich kann die Stimme stumm schalten.

MVP (Studie)

### US-26 Unterbrechen

**Als** Einsatzkraft **möchte ich** der KI ins Wort fallen können, **damit** sich das Gespräch nicht wie ein Anrufbeantworter anfühlt.

- Angenommen die KI spricht und ich fange an zu reden, dann hört sie auf und hört mir zu.

danach

### US-27 Avatar

**Als** Einsatzkraft **möchte ich** eine ruhige Figur sehen, die passend zur Stimme spricht, **damit** ich mich weniger wie vor einer Maschine fühle.

- Die Mundbewegungen passen grob zur Sprache.
- Die Figur reagiert sichtbar, während sie zuhört und antwortet.

danach

### US-28 Darstellung wählen

**Als** Einsatzkraft **möchte ich** zwischen Text, Stimme und Avatar wählen, **damit** ich so reden kann, wie es mir gerade leichter fällt.

- Alle drei Darstellungen nutzen denselben Chat und dieselben Schutzregeln.

danach

### US-29 Messwerte dokumentieren

**Als** Team **möchten wir** Latenz, Unterbrechbarkeit, Stimmqualität und Lippensynchronität messen und dokumentieren, **damit** wir dem Auftraggeber belegen können, was heute flüssig möglich ist und wo es hakt.

- Messungen laufen nach einem festen Ablauf und sind wiederholbar.
- Ergebnisse und Gründe stehen in `decisions.md`.

MVP (Studie)

---

## E8 Konto und Daten

### US-30 Anonymes Konto

**Als** Einsatzkraft **möchte ich**, dass meine Einträge ohne Registrierung gespeichert werden, **damit** ich keine persönlichen Daten angeben muss.

- Angenommen ich halte den ersten Einsatz oder Check-in fest, dann entsteht ein Konto mit einer zufälligen ID.
- Ich werde nie nach Name, E-Mail oder Telefon gefragt.
- Das Schema hat keine Felder dafür.

MVP · NFR-02

### US-31 Alle Daten löschen

**Als** Einsatzkraft **möchte ich** mein Konto und alle Daten mit einem Schritt löschen, **damit** ich die Kontrolle behalte.

- Angenommen ich bestätige das Löschen, dann sind Konto, Check-ins, Erinnerungen und Chatverlauf auf Gerät und Server entfernt.

MVP

### US-32 Gerät wechseln

**Als** Einsatzkraft **möchte ich** mein anonymes Konto mit einem Passkey sichern, **damit** ich meine Daten auf ein neues Handy mitnehmen kann.

- Angenommen ich habe einen Passkey eingerichtet, dann kann ich mich auf einem neuen Gerät damit anmelden.
- Ohne Passkey bleibt alles wie bisher.

danach

---

## E9 Ankommen

### US-33 Erster Start

**Als** Einsatzkraft **möchte ich** beim ersten Start in wenigen Sätzen sehen, was die App ist und was nicht, **damit** ich weiß, worauf ich mich einlasse.

- Angenommen ich öffne die App zum ersten Mal, dann sehe ich eine kurze Erklärung ohne Registrierung.
- Sie sagt, dass die App keine Therapie ersetzt und wo es sofort Hilfe gibt.

MVP

### US-34 App installieren

**Als** Einsatzkraft **möchte ich** die App auf meinem Startbildschirm installieren, **damit** ich sie schnell finde und Erinnerungen bekomme.

- Auf Android erscheint ein Installationshinweis.
- Auf iOS erklärt eine kurze Anleitung „Zum Home-Bildschirm“, weil Push dort nur nach Installation funktioniert.

MVP

---

## E10 Qualität und Audit

### US-35 Regelentscheidungen protokollieren

**Als** Team **möchten wir** protokollieren, welche Schutzregel wann und warum gegriffen hat, **damit** wir das Verhalten der KI nachvollziehen können.

- Das Protokoll enthält Regel, Zeitpunkt und Ergebnis, aber keinen Chatinhalt.

MVP · NFR-07

### US-36 Review durch Fachleute

**Als** Team **möchten wir**, dass unsere Rettungsdienst-Kollegen Stichproben von Testgesprächen bewerten, **damit** wir wissen, ob sich die Antworten in der Praxis richtig anfühlen.

- Bewertet werden nur Gespräche mit Testdaten.
- Ergebnisse fließen in das Testset ein.

danach · NFR-12
