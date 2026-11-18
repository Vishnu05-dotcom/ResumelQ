from io import BytesIO
import pytest
import pymupdf
from docx import Document
from app.services.extraction import extract_resume, ResumeExtractionError, MAX_BYTES

def make_docx(text):
    doc=Document(); doc.add_paragraph(text); out=BytesIO(); doc.save(out); return out.getvalue()

def make_pdf(text):
    doc=pymupdf.open(); page=doc.new_page(); page.insert_text((72,72),text); return doc.tobytes()

def test_docx_text_extraction():
    content="Alex Example\nSummary\nExperienced software engineer with Python and SQL projects."
    assert "Alex Example" in extract_resume("resume.docx",make_docx(content))

def test_pdf_text_extraction():
    content="Alex Example\nExperienced software engineer with Python and SQL projects."
    assert "Alex Example" in extract_resume("resume.pdf",make_pdf(content))

def test_reject_unsupported_and_large_files():
    with pytest.raises(ResumeExtractionError): extract_resume("resume.txt",b"text")
    with pytest.raises(ResumeExtractionError): extract_resume("resume.docx",b"x"*(MAX_BYTES+1))

def test_reject_empty_and_too_short():
    with pytest.raises(ResumeExtractionError): extract_resume("resume.pdf",b"")
    with pytest.raises(ResumeExtractionError): extract_resume("resume.docx",make_docx("tiny"))
