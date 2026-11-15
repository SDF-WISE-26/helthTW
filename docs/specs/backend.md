# Backend

Contract of the REST API between backend and frontend.

## Paths and methods

- Paths: `/api/v1/<resource>`, English, plural, kebab-case, no verbs, e.g. `GET /api/v1/check-ins/:id`.
- Exception: `/api/alive_ping` stays unversioned, deploy and health check depend on it.
- `GET` reads, `POST` creates, `PATCH` partially updates, `DELETE` deletes. `PUT` only when a resource is really replaced as a whole.
- Breaking changes only with a new version or together with the frontend.

## Responses

- Fields in camelCase, times as ISO 8601 in UTC.
- Single object directly: `{ "id": 1, "mood": 3 }`.
- Lists always as `{ "items": [...] }`, so pagination can be added without breaking anything.
- Errors always as `{ "error": { "code", "message", "details" } }`. `code` is stable and meant for the frontend, `message` for developers, `details` is optional.

| Status | Meaning                          |
| ------ | -------------------------------- |
| 200    | read or updated                  |
| 201    | created                          |
| 204    | success, no content              |
| 400    | invalid input                    |
| 401    | not signed in                    |
| 403    | signed in, but no access         |
| 404    | resource or route missing        |
| 409    | conflict with the current state  |
| 500    | error in the backend, no details |

## Input and privacy

- Every input (`param`, `query`, `json`) is validated with Zod before it reaches the service.
- No health data, chat content or personal data in logs and error messages.
- The caller's own account ID comes from the `X-Account-Id` header via `requireAccount`, never from path or body.
- Responses contain only explicitly selected fields.

## Example

Pattern for a write endpoint, not yet in the code.

```http
POST /api/v1/check-ins
Content-Type: application/json

{ "mood": 3 }
```

```http
HTTP/1.1 201 Created

{ "id": 1, "mood": 3, "createdAt": "2026-11-01T12:00:00.000Z" }
```

```http
HTTP/1.1 400 Bad Request

{
  "error": {
    "code": "invalid_request",
    "message": "Invalid request",
    "details": [{ "path": ["mood"], "message": "Invalid input" }]
  }
}
```
