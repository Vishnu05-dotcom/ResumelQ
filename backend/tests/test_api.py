from io import BytesIO
from docx import Document
from fastapi.testclient import TestClient
from app.main import app
client=TestClient(app)

def docx_bytes():
    doc=Document()
    for line in ["Taylor Rivera", "taylor@example.com", "+1 212 555 0110", "SUMMARY", "Software developer with Python project experience.", "EXPERIENCE", "Built a Python tool for a class project.", "EDUCATION", "BS Computer Science", "SKILLS", "Python, Git"]:
        doc.add_paragraph(line)
    stream=BytesIO(); doc.save(stream); return stream.getvalue()

def test_health():
    r=client.get('/api/health'); assert r.status_code==200; assert r.json()['status']=='ok'

def test_extract_skills_validation():
    assert client.post('/api/extract-skills',json={'text':'Python and SQL'}).json()['skills']==['python','sql']
    assert client.post('/api/extract-skills',json={'text':''}).status_code==422

def test_improve_and_empty_validation(monkeypatch):
    monkeypatch.setenv('LLM_PROVIDER','rules')
    response=client.post('/api/improve-resume',json={'text':'worked on tools'})
    assert response.status_code==200
    assert response.json()['engine']=='rules'
    assert response.json()['changed'] is True
    assert client.post('/api/improve-resume',json={'text':''}).status_code==422

def test_job_match():
    r=client.post('/api/job-match',json={'resume_text':'Python data projects','job_description':'A role building Python applications and data projects','required_skills':'Python'})
    assert r.status_code==200 and 'job_match_score' in r.json()

def test_valid_docx_analysis_returns_report_without_resume_text():
    r=client.post('/api/analyze-resume',files={'file':('resume.docx',docx_bytes(),'application/vnd.openxmlformats-officedocument.wordprocessingml.document')},data={'job_title':'Junior developer','job_description':'Seeking a junior software developer with Python, Docker, collaboration and project experience.','required_skills':'Python, Docker'})
    assert r.status_code==200
    body=r.json()
    assert 0 <= body['resume_score'] <= 100
    assert body['skills']['matched']==['python']
    assert body['skills']['missing']==['docker']
    assert 'Taylor Rivera' not in str(body)

def test_invalid_upload_type():
    r=client.post('/api/analyze-resume',files={'file':('resume.txt',b'Not a resume','text/plain')},data={'job_description':'This is a sufficiently detailed job description.'})
    assert r.status_code==415

def test_local_history_is_empty_and_analysis_is_not_persisted():
    assert client.get('/api/analysis-history').json()['storage_enabled'] is False
    assert client.get('/api/analysis/unknown').status_code==404
    assert client.delete('/api/resume/unknown').json()['deleted'] is False
