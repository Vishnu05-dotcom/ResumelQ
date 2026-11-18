"""Safe PDF/DOCX text extraction. Request content is not persistently stored by this service."""
from io import BytesIO
from pathlib import Path

MAX_BYTES = 5 * 1024 * 1024
ALLOWED = {".pdf", ".docx"}

class ResumeExtractionError(ValueError):
    pass

def extract_resume(filename: str, payload: bytes) -> str:
    suffix = Path(filename or "").suffix.lower()
    if suffix not in ALLOWED:
        raise ResumeExtractionError("Unsupported file type. Upload a PDF or DOCX file.")
    if not payload:
        raise ResumeExtractionError("The uploaded file is empty.")
    if len(payload) > MAX_BYTES:
        raise ResumeExtractionError("File exceeds the 5 MB limit.")
    try:
        if suffix == ".pdf":
            import pymupdf
            doc = pymupdf.open(stream=payload, filetype="pdf")
            if doc.is_encrypted:
                raise ResumeExtractionError("Password-protected PDFs are not supported.")
            text = "\n".join(page.get_text("text") for page in doc)
            doc.close()
        else:
            from docx import Document
            doc = Document(BytesIO(payload))
            text = "\n".join(p.text for p in doc.paragraphs)
            for table in doc.tables:
                text += "\n" + "\n".join(" | ".join(c.text for c in row.cells) for row in table.rows)
    except ResumeExtractionError:
        raise
    except Exception as exc:
        raise ResumeExtractionError("Could not read this file. Check that it is a valid, text-based PDF or DOCX.") from exc
    text = "\n".join(line.strip() for line in text.splitlines() if line.strip())
    if len(text.strip()) < 40:
        raise ResumeExtractionError("Not enough text was found. The file may be scanned; use a text-based PDF or DOCX.")
    return text[:100_000]
