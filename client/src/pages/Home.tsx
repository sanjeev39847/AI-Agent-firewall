import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowDown,
  ArrowUpRight,
  Braces,
  Check,
  ChevronRight,
  CircleDot,
  ClipboardCheck,
  Clock3,
  Database,
  Eye,
  FileText,
  Gavel,
  LockKeyhole,
  Network,
  Play,
  Radio,
  RotateCcw,
  ScanLine,
  Send,
  ShieldAlert,
  ShieldCheck,
  Terminal,
  UserCheck,
  X,
  Zap,
} from "lucide-react";

const stages = [
  {
    id: "01",
    label: "Request intake",
    title: "Normalize request",
    detail: "Parse the prompt, attachments, links, identity and session into one traceable request envelope.",
    signal: "REQ-8F2A / session-bound",
    rule: "Every request gets a durable identity before it reaches the agent.",
    icon: FileText,
    tone: "cyan",
    action: "pass",
  },
  {
    id: "02",
    label: "Identity gate",
    title: "Authenticate & authorize",
    detail: "Validate the caller, tenant, role and requested data scope before any agent planning begins.",
    signal: "principal: operator@northstar",
    rule: "No identity, no inference. No scope, no tool.",
    icon: UserCheck,
    tone: "cyan",
    action: "pass",
  },
  {
    id: "03",
    label: "Input defense",
    title: "Scan for hostile intent",
    detail: "Detect prompt injection, jailbreaks, malware, secrets and personal data hiding in the input.",
    signal: "injection score 0.08 / PII 0",
    rule: "The agent sees a protected context, not raw untrusted input.",
    icon: ScanLine,
    tone: "amber",
    action: "watch",
  },
  {
    id: "04",
    label: "Agent loop",
    title: "Classify intended action",
    detail: "Translate the plan into an explicit action type: read, write, API call, code execution or message.",
    signal: "intent: read-only / confidence 98%",
    rule: "Make implicit agent intent inspectable before it becomes an action.",
    icon: Braces,
    tone: "cyan",
    action: "pass",
  },
  {
    id: "05",
    label: "Policy engine",
    title: "Evaluate the decision",
    detail: "Score identity, target, data sensitivity, tool permissions, rate, cost and blast radius.",
    signal: "risk 14 / policy P-104",
    rule: "Low risk can flow. Medium risk pauses. High risk stops by default.",
    icon: Gavel,
    tone: "amber",
    action: "watch",
  },
  {
    id: "06",
    label: "Approval rail",
    title: "Human approval when needed",
    detail: "Route sensitive writes, external communication and multi-step actions to an accountable reviewer.",
    signal: "queue: 0 pending / SLA 04:12",
    rule: "Automation handles the routine. People own the irreversible.",
    icon: ClipboardCheck,
    tone: "violet",
    action: "hold",
  },
  {
    id: "07",
    label: "Tool firewall",
    title: "Constrain the tool call",
    detail: "Validate arguments, issue scoped credentials, enforce network allowlists and cap time and budget.",
    signal: "sandbox: isolated / egress 2 hosts",
    rule: "Every tool call is a fresh permission check—not a blank cheque.",
    icon: LockKeyhole,
    tone: "cyan",
    action: "pass",
  },
  {
    id: "08",
    label: "Result inspection",
    title: "Inspect the tool result",
    detail: "Quarantine malicious content, data exfiltration, secret leakage or unsafe instructions before re-entry.",
    signal: "result: trusted / 4.2 KB",
    rule: "Tool output is data first, instruction never.",
    icon: Eye,
    tone: "cyan",
    action: "pass",
  },
  {
    id: "09",
    label: "Output gate",
    title: "Deliver a safe response",
    detail: "Redact secrets, filter sensitive data, record the evidence and return only what the user is allowed to see.",
    signal: "DLP clean / trace sealed",
    rule: "Close the loop with the same rigor that opened it.",
    icon: Send,
    tone: "green",
    action: "pass",
  },
];

const layers = [
  { label: "Identity", text: "RBAC · tenant isolation · session binding", icon: UserCheck, color: "cyan" },
  { label: "Input", text: "Injection · jailbreak · PII · secret scan", icon: ScanLine, color: "amber" },
  { label: "Policy", text: "Risk score · permissions · rate limits", icon: Gavel, color: "violet" },
  { label: "Execution", text: "Sandbox · egress · scoped credentials", icon: Terminal, color: "cyan" },
  { label: "Output", text: "DLP · redaction · safe completion", icon: ShieldCheck, color: "green" },
  { label: "Oversight", text: "Approvals · audit · rollback · alerts", icon: Activity, color: "coral" },
];

const riskTiers = [
  { label: "LOW RISK", value: "AUTO-ALLOW", text: "Read-only action against an approved source.", color: "green", icon: Check },
  { label: "MEDIUM RISK", value: "PAUSE + REVIEW", text: "Writes, sensitive data or external API calls.", color: "amber", icon: Clock3 },
  { label: "HIGH RISK", value: "BLOCK BY DEFAULT", text: "Credential access, exfiltration or destructive action.", color: "coral", icon: ShieldAlert },
];

