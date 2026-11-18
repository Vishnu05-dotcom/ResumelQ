from app.services.analyzer import analyze, extract_skills, improve_text

def test_extract_skills_case_insensitive_and_unique():
    assert extract_skills("Python, python and SQL with Docker") == ["docker", "python", "sql"]

def test_missing_skills_and_scores_are_bounded():
    resume="""Jordan Lee\njordan@example.com\n+1 202 555 0100\n\nSUMMARY\nAnalyst using Python and SQL.\n\nEDUCATION\nBS Statistics\n\nSKILLS\nPython, SQL\n\nPROJECTS\n- Built Python analysis for business data"""
    result=analyze(resume,"Seeking analyst with Python, SQL, Docker and Tableau. Experience building dashboards.")
    assert result["skills"]["matched"] == ["python", "sql"]
    assert result["skills"]["missing"] == ["docker", "tableau"]
    for key in ("resume_score","job_match_score","ats_score"):
        assert 0 <= result[key] <= 100

def test_score_weights_visible_and_no_fake_semantics():
    result=analyze("Short text", "A detailed role description asking for SQL and Python skills.")
    assert set(result["score_breakdown"]) == {"structure","skills_relevance","experience_project_relevance","keyword_relevance","readability_completeness"}
    assert "TF-IDF" in result["analysis_method"]
    assert "weaknesses" in result["sections"]["summary"]

def test_improve_does_not_add_achievement():
    result=improve_text("helped with a project")
    assert "Supported a project." == result["improved"]
    assert "no new facts" in result["method"]

def test_summary_improvement_changes_style_without_inventing_facts():
    source=("PROFESSIONAL SUMMARY Innovative and research-oriented Data Scientist with over 7+ years of experience in Artificial Intelligence, Deep Learning, and Computer Vision. "
            "Expert in architecting end-to-end Machine Learning solutions, ranging from real-time object detection and biometric systems to predictive analytics in healthcare and finance.")
    result=improve_text(source,mode="summary")
    assert result["changed"] is True
    assert not result["improved"].startswith("PROFESSIONAL SUMMARY")
    assert "7+ years of experience" in result["improved"]
    assert "object detection, biometric systems, and predictive analytics" in result["improved"]
    assert "research-oriented Data Scientist" in result["improved"]
