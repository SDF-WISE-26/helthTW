# 0017: Git-based content

- **Status:** proposed · **Date:** 2026-11-03 · **Involved:** @justingebert · **Ref:** #43, #54
- **Decision:** Info material and contacts live as files in the repo, as do our own images and PDFs. Changes go through PRs with review, a schema checks the files in CI. The data format and whether the backend syncs the files into the database or reads them directly is decided by #54.
- **Why:** Every change to health content is versioned and reviewed, the PR is the record. No extra service on the VMs. Content and code stay together.
- **Rejected:** Self-hosted headless CMS like Directus, Strapi or Payload (its own service with logins, updates and backups, changes outside Git). CMS as SaaS like Contentful or Sanity (external provider, limits, hard to justify before the GDPR review #91).
- **Caution:** The repo is public: link third-party PDFs and images instead of hosting them, unless they are freely licensed. `db:seed` deletes all data and is not a path for content in production. A Git-based CMS like Keystatic or Decap can be added later if non-developers maintain content.
