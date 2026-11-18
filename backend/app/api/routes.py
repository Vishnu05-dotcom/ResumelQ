from uuid import uuid4
from fastapi import APIRouter, File, Form, HTTPException, Request, UploadFile
from app.core.rate_limit import limiter
from app.schemas.analysis import ImprovePayload, JobMatchPayload, TextPayload
from app.services.analyzer import analyze, extract_skills
from app.services.llm_improver import improve_resume, llm_config
from app.services.extraction import MAX_BYTES, ResumeExtractionError, extract_resume

router = APIRouter(prefix="/api")

@router.get("/health")
def health():
    llm = llm_config()
    return {
        "status": "ok",
        "service": "ResumeIQ API",
        "storage": "disabled; files are not persisted",
        "semantic_model": "optional local Sentence Transformer; each analysis reports the method actually used, with TF-IDF fallback",
        "resume_improver": {"provider": llm["provider"], "model": llm["model"] if llm["provider"] == "ollama" else None},
    }

@router.post("/analyze-resume")
@limiter.limit("10/minute")
async def analyze_resume(request: Request, file: UploadFile=File(...), job_description: str=Form(...), job_title: str=Form(default=""), company_name: str=Form(default=""), required_skills: str=Form(default="")):
    if len(job_description.strip()) < 20:
        raise HTTPException(422,"Please enter a job description with at least 20 characters.")
    if len(job_description) > 30000 or len(required_skills) > 3000:
        raise HTTPException(413,"Job details exceed the allowed length.")
    if not file.filename:
        raise HTTPException(422,"A resume file is required.")
    if file.content_type and file.content_type not in {"application/pdf","application/vnd.openxmlformats-officedocument.wordprocessingml.document","application/octet-stream"}:
        raise HTTPException(415,"Upload a PDF or DOCX file.")
    payload = await file.read(MAX_BYTES + 1)
    if len(payload) > MAX_BYTES:
        raise HTTPException(413,"File exceeds the 5 MB limit.")
    try:
        text = extract_resume(file.filename,payload)
    except ResumeExtractionError as exc:
        raise HTTPException(422,str(exc))
    result = analyze(text,job_description,job_title,company_name,required_skills)
    result["analysis_id"] = str(uuid4())
    result["filename"] = file.filename
    return result

@router.post("/extract-skills")
def skills(payload: TextPayload):
    return {"skills":extract_skills(payload.text)}

@router.post("/job-match")
def job_match(payload: JobMatchPayload):
    return analyze(payload.resume_text,payload.job_description,required_skills=payload.required_skills)

@router.post("/ats-score")
def ats_score(payload: TextPayload):
    result = analyze(payload.text,"")
    return {"ats_score":result["ats_score"],"checks":result["ats_checks"],"disclaimer":"Estimated heuristic only; ATS outcomes vary by employer and software."}

@router.post("/improve-resume")
async def improve(payload: ImprovePayload):
    try:
        return await improve_resume(payload.text,payload.mode,payload.context)
    except ValueError as exc:
        raise HTTPException(422,str(exc))

@router.get("/analysis-history")
def analysis_history():
    return {"items":[],"storage_enabled":False,"message":"History is stored locally in this browser only when available; server persistence is not configured."}

@router.get("/analysis/{analysis_id}")
def get_analysis(analysis_id: str):
    raise HTTPException(404,"Analysis not found. This privacy-first local backend does not persist reports; use a configured Supabase deployment for account history.")

@router.delete("/resume/{resume_id}")
def delete_resume(resume_id: str):
    return {"deleted":False,"storage_enabled":False,"message":"No server-side resume is stored in this local setup."}
