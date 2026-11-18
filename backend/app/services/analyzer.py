"""Explainable resume scoring with local, optional semantic embeddings."""
import os
import re
from typing import Any

from sklearn.feature_extraction.text import TfidfVectorizer
import numpy as np

def cosine_similarity(a, b):
    a = np.atleast_2d(np.asarray(a, dtype=float))
    b = np.atleast_2d(np.asarray(b, dtype=float))
    a = a / np.clip(np.linalg.norm(a, axis=1, keepdims=True), 1e-12, None)
    b = b / np.clip(np.linalg.norm(b, axis=1, keepdims=True), 1e-12, None)
    return a @ b.T

SKILL_BANK = [
    "python", "java", "javascript", "typescript", "c++", "sql", "postgresql",
    "mysql", "mongodb", "aws", "azure", "gcp", "docker", "kubernetes",
    "linux", "git", "react", "node.js", "fastapi", "django", "flask", "html",
    "css", "tailwind", "machine learning", "deep learning",
    "natural language processing", "nlp", "scikit-learn", "pytorch", "tensorflow",
    "pandas", "numpy", "data analysis", "data visualization", "power bi", "tableau",
    "excel", "statistics", "communication", "leadership", "project management",
    "agile", "rest api", "api design", "system design", "data structures",
    "algorithms", "cybersecurity", "figma", "ui/ux", "testing", "ci/cd",
    "terraform", "spark", "hadoop", "redis", "graphql", "prompt engineering",
]

HEADINGS = {
    "summary": ["summary", "professional summary", "profile", "about me", "objective"],
    "experience": ["experience", "work experience", "employment", "professional experience"],
    "education": ["education", "academic background"],
    "skills": ["skills", "technical skills", "core competencies", "technologies"],
    "projects": ["projects", "personal projects", "key projects"],
    "certifications": ["certifications", "certificates", "licenses"],
}

_semantic_model = None
_semantic_model_error: str | None = None
_semantic_model_attempted = False


def normalize(text: str) -> str:
    return re.sub(r"\s+", " ", (text or "").lower()).strip()


def extract_skills(text: str) -> list[str]:
    low = normalize(text)
    found = []
    for skill in SKILL_BANK:
        pattern = r"(?<![a-z0-9+#])" + re.escape(skill) + r"(?![a-z0-9+#])"
        if re.search(pattern, low):
            found.append(skill)
    return sorted(found)


def _section_text(text: str) -> dict[str, str]:
    lines = [line.strip() for line in text.splitlines() if line.strip()]
    sections = {key: "" for key in HEADINGS}
    active = None
    for line in lines:
        cleaned = re.sub(r"[^a-z ]", "", line.lower()).strip()
        match = next((key for key, aliases in HEADINGS.items() if cleaned in aliases), None)
        if match:
            active = match
        elif active:
            sections[active] += line + "\n"
    return sections


def _similarity(resume: str, job: str) -> tuple[float, str]:
    """Use optional local embeddings; always label any TF-IDF fallback explicitly."""
    global _semantic_model, _semantic_model_error, _semantic_model_attempted
    if not resume.strip() or not job.strip():
        return 0.0, "TF-IDF cosine similarity; no job text supplied"

    if os.getenv("ENABLE_SENTENCE_TRANSFORMERS", "false").lower() == "true":
        if not _semantic_model_attempted:
            _semantic_model_attempted = True
            try:
                from sentence_transformers import SentenceTransformer
                _semantic_model = SentenceTransformer(
                    "sentence-transformers/all-MiniLM-L6-v2", device="cpu"
                )
            except Exception as exc:  # model/package/download errors must not be hidden
                _semantic_model_error = type(exc).__name__
        if _semantic_model is not None:
            try:
                vectors = _semantic_model.encode(
                    [resume, job], normalize_embeddings=True, convert_to_numpy=True
                )
                score = float(vectors[0] @ vectors[1])
                return max(0.0, min(1.0, score)), (
                    "Local Sentence Transformers all-MiniLM-L6-v2 + TF-IDF keyword coverage"
                )
            except Exception as exc:
                _semantic_model_error = type(exc).__name__
                _semantic_model = None
        try:
            matrix = TfidfVectorizer(
                stop_words="english", ngram_range=(1, 2), max_features=5000
            ).fit_transform([resume, job])
            score = float(cosine_similarity(matrix[0:1], matrix[1:2])[0][0])
        except ValueError:
            score = 0.0
        return score, (
            "TF-IDF fallback; Sentence Transformers unavailable "
            f"({_semantic_model_error or 'load error'})"
        )

    try:
        matrix = TfidfVectorizer(
            stop_words="english", ngram_range=(1, 2), max_features=5000
        ).fit_transform([resume, job])
        return float(cosine_similarity(matrix[0:1], matrix[1:2])[0][0]), (
            "TF-IDF cosine similarity"
        )
    except ValueError:
        return 0.0, "TF-IDF cosine similarity"


