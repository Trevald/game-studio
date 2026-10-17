# The ideas board

Benji's ideas board is a private Claude artifact with a small database:

**URL:** https://claude.ai/artifact/AKDqzfgYTwNZQmj6CS32Az

Read and write it with the `ArtifactData` tool (load it with ToolSearch: `select:ArtifactData`).
Every call takes `url` set to the URL above. Every write to an existing document needs `if_version`
set to the `version` you last read for that document.

## Collections

### `ideas/<id>` — one per game idea (Benji creates these from the page)

| field | type | notes |
|---|---|---|
| `title` | string | Benji's one-liner |
| `pitch` | string | optional details |
| `order` | number | queue position set by Benji (lowest first); may be missing on old ideas |
| `origin` | `"studio"` or absent | `"studio"` when the studio pitched the idea itself; absent means Benji's |
| `status` | `"queued"` \| `"building"` \| `"ready"` \| `"parked"` | the studio sets building/ready; Benji sets parked |
| `nights` | number | how many nights the studio has worked on it |
| `createdAt`, `updatedAt` | ISO string | |
| `slug` | string | set by the studio: folder name under `games/` |
| `buildUrl` | string | set by the studio: artifact URL of the latest build |
| `lastReport` | `{date, summary, questions[]}` | set by the studio after each night |

### `feedback/<id>` — Benji's notes on a game (written from the page)

| field | type | notes |
|---|---|---|
| `ideaId` | string | the idea's doc id |
| `text` | string | the note |
| `status` | `"pending"` \| `"used"` | the studio marks notes used after the night that handled them |
| `createdAt` | ISO string | |
| `usedOn` | ISO string | set by the studio |

### `studio/state` — one document

`shiftTime` (e.g. "01:45"), `repo`, `lastRun` (ISO), `lastNote` (one short line, e.g. "Slide Eight, night 2").

## Recipes

Read everything at the start of the night:

```
ArtifactData list   collection: "ideas"     query: {limit: 1000}
ArtifactData list   collection: "feedback"  query: {limit: 1000}
ArtifactData get    collection: "studio"    doc_id: "state"
```

Add the studio's own pitch (new doc, so no `if_version`; pick a short unique `doc_id` like `studio-<slug>`):

```
ArtifactData set collection: "ideas" doc_id: "studio-<slug>"
  data: {title, pitch, origin: "studio", status: "building", slug: "<slug>",
         nights: 0, createdAt: "<now>", updatedAt: "<now>"}
```

Mark the job started (use the version from the list):

```
ArtifactData update collection: "ideas" doc_id: <id> if_version: <v>
  data: {status: "building", slug: "<slug>", updatedAt: "<now>"}
```

Finish the night with one `batch` (each entry pinned with its own `if_version`):

- update `ideas/<id>`: `status: "ready"`, `buildUrl`, `nights`, `lastReport`, `updatedAt`
- update each used `feedback/<id>`: `status: "used"`, `usedOn`
- update `studio/state`: `lastRun`, `lastNote`

If a pinned write fails because Benji changed the doc during the night (e.g. he parked the idea),
re-read it and keep his change: only add the studio's fields, never overwrite his `status: "parked"`.

`lastReport.summary` is 2-4 plain sentences for Benji: what changed tonight and what to try first.
`lastReport.questions` holds 0-3 short questions whose answers would change the next night's work.
