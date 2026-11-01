# Backend

Vertrag der REST-API zwischen Backend und Frontend.

## Pfade und Methoden

- Pfade: `/api/v1/<ressource>`, englisch, Plural, kebab-case, keine Verben, z. B. `GET /api/v1/users/:id`.
- Ausnahme: `/api/alive_ping` bleibt unversioniert, Deploy und Healthcheck hängen daran.
- `GET` liest, `POST` legt an, `PATCH` ändert teilweise, `DELETE` löscht. `PUT` nur, wenn eine Ressource wirklich ganz ersetzt wird.
- Breaking Changes nur mit neuer Version oder gleichzeitig im Frontend.

## Antworten

- Felder in camelCase, Zeiten als ISO 8601 in UTC.
- Einzelobjekt direkt: `{ "id": 1, "name": "User1" }`.
- Liste immer als `{ "items": [...] }`, damit Paginierung ohne Bruch dazukommen kann.
- Fehler immer als `{ "error": { "code", "message", "details" } }`. `code` ist stabil und für das Frontend, `message` für Entwickler, `details` optional.

| Status | Bedeutung                        |
| ------ | -------------------------------- |
| 200    | gelesen oder geändert            |
| 201    | angelegt                         |
| 204    | erfolgreich, ohne Inhalt         |
| 400    | Eingabe ungültig                 |
| 401    | nicht angemeldet                 |
| 403    | angemeldet, aber kein Zugriff    |
| 404    | Ressource oder Route fehlt       |
| 409    | Konflikt mit dem aktuellen Stand |
| 500    | Fehler im Backend, ohne Details  |

## Eingaben und Datenschutz

- Jede Eingabe (`param`, `query`, `json`) wird per Zod geprüft, bevor sie den Service erreicht.
- Keine Gesundheitsdaten, Chat-Inhalte oder Personendaten in Logs und Fehlermeldungen.
- Die eigene Nutzer-ID kommt aus der Sitzung, nie aus Pfad oder Body.
- Antworten enthalten nur ausdrücklich ausgewählte Felder.

## Beispiel

Muster für einen Schreib-Endpunkt, im Code noch nicht vorhanden.

```http
POST /api/v1/users
Content-Type: application/json

{ "name": "User1" }
```

```http
HTTP/1.1 201 Created

{ "id": 1, "name": "User1", "createdAt": "2026-11-01T12:00:00.000Z" }
```

```http
HTTP/1.1 400 Bad Request

{
  "error": {
    "code": "invalid_request",
    "message": "Invalid request",
    "details": [{ "path": ["name"], "message": "Invalid input" }]
  }
}
```
