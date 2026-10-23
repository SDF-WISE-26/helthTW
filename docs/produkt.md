# Produkt

Was die App leisten muss und was nicht.

## Ziel

Einsatzkräfte im Rettungsdienst und First Responder (zuerst Berlin und Brandenburg) sollen nach belastenden Einsätzen nicht durchs Raster fallen. Die App begleitet von direkt nach dem Einsatz bis langfristig:

- Sie senkt die Schwelle, sich Hilfe zu holen.
- Sie erinnert an geprüfte Tipps/Praktiken: was hilft und was man lassen sollte.
- Sie fragt in den Wochen danach nach, damit niemand nach einem oder keinem Gespräch einfach verstummt.

## Abgrenzung

- Keine Diagnose, keine Therapie, keine Behandlungs- oder Medikamentenempfehlung.
- Inhalte kommen nur aus geprüftem Infomaterial und der Kontaktliste. Das gilt auch für die KI.
- Ergebnisse von Fragebögen sind Hinweise („Jetzt wäre ein guter Zeitpunkt, mit jemandem zu reden“), keine Befunde.
- In einer Krise antwortet die App mit festem, geprüftem Inhalt.
- Daten einer Person sind nie für andere organisationen sichtbar.

## Nutzergruppen

| Rolle          | Jetzt                                                       | Später                                          |
| -------------- | ----------------------------------------------------------- | ----------------------------------------------- |
| Einsatzkraft   | Hauptnutzer:in (Rettungsdienst, First Responder)            | weitere BOS (Feuerwehr, THW, …)                 |
| Inhaltspflege  | Team pflegt Infomaterial und Kontakte als Seed-Daten per PR | Organisationen pflegen Inhalte selbst           |
| Peers / PSNV-E | erscheinen nur als Kontakte                                 | direkte Verbindung, auf Wunsch der Einsatzkraft |

## Personas

Erfundene Personen, keine Interviewdaten.

**Sarah, 34, Notfallsanitäterin, Berlin, 9 Jahre im Dienst.** Hat schon viel gesehen und sagt, das gehöre dazu. Nach einem Einsatz mit einem toten Kind schläft sie schlecht, redet aber nicht darüber, weil die Wache das als Schwäche sehen könnte. Die Nachbesprechung war kurz. Sie würde nie bei einer Beratungsstelle anrufen, aber nachts um zwei auf ihr Handy schauen. Braucht: anonym, nichts geht an den Arbeitgeber, kurze ehrliche Infos, ein Kontakt, der sich nicht nach „Psychiatrie“ anfühlt.

**Jonas, 23, Rettungssanitäter, Brandenburg, seit einem Jahr dabei.** Erster schwerer Verkehrsunfall. Er weiß nicht, ob es normal ist, dass er die Bilder nicht loswird, und kennt die Ansprechpartner seiner Organisation nicht. Redet eher mit einer KI als mit dem Wachleiter. Braucht: „Was ist normal?“, wen er anrufen kann, Erinnerung, wenn er sich nach zwei Wochen nicht mehr meldet.

## Kernablauf

1. Belastender Einsatz → „Das war ein harter Einsatz“ festhalten (wenige Tipps, keine Einsatzdetails).
2. Sofort-Tipps für die ersten Stunden.
3. Check-ins an Tag 1, 3, 7 und 28 per Push-Erinnerung.
4. Ampel-Ergebnis nach festen Regeln → passendes Infomaterial, bei Bedarf konkrete Kontakte.
5. Jederzeit: Infomaterial, Kontakte, KI-Chat, Hilfe-Button.

## Story Map

Die MVP-Spalte ist ein Vorschlag, keine Entscheidung.

| Aktivität           | MVP-Vorschlag                                                            | Danach                                              |
| ------------------- | ------------------------------------------------------------------------ | --------------------------------------------------- |
| Ankommen            | Erster Start ohne Registrierung, App installieren (PWA)                  | Organisation und Region wählen                      |
| Sofort Hilfe holen  | Hilfe-Button überall, Krisenbildschirm, eigene Vertrauenspersonen        |                                                     |
| Einsatz verarbeiten | Harter-Einsatz-Flow, Sofort-Tipps, Check-ins planen, Push-Erinnerungen   | Nachfassen bei verpassten Check-ins                 |
| Wissen nachschlagen | Infomaterial nach Themen, Suche, offline lesbar, „Was ist normal?“       |                                                     |
| Befinden prüfen     | Kurzer Check-in, Sicherheitsfrage, Ampel                                 | Screener um Tag 28, Verlauf                         |
| Mit der KI reden    | Text-Chat aus Infomaterial mit Quellen, Krisenerkennung, feste Antworten | Chat kennt Check-in-Ergebnisse, Chatverlauf löschen |
| Sprache und Avatar  | Machbarkeitsstudie: Sprechen, Vorlesen, Messwerte                        | Unterbrechen, Avatar, Darstellungen vergleichen     |
| Konto und Daten     | Anonymes Konto automatisch, alle Daten löschen                           | Passkey für Gerätewechsel, Datenschutz-Übersicht    |
| Qualität und Audit  | Testgespräche in CI, Guardrail-Entscheidungen protokollieren             | Stichproben-Review durch Fachleute                  |

