# Content

Info material and contacts for `/info`.

## Terms

| Term                                 | Meaning                                                             |
| ------------------------------------ | ------------------------------------------------------------------- |
| **Topic** (Thema)                    | A group of items by what someone needs help with, not by format     |
| **Item** (Beitrag, `ContentItem`)    | One piece of info material: `article` (our text), `pdf` or `link`   |
| **Contact** (Kontakt)                | One support service people can call or write to                     |
| **Contact category** (Kontaktgruppe) | A group of contacts                                                 |
| **Tag** (Schlagwort)                 | Shared vocabulary that connects items and contacts, e.g. for search |

## Layout

| Path                      | What                                                          |
| ------------------------- | ------------------------------------------------------------- |
| `topics.yaml`             | Topics by need, not by format, in display order               |
| `contact-categories.yaml` | Contact groups, in display order                              |
| `tags.yaml`               | The only allowed tags, shared by content, contacts and search |
| `items/<slug>.md`         | One content item: `article`, `pdf` or `link`                  |
| `contacts/<slug>.yaml`    | One contact                                                   |

## Rules

- **The file name is the ID.** Lowercase letters, digits, hyphens. Never rename a file, other parts of the app link to it.
- **Tags** only from `tags.yaml`. A new tag means one new entry there, in the same PR.
- Every item has exactly **one topic**.
- **PDFs and pages are linked** (`url: https://…`), never copied here (copyright, the repo is public). There are no own files yet.
- **Contacts** are public services. Contact persons may be named only if the organisation lists them publicly, with that page as `source`.
- IDs in `topics.yaml`, `contact-categories.yaml` and `tags.yaml` must be unique.
- Phone numbers as `+49…` without spaces, so they can be called directly.
- Unknown fields are ignored, so a new field can be added before the app uses it.