function IconBadge({ children, tone = "cyan" }: { children: React.ReactNode; tone?: string }) {
  return <span className={`icon-badge tone-${tone}`}>{children}</span>;
}

export default function Home() {
  const [activeStage, setActiveStage] = useState(0);
  const [isReplaying, setIsReplaying] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const active = stages[activeStage];
  const ActiveIcon = active.icon;

  useEffect(() => {
    if (!isReplaying) return;
    const timer = window.setInterval(() => {
      setActiveStage((current) => {
        if (current >= stages.length - 1) {
          setIsReplaying(false);
          return 0;
        }
        return current + 1;
      });
    }, 900);
    return () => window.clearInterval(timer);
  }, [isReplaying]);

  const statusText = useMemo(() => {
    if (isReplaying) return "REPLAYING DECISION PATH";
    return `${active.id} / ${active.label.toUpperCase()}`;
  }, [active, isReplaying]);

  return (
    <main className="console-shell">
      <div className="grid-noise" />
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Firewall home">
          <span className="brand-mark"><ShieldCheck size={18} strokeWidth={2.5} /></span>
          <span>FIREWALL<span className="brand-slash">//</span>AGENT</span>
        </a>
        <nav className="topnav" aria-label="Primary navigation">
          <a className="active" href="#flow">Decision flow</a>
          <a href="#controls">Control plane</a>
          <a href="#mvp">MVP path</a>
        </nav>
        <div className="topbar-status"><span className="pulse-dot" /> POLICY ENGINE ONLINE <span className="status-divider" /> v0.9.4</div>
      </header>

      <section className="hero-section" id="top">
        <div className="hero-copy">
          <div className="eyebrow"><Radio size={14} /> AI-NATIVE SECURITY OPERATIONS</div>
          <h1>Protect every<br /><em>agent action</em><br />before impact.</h1>
          <p className="hero-lede">A clear, inspectable firewall for AI agents—where every request is scored, every tool is constrained, and every response leaves a trace.</p>
          <div className="hero-actions">
            <a className="button button-primary" href="#flow"><span>Explore the flow</span><ArrowDown size={16} /></a>
            <a className="button button-ghost" href="#mvp">See the MVP path <ArrowUpRight size={16} /></a>
          </div>
          <div className="hero-meta"><span><span className="meta-icon"><Zap size={12} /></span> 5 core controls</span><span><span className="meta-icon"><Network size={12} /></span> zero-trust by default</span></div>
        </div>
        <div className="hero-visual" aria-label="Firewall telemetry visual">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="orbit orbit-three" />
          <div className="crosshair crosshair-x" /><div className="crosshair crosshair-y" />
          <div className="core-shield"><ShieldCheck size={66} strokeWidth={1.2} /><span>SAFE<br />PATH</span></div>
          <div className="telemetry telemetry-top"><span>THREAT SURFACE</span><strong>REDUCED 92%</strong></div>
          <div className="telemetry telemetry-left"><span>ACTIVE RULES</span><strong>104</strong></div>
          <div className="telemetry telemetry-right"><span>TRACE ID</span><strong>8F2A.C91E</strong></div>
          <div className="telemetry telemetry-bottom"><span>LAST EVENT</span><strong>00:00:04 AGO</strong></div>
          <div className="scan-line" />
        </div>
      </section>

      <section className="metric-strip" aria-label="Firewall metrics">
        <div><span className="metric-label">DECISIONS / HOUR</span><strong>12,840</strong><span className="metric-up">+18.4%</span></div>
        <div><span className="metric-label">BLOCK RATE</span><strong>3.7%</strong><span className="metric-muted">within baseline</span></div>
        <div><span className="metric-label">MEAN DECISION</span><strong>42<span className="metric-unit">ms</span></strong><span className="metric-up">−12ms</span></div>
        <div><span className="metric-label">AUDIT COVERAGE</span><strong>100<span className="metric-unit">%</span></strong><span className="metric-muted">trace sealed</span></div>
      </section>

      <section className="flow-section section-pad" id="flow">
        <div className="section-heading">
          <div><div className="section-kicker">01 / END-TO-END PATH</div><h2>Every decision,<br /><span>made visible.</span></h2></div>
          <div className="section-intro"><p>From the first prompt to the final response, the firewall turns invisible agent behavior into explicit, auditable checkpoints.</p><button className={`replay-button ${isReplaying ? "is-playing" : ""}`} onClick={() => { setActiveStage(0); setIsReplaying(!isReplaying); }}><span className="play-icon">{isReplaying ? <RotateCcw size={14} /> : <Play size={14} fill="currentColor" />}</span>{isReplaying ? "Replay running" : "Replay decision path"}</button></div>
        </div>

        <div className="flow-layout">
          <div className="stage-list" role="list" aria-label="Firewall decision stages">
            {stages.map((stage, index) => {
              const StageIcon = stage.icon;
              const isActive = activeStage === index;
              return <button key={stage.id} className={`stage-row ${isActive ? "active" : ""}`} onClick={() => { setActiveStage(index); setIsReplaying(false); }} role="listitem" aria-current={isActive ? "step" : undefined}>
                <span className={`stage-number ${isActive ? "active-number" : ""}`}>{stage.id}</span>
                <span className={`stage-icon tone-${stage.tone}`}><StageIcon size={15} /></span>
                <span className="stage-text"><strong>{stage.title}</strong><small>{stage.label}</small></span>
                <span className={`stage-action action-${stage.action}`}>{stage.action === "pass" ? <Check size={13} /> : stage.action === "watch" ? <AlertTriangle size={13} /> : <Clock3 size={13} />}</span>
                <ChevronRight className="stage-chevron" size={15} />
              </button>;
            })}
          </div>

          <div className={`stage-detail tone-panel-${active.tone}`}>
            <div className="detail-topline"><span className="detail-status"><CircleDot size={12} /> LIVE CHECKPOINT</span><span className="detail-id">STAGE_{active.id}</span></div>
            <div className="detail-icon"><ActiveIcon size={28} /></div>
            <div className="detail-label">{active.label}</div>
            <h3>{active.title}</h3>
            <p>{active.detail}</p>
            <div className="detail-rule"><span>FIREWALL RULE</span><strong>“{active.rule}”</strong></div>
            <div className="signal-box"><span className="signal-dot" /><span>{active.signal}</span><span className="signal-live">LIVE</span></div>
            <div className="detail-footer"><span>DECISION LATENCY</span><strong>{activeStage === 4 ? "18ms" : activeStage === 5 ? "human" : "06ms"}</strong><span className="footer-divider" /><span>TRACE SEALED</span><Check size={14} /></div>
          </div>
        </div>
      </section>

      <section className="risk-section section-pad">
        <div className="section-heading compact"><div><div className="section-kicker">02 / RISK-BASED CONTROL</div><h2>Let the risk<br /><span>set the pace.</span></h2></div><p className="section-note">A simple tiering model keeps the demo legible: automate the safe, pause the sensitive, stop the dangerous.</p></div>
        <div className="risk-grid">{riskTiers.map((tier) => { const TierIcon = tier.icon; return <article className={`risk-card risk-${tier.color}`} key={tier.label}><div className="risk-card-top"><span>{tier.label}</span><TierIcon size={18} /></div><h3>{tier.value}</h3><p>{tier.text}</p><div className="risk-line"><span /><span /><span /></div></article>; })}</div>
      </section>

      <section className="control-section section-pad" id="controls">
        <div className="section-heading compact"><div><div className="section-kicker">03 / DEFENSE IN DEPTH</div><h2>Six layers.<br /><span>One contract.</span></h2></div><p className="section-note">The firewall is not a single model call. It is a contract around the model—identity, policy, execution and evidence.</p></div>
        <div className="layer-grid">{layers.map((layer, index) => { const LayerIcon = layer.icon; return <article className={`layer-card layer-${layer.color}`} key={layer.label}><span className="layer-index">0{index + 1}</span><IconBadge tone={layer.color}><LayerIcon size={18} /></IconBadge><h3>{layer.label}</h3><p>{layer.text}</p><span className="layer-arrow"><ArrowUpRight size={15} /></span></article>; })}</div>
      </section>

      <section className="mvp-section section-pad" id="mvp">
        <div className="mvp-card"><div className="mvp-copy"><div className="section-kicker">04 / HACKATHON MVP</div><h2>Ship the guardrail,<br /><span>not the guesswork.</span></h2><p>Five controls are enough to prove the pattern. Start narrow, make the decisions visible, and earn trust one trace at a time.</p><button className="button button-primary" onClick={() => setShowAll(!showAll)}>{showAll ? "Hide build sequence" : "Show build sequence"}<ChevronRight size={16} /></button></div><div className="mvp-checklist">{["Scan input for injection + secrets", "Route action through a policy engine", "Validate every tool call in a proxy", "Run with sandbox + egress limits", "Redact output and seal the audit log"].map((item, index) => <div className={`check-row ${showAll || index < 3 ? "revealed" : ""}`} key={item}><span className="check-index">0{index + 1}</span><span className="check-box"><Check size={13} /></span><span>{item}</span><span className="check-state">{showAll || index < 3 ? "READY" : "NEXT"}</span></div>)}</div></div>
      </section>

      <footer className="footer"><div className="brand"><span className="brand-mark"><ShieldCheck size={16} /></span><span>FIREWALL<span className="brand-slash">//</span>AGENT</span></div><span className="footer-copy">A visual blueprint for safer agentic systems.</span><span className="footer-meta"><span className="pulse-dot" /> BUILT FOR THE NEXT ATTACK SURFACE</span></footer>
    </main>
  );
}
