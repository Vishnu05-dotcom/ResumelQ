import asyncio
from app.services.llm_improver import _reject_new_numbers, improve_resume


def test_default_provider_keeps_rule_engine(monkeypatch):
    monkeypatch.delenv("LLM_PROVIDER", raising=False)
    result = asyncio.run(improve_resume("helped with a data project", mode="bullet"))
    assert result["engine"] == "rules"
    assert result["changed"] is True


def test_rejects_unprovided_numeric_claims():
    assert _reject_new_numbers("Built a small app", "Built 12 apps")
    assert not _reject_new_numbers("Improved 7+ years of experience", "Improved 7+ years of experience")


def test_unavailable_ollama_has_explicit_rules_fallback(monkeypatch):
    monkeypatch.setenv("LLM_PROVIDER", "ollama")
    monkeypatch.setenv("OLLAMA_BASE_URL", "http://127.0.0.1:1")
    monkeypatch.setenv("LLM_TIMEOUT_SECONDS", "0.2")
    result = asyncio.run(improve_resume("helped with a project", mode="bullet"))
    assert result["engine"] == "rules"
    assert "Ollama request failed" in result["fallback_reason"]
    assert "fallback" in result["method"].lower()