def _important_keyword_coverage(resume: str, job: str) -> float:
    """Coverage of high-weight job-description terms, separate from skill matches."""
    if not resume.strip() or not job.strip():
        return 0.0
    try:
        vectorizer = TfidfVectorizer(
            stop_words="english", ngram_range=(1, 2), max_features=3000
        )
        matrix = vectorizer.fit_transform([resume, job])
        weights = matrix[1].toarray().ravel()
        features = vectorizer.get_feature_names_out()
        ranked = weights.argsort()[::-1]
        terms = [features[i] for i in ranked if weights[i] > 0][:20]
        if not terms:
            return 0.0
        normalized_resume = normalize(resume)
        found = sum(
            1 for term in terms
            if re.search(
                r"(?<![a-z0-9+#])" + re.escape(term) + r"(?![a-z0-9+#])",
                normalized_resume,
            )
        )
        return found / len(terms) * 100
    except ValueError:
        return 0.0


def _bounded(value: float) -> int:
    return round(max(0, min(100, value)))


def analyze(
    resume_text: str,
    job_description: str,
    job_title: str = "",
    company_name: str = "",
    required_skills: str = "",
) -> dict[str, Any]:
    text = resume_text.strip()
    job = (job_description or "").strip()
    sections = _section_text(text)
    resume_skills = extract_skills(text)

    manual_requirements = [
        item.strip().lower()
        for item in re.split(r"[,\n;]", required_skills or "")
        if item.strip()
    ]
    job_skills = extract_skills(job + " " + (required_skills or ""))
    requirements = sorted(set(job_skills + manual_requirements))
    matched = sorted(set(resume_skills) & set(requirements))
    missing = sorted(set(requirements) - set(resume_skills))
    coverage = len(matched) / len(requirements) * 100 if requirements else 0.0

    job_similarity, similarity_method = _similarity(text, job)
    keyword_coverage = _important_keyword_coverage(text, job)
    evidence_text = (sections["experience"] + " " + sections["projects"]).lower()
    evidence_count = sum(
        1 for skill in matched
        if re.search(r"(?<!\w)" + re.escape(skill) + r"(?!\w)", evidence_text)
    )
    evidence = (
        evidence_count / len(requirements) * 100
        if requirements
        else (45 if sections["experience"] or sections["projects"] else 10)
    )
    semantic_score = job_similarity * 100
    job_match = _bounded(
        0.40 * coverage
        + 0.25 * evidence
        + 0.25 * semantic_score
        + 0.10 * keyword_coverage
    )

    present_sections = [key for key, value in sections.items() if value.strip()]
    has_email = bool(re.search(r"[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}", text))
    has_phone = bool(re.search(r"(?:\+?\d[\d ().-]{7,}\d)", text))
    structure = _bounded(
        (len(present_sections) / len(HEADINGS)) * 70
        + (15 if has_email else 0)
        + (10 if has_phone else 0)
        + (5 if len(text.split()) >= 120 else 0)
    )
    relevant_skills = coverage if requirements else min(100, len(resume_skills) * 9)
    skills_relevance = _bounded(
        0.55 * relevant_skills + 0.45 * min(100, evidence + 25)
    )
    experience_project = _bounded(
        (65 if sections["experience"] else 0)
        + (35 if sections["projects"] else 0)
    )
    if job:
        experience_project = _bounded(
            0.65 * experience_project + 0.35 * min(100, evidence + 20)
        )
    keyword_score = _bounded(0.65 * keyword_coverage + 0.35 * semantic_score)

    words = text.split()
    sentences = [sentence for sentence in re.split(r"[.!?\n]+", text) if len(sentence.split()) > 2]
    average_sentence = sum(len(sentence.split()) for sentence in sentences) / max(1, len(sentences))
    bullet_count = len(re.findall(r"(?m)^\s*(?:[-*•]|\d+[.)])\s+", text))
    readability = _bounded(
        (30 if 150 <= len(words) <= 1000 else 15 if len(words) > 70 else 0)
        + (30 if 8 <= average_sentence <= 28 else 15)
        + (25 if bullet_count >= 2 else 10)
        + (15 if len(text) / max(1, len(words)) < 9 else 5)
    )
    completeness = _bounded(
        (len(present_sections) / len(HEADINGS)) * 65
        + (15 if has_email else 0)
        + (10 if has_phone else 0)
        + (10 if len(words) > 100 else 0)
    )
    readability_completeness = _bounded((readability + completeness) / 2)
    overall = _bounded(
        0.20 * structure
        + 0.25 * skills_relevance
        + 0.25 * experience_project
        + 0.15 * keyword_score
        + 0.15 * readability_completeness
    )
    ats_score = _bounded(
        0.28 * structure
        + 0.20 * readability
        + 0.22 * keyword_score
        + 0.15 * completeness
        + 0.15 * (100 if has_email else 20)
    )

    section_feedback: dict[str, dict[str, Any]] = {}
    for key in HEADINGS:
        content = sections[key]
        section_words = len(content.split())
        is_present = bool(content)
        section_feedback[key] = {
            "score": _bounded((100 if is_present else 18) * (0.75 if is_present and section_words < 20 else 1)),
            "present": is_present,
            "strengths": ([f"{key.title()} content was detected ({section_words} words)."] if is_present else []),
            "weaknesses": (
                [f"No clearly labeled {key.title()} section was detected."]
                if not is_present
                else (["This section is brief; add role-relevant detail where truthful."] if section_words < 20 else [])
            ),
            "suggestions": (
                [f"Consider adding a clearly labeled {key.title()} section if relevant."]
                if not is_present
                else ([f"Expand the {key.title()} section with specific, role-relevant details where applicable."] if section_words < 20 else [])
            ),
        }

    strengths = []
    recommendations = []
    if has_email:
        strengths.append("Email contact information is present.")
    else:
        recommendations.append("Add a professional email address in the header.")
    if sections["projects"]:
        strengths.append("A projects section gives recruiters concrete work to review.")
    else:
        recommendations.append("Add a Projects section with 2–3 relevant projects and clear outcomes.")
    if sections["experience"]:
        strengths.append("Work or internship experience is represented.")
    else:
        recommendations.append("Add relevant internship, volunteer, or project experience; do not imply work you have not done.")
    if bullet_count < 2:
        recommendations.append("Use concise, action-led bullet points to make achievements easier to scan.")
    if requirements and missing:
        recommendations.append(
            "Where truthful, incorporate missing job terms into relevant project or experience evidence: "
            + ", ".join(missing[:8]) + "."
        )
    if not sections["summary"]:
        recommendations.append("Add a 2–3 line professional summary tailored to this target role.")
    if not recommendations:
        recommendations.append("Quantify outcomes in your strongest bullets and keep the layout consistent.")

    return {
        "resume_score": overall,
        "job_match_score": job_match,
        "ats_score": ats_score,
        "score_breakdown": {
            "structure": structure,
            "skills_relevance": skills_relevance,
            "experience_project_relevance": experience_project,
            "keyword_relevance": keyword_score,
            "readability_completeness": readability_completeness,
        },
        "job_match_breakdown": {
            "required_skills_coverage": _bounded(coverage),
            "experience_evidence": _bounded(evidence),
            "semantic_similarity": _bounded(semantic_score),
            "keyword_coverage": _bounded(keyword_coverage),
        },
        "skills": {
            "identified": resume_skills,
            "required": requirements,
            "matched": matched,
            "missing": missing,
        },
        "sections": section_feedback,
        "recommendations": recommendations,
        "strengths": strengths,
        "ats_checks": {
            "section_headings": len(present_sections),
            "total_recommended_sections": len(HEADINGS),
            "email_present": has_email,
            "phone_present": has_phone,
            "work_experience_present": bool(sections["experience"]),
            "education_present": bool(sections["education"]),
            "skills_section_present": bool(sections["skills"]),
            "readability_score": readability,
            "formatting_consistency": "Visual layout is not inspected by the text parser.",
            "potential_parsing_issues": [
                "Use a single-column layout, standard headings, selectable text, and avoid tables or graphics for critical content."
            ],
            "formatting_hint": "Use a single-column layout, standard headings, selectable text, and avoid tables or graphics for critical content.",
        },
        "analysis_method": (
            similarity_method
            + " + deterministic rule-based skills, sections, and evidence analysis. Resume content is not sent to an AI API."
        ),
        "semantic_model_status": (
            "enabled and loaded locally"
            if "Sentence Transformers all-MiniLM" in similarity_method
            else ("requested but unavailable; documented TF-IDF fallback" if "fallback" in similarity_method else "optional; disabled; TF-IDF used")
        ),
        "job_title": job_title,
        "company_name": company_name,
        "resume_word_count": len(words),
        "job_description_similarity": round(job_similarity, 3),
        "privacy_note": "The app does not persist the uploaded file or extracted text. The web framework may use an ephemeral request buffer.",
    }


