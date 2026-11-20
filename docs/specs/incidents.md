# Incidents

A distressing incident that a person records, and the aftercare that follows it. Why status and progress are derived: decision `2026-11-20-incident-data-model.md`. Columns: `apps/backend/src/db/schema.ts`.

## Incident

- The person enters a date (required), a time (optional) and a note (optional). Date and time say when the incident happened, in local time, not when it was recorded.
- An incident is `active` or `closed`. The person closes it and can reopen it, without a confirmation prompt.
- The person can edit date, time and note, and delete the incident.
- A person only sees and changes their own incidents. Another account's incident answers 404.

## Progress

- Progress is the list of aftercare steps of an incident, each done or open.
- "Immediate tips read" is done once the tips were opened from within the incident (#66).
- From #67, every questionnaire scheduled for the incident is a step, done once it is answered.
- Progress is always computed from these sources, never stored on its own.

## List

- Sorted by when the incident happened, newest first: `date`, then `time` (incidents without a time after those with one), then `id`.
- The API returns all own incidents, splitting them into active and archive is up to the frontend.

## API

| Request                        | Body                                                                                    | Response         |
| ------------------------------ | --------------------------------------------------------------------------------------- | ---------------- |
| `POST /api/v1/incidents`       | `date`, `time?`, `note?`                                                                | 201, incident    |
| `GET /api/v1/incidents`        |                                                                                         | 200, `{ items }` |
| `GET /api/v1/incidents/:id`    |                                                                                         | 200, incident    |
| `PATCH /api/v1/incidents/:id`  | any of `date`, `time`, `note`, `closed`, `tipsRead` (only `true`, keeps the first time) | 200, incident    |
| `DELETE /api/v1/incidents/:id` |                                                                                         | 204              |

An incident is `{ id, date, time, note, status, closedAt, steps, createdAt, updatedAt }`, a step is `{ type, doneAt }`, e.g. `{ "type": "tips", "doneAt": null }`.

## Privacy

- Date, time and note are health data: never in logs or error messages.
- The note is at most 1000 characters. Encrypting it belongs to #145.
- Deleting the account deletes its incidents.
