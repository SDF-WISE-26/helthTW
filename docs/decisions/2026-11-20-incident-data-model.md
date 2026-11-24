# Incident data model

- **Status:** proposed · **Date:** 2026-11-20 · **Involved:** @LilGravyyyy, @behritt · **Ref:** #134, #44
- **Decision:** The table `incidents` stores what the person entered and when something happened (`closed_at`, `tips_read_at`), but no status and no progress. Both are computed: `closed` once `closed_at` is set. A step is done once its source says so: "immediate tips read" by `tips_read_at`, and with #67 each scheduled questionnaire of the incident by its response, linked through a new `scheduled_questionnaires.incident_id`.
- **Why:** Same rule as the questionnaire model (`2026-11-13-questionnaire-format-and-data-model.md`): nothing stored can contradict the times and responses. Questionnaires as steps only need one column on `scheduled_questionnaires`, `incidents` stays as it is.
- **Rejected:** A `status` column (can disagree with `closed_at`, which also says when). An `incident_steps` table or a JSON `progress` column (would store a questionnaire as done a second time next to its response). A table for the days of an incident (the day follows from `date`).
- **Caution:** #67 decides what happens to an incident's questionnaires when it is deleted or closed. A further manual step (e.g. "talked to someone") would be a new nullable column or its own table.
