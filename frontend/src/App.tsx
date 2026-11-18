import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type DragEvent,
  type ChangeEvent,
} from "react";
import {
  Link,
  NavLink,
  Route,
  Routes,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import {
  Activity,
  ArrowDownToLine,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CloudUpload,
  FileCheck2,
  FileText,
  HeartHandshake,
  History,
  Home,
  Lightbulb,
  LockKeyhole,
  LogIn,
  Menu,
  MessageSquareText,
  MousePointer2,
  PenLine,
  Plus,
  Quote,
  RefreshCw,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Target,
  Trash2,
  TrendingUp,
  Upload,
  UserRound,
  Workflow,
  X,
  AlertCircle,
  LoaderCircle,
  Copy,
  Download,
  Briefcase,
  GraduationCap,
  Code2,
  Layers3,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { analyzeResume, improveText, type Analysis } from "./services/api";

const STORAGE = "resumeiq:analyses";
function loadAnalyses(): Analysis[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE) || "[]");
  } catch {
    return [];
  }
}
function saveAnalysis(a: Analysis) {
  const all = [
    a,
    ...loadAnalyses().filter((x) => x.analysis_id !== a.analysis_id),
  ].slice(0, 25);
  localStorage.setItem(STORAGE, JSON.stringify(all));
  return all;
}
const colors = [
  "#7464f2",
  "#27b8d6",
  "#47c79b",
  "#f5aa57",
  "#f27b9a",
  "#6a8df5",
];
const supaUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supaKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
const supabase = supaUrl && supaKey ? createClient(supaUrl, supaKey) : null;

