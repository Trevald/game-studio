# Asset manifest

`manifest.json` starts empty. Add one entry per actual asset; do not ship fictional paths. IDs remain stable across revisions, and changed content gets a new revision/hash.

Each entry must record: `id`, `revision`, `role`, `status` (concept/placeholder/production), `path_or_url`, `sha256` (for delivered file bytes), `format`, `dimensions`, `source`, `creator`, `rights_status`, `rights_evidence`, `generation_details` (model/prompt/date if relevant, otherwise null), `requirement_ids`, and `notes`.

Use repository-relative paths from the project folder or immutable accessible URLs. Production rights must be confirmed by evidence; generated output is not automatically cleared. Explain N/A fields. For fonts/audio and other non-image files, use appropriate properties in notes and null dimensions. Delivery includes a scoped copy with paths valid relative to the packet. Keep concept files distinct from production exports. Never claim an empty manifest supplies a game's required art.
