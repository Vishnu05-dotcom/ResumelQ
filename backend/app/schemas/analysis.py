from pydantic import BaseModel, Field

class TextPayload(BaseModel):
    text: str = Field(min_length=1, max_length=100_000)

class JobMatchPayload(BaseModel):
    resume_text: str = Field(min_length=1, max_length=100_000)
    job_description: str = Field(min_length=1, max_length=30_000)
    required_skills: str = Field(default="", max_length=3000)

class ImprovePayload(BaseModel):
    text: str = Field(min_length=1, max_length=12_000)
    mode: str = Field(default="summary", max_length=40)
    context: str = Field(default="", max_length=3000)