function Logo({ small = false }: { small?: boolean }) {
  return (
    <Link to="/" className={`logo ${small ? "logo-small" : ""}`}>
      <span className="logo-mark">
        <FileText size={19} />
        <Sparkles className="logo-spark" size={10} />
      </span>
      <span>
        resume<span className="logo-iq">IQ</span>
      </span>
    </Link>
  );
}
function Button({
  children,
  variant = "primary",
  to,
  onClick,
  className = "",
  type = "button",
  disabled = false,
}: {
  children: any;
  variant?: string;
  to?: string;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  const cls = `btn btn-${variant} ${className}`;
  return to ? (
    <Link className={cls} to={to}>
      {children}
    </Link>
  ) : (
    <button type={type} className={cls} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <Logo />
        <nav className={open ? "nav-links nav-open" : "nav-links"}>
          <a href="/#features" onClick={() => setOpen(false)}>
            Features
          </a>
          <a href="/#how-it-works" onClick={() => setOpen(false)}>
            How it works
          </a>
          <a href="/#about" onClick={() => setOpen(false)}>
            About
          </a>
        </nav>
        <div className="top-actions">
          <Link className="login-link" to="/login">
            Log in
          </Link>
          <Button to="/analyze" className="nav-cta">
            Get started <ArrowRight size={15} />
          </Button>
        </div>
        <button
          className="mobile-menu"
          onClick={() => setOpen(!open)}
          aria-label="Open navigation"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
    </header>
  );
}
function Landing() {
  return (
    <>
      <Header />
      <main>
        <section className="hero wrap">
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="eyebrow-dot" /> Career clarity, powered by AI
            </div>
            <h1>
              Make your resume
              <br />
              stand out <span>with AI.</span>
            </h1>
            <p className="hero-sub">
              Know what recruiters are looking for. Get a thoughtful resume
              review, spot skill gaps, and take your next career step with
              confidence.
            </p>
            <div className="hero-actions">
              <Button to="/analyze">
                Analyze my resume <ArrowRight size={16} />
              </Button>
              <a className="text-button" href="#features">
                Explore features <ChevronRight size={16} />
              </a>
            </div>
            <div className="hero-trust">
              <div className="trust-icon">
                <ShieldCheck size={16} />
              </div>
              <span>
                Your files stay private. Analysis runs locally on our own
                service.
              </span>
            </div>
          </div>
          <div
            className="hero-visual"
            aria-label="Resume insights illustration"
          >
            <div className="visual-glow" />
            <div className="floating-chip chip-one">
              <span className="chip-dot green" />
              <span>ATS-ready structure</span>
              <Check size={14} />
            </div>
            <div className="resume-card">
              <div className="resume-top">
                <div className="avatar-sample">AM</div>
                <div>
                  <b>Alex Morgan</b>
                  <small>Product Designer</small>
                </div>
                <div className="resume-more">•••</div>
              </div>
              <div className="resume-divider" />
              <div className="skeleton title-sk" />
              <div className="skeleton line-sk w90" />
              <div className="skeleton line-sk w72" />
              <div className="resume-mini-title">
                <span /> EXPERIENCE
              </div>
              <div className="experience-row">
                <i />
                <div>
                  <b>Product Designer</b>
                  <small>Northstar Studio · 2022 — Present</small>
                </div>
              </div>
              <div className="skeleton line-sk w90" />
              <div className="skeleton line-sk w72" />
              <div className="resume-mini-title">
                <span /> CORE SKILLS
              </div>
              <div className="skill-pills">
                <i>Research</i>
                <i>Figma</i>
                <i>Prototyping</i>
              </div>
              <div className="resume-footer">
                <span>
                  <CheckCircle2 size={14} /> Resume scan complete
                </span>
                <b>Ready for review</b>
              </div>
            </div>
            <div className="score-float">
              <div className="score-ring">
                <div>
                  <b>86</b>
                  <small>/100</small>
                </div>
              </div>
              <div>
                <b>Resume score</b>
                <small>Strong foundation</small>
              </div>
            </div>
            <div className="floating-chip chip-two">
              <span className="chip-icon">
                <Target size={14} />
              </span>
              <span>
                <b>Role match</b>
                <small>Skills aligned</small>
              </span>
              <strong>+12%</strong>
            </div>
          </div>
        </section>
        <section className="trust-strip">
          <div className="wrap trust-inner">
            <span>BUILT FOR YOUR NEXT MOVE</span>
            <b>
              <GraduationCap /> Students
            </b>
            <b>
              <Briefcase /> Early careers
            </b>
            <b>
              <TrendingUp /> Career changers
            </b>
            <b>
              <HeartHandshake /> Job seekers
            </b>
          </div>
        </section>
        <section id="features" className="section wrap">
          <div className="section-heading">
            <div className="eyebrow">A smarter way to prepare</div>
            <h2>
              Every detail, working
              <br />
              <span>toward your next yes.</span>
            </h2>
            <p>
              Practical, transparent feedback to help you put your best work
              forward.
            </p>
          </div>
          <div className="feature-grid">
            {[
              [
                Sparkles,
                "AI resume analysis",
                "Get a structured, explainable review of the content you already have.",
                "lavender",
              ],
              [
                ShieldCheck,
                "ATS compatibility",
                "Check core sections, contact details, readability, and keyword alignment.",
                "mint",
              ],
              [
                Target,
                "Job description match",
                "See how your experience and skills map to a role you care about.",
                "blue",
              ],
              [
                Search,
                "Skill gap discovery",
                "Find the requirements you may want to address or learn next.",
                "peach",
              ],
              [
                MessageSquareText,
                "Actionable suggestions",
                "Get focused recommendations grounded in your uploaded resume.",
                "rose",
              ],
              [
                BarChart3,
                "Clear score dashboard",
                "Understand the factors behind each score, not just a number.",
                "lavender",
              ],
            ].map(([Icon, title, desc, color]: any) => (
              <article className="feature-card" key={title}>
                <div className={`feature-icon ${color}`}>
                  <Icon size={20} />
                </div>
                <h3>{title}</h3>
                <p>{desc}</p>
                <div className="feature-arrow">
                  <ArrowUpRight size={16} />
                </div>
              </article>
            ))}
          </div>
        </section>
        <section id="how-it-works" className="steps-section">
          <div className="wrap">
            <div className="section-heading center">
              <div className="eyebrow">Simple by design</div>
              <h2>
                From upload to <span>next steps.</span>
              </h2>
              <p>Useful insights in a few straightforward steps.</p>
            </div>
            <div className="steps-grid">
              {[
                [
                  Upload,
                  "01",
                  "Upload your resume",
                  "Add a PDF or DOCX. Your file is processed for the request and is not persistently stored by the local demo.",
                ],
                [
                  Briefcase,
                  "02",
                  "Add a target role",
                  "Paste a job description and optional skills you want to check against.",
                ],
                [
                  Sparkles,
                  "03",
                  "Get your analysis",
                  "Review your resume score, estimated ATS readiness, match, and skill gaps.",
                ],
                [
                  Lightbulb,
                  "04",
                  "Take action",
                  "Use grounded suggestions and free learning resources to refine your next draft.",
                ],
              ].map(([Icon, num, title, desc]: any) => (
                <div className="step-card" key={num}>
                  <span className="step-number">{num}</span>
                  <div className="step-icon">
                    <Icon size={19} />
                  </div>
                  <h3>{title}</h3>
                  <p>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section id="about" className="wrap privacy-band">
          <div className="privacy-icon">
            <LockKeyhole size={24} />
          </div>
          <div>
            <div className="eyebrow">Privacy, by default</div>
            <h2>Your career story is yours.</h2>
            <p>
              ResumeIQ's local demo processes your resume per request and keeps
              a report only in this browser. No third-party AI provider receives
              your document.
            </p>
          </div>
          <Button to="/analyze" variant="light">
            Try your analysis <ArrowRight size={15} />
          </Button>
        </section>
      </main>
      <Footer />
    </>
  );
}
function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-top">
        <div>
          <Logo />
          <p>Thoughtful tools for your next career move.</p>
        </div>
        <div className="footer-links">
          <a href="#about">About</a>
          <a href="/#features">Features</a>
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
          <a href="mailto:hello@resumeiq.local">Contact</a>
          <a href="https://github.com" target="_blank" rel="noreferrer">
            GitHub <ArrowUpRight size={13} />
          </a>
        </div>
      </div>
      <div className="wrap footer-bottom">
        <span>© 2026 ResumeIQ · Open-source project</span>
        <span>Analysis is an estimate, not a hiring guarantee.</span>
      </div>
    </footer>
  );
}

const navItems = [
  ["/dashboard", "Overview", Home],
  ["/analyze", "Analyze resume", CloudUpload],
  ["/history", "My analyses", History],
  ["/improve", "Resume improver", PenLine],
  ["/skills", "Skill roadmap", BookOpen],
  ["/profile", "Profile & settings", UserRound],
] as const;
function AppLayout({ children }: { children: any }) {
  const [mobile, setMobile] = useState(false);
  const location = useLocation();
  useEffect(() => setMobile(false), [location.pathname]);
  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobile ? "sidebar-open" : ""}`}>
        <div className="side-brand">
          <Logo />
          <button className="side-close" onClick={() => setMobile(false)}>
            <X size={18} />
          </button>
        </div>
        <div className="workspace-label">WORKSPACE</div>
        <nav className="side-nav">
          {navItems.map(([to, label, Icon]) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `side-link ${isActive ? "active" : ""}`
              }
            >
              <Icon size={17} />
              <span>{label}</span>
              {label === "Analyze resume" && (
                <span className="side-plus">
                  <Plus size={13} />
                </span>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="side-bottom">
          <div className="side-help">
            <div className="help-icon">
              <MessageSquareText size={16} />
            </div>
            <b>Need a hand?</b>
            <p>Explore the scoring guide in our project docs.</p>
            <a href="https://github.com" target="_blank" rel="noreferrer">
              Visit documentation <ArrowUpRight size={12} />
            </a>
          </div>
          <div className="side-profile">
            <div className="user-avatar">G</div>
            <div>
              <b>Guest workspace</b>
              <small>Saved on this device</small>
            </div>
            <Settings size={16} />
          </div>
        </div>
      </aside>
      <div className="app-main">
        <header className="app-topbar">
          <button className="side-toggle" onClick={() => setMobile(true)}>
            <Menu size={20} />
          </button>
          <div className="breadcrumb">
            <span>Workspace</span>
            <ChevronRight size={14} />
            <b>
              {navItems.find((n) => n[0] === location.pathname)?.[1] ||
                "Analysis"}
            </b>
          </div>
          <div className="app-top-actions">
            <span className="local-badge">
              <span />
              Local mode
            </span>
            <Link to="/profile" className="top-user">
              G
            </Link>
          </div>
        </header>
        <main className="app-content">{children}</main>
      </div>
    </div>
  );
}
function PageTitle({
  eyebrow,
  title,
  desc,
  action,
}: {
  eyebrow: string;
  title: string;
  desc: string;
  action?: any;
}) {
  return (
    <div className="page-title">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        <p>{desc}</p>
      </div>
      {action}
    </div>
  );
}
function Dashboard() {
  const [data, setData] = useState<Analysis[]>(loadAnalyses);
  useEffect(() => {
    const on = () => setData(loadAnalyses());
    window.addEventListener("storage", on);
    return () => window.removeEventListener("storage", on);
  }, []);
  const avg = (fn: (a: Analysis) => number) =>
    data.length
      ? Math.round(data.reduce((n, a) => n + fn(a), 0) / data.length)
      : 0;
  const trend = data
    .slice(0, 7)
    .reverse()
    .map((a, i) => ({
      name: `${i + 1}`,
      score: a.resume_score,
      match: a.job_match_score,
    }));
  const skills = useMemo(() => {
    const count: Record<string, number> = {};
    data.forEach((a) =>
      a.skills.identified.forEach((s) => (count[s] = (count[s] || 0) + 1)),
    );
    return Object.entries(count)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, value]) => ({ name, value }));
  }, [data]);
  return (
    <>
      <PageTitle
        eyebrow="YOUR WORKSPACE"
        title="Good things take a draft."
        desc="A clear view of your resume analysis and what to focus on next."
        action={
          <Button to="/analyze">
            <Plus size={16} /> New analysis
          </Button>
        }
      />
      <div className="metric-grid">
        <Metric
          icon={FileCheck2}
          label="Resumes analyzed"
          value={data.length}
          detail="On this device"
          color="purple"
        />
        <Metric
          icon={Activity}
          label="Average resume score"
          value={data.length ? `${avg((a) => a.resume_score)}%` : "—"}
          detail={
            data.length
              ? "Across your analyses"
              : "Run an analysis to see your score"
          }
          color="blue"
        />
        <Metric
          icon={Target}
          label="Average job match"
          value={data.length ? `${avg((a) => a.job_match_score)}%` : "—"}
          detail={
            data.length
              ? "Across your target roles"
              : "Add a job description to compare"
          }
          color="green"
        />
        <Metric
          icon={Layers3}
          label="Skills identified"
          value={new Set(data.flatMap((a) => a.skills.identified)).size || "—"}
          detail="Unique skills across reports"
          color="orange"
        />
      </div>
      <div className="dashboard-grid">
        <section className="panel chart-panel">
          <div className="panel-head">
            <div>
              <h2>Resume score overview</h2>
              <p>Recent analyses saved in this browser</p>
            </div>
            <span className="chart-legend">
              <i /> Resume score
            </span>
          </div>
          {data.length ? (
            <ResponsiveContainer width="100%" height={245}>
              <AreaChart data={trend}>
                <defs>
                  <linearGradient id="scoreFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7868f5" stopOpacity={0.22} />
                    <stop offset="95%" stopColor="#7868f5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 5"
                  vertical={false}
                  stroke="#edf0f5"
                />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#9ca3b4", fontSize: 11 }}
                />
                <YAxis
                  domain={[0, 100]}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#9ca3b4", fontSize: 11 }}
                />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="score"
                  name="Resume score"
                  stroke="#7868f5"
                  strokeWidth={2.5}
                  fill="url(#scoreFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart
              icon={BarChart3}
              title="Your score trends start here"
              text="Run your first analysis to see your scores over time."
            />
          )}
        </section>
        <section className="panel skill-panel">
          <div className="panel-head">
            <div>
              <h2>Skills identified</h2>
              <p>Across your resume analyses</p>
            </div>
            <Link className="inline-link" to="/skills">
              Explore <ArrowRight size={14} />
            </Link>
          </div>
          {skills.length ? (
            <div className="skill-chart">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart
                  data={skills}
                  layout="vertical"
                  margin={{ left: 4, right: 10 }}
                >
                  <XAxis type="number" hide />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={90}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#737b8d", fontSize: 11 }}
                  />
                  <Tooltip cursor={{ fill: "#f8f8fc" }} />
                  <Bar
                    dataKey="value"
                    name="Analyses"
                    radius={[0, 5, 5, 0]}
                    barSize={13}
                  >
                    {skills.map((_, i) => (
                      <Cell key={i} fill={colors[i % colors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyChart
              icon={Search}
              title="No skills yet"
              text="Skills will appear here after an analysis."
              compact
            />
          )}
        </section>
      </div>
      <section className="panel recent-panel">
        <div className="panel-head">
          <div>
            <h2>Recent analyses</h2>
            <p>Your reports are stored only in this browser.</p>
          </div>
          <Link to="/history" className="inline-link">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        {data.length ? (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>RESUME</th>
                  <th>TARGET ROLE</th>
                  <th>RESUME SCORE</th>
                  <th>JOB MATCH</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {data.slice(0, 5).map((a) => (
                  <tr key={a.analysis_id}>
                    <td>
                      <span className="table-file">
                        <FileText size={16} />
                        <b>{a.filename}</b>
                      </span>
                    </td>
                    <td>{a.job_title || "Untitled role"}</td>
                    <td>
                      <ScorePill score={a.resume_score} />
                    </td>
                    <td>
                      <ScorePill score={a.job_match_score} />
                    </td>
                    <td>
                      <Link
                        to={`/results/${a.analysis_id}`}
                        className="row-link"
                      >
                        <ArrowUpRight size={16} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-recent">
            <div className="empty-icon">
              <FileText />
            </div>
            <div>
              <h3>Nothing here just yet</h3>
              <p>
                Your first report will show up here after you analyze a resume.
              </p>
            </div>
            <Button to="/analyze" variant="outline">
              Analyze a resume <ArrowRight size={14} />
            </Button>
          </div>
        )}
      </section>
      <p className="storage-note">
        <LockKeyhole size={13} /> Reports stay in this browser only. Clearing
        browser data permanently removes them.
      </p>
    </>
  );
}
function Metric({
  icon: Icon,
  label,
  value,
  detail,
  color,
}: {
  icon: any;
  label: string;
  value: any;
  detail: string;
  color: string;
}) {
  return (
    <div className="metric-card">
      <div className={`metric-icon ${color}`}>
        <Icon size={18} />
      </div>
      <span>{label}</span>
      <b>{value}</b>
      <small>{detail}</small>
    </div>
  );
}
function EmptyChart({ icon: Icon, title, text, compact = false }: any) {
  return (
    <div className={`empty-chart ${compact ? "compact" : ""}`}>
      <div className="empty-chart-icon">
        <Icon size={21} />
      </div>
      <b>{title}</b>
      <p>{text}</p>
    </div>
  );
}
function ScorePill({ score }: { score: number }) {
  return (
    <span
      className={`score-pill ${score >= 75 ? "good" : score >= 50 ? "medium" : "low"}`}
    >
      <i />
      {score}%
    </span>
  );
}

function AnalyzePage() {
  const [file, setFile] = useState<File | null>(null);
  const [drag, setDrag] = useState(false);
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [requiredSkills, setRequiredSkills] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [stage, setStage] = useState(0);
  const [progress, setProgress] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const stages = [
    "Reading your resume",
    "Extracting skills",
    "Comparing job requirements",
    "Calculating compatibility",
    "Preparing your report",
  ];
  function accept(f?: File) {
    setError("");
    if (!f) return;
    if (!/\.(pdf|docx)$/i.test(f.name)) {
      setError("Please choose a PDF or DOCX file.");
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      setError(
        "This file is larger than 5 MB. Please choose a smaller resume.",
      );
      return;
    }
    setFile(f);
  }
  function drop(e: DragEvent) {
    e.preventDefault();
    setDrag(false);
    accept(e.dataTransfer.files?.[0]);
  }
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!file) {
      setError("Upload your resume before continuing.");
      return;
    }
    if (jobDescription.trim().length < 20) {
      setError("Add a job description with at least 20 characters.");
      return;
    }
    setLoading(true);
    setStage(0);
    setProgress(8);
    const ticker = window.setInterval(() => {
      setStage((s) => Math.min(s + 1, stages.length - 1));
      setProgress((p) => Math.min(p + 17, 86));
    }, 950);
    try {
      const result = await analyzeResume(file, {
        jobTitle,
        companyName,
        jobDescription,
        requiredSkills,
      });
      window.clearInterval(ticker);
      setProgress(100);
      saveAnalysis(result);
      window.setTimeout(
        () =>
          navigate(`/results/${result.analysis_id}`, {
            state: { analysis: result },
          }),
        260,
      );
    } catch (err: any) {
      window.clearInterval(ticker);
      setError(err.message || "Analysis failed. Is the ResumeIQ API running?");
      setLoading(false);
      setProgress(0);
    }
  }
  return (
    <>
      <PageTitle
        eyebrow="ANALYZE YOUR RESUME"
        title="A clearer path to your next role."
        desc="Upload your resume and compare it with a job description. The file is handled per request and is not persistently stored by this local setup."
      />
      <form className="analyze-grid" onSubmit={submit}>
        <div className="analyze-main">
          <section className="panel analyze-panel">
            <div className="panel-title-row">
              <div className="step-badge">01</div>
              <div>
                <h2>Upload your resume</h2>
                <p>PDF or DOCX · Up to 5 MB</p>
              </div>
            </div>
            <div
              className={`dropzone ${drag ? "dragging" : ""} ${file ? "has-file" : ""}`}
              onDragOver={(e) => {
                e.preventDefault();
                setDrag(true);
              }}
              onDragLeave={() => setDrag(false)}
              onDrop={drop}
              onClick={() => !file && input.current?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && input.current?.click()}
            >
              <input
                ref={input}
                type="file"
                accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                hidden
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  accept(e.target.files?.[0])
                }
              />
              {file ? (
                <div className="uploaded-file">
                  <div className="upload-file-icon">
                    <FileText size={21} />
                  </div>
                  <div className="file-meta">
                    <b>{file.name}</b>
                    <span>
                      {(file.size / 1024).toFixed(0)} KB · Ready to analyze
                    </span>
                    <div className="file-progress">
                      <i style={{ width: "100%" }} />
                    </div>
                  </div>
                  <button
                    type="button"
                    className="remove-file"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                      if (input.current) input.current.value = "";
                    }}
                    aria-label="Remove file"
                  >
                    <X size={17} />
                  </button>
                </div>
              ) : (
                <>
                  <div className="upload-cloud">
                    <CloudUpload size={24} />
                  </div>
                  <b>Drag and drop your resume here</b>
                  <span>
                    or <em>browse files</em> from your device
                  </span>
                  <small>PDF or DOCX · Maximum file size 5 MB</small>
                </>
              )}
            </div>
            <div className="upload-privacy">
              <LockKeyhole size={14} /> Your file is processed for this request
              and isn't persistently stored by this demo.
            </div>
          </section>
          <section className="panel analyze-panel">
            <div className="panel-title-row">
              <div className="step-badge">02</div>
              <div>
                <h2>Tell us about the role</h2>
                <p>Provide details so we can tailor your analysis.</p>
              </div>
            </div>
            <div className="form-row">
              <label>
                Job title <span>Optional</span>
                <input
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Junior Data Analyst"
                />
              </label>
              <label>
                Company <span>Optional</span>
                <input
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Northstar Labs"
                />
              </label>
            </div>
            <label className="field-label">
              Job description <span className="required">Required</span>
              <textarea
                rows={8}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here. Include responsibilities, skills, and qualifications to get the most relevant comparison..."
              />
            </label>
            <label className="field-label">
              Skills to prioritize <span>Optional · comma-separated</span>
              <input
                value={requiredSkills}
                onChange={(e) => setRequiredSkills(e.target.value)}
                placeholder="e.g. SQL, Python, stakeholder communication"
              />
            </label>
            <div className="form-footnote">
              <span>{jobDescription.length}/30,000 characters</span>
              <span>
                Job details are sent to your configured API for analysis.
              </span>
            </div>
          </section>
          {error && (
            <div className="alert-error">
              <AlertCircle size={17} />
              {error}
            </div>
          )}
          {loading && (
            <div className="loading-card">
              <div className="loading-head">
                <span className="spinner">
                  <LoaderCircle size={18} />
                </span>
                <div>
                  <b>{stages[stage]}...</b>
                  <small>Your report is being prepared</small>
                </div>
                <strong>{progress}%</strong>
              </div>
              <div className="loadbar">
                <i style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}
          <div className="analyze-submit">
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <LoaderCircle className="spin" size={17} /> Analyzing...
                </>
              ) : (
                <>
                  Analyze my resume <Sparkles size={16} />
                </>
              )}
            </Button>
            <span>No score is shown until analysis is complete.</span>
          </div>
        </div>
        <aside className="analyze-side">
          <div className="side-info-card">
            <div className="side-info-icon">
              <Sparkles size={18} />
            </div>
            <h3>What you'll get</h3>
            <ul>
              {[
                "An explainable resume quality score",
                "Estimated ATS compatibility checks",
                "Job match and skill gap analysis",
                "Specific, resume-grounded recommendations",
              ].map((x) => (
                <li key={x}>
                  <CheckCircle2 size={15} />
                  {x}
                </li>
              ))}
            </ul>
          </div>
          <div className="side-info-card methodology">
            <div className="side-info-icon">
              <BarChart3 size={18} />
            </div>
            <h3>Transparent scoring</h3>
            <p>
              Scores use section structure, skill coverage, experience evidence,
              TF-IDF keyword similarity, and readability checks. They are
              estimates, never hiring guarantees.
            </p>
            <Link to="/scoring">
              Read the scoring guide <ArrowUpRight size={13} />
            </Link>
          </div>
          <div className="privacy-card">
            <ShieldCheck size={19} />
            <b>Privacy first</b>
            <p>
              The local API doesn't store your uploaded resume or extracted
              text.
            </p>
          </div>
        </aside>
      </form>
    </>
  );
}

function ResultsPage() {
  const { pathname } = useLocation();
  const id = pathname.split("/").pop() || "";
  const [a, setA] = useState<Analysis | null>(
    () => loadAnalyses().find((x) => x.analysis_id === id) || null,
  );
  const [toast, setToast] = useState("");
  useEffect(() => {
    const fresh = loadAnalyses().find((x) => x.analysis_id === id);
    if (fresh) setA(fresh);
  }, [id]);
  if (!a)
    return (
      <div className="not-found">
        <div className="empty-icon">
          <FileText />
        </div>
        <h2>We couldn't find that report</h2>
        <p>
          It may have been removed from this browser or opened on a different
          device.
        </p>
        <Button to="/history">View analyses</Button>
      </div>
    );
  const bars = Object.entries(a.score_breakdown).map(([name, value]) => ({
    name: name.replaceAll("_", " "),
    score: value,
  }));
  const radar = Object.entries(a.job_match_breakdown).map(([name, value]) => ({
    subject: name.replaceAll("_", " "),
    A: value,
    fullMark: 100,
  }));
  const sectionScores = Object.entries(a.sections).map(
    ([name, section]: any) => ({
      name: name[0].toUpperCase() + name.slice(1),
      score: section.score,
    }),
  );
  function download() {
    window.print();
  }
  return (
    <>
      <div className="results-top">
        <div>
          <Link to="/history" className="back-link">
            <ChevronRight size={14} /> All analyses
          </Link>
          <div className="eyebrow">ANALYSIS REPORT</div>
          <h1>
            {a.job_title
              ? `Your fit for ${a.job_title}`
              : "Your resume analysis"}
          </h1>
          <p>
            {a.filename}
            {a.company_name ? ` · ${a.company_name}` : ""} ·{" "}
            {a.resume_word_count} words
          </p>
        </div>
        <div className="results-actions">
          <Button variant="outline" onClick={download}>
            <Download size={15} /> Download report
          </Button>
          <Button to="/analyze">
            <Plus size={15} /> New analysis
          </Button>
        </div>
      </div>
      <div className="report-disclaimer">
        <AlertCircle size={15} /> These scores are explainable estimates based
        on the uploaded text. They don't predict hiring decisions or guarantee
        ATS outcomes.
      </div>
      <div className="score-hero-grid">
        <div className="panel score-main">
          <div
            className="score-ring large"
            style={{ "--score": `${a.resume_score * 3.6}deg` } as any}
          >
            <div>
              <b>{a.resume_score}</b>
              <small>/100</small>
            </div>
          </div>
          <div className="score-main-text">
            <span className="score-label">OVERALL RESUME SCORE</span>
            <h2>
              {a.resume_score >= 80
                ? "Strong foundation"
                : a.resume_score >= 60
                  ? "Room to strengthen"
                  : "Start with the essentials"}
            </h2>
            <p>
              Based on structure, skills, evidence, keyword fit, and
              readability.
            </p>
            <div className="mini-pill">
              <Sparkles size={13} /> Explainable score
            </div>
          </div>
        </div>
        <div className="score-side-cards">
          <div className="panel small-score">
            <div className="small-score-icon purple-bg">
              <Target size={18} />
            </div>
            <div>
              <span>JOB MATCH</span>
              <b>
                {a.job_match_score}
                <small>/100</small>
              </b>
            </div>
            <div className="mini-bar">
              <i style={{ width: `${a.job_match_score}%` }} />
            </div>
          </div>
          <div className="panel small-score">
            <div className="small-score-icon mint-bg">
              <ShieldCheck size={18} />
            </div>
            <div>
              <span>ATS ESTIMATE</span>
              <b>
                {a.ats_score}
                <small>/100</small>
              </b>
            </div>
            <div className="mini-bar mint-bar">
              <i style={{ width: `${a.ats_score}%` }} />
            </div>
          </div>
        </div>
      </div>
      <div className="results-grid">
        <section className="panel result-panel">
          <div className="panel-head">
            <div>
              <h2>Score breakdown</h2>
              <p>Resume quality components, weighted per our scoring model</p>
            </div>
            <Link
              to="/scoring"
              className="info-dot"
              title="Scoring methodology"
            >
              i
            </Link>
          </div>
          <div className="score-bars">
            {bars.map((b) => (
              <div className="score-bar-row" key={b.name}>
                <span>{b.name.replace(/\b\w/g, (m) => m.toUpperCase())}</span>
                <div className="horizontal-bar">
                  <i style={{ width: `${b.score}%` }} />
                </div>
                <b>{b.score}</b>
              </div>
            ))}
          </div>
          <div className="weight-note">
            Structure 20% · Skills relevance 25% · Project &amp; experience 25%
            · Keywords 15% · Readability &amp; completeness 15%
          </div>
        </section>
        <section className="panel result-panel">
          <div className="panel-head">
            <div>
              <h2>Role match signals</h2>
              <p>Signals that contribute to your job match score</p>
            </div>
          </div>
          <div className="radar-wrap">
            <ResponsiveContainer width="100%" height={230}>
              <RadarChart data={radar} outerRadius="72%">
                <PolarGrid stroke="#eceef4" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: "#71798b", fontSize: 10 }}
                />
                <Radar
                  dataKey="A"
                  stroke="#7b6af5"
                  fill="#7b6af5"
                  fillOpacity={0.17}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
      <div className="results-grid">
        <section className="panel result-panel skill-result">
          <div className="panel-head">
            <div>
              <h2>Skills match</h2>
              <p>Detected skills compared with job requirements</p>
            </div>
            <span className="result-count">
              {a.skills.matched.length} matched
            </span>
          </div>
          {a.skills.required.length === 0 ? (
            <div className="no-req">
              <Search size={18} />
              <span>
                No recognizable skills were found in the job description. Add
                specific requirements to get a deeper skill comparison.
              </span>
            </div>
          ) : (
            <>
              <div className="skill-columns">
                <div>
                  <h3>
                    <span className="skill-state match-state">
                      <Check size={12} />
                    </span>{" "}
                    Matching skills <b>{a.skills.matched.length}</b>
                  </h3>
                  <div className="tag-list">
                    {a.skills.matched.length ? (
                      a.skills.matched.map((s) => (
                        <span className="skill-tag matched" key={s}>
                          {s}
                        </span>
                      ))
                    ) : (
                      <small>No matched skills detected.</small>
                    )}
                  </div>
                </div>
                <div>
                  <h3>
                    <span className="skill-state missing-state">
                      <X size={12} />
                    </span>{" "}
                    Skills to address <b>{a.skills.missing.length}</b>
                  </h3>
                  <div className="tag-list">
                    {a.skills.missing.length ? (
                      a.skills.missing.map((s) => (
                        <span className="skill-tag missing" key={s}>
                          {s}
                        </span>
                      ))
                    ) : (
                      <small>All detected requirements matched.</small>
                    )}
                  </div>
                </div>
              </div>
              <p className="skill-footnote">
                Skills are identified from a curated vocabulary and exact
                contextual text matches. Related phrasing may not be detected.
              </p>
            </>
          )}
        </section>
        <section className="panel result-panel">
          <div className="panel-head">
            <div>
              <h2>ATS readiness checks</h2>
              <p>Estimated parsing and content signals</p>
            </div>
          </div>
          <div className="check-list">
            {[
              ["Contact email", a.ats_checks.email_present],
              ["Phone number", a.ats_checks.phone_present],
              ["Work experience", a.ats_checks.work_experience_present],
              ["Education", a.ats_checks.education_present],
              ["Skills section", a.ats_checks.skills_section_present],
              ["Readability estimate", `${a.ats_checks.readability_score}/100`],
              ["Formatting review", a.ats_checks.formatting_consistency],
              [
                "Standard sections",
                `${a.ats_checks.section_headings}/${a.ats_checks.total_recommended_sections}`,
              ],
            ].map(([name, ok]: any) => (
              <div className="check-row" key={name}>
                <span
                  className={`check-status ${typeof ok === "boolean" ? (ok ? "yes" : "no") : "info"}`}
                >
                  {typeof ok !== "boolean" ? (
                    <Activity size={12} />
                  ) : ok ? (
                    <Check size={12} />
                  ) : (
                    <AlertCircle size={12} />
                  )}
                </span>
                <span>{name}</span>
                <b>
                  {typeof ok === "boolean"
                    ? ok
                      ? "Detected"
                      : "Not detected"
                    : ok}
                </b>
              </div>
            ))}
          </div>
          <div className="ats-note">
            {a.ats_checks.formatting_hint} ATS tools differ; this is not a
            pass/fail prediction.
          </div>
        </section>
      </div>
      <section className="panel result-panel sections-result">
        <div className="panel-head">
          <div>
            <h2>Resume section analysis</h2>
            <p>Basic section detection and completeness review</p>
          </div>
        </div>
        <div className="section-score-chart">
          <ResponsiveContainer width="100%" height={165}>
            <BarChart
              data={sectionScores}
              layout="vertical"
              margin={{ left: 8, right: 16 }}
            >
              <XAxis type="number" domain={[0, 100]} hide />
              <YAxis
                type="category"
                dataKey="name"
                width={88}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#737b8d", fontSize: 9 }}
              />
              <Tooltip />
              <Bar
                dataKey="score"
                name="Section score"
                fill="#7868ef"
                radius={[0, 5, 5, 0]}
                barSize={11}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="section-cards">
          {Object.entries(a.sections).map(([name, s]: any) => (
            <div className="section-analysis-card" key={name}>
              <div className="section-analysis-title">
                <div
                  className={`section-status-icon ${s.present ? "is-present" : ""}`}
                >
                  {s.present ? <Check size={14} /> : <Plus size={14} />}
                </div>
                <div>
                  <b>{name[0].toUpperCase() + name.slice(1)}</b>
                  <small>{s.present ? "Detected" : "Not detected"}</small>
                </div>
                <span>{s.score}</span>
              </div>
              {s.present &&
                s.strengths.map((x: string) => (
                  <p className="section-strength" key={x}>
                    {x}
                  </p>
                ))}
              {s.weaknesses.map((x: string) => (
                <p className="section-weakness" key={x}>
                  {x}
                </p>
              ))}
              {s.suggestions.map((x: string) => (
                <p className="section-suggest" key={x}>
                  {x}
                </p>
              ))}
            </div>
          ))}
        </div>
      </section>
      <div className="results-grid">
        <section className="panel result-panel recommendations">
          <div className="panel-head">
            <div>
              <h2>Recommendations for your next draft</h2>
              <p>Specific next steps based on the content we detected</p>
            </div>
            <div className="rec-bulb">
              <Lightbulb size={18} />
            </div>
          </div>
          {a.strengths.length > 0 && (
            <div className="strength-box">
              <b>
                <CheckCircle2 size={15} /> Working well
              </b>
              {a.strengths.map((s) => (
                <p key={s}>{s}</p>
              ))}
            </div>
          )}
          <ul className="recommendation-list">
            {a.recommendations.map((r, i) => (
              <li key={r}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                {r}
              </li>
            ))}
          </ul>
        </section>
        <section className="panel method-panel">
          <div className="method-icon">
            <Workflow size={18} />
          </div>
          <h3>How we analyzed this</h3>
          <p>{a.analysis_method}</p>
          <div className="method-divider" />
          <p className="privacy-note">
            <LockKeyhole size={13} /> {a.privacy_note}
          </p>
          <Link to="/scoring" className="inline-link">
            Scoring methodology <ArrowRight size={14} />
          </Link>
        </section>
      </div>
      <div className="results-bottom-cta">
        <div>
          <b>Ready to turn feedback into a stronger draft?</b>
          <span>Use the resume improver for a grounded wording pass.</span>
        </div>
        <Button to="/improve">
          Open resume improver <ArrowRight size={15} />
        </Button>
      </div>
      <div className="print-footer">
        ResumeIQ analysis · A heuristic guide only, not a hiring guarantee.
      </div>
    </>
  );
}

function HistoryPage() {
  const [items, setItems] = useState<Analysis[]>(loadAnalyses);
  function remove(id: string) {
    const next = items.filter((a) => a.analysis_id !== id);
    localStorage.setItem(STORAGE, JSON.stringify(next));
    setItems(next);
  }
  return (
    <>
      <PageTitle
        eyebrow="YOUR REPORTS"
        title="Analysis history"
        desc="Reports saved locally in this browser. They're not synced to another device."
        action={
          <Button to="/analyze">
            <Plus size={15} /> New analysis
          </Button>
        }
      />
      {items.length ? (
        <div className="history-list">
          {items.map((a) => (
            <div className="panel history-item" key={a.analysis_id}>
              <div className="history-file-icon">
                <FileText size={20} />
              </div>
              <div className="history-details">
                <b>{a.filename}</b>
                <span>
                  {a.job_title || "Untitled role"}
                  {a.company_name ? ` · ${a.company_name}` : ""} ·{" "}
                  {a.resume_word_count} words
                </span>
              </div>
              <div className="history-score">
                <small>RESUME</small>
                <ScorePill score={a.resume_score} />
              </div>
              <div className="history-score">
                <small>JOB MATCH</small>
                <ScorePill score={a.job_match_score} />
              </div>
              <Link
                className="icon-action"
                to={`/results/${a.analysis_id}`}
                aria-label="Open report"
              >
                <ArrowUpRight size={17} />
              </Link>
              <button
                className="icon-action danger"
                onClick={() => remove(a.analysis_id)}
                aria-label="Delete report"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="panel empty-state">
          <div className="empty-icon">
            <History />
          </div>
          <h2>Your history is waiting</h2>
          <p>
            Once you run an analysis, reports will be saved on this device for
            quick reference.
          </p>
          <Button to="/analyze">
            Analyze a resume <ArrowRight size={15} />
          </Button>
        </div>
      )}
    </>
  );
}

function Improver() {
  const [original, setOriginal] = useState("");
  const [improved, setImproved] = useState("");
  const [engine, setEngine] = useState<"rules" | "ollama" | null>(null);
  const [mode, setMode] = useState("summary");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  async function generate() {
    setError("");
    setInfo("");
    if (!original.trim()) {
      setError("Paste a summary or bullet point to improve.");
      return;
    }
    setLoading(true);
    try {
      const r = await improveText(original, mode);
      setEngine(r.engine);
      setImproved(r.changed ? r.improved : "");
      setInfo(r.method);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }
  async function copy() {
    try {
      await navigator.clipboard.writeText(improved);
      setError("");
      setInfo("Copied improved text to clipboard.");
    } catch {
      setError("Clipboard access is unavailable in this browser.");
    }
  }
  function applyChanges() {
    setOriginal(improved);
    setImproved("");
    setEngine(null);
    setInfo(
      "Applied the draft to your original text. You can continue editing or regenerate another pass.",
    );
    setError("");
  }
  function download() {
    const blob = new Blob([improved], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "resumeiq-improved-draft.txt";
    a.click();
    URL.revokeObjectURL(a.href);
  }
  return (
    <>
      <PageTitle
        eyebrow="RESUME IMPROVER"
        title="Make your experience read stronger."
        desc="Polish wording while keeping your real experience and qualifications intact."
      />
      <div className="notice-banner">
        <ShieldCheck size={17} />
        <div>
          <b>Grounded drafts, carefully reviewed</b>
          <span>
            Ollama is prompted to preserve your facts; an LLM can still make
            mistakes. Verify every claim before using the draft.
          </span>
        </div>
      </div>
      <div className="panel improve-controls">
        <label>
          What are you working on?
          <select value={mode} onChange={(e) => setMode(e.target.value)}>
            <option value="summary">Professional summary</option>
            <option value="project">Project description</option>
            <option value="bullet">Achievement bullet</option>
            <option value="grammar">Grammar and clarity</option>
          </select>
        </label>
        <p>
          Local Ollama LLM when enabled · No paid AI API; rules fallback
          otherwise
        </p>
      </div>
      <div className="improve-grid">
        <section className="panel text-editor">
          <div className="editor-head">
            <div>
              <span className="editor-step">01 / ORIGINAL</span>
              <h2>Your original text</h2>
            </div>
            <button
              onClick={() => {
                setOriginal("");
                setImproved("");
                setEngine(null);
              }}
              className="clear-btn"
            >
              <RefreshCw size={14} /> Clear
            </button>
          </div>
          <textarea
            rows={12}
            value={original}
            onChange={(e) => setOriginal(e.target.value)}
            placeholder="Paste a professional summary, project description, or a bullet point here. Add only details that are true to your experience."
          />
          <div className="editor-foot">
            <span>{original.length}/12,000</span>
            <Button onClick={generate} disabled={loading}>
              {loading ? (
                <>
                  <LoaderCircle className="spin" size={15} /> Improving...
                </>
              ) : (
                <>
                  Generate improvement <Sparkles size={15} />
                </>
              )}
            </Button>
          </div>
        </section>
        <section className="panel text-editor improved-editor">
          <div className="editor-head">
            <div>
              <span className="editor-step">02 / REFINED DRAFT</span>
              <h2>Improved version</h2>
            </div>
            {improved && (
              <span className="draft-badge">
                <Check size={12} />{" "}
                {engine === "ollama" ? "Local LLM draft" : "Rules draft"}
              </span>
            )}
          </div>
          {improved ? (
            <div className="improved-text">{improved}</div>
          ) : (
            <div className="improved-placeholder">
              <div className="placeholder-spark">
                <Sparkles size={20} />
              </div>
              <b>Your refined draft will appear here</b>
              <p>
                Review every change and make sure it accurately reflects your
                experience.
              </p>
            </div>
          )}
          <div className="editor-foot">
            {improved ? (
              <>
                <span className="method-disclaimer">
                  {engine === "ollama" ? (
                    <AlertCircle size={12} />
                  ) : (
                    <LockKeyhole size={12} />
                  )}
                  {engine === "ollama"
                    ? "LLM output · verify claims"
                    : "Rule-based · no new facts"}
                </span>
                <div className="editor-buttons">
                  <button
                    className="btn btn-outline small-btn"
                    onClick={applyChanges}
                  >
                    <Check size={14} /> Apply
                  </button>
                  <button className="btn btn-outline small-btn" onClick={copy}>
                    <Copy size={14} /> Copy
                  </button>
                  <button
                    className="btn btn-primary small-btn"
                    onClick={download}
                  >
                    <Download size={14} /> Download
                  </button>
                </div>
              </>
            ) : (
              <span>Nothing generated yet</span>
            )}
          </div>
        </section>
      </div>
      {(error || info) && (
        <div className={error ? "alert-error" : "alert-info"}>
          {error || info}
        </div>
      )}
      <div className="improver-note">
        <Lightbulb size={16} />
        <span>
          Tip: Add context such as your audience, tools, and outcome before
          improving. If you have a metric, include it yourself—ResumeIQ won't
          make one up.
        </span>
      </div>
    </>
  );
}

const resourceMap: Record<
  string,
  { path: string[]; links: { label: string; url: string }[] }
> = {
  python: {
    path: [
      "Python syntax & core concepts",
      "Build small scripts and use packages",
      "Create a data or automation project",
    ],
    links: [
      {
        label: "Python for Everybody · free course",
        url: "https://www.py4e.com/",
      },
      {
        label: "Official Python tutorial",
        url: "https://docs.python.org/3/tutorial/",
      },
    ],
  },
  sql: {
    path: [
      "Query basics: SELECT, WHERE, JOIN",
      "Aggregations and subqueries",
      "Practice with a real dataset",
    ],
    links: [
      { label: "SQLBolt · interactive lessons", url: "https://sqlbolt.com/" },
      {
        label: "PostgreSQL tutorial",
        url: "https://www.postgresql.org/docs/current/tutorial.html",
      },
    ],
  },
  docker: {
    path: [
      "Container fundamentals",
      "Build images and run containers",
      "Containerize a small application",
    ],
    links: [
      {
        label: "Docker Get Started",
        url: "https://docs.docker.com/get-started/",
      },
    ],
  },
  kubernetes: {
    path: [
      "Container concepts first",
      "Deployments, services, and pods",
      "Practice a local cluster project",
    ],
    links: [
      {
        label: "Kubernetes Basics",
        url: "https://kubernetes.io/docs/tutorials/kubernetes-basics/",
      },
    ],
  },
  react: {
    path: [
      "Components, props, and state",
      "Hooks and data fetching",
      "Build and deploy a portfolio app",
    ],
    links: [{ label: "React Learn", url: "https://react.dev/learn" }],
  },
  aws: {
    path: [
      "Cloud fundamentals and IAM",
      "Core compute and storage services",
      "Build a small cloud-hosted project",
    ],
    links: [
      {
        label: "AWS Skill Builder · free digital training",
        url: "https://skillbuilder.aws/",
      },
    ],
  },
  "machine learning": {
    path: [
      "Python, statistics, and data prep",
      "Supervised learning and evaluation",
      "Build and document a small model",
    ],
    links: [
      {
        label: "Google Machine Learning Crash Course",
        url: "https://developers.google.com/machine-learning/crash-course",
      },
      {
        label: "scikit-learn tutorials",
        url: "https://scikit-learn.org/stable/tutorial/index.html",
      },
    ],
  },
  "data structures": {
    path: [
      "Arrays, strings, and hash maps",
      "Trees, graphs, and complexity",
      "Solve problems and explain trade-offs",
    ],
    links: [
      {
        label: "Open Data Structures · free book",
        url: "https://opendatastructures.org/",
      },
    ],
  },
  communication: {
    path: [
      "Practice concise written updates",
      "Present a project to a peer",
      "Ask for feedback and iterate",
    ],
    links: [
      {
        label: "Toastmasters · find a local club",
        url: "https://www.toastmasters.org/find-a-club",
      },
    ],
  },
};
function SkillsPage() {
  const analyses = loadAnalyses();
  const missing = [...new Set(analyses.flatMap((a) => a.skills.missing))];
  const matched = [...new Set(analyses.flatMap((a) => a.skills.matched))];
  const suggestions = missing.slice(0, 8);
  return (
    <>
      <PageTitle
        eyebrow="SKILL ROADMAP"
        title="Make your next skill count."
        desc="A practical learning plan based on skill gaps detected in your saved analyses."
        action={
          <Button to="/analyze" variant="outline">
            <Plus size={15} /> Analyze another role
          </Button>
        }
      />
      {suggestions.length ? (
        <div className="roadmap-intro">
          <div>
            <div className="roadmap-icon">
              <Target size={20} />
            </div>
            <div>
              <b>
                {suggestions.length} skill{suggestions.length === 1 ? "" : "s"}{" "}
                to explore
              </b>
              <span>
                Prioritized from the roles you've analyzed on this device.
              </span>
            </div>
          </div>
          <span className="roadmap-local">
            <LockKeyhole size={12} /> From your local reports
          </span>
        </div>
      ) : (
        <div className="panel roadmap-empty">
          <div className="empty-icon">
            <BookOpen />
          </div>
          <h2>Your learning roadmap starts with a role</h2>
          <p>
            Analyze a resume against a job description to surface a personalized
            list of skill gaps.
          </p>
          <Button to="/analyze">
            Analyze a role <ArrowRight size={15} />
          </Button>
        </div>
      )}
      {suggestions.map((s, i) => {
        const data = resourceMap[s.toLowerCase()] || {
          path: [
            `Learn the foundations of ${s}`,
            "Practice with guided exercises",
            "Build a small portfolio project that demonstrates the skill",
          ],
          links: [
            {
              label: `Search freeCodeCamp learning resources for ${s}`,
              url: "https://www.freecodecamp.org/learn/",
            },
            {
              label: `Explore ${s} documentation and tutorials`,
              url: "https://developer.mozilla.org/",
            },
          ],
        };
        return (
          <div className="panel roadmap-card" key={s}>
            <div className="roadmap-rank">{String(i + 1).padStart(2, "0")}</div>
            <div className="roadmap-content">
              <div className="roadmap-title">
                <div>
                  <span className="roadmap-kicker">
                    PRIORITY {i < 3 ? "HIGH" : "NEXT"}
                  </span>
                  <h2>{s}</h2>
                </div>
                <span className="gap-badge">Detected as missing</span>
              </div>
              <div className="learning-path">
                <div className="path-label">
                  <span>FOUNDATION</span>
                  <span>BUILD</span>
                  <span>DEMONSTRATE</span>
                </div>
                <div className="path-track">
                  <i />
                </div>
                <div className="path-steps">
                  {data.path.map((p, j) => (
                    <p key={p}>
                      <span>{j + 1}</span>
                      {p}
                    </p>
                  ))}
                </div>
              </div>
              <div className="resource-links">
                <b>
                  <BookOpen size={14} /> Free learning resources
                </b>
                {data.links.map((l) => (
                  <a key={l.url} href={l.url} target="_blank" rel="noreferrer">
                    {l.label}
                    <ArrowUpRight size={13} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        );
      })}
      {matched.length > 0 && (
        <section className="panel current-skills">
          <div className="panel-head">
            <div>
              <h2>Skills already present</h2>
              <p>Detected as matching across your saved analyses.</p>
            </div>
            <CheckCircle2 size={19} className="green-icon" />
          </div>
          <div className="tag-list">
            {matched.map((s) => (
              <span className="skill-tag matched" key={s}>
                {s}
              </span>
            ))}
          </div>
        </section>
      )}
      <p className="roadmap-footnote">
        Skill suggestions are based on exact matches against a curated
        vocabulary. They don't imply that you need every listed skill for a
        role.
      </p>
    </>
  );
}

function Profile() {
  const [items, setItems] = useState<Analysis[]>(loadAnalyses);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authUser, setAuthUser] = useState<any>(null);
  useEffect(() => {
    if (supabase)
      supabase.auth.getUser().then(({ data }) => setAuthUser(data.user));
  }, []);
  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    if (!supabase) {
      setMessage(
        "Supabase is not configured. This workspace is in local-only mode; reports remain in this browser.",
      );
      return;
    }
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) setMessage(error.message);
    else {
      const { data } = await supabase.auth.getUser();
      setAuthUser(data.user);
      setMessage(
        "Signed in. Note: database-backed report sync still requires Supabase policies and backend integration.",
      );
    }
  }
  async function signOut() {
    if (supabase) await supabase.auth.signOut();
    setAuthUser(null);
    setMessage("Signed out.");
  }
  function clear() {
    if (
      confirm(
        "Permanently delete all ResumeIQ reports saved in this browser? This cannot be undone.",
      )
    ) {
      localStorage.removeItem(STORAGE);
      setItems([]);
      setMessage("All local analysis reports were deleted.");
    }
  }
  return (
    <>
      <PageTitle
        eyebrow="PROFILE & SETTINGS"
        title="Your workspace, your way."
        desc="Manage local reports, account connection, and privacy settings."
      />
      <div className="profile-grid">
        <section className="panel profile-card">
          <div className="profile-head">
            <div className="profile-avatar">
              {authUser?.email?.[0]?.toUpperCase() || "G"}
            </div>
            <div>
              <h2>{authUser?.email || "Guest workspace"}</h2>
              <p>
                {authUser
                  ? "Supabase authenticated"
                  : "Local-only mode · This device"}
              </p>
            </div>
            <span className={`account-status ${authUser ? "connected" : ""}`}>
              <i />
              {authUser ? "Connected" : "Local"}
            </span>
          </div>
          <div className="profile-divider" />
          <div className="profile-stat-row">
            <div>
              <b>{items.length}</b>
              <span>Saved reports</span>
            </div>
            <div>
              <b>{new Set(items.flatMap((a) => a.skills.identified)).size}</b>
              <span>Unique skills</span>
            </div>
            <div>
              <b>0</b>
              <span>Files stored on server</span>
            </div>
          </div>
          {supabase ? (
            <form className="auth-inline" onSubmit={signIn}>
              <h3>{authUser ? "Account connected" : "Connect your account"}</h3>
              {!authUser && (
                <>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                  />
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password (8+ characters)"
                  />
                  <button className="btn btn-primary" type="submit">
                    <LogIn size={14} /> Sign in
                  </button>
                </>
              )}
              {authUser && (
                <button
                  className="btn btn-outline"
                  type="button"
                  onClick={signOut}
                >
                  Sign out
                </button>
              )}
            </form>
          ) : (
            <div className="config-hint">
              <LockKeyhole size={15} />
              <span>
                To enable sign-in, add your Supabase project URL and anon key to{" "}
                <code>frontend/.env</code>. Never add a service-role key here.
              </span>
            </div>
          )}
          {message && <div className="alert-info">{message}</div>}
        </section>
        <section className="panel settings-card">
          <div className="settings-heading">
            <div className="settings-icon">
              <ShieldCheck size={17} />
            </div>
            <div>
              <h2>Privacy & data</h2>
              <p>Your resume documents are not stored by this local API.</p>
            </div>
          </div>
          <div className="setting-row">
            <div>
              <b>Local report history</b>
              <span>Stored in browser local storage on this device.</span>
            </div>
            <button className="btn btn-danger-outline" onClick={clear}>
              <Trash2 size={14} /> Delete all reports
            </button>
          </div>
          <div className="setting-row">
            <div>
              <b>Uploaded resume files</b>
              <span>
                Files are processed per request; the demo backend does not
                persist the original file.
              </span>
            </div>
            <span className="setting-value">Not stored</span>
          </div>
          <div className="setting-row">
            <div>
              <b>Account deletion</b>
              <span>
                Supabase account deletion must be handled through your
                configured project.
              </span>
            </div>
            <span className="setting-value">Not configured</span>
          </div>
        </section>
      </div>
      <div className="profile-footnote">
        <AlertCircle size={15} /> Cloud account authentication, server-side
        history, and account deletion require connecting Supabase and completing
        the backend JWT/database adapter configuration documented in README.
      </div>
    </>
  );
}

function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase) {
      setMsg(
        "Supabase auth is not configured yet. You can continue in local mode; the account form will work once you add your project URL and anon key.",
      );
      return;
    }
    const result =
      mode === "login"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });
    if (result.error) setMsg(result.error.message);
    else {
      setMsg(
        mode === "signup"
          ? "Account created. Check your email if confirmation is enabled."
          : "Welcome back.",
      );
      if (mode === "login") navigate("/dashboard");
    }
  }
  async function resetPassword() {
    setMsg("");
    if (!email) {
      setMsg("Enter your email address above before requesting a reset link.");
      return;
    }
    if (!supabase) {
      setMsg("Password reset needs your configured Supabase Auth project.");
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    });
    setMsg(
      error
        ? error.message
        : "If this email is registered, a reset link has been sent.",
    );
  }
  return (
    <>
      <Header />
      <main className="auth-page">
        <div className="auth-art">
          <div className="auth-art-inner">
            <div className="auth-orbit orbit-a" />
            <div className="auth-orbit orbit-b" />
            <div className="auth-doc">
              <FileText size={36} />
              <Sparkles className="auth-spark" size={18} />
            </div>
            <h2>Your next chapter starts here.</h2>
            <p>
              Get thoughtful, practical insights to help your resume tell your
              story.
            </p>
            <div className="auth-points">
              <span>
                <CheckCircle2 size={15} /> Explainable feedback
              </span>
              <span>
                <CheckCircle2 size={15} /> Privacy-first analysis
              </span>
              <span>
                <CheckCircle2 size={15} /> Free and open source
              </span>
            </div>
          </div>
        </div>
        <div className="auth-form-area">
          <div className="auth-form">
            <Logo />
            <div className="eyebrow">WELCOME TO RESUMEIQ</div>
            <h1>{mode === "login" ? "Welcome back" : "Create your account"}</h1>
            <p className="auth-sub">
              {mode === "login"
                ? "Sign in to your ResumeIQ workspace."
                : "Start building a clearer career story."}
            </p>
            <div className="auth-tabs">
              <button
                className={mode === "login" ? "selected" : ""}
                onClick={() => setMode("login")}
              >
                Log in
              </button>
              <button
                className={mode === "signup" ? "selected" : ""}
                onClick={() => setMode("signup")}
              >
                Create account
              </button>
            </div>
            <form onSubmit={submit}>
              <label>
                Email address
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </label>
              <label>
                Password
                <input
                  required
                  type="password"
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                />
              </label>
              <div className="password-hint">
                <LockKeyhole size={13} /> Use at least 8 characters.
                {mode === "login" && (
                  <button
                    className="forgot-link"
                    type="button"
                    onClick={resetPassword}
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <button className="btn btn-primary auth-submit" type="submit">
                {mode === "login" ? "Sign in" : "Create account"}{" "}
                <ArrowRight size={15} />
              </button>
            </form>
            {msg && <div className="alert-info">{msg}</div>}
            <div className="auth-or">
              <span /> or <span />
            </div>
            <Button variant="outline" className="full-width" to="/dashboard">
              Continue in local mode <ArrowRight size={14} />
            </Button>
            <p className="auth-terms">
              By continuing, you agree to use your analysis as guidance only. No
              hiring outcome is guaranteed.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function Scoring() {
  return (
    <>
      <PageTitle
        eyebrow="TRANSPARENT BY DESIGN"
        title="How ResumeIQ scores your resume."
        desc="Scores are heuristic estimates computed with local, explainable methods—not a hiring prediction."
      />
      <div className="scoring-layout">
        <section className="panel score-method-card">
          <div className="panel-head">
            <div>
              <h2>Resume quality score</h2>
              <p>Weighted combination of five measurable dimensions</p>
            </div>
            <span className="score-pill medium">0–100</span>
          </div>
          {[
            [
              "Structure & sections",
              "20%",
              "Presence of common resume headings, contact details, and basic completeness.",
            ],
            [
              "Skills relevance",
              "25%",
              "Coverage of required skills plus whether matched skills appear in project or work evidence.",
            ],
            [
              "Project & experience relevance",
              "25%",
              "Presence of work and project sections with additional role-relevant evidence.",
            ],
            [
              "Keyword relevance",
              "15%",
              "TF-IDF cosine similarity between resume and job text; job keywords are not enough by themselves.",
            ],
            [
              "Readability & completeness",
              "15%",
              "Word count, approximate sentence length, bullet use, and common section coverage.",
            ],
          ].map(([name, weight, desc]) => (
            <div className="scoring-row" key={name}>
              <div>
                <b>{name}</b>
                <span>{desc}</span>
              </div>
              <strong>{weight}</strong>
            </div>
          ))}
        </section>
        <aside className="panel score-method-side">
          <div className="side-info-icon">
            <Target size={18} />
          </div>
          <h3>Separate job match</h3>
          <p>
            Job match is calculated separately: required skill coverage (40%),
            project/experience evidence (25%), TF-IDF text similarity (25%), and
            important keyword coverage (10%).
          </p>
          <div className="method-divider" />
          <h3>ATS estimate</h3>
          <p>
            A simple weighted check of section structure, readability, keyword
            relevance, completeness, and contact details. It cannot simulate any
            specific employer's ATS.
          </p>
          <div className="method-divider" />
          <h3>Important limitations</h3>
          <ul>
            <li>
              Skill extraction uses an editable curated vocabulary and exact
              phrase patterns.
            </li>
            <li>
              TF-IDF is not a deep language model; semantic equivalence can be
              missed.
            </li>
            <li>No score guarantees recruiter attention or an ATS pass.</li>
            <li>
              Never add a missing skill unless it truthfully describes your
              experience.
            </li>
          </ul>
        </aside>
      </div>
    </>
  );
}
function Privacy() {
  return (
    <>
      <PageTitle
        eyebrow="PRIVACY"
        title="Your resume data, clearly explained."
        desc="The local demo aims to minimize document retention."
      />
      <section className="panel privacy-copy">
        <h2>What happens to your resume?</h2>
        <p>
          When you upload a PDF or DOCX, the browser sends it to the configured
          ResumeIQ API. The API reads the file for the request, returns an
          analysis, and does not persist the original document or extracted
          text. Framework request buffering can use ephemeral temporary storage.
          The report is saved by the browser in local storage on this device.
        </p>
        <h3>What is not configured by default</h3>
        <p>
          Supabase account authentication, server-side report history, cloud
          storage, and account deletion integration require adding your own
          Supabase project keys and completing the backend
          authentication/database adapter. Do not treat this starter as a
          deployed production service until those items are completed and
          reviewed.
        </p>
        <h3>Third parties</h3>
        <p>
          The default analyzer does not call a paid AI service. Text comparison
          uses TF-IDF and deterministic rules within the API process. The
          external learning links on the Skill Roadmap lead to third-party
          sites.
        </p>
        <h3>Delete local reports</h3>
        <p>
          Use Profile &amp; settings → Delete all reports, or clear this
          website's browser data. Resume files are not retained by the default
          backend.
        </p>
      </section>
    </>
  );
}
function Terms() {
  return (
    <>
      <PageTitle
        eyebrow="TERMS"
        title="Guidance, not a guarantee."
        desc="Use ResumeIQ as a practical writing aid—not a hiring decision system."
      />
      <section className="panel privacy-copy">
        <h2>Informational use</h2>
        <p>
          ResumeIQ provides heuristic analysis and draft wording for
          informational and educational purposes. Scores, ATS checks, skill
          matches, and suggestions do not guarantee an interview, ATS pass, job
          offer, or any particular employment outcome.
        </p>
        <h3>Accuracy and user responsibility</h3>
        <p>
          Review all output before using it. You are responsible for ensuring
          that resume statements are accurate, truthful, and supported by your
          real experience. The ResumeIQ improver is conservative and does not
          verify claims.
        </p>
        <h3>Local demo limitations</h3>
        <p>
          This repository is a development starter. Account synchronization,
          server-side persistence, account deletion workflows, and production
          security controls require configuration and implementation. Do not use
          the demo as a production personal-data service without completing
          those steps.
        </p>
        <h3>Third-party services and learning links</h3>
        <p>
          External learning resources are provided for convenience and are
          governed by their own terms and privacy practices. ResumeIQ does not
          control those sites.
        </p>
      </section>
    </>
  );
}
function NotFound() {
  return (
    <div className="not-found">
      <div className="empty-icon">
        <Search />
      </div>
      <h2>Page not found</h2>
      <p>Let's get you back to your workspace.</p>
      <Button to="/dashboard">Go to dashboard</Button>
    </div>
  );
}
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<AuthPage />} />
      <Route
        path="/privacy"
        element={
          <AppLayout>
            <Privacy />
          </AppLayout>
        }
      />
      <Route
        path="/terms"
        element={
          <AppLayout>
            <Terms />
          </AppLayout>
        }
      />
      <Route
        path="/scoring"
        element={
          <AppLayout>
            <Scoring />
          </AppLayout>
        }
      />
      <Route
        path="/dashboard"
        element={
          <AppLayout>
            <Dashboard />
          </AppLayout>
        }
      />
      <Route
        path="/analyze"
        element={
          <AppLayout>
            <AnalyzePage />
          </AppLayout>
        }
      />
      <Route
        path="/results/:id"
        element={
          <AppLayout>
            <ResultsPage />
          </AppLayout>
        }
      />
      <Route
        path="/history"
        element={
          <AppLayout>
            <HistoryPage />
          </AppLayout>
        }
      />
      <Route
        path="/improve"
        element={
          <AppLayout>
            <Improver />
          </AppLayout>
        }
      />
      <Route
        path="/skills"
        element={
          <AppLayout>
            <SkillsPage />
          </AppLayout>
        }
      />
      <Route
        path="/profile"
        element={
          <AppLayout>
            <Profile />
          </AppLayout>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