def improve_text(original: str, mode: str = "summary", context: str = "") -> dict[str, Any]:
    """Rule-based copy editing that preserves the user's claims and numbers."""
    original = original.strip()
    if not original:
        raise ValueError("Please provide text to improve.")
    if len(original) > 12000:
        raise ValueError("Text is too long (maximum 12,000 characters).")

    improved = re.sub(r"\s+", " ", original).strip()
    changes: list[str] = []

    # Remove a pasted section heading rather than repeating it in the refined draft.
    if mode == "summary":
        without_heading = re.sub(
            r"^(?:professional\s+summary|summary|profile|objective)\s*[:—-]?\s*",
            "",
            improved,
            flags=re.IGNORECASE,
        ).strip()
        if without_heading != improved:
            improved = without_heading
            changes.append("Removed the section label")

        rules = [
            (r"\bInnovative and research-oriented\b", "Innovative, research-oriented"),
            (r"\bInnovative and research focused\b", "Innovative, research-focused"),
            (r"\bExpert in architecting\b", "Experienced in designing"),
            (r"\bExpert in designing\b", "Experienced in designing"),
            (r"\bArtificial Intelligence\b", "artificial intelligence"),
            (r"\bDeep Learning\b", "deep learning"),
            (r"\bComputer Vision\b", "computer vision"),
            (r"\bMachine Learning\b", "machine learning"),
        ]
        for pattern, replacement in rules:
            updated = re.sub(pattern, replacement, improved, flags=re.IGNORECASE)
            if updated != improved:
                improved = updated
                changes.append("Polished summary phrasing and capitalization")

        def normalize_years(match: re.Match[str]) -> str:
            number = match.group(1)
            if "+" in number:
                return f"{number} years of experience"
            return f"more than {number} years of experience"

        updated = re.sub(
            r"\bover\s+(\d+\+?)\s+years\s+of\s+experience\b",
            normalize_years,
            improved,
            flags=re.IGNORECASE,
        )
        if updated != improved:
            improved = updated
            changes.append("Removed redundant years wording")

        # This clause pattern only changes list punctuation, retaining the same items.
        updated = re.sub(
            r",?\s+\branging from (.+?) and (.+?) to (.+?)(?=[.!?]|$)",
            r" spanning \1, \2, and \3",
            improved,
            flags=re.IGNORECASE,
        )
        if updated != improved:
            improved = updated
            changes.append("Clarified the list of focus areas")

    replacements = {
        "worked on": "Contributed to",
        "helped with": "Supported",
        "responsible for": "Managed",
        "made": "Created",
        "did": "Delivered",
        "used": "Applied",
    }
    for old, new in replacements.items():
        updated = re.sub(r"\b" + re.escape(old) + r"\b", new, improved, flags=re.IGNORECASE)
        if updated != improved:
            improved = updated
            changes.append("Used clearer action wording")

    improved = improved[0].upper() + improved[1:] if improved else improved
    if improved and improved[-1] not in ".!?":
        improved += "."
        changes.append("Standardized ending punctuation")

    if improved == original:
        note = (
            "No safe wording changes were found. Add a concrete responsibility, tool, "
            "or outcome that is true to your experience, then try again."
        )
    else:
        note = (
            "Rule-based wording cleanup only. Review every statement; no new facts, "
            "metrics, or qualifications were added."
        )
    return {
        "original": original,
        "improved": improved,
        "mode": mode,
        "changed": improved != original,
        "changes": list(dict.fromkeys(changes)),
        "method": note,
    }
