# Frontend

Was die Weboberfläche können muss. Details und Akzeptanzkriterien stehen in den verlinkten Issues.

## Überall

- Ein Hilfe-Button auf jedem Bildschirm öffnet mit einem Tipp den Krisenbildschirm (#56).
- Krisenbildschirm, Infomaterial und Kontakte gehen ohne Konto und ohne Netz, sobald die App einmal online geöffnet wurde (#62).
- Offline ist sichtbar, was gerade nicht geht, z. B. Chat und Synchronisierung (#62).
- Alles, was KI nutzt, ist jederzeit als KI gekennzeichnet (#78).
- Oberfläche und Texte sind deutsch.
- Mobil zuerst, mit einer Hand bedienbar, große Tippflächen, barrierefrei nach WCAG 2.1 AA (#98).
- Die App fragt nie nach Name, E-Mail oder Telefon (#92).
- Die App lässt sich installieren, auf iOS mit Anleitung (#96).

## Bereiche

- **Krise:** Ein Bildschirm für alle Auslöser mit festem, geprüftem Inhalt, nichts aus der KI. Nummern sind direkt anrufbar (#56, #57).
- **Infomaterial:** Themenübersicht, Suche, Artikel mit Zusammenfassung, Quelle und Prüfdatum, Bereich „Was ist normal?“ (#60, #61, #63).
- **Kontakte:** Für wen, wann erreichbar, was beim Kontakt passiert, direkt anrufbar (#64).
- **Einsätze:** Harten Einsatz in höchstens drei Schritten festhalten, nur mit Datum, danach Sofort-Tipps. Liste der eigenen Einsätze (#65, #66, #106).
- **Check-in:** Geplante Termine sehen und verschieben. Höchstens vier Fragen in unter einer Minute, die Sicherheitsfrage führt auch offline zur Krise, danach ein Ampel-Ergebnis (#67, #71, #72, #73, #75).
- **Chat:** Ohne Konto sofort schreiben, Antworten gestreamt und mit Quelle, Verlauf löschbar, Darstellung als Text, Stimme oder Avatar (#78, #80, #84, #86–#90).
- **Konto:** Entsteht anonym beim ersten Einsatz oder Check-in, alles mit einem Schritt löschbar, später Passkey (#92, #93, #94).
- **Ankommen:** Kurze Erklärung beim ersten Start, überspringbar (#95).

## Benachrichtigungen

- Die Erlaubnis wird erst beim Planen von Check-ins abgefragt, nicht beim ersten Start (#68).
- Texte auf dem Sperrbildschirm verraten nichts über Belastung oder Einsätze (#68).

Aufbau und Technik: Entscheidungen 0003, 0006–0008 und 0010–0012 in [`decisions.md`](../decisions.md).
