const API_BASE =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, "") ||
  "";
export type Analysis = {
  analysis_id: string;
  filename: string;
  resume_score: number;
  job_match_score: number;
  ats_score: number;
  score_breakdown: Record<string, number>;
  job_match_breakdown: Record<string, number>;
  skills: {
    identified: string[];
    required: string[];
    matched: string[];
    missing: string[];
  };
  sections: Record<
    string,
    {
      score: number;
      present: boolean;
      strengths: string[];
      weaknesses: string[];
      suggestions: string[];
    }
  >;
  recommendations: string[];
  strengths: string[];
  ats_checks: Record<string, any>;
  analysis_method: string;
  privacy_note: string;
  resume_word_count: number;
  job_title: string;
  company_name: string;
};
export async function analyzeResume(
  file: File,
  fields: {
    jobTitle: string;
    companyName: string;
    jobDescription: string;
    requiredSkills: string;
  },
) {
  const body = new FormData();
  body.append("file", file);
  body.append("job_title", fields.jobTitle);
  body.append("company_name", fields.companyName);
  body.append("job_description", fields.jobDescription);
  body.append("required_skills", fields.requiredSkills);
  const response = await fetch(`${API_BASE}/api/analyze-resume`, {
    method: "POST",
    body,
  });
  const data = await response.json().catch(() => ({
    detail: "The analysis service returned an invalid response.",
  }));
  if (!response.ok)
    throw new Error(data.detail || "Analysis failed. Please try again.");
  return data as Analysis;
}
export async function improveText(text: string, mode: string, context = "") {
  const response = await fetch(`${API_BASE}/api/improve-resume`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, mode, context }),
  });
  const data = await response.json();
  if (!response.ok)
    throw new Error(data.detail || "Could not improve this text.");
  return data as {
    original: string;
    improved: string;
    changed: boolean;
    changes: string[];
    engine: "rules" | "ollama";
    model?: string;
    fallback_reason?: string | null;
    method: string;
  };
}
