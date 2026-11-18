# API documentation

Default local API root: `http://localhost:8000/api`. OpenAPI UI: `/docs`.

## `GET /health`
Returns service status, storage behavior, and analysis mode.

## `POST /analyze-resume`
`multipart/form-data`

| Field | Type | Required | Notes |
|---|---|---|---|
| `file` | PDF/DOCX | Yes | 5 MB max, text-based file required |
| `job_description` | string | Yes | 20–30,000 characters |
| `job_title` | string | No | Optional role context |
| `company_name` | string | No | Optional label |
| `required_skills` | string | No | Comma/newline/semicolon separated |

Returns analysis ID, score components, skill sets, detected sections, ATS checks, recommendations, analysis method, and privacy note. The API deliberately does not include the extracted resume text in its response.

Example:

```bash
curl -X POST http://localhost:8000/api/analyze-resume \
  -F 'file=@resume.pdf' \
  -F 'job_title=Junior Data Analyst' \
  -F 'job_description=Seeking a junior analyst with SQL, Python, dashboarding, communication, and statistics experience.' \
  -F 'required_skills=SQL, Python, Tableau'
```

Validation errors use `4xx` codes and a `detail` string. Rate limited requests return `429`.

## Other routes

- `POST /extract-skills` JSON `{ "text": "..." }`, max 100,000 chars.
- `POST /job-match` JSON `{ "resume_text": "...", "job_description": "...", "required_skills": "..." }`.
- `POST /ats-score` JSON `{ "text": "..." }`; returns heuristic score/checks and disclaimer.
- `POST /improve-resume` JSON `{ "text": "...", "mode": "summary", "context": "" }`; returns original/improved/method/engine. Defaults to rules; setting `LLM_PROVIDER=ollama` uses a local Ollama model and falls back transparently if unavailable or validation fails.
- `GET /analysis-history` returns `{items:[],storage_enabled:false,...}` until a secure persistence adapter is completed.
- `GET /analysis/{analysis_id}` returns `404` in local-only mode.
- `DELETE /resume/{resume_id}` reports that no server-side resume is stored.

## Errors

- `413`: upload or text exceeds the size cap.
- `415`: unsupported media type or extension.
- `422`: malformed request, invalid document, scanned/empty text, or short job description.
- `429`: rate limit reached.
