# Scoring methodology

All scores are deterministic, explainable estimates, normalized to integer 0–100. They are not validated against hiring outcomes and do not guarantee recruiter attention, ATS parsing, or a job offer.

## Resume quality score

`0.20 × structure + 0.25 × skills_relevance + 0.25 × experience_project_relevance + 0.15 × keyword_relevance + 0.15 × readability_completeness`

- **Structure (20%)**: recognized standard sections, email, phone, minimum content signal.
- **Skills relevance (25%)**: overlap of recognized job requirements and resume skills, plus a signal that matched terms appear in experience/projects.
- **Project/experience relevance (25%)**: whether project and experience sections exist, combined with job-related evidence.
- **Keyword relevance (15%)**: coverage of high-weight terms in the target description and semantic/text similarity between resume and target description.
- **Readability/completeness (15%)**: word-count band, average sentence length, bullet usage, and section completeness.

## Job match score

`0.40 × required skill coverage + 0.25 × experience/project evidence + 0.25 × TF-IDF similarity + 0.10 × important keyword coverage`

A curated skill vocabulary extracts phrases with boundary-aware exact matches. Evidence is counted when recognized matched skills appear in the detected Projects or Experience sections. If no requirements are recognized, the score remains low-information and should not be interpreted as reliable; users can provide explicit required skills.

## ATS estimate

A heuristic blend of structure (28%), readability (20%), keyword relevance (22%), completeness (15%), and contact email (15%). The UI also reports contact details and section-presence checks. It cannot simulate proprietary employer ATS platforms or formatting behavior.

## Similarity and limitations

The default uses TF-IDF vectorization with unigrams/bigrams and cosine similarity. An optional local `sentence-transformers/all-MiniLM-L6-v2` embedding model can be enabled with `ENABLE_SENTENCE_TRANSFORMERS=true` after installing `requirements-embeddings.txt`. It runs in the API process and can require more RAM and a model download; low-memory free hosts may not support it. If it fails to load, the report clearly states that TF-IDF fallback was used. TF-IDF can miss synonyms, negation, context, domain-specific language, and multilingual text. No paid external AI service is called. Recommendations are simple rules based on the observed document; users should only incorporate claims that are true.