## Nicht-funktionale Anforderungen

- **NFR-01 Hilfe immer erreichbar:** Hilfe-Button auf jedem Bildschirm, ein Tipp zum Krisenbildschirm. Funktioniert ohne Konto, ohne KI und ohne Netz.
- **NFR-02 Keine personenbezogenen Daten:** Das Datenbankschema hat keine Felder für Name, E-Mail oder Telefon. Eigene Vertrauenspersonen bleiben auf dem Gerät.
- **NFR-03 Nichts für die Organisation:** Einzeldaten sind nie für Arbeitgeber oder Organisation sichtbar.
- **NFR-04 Geprüfte Inhalte:** KI-Antworten stützen sich nur auf Infomaterial und Kontakte, mit Quellenangabe.
- **NFR-05 Feste Krisenreaktion:** Krisenbildschirm und Antworten auf Diagnose-, Medikamenten- und Therapiefragen sind fester Text.
- **NFR-06 KI erkennbar:** Der Chat ist jederzeit als KI gekennzeichnet (AI Act, Transparenzpflicht).
- **NFR-07 Sparsames Protokoll:** Es wird protokolliert, welche Schutzregel wann und warum gegriffen hat, nicht der Chatinhalt.
- **NFR-08 Offline:** Infomaterial, Kontakte und Krisenbildschirm funktionieren ohne Netz.
- **NFR-09 Mobil zuerst und barrierearm:** Ziel WCAG 2.1 AA, große Tippflächen, ruhige Gestaltung.
- **NFR-10 Deutsch:** Oberfläche, Inhalte und Stimme auf Deutsch.
- **NFR-11 Diskrete Benachrichtigungen:** Push-Texte verraten auf dem Sperrbildschirm nichts über Belastung oder Einsätze.
- **NFR-12 Tests mit echten Personen:** Vor Nutzertests prüfen, was Gesundheitsdaten nach DSGVO Art. 9 bedeutet und wohin Chatinhalte gehen (LLM-Anbieter). Bis dahin nur Testdaten.

## Offene Recherche

**Fragebögen (S-01):** Auswahl aus der vorhandenen Liste nach deutscher Version, freier Nutzung und Zeitfenster. Arbeitsidee, die nach der Auswahl geprüft wird: kurze Check-ins nur für den Verlauf, ein validierter Screener um Tag 28 (viele fragen nach dem letzten Monat), eine Sicherheitsfrage in jedem Check-in. Belastungsreaktionen in den ersten Tagen sind normal und dürfen allein kein Rot auslösen. Schwellen mit Fachleuten aus dem Team abstimmen.

**Schutzregeln und Audit (S-02).** Optionen nach Stelle:

- Eingabe prüfen: Wortlisten für Krisenbegriffe; trainierter Klassifikator oder Moderations-API (Deutsch prüfen); LLM als Richter.
- Antwort steuern: Regeln im Systemprompt; Grounding per RAG mit Ablehnung, wenn nichts Passendes gefunden wird; strukturierte Ausgabe (Antwort, Quellen-IDs, nächster Schritt), die Code prüfen kann; feste Vorlagen für bekannte Fälle.
- Ausgabe prüfen: Regeln für verbotene Inhalte (Diagnosen, Medikamente); Prüfung, ob Quellen existieren und die Antwort stützen; LLM als Richter gegen eine schriftliche Richtlinie; fertige Frameworks (NeMo Guardrails, Guardrails AI, Llama Guard).
- Audit: Protokoll der Regelentscheidungen; Testgespräche in CI; LLM als Richter offline zum Bewerten der Testläufe; Stichproben-Review durch Fachleute.

Achtung: Ein LLM-Richter, der jede Antwort live prüft, kostet spürbar Zeit und bremst flüssige Sprache. S-02 und S-03 gemeinsam entscheiden.

**Sprachpipeline (S-03):**

- (a) Schrittweise: Sprache zu Text, LLM, Text zu Sprache, satzweise gestreamt. Schutzregeln prüfen jeden Satz, bevor er gesprochen wird.
- (b) Echtzeit-Sprachmodell: flüssiger, aber Schutzregeln sehen das Gesagte erst danach.

Messkriterien für beide: Zeit bis zum ersten Ton (Ziel unter 1,5 s), Unterbrechen möglich, Qualität der deutschen Stimme (Bewertung durch Fachleute im Team), Lippensynchronität beim Avatar.

**Avatar-Technik (S-04):** 2D mit Mundformen, 3D-Modell oder Video-Avatar-Dienst.

**Anbieter, Hosting und Budget (S-05):** Cloud-APIs oder lokale Modelle, abhängig von Budget und GPU auf den Uni-Servern.

## Ideen für die zukunftige Entwicklung

- Check-in als Gespräch mit der KI statt als Formular
- Daten von Wearables (z. B. Schlaf, Puls), möglcih POC auch mit importierten Daten/gemockte daten
- Auswahl von Organisation und Region mit gefilterten Kontakten
- Direkte Verbindung zu Peers und PSNV-E auf Wunsch der Einsatzkraft
- Anonymisierte, zusammengefasste Auswertungen für Organisationen
- Inhaltspflege durch Organisationen
