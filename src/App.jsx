import { useState, useEffect, useRef } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&family=Lora:ital@0;1&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }

  :root {
    --ink: #0d0d0d;
    --paper: #f5f0e8;
    --gold: #c8922a;
    --gold-light: #e8b84b;
    --warm-gray: #8a8278;
    --rust: #b84c2e;
    --cream: #faf7f0;
    --dark-brown: #1a1208;
  }

  body { font-family: 'DM Mono', monospace; background: var(--paper); color: var(--ink); overflow-x: hidden; }

  body::after {
    content: '';
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 200;
    opacity: 0.022;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50%       { transform: scale(1.04); }
  }
  @keyframes rotateBg {
    from { transform: rotate(3deg); }
    to   { transform: rotate(5deg); }
  }

  .fade-up   { animation: fadeUp 0.65s ease both; }
  .fade-in   { animation: fadeIn 0.65s ease both; }

  .ku-header {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    padding: 1.1rem 3rem;
    display: flex; justify-content: space-between; align-items: center;
    background: rgba(245,240,232,0.88);
    backdrop-filter: blur(14px);
    border-bottom: 1px solid rgba(200,146,42,0.2);
    transition: box-shadow 0.3s;
  }
  .ku-header.scrolled { box-shadow: 0 4px 30px rgba(0,0,0,0.07); }

  .ku-logo {
    font-family: 'Syne', sans-serif;
    font-weight: 800; font-size: 1.05rem;
    letter-spacing: 0.08em; text-transform: uppercase;
    color: var(--ink); text-decoration: none;
  }
  .ku-logo span { color: var(--gold); }

  .ku-nav { display: flex; gap: 2.2rem; }
  .ku-nav a {
    font-size: 0.7rem; letter-spacing: 0.14em; text-transform: uppercase;
    text-decoration: none; color: var(--warm-gray);
    transition: color 0.2s; cursor: pointer;
  }
  .ku-nav a:hover, .ku-nav a.active { color: var(--gold); }

  /* ── HERO ── */
  .ku-hero {
    min-height: 100vh;
    padding: 8rem 3rem 4rem;
    display: grid; grid-template-columns: 1fr 1fr;
    align-items: center; gap: 4rem;
    max-width: 1200px; margin: 0 auto;
  }

  .hero-eyebrow {
    font-size: 0.68rem; letter-spacing: 0.22em; text-transform: uppercase;
    color: var(--gold); margin-bottom: 1.4rem;
    display: flex; align-items: center; gap: 0.8rem;
    animation: fadeUp 0.6s 0.1s ease both;
  }
  .hero-eyebrow::before {
    content: ''; display: block;
    width: 2rem; height: 1px; background: var(--gold);
  }

  .hero-h1 {
    font-family: 'Syne', sans-serif;
    font-size: clamp(3rem, 6vw, 5.5rem);
    font-weight: 800; line-height: 0.94; letter-spacing: -0.02em;
    margin-bottom: 1.5rem;
    animation: fadeUp 0.65s 0.18s ease both;
  }
  .hero-h1 em { font-style: normal; color: var(--gold); }

  .hero-desc {
    font-size: 0.85rem; line-height: 1.85; color: var(--warm-gray);
    max-width: 430px; margin-bottom: 2.5rem;
    animation: fadeUp 0.65s 0.28s ease both;
  }

  .hero-cta {
    display: flex; gap: 1rem; flex-wrap: wrap;
    animation: fadeUp 0.65s 0.38s ease both;
  }

  .btn {
    display: inline-flex; align-items: center; gap: 0.5rem;
    padding: 0.85rem 1.8rem;
    font-family: 'DM Mono', monospace;
    font-size: 0.7rem; letter-spacing: 0.13em; text-transform: uppercase;
    border: 1.5px solid var(--ink); cursor: pointer;
    background: transparent; color: var(--ink);
    transition: all 0.22s; text-decoration: none;
  }
  .btn-primary { background: var(--ink); color: var(--paper); }
  .btn-primary:hover { background: var(--gold); border-color: var(--gold); color: var(--ink); }
  .btn-outline:hover { background: var(--ink); color: var(--paper); }

  /* ── PROFILE CARD ── */
  .ku-hero-visual {
    display: flex; justify-content: center; align-items: center;
    animation: fadeUp 0.85s 0.3s ease both;
  }

  .profile-frame { position: relative; width: 370px; height: 455px; }

  .profile-bg {
    position: absolute; inset: 0;
    background: linear-gradient(135deg, var(--gold) 0%, var(--dark-brown) 100%);
    transform: rotate(3deg);
    transition: transform 0.4s ease;
  }
  .profile-frame:hover .profile-bg { transform: rotate(5deg); }

  .profile-card {
    position: absolute; inset: 0;
    background: var(--cream);
    border: 1.5px solid rgba(200,146,42,0.3);
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    gap: 1rem; padding: 2rem;
  }

  .avatar {
    width: 106px; height: 106px; border-radius: 50%;
    background: linear-gradient(135deg, var(--gold), var(--rust));
    display: flex; align-items: center; justify-content: center;
    font-family: 'Syne', sans-serif;
    font-size: 2.3rem; font-weight: 800; color: white;
    animation: pulse 4s 1s ease-in-out infinite;
  }

  .profile-name {
    font-family: 'Syne', sans-serif;
    font-weight: 700; font-size: 1.05rem; text-align: center;
  }
  .profile-role {
    font-size: 0.65rem; letter-spacing: 0.16em;
    text-transform: uppercase; color: var(--gold); text-align: center;
  }

  .profile-badges { display: flex; flex-wrap: wrap; gap: 0.4rem; justify-content: center; }
  .badge {
    padding: 0.28rem 0.65rem;
    background: var(--paper);
    border: 1px solid rgba(200,146,42,0.3);
    font-size: 0.6rem; letter-spacing: 0.08em; text-transform: uppercase;
    color: var(--warm-gray);
  }

  .profile-stats {
    width: 100%; display: grid; grid-template-columns: 1fr 1fr;
    gap: 0.7rem; border-top: 1px solid rgba(200,146,42,0.2); padding-top: 0.9rem;
  }
  .stat { text-align: center; }
  .stat-num {
    font-family: 'Syne', sans-serif; font-weight: 800;
    font-size: 1.35rem; color: var(--gold);
  }
  .stat-label {
    font-size: 0.57rem; letter-spacing: 0.1em;
    text-transform: uppercase; color: var(--warm-gray);
  }

  /* ── SECTION SHELL ── */
  .ku-section {
    padding: 6rem 3rem; max-width: 1200px; margin: 0 auto;
  }
  .ku-section-full {
    padding: 6rem 3rem;
  }
  .ku-section-inner { max-width: 1200px; margin: 0 auto; }

  .section-header {
    display: flex; align-items: baseline; gap: 1.5rem; margin-bottom: 3.5rem;
  }
  .section-num {
    font-size: 0.68rem; font-weight: 700; letter-spacing: 0.2em;
    text-transform: uppercase; color: var(--gold); white-space: nowrap;
  }
  .section-h2 {
    font-family: 'Syne', sans-serif;
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 800; letter-spacing: -0.02em; line-height: 1;
  }

  /* ── SKILLS ── */
  .skills-bg { background: var(--ink); }
  .skills-bg .section-num { color: var(--gold-light); }
  .skills-bg .section-h2 { color: var(--paper); }

  .skills-grid {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(255px, 1fr));
    gap: 1.5px; background: rgba(255,255,255,0.06);
    border: 1.5px solid rgba(255,255,255,0.08);
  }

  .skill-card {
    background: var(--dark-brown);
    padding: 1.8rem 1.5rem;
    border: 1.5px solid transparent;
    transition: all 0.22s; cursor: default;
  }
  .skill-card:hover { border-color: var(--gold); background: #231a06; }

  .skill-icon { font-size: 1.7rem; margin-bottom: 0.75rem; }
  .skill-name {
    font-family: 'Syne', sans-serif; font-size: 0.92rem; font-weight: 700;
    margin-bottom: 0.4rem; color: var(--cream);
  }
  .skill-desc {
    font-size: 0.69rem; line-height: 1.65;
    color: rgba(245,240,232,0.42);
  }

  /* ── TIMELINE ── */
  .timeline { display: flex; flex-direction: column; }

  .timeline-item {
    display: grid; grid-template-columns: 155px 1px 1fr;
    gap: 0 2rem; padding-bottom: 3rem;
  }

  .tl-date { text-align: right; padding-top: 0.15rem; }
  .tl-date-text {
    font-size: 0.65rem; letter-spacing: 0.1em;
    text-transform: uppercase; color: var(--gold);
  }

  .tl-line {
    position: relative;
    background: rgba(200,146,42,0.2);
  }
  .tl-line::before {
    content: ''; position: absolute; top: 0.45rem; left: 50%;
    transform: translateX(-50%);
    width: 8px; height: 8px; border-radius: 50%;
    background: var(--gold);
  }

  .tl-company {
    font-size: 0.62rem; letter-spacing: 0.15em;
    text-transform: uppercase; color: var(--gold); margin-bottom: 0.3rem;
  }
  .tl-role {
    font-family: 'Syne', sans-serif; font-size: 1.1rem;
    font-weight: 700; margin-bottom: 0.8rem;
  }
  .tl-bullets { list-style: none; display: flex; flex-direction: column; gap: 0.4rem; }
  .tl-bullet {
    font-size: 0.76rem; line-height: 1.65; color: var(--warm-gray);
    display: flex; gap: 0.6rem;
  }
  .tl-bullet::before { content: '→'; color: var(--gold); flex-shrink: 0; }

  /* ── CERTS ── */
  .certs-bg { background: var(--cream); }

  .certs-grid {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
    gap: 1.5rem;
  }

  .cert-card {
    padding: 2rem;
    border: 1.5px solid rgba(200,146,42,0.25);
    background: white;
    position: relative; overflow: hidden;
    transition: all 0.22s; cursor: default;
  }
  .cert-card::before {
    content: ''; position: absolute; top: 0; left: 0;
    width: 3px; height: 100%; background: var(--gold);
  }
  .cert-card:hover {
    border-color: var(--gold);
    transform: translateY(-3px);
    box-shadow: 0 10px 35px rgba(200,146,42,0.13);
  }
  .cert-issuer {
    font-size: 0.6rem; letter-spacing: 0.16em;
    text-transform: uppercase; color: var(--gold); margin-bottom: 0.5rem;
  }
  .cert-name {
    font-family: 'Syne', sans-serif; font-size: 0.98rem;
    font-weight: 700; line-height: 1.35; margin-bottom: 0.45rem;
  }
  .cert-sub { font-size: 0.67rem; color: var(--warm-gray); }

  /* ── CONTACT ── */
  .contact-bg { background: var(--gold); }
  .contact-inner {
    max-width: 1200px; margin: 0 auto;
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 4rem; align-items: center;
  }
  .contact-h2 {
    font-family: 'Syne', sans-serif;
    font-size: clamp(2.5rem, 5vw, 4rem);
    font-weight: 800; letter-spacing: -0.02em;
    color: var(--ink); margin-bottom: 1rem;
  }
  .contact-p { font-size: 0.83rem; line-height: 1.85; color: rgba(13,13,13,0.68); }

  .contact-links { display: flex; flex-direction: column; gap: 1rem; }
  .contact-link {
    display: flex; align-items: center; gap: 1rem;
    text-decoration: none; color: var(--ink);
    padding: 1rem 1.2rem;
    background: rgba(255,255,255,0.32);
    border: 1.5px solid rgba(13,13,13,0.14);
    transition: all 0.2s; cursor: pointer;
  }
  .contact-link:hover { background: var(--ink); color: var(--gold); border-color: var(--ink); }
  .contact-icon { font-size: 1.1rem; }
  .contact-text { font-size: 0.76rem; letter-spacing: 0.04em; }

  /* ── FOOTER ── */
  .ku-footer {
    padding: 2rem 3rem; text-align: center;
    font-size: 0.66rem; letter-spacing: 0.13em; text-transform: uppercase;
    color: var(--warm-gray); border-top: 1px solid rgba(200,146,42,0.15);
  }

  /* ── RESPONSIVE ── */
  @media (max-width: 768px) {
    .ku-header { padding: 1rem 1.5rem; }
    .ku-nav { gap: 1.2rem; }
    .ku-nav a { font-size: 0.62rem; }
    .ku-hero { grid-template-columns: 1fr; padding: 7rem 1.5rem 3rem; }
    .ku-hero-visual { display: none; }
    .ku-section { padding: 4rem 1.5rem; }
    .ku-section-full { padding: 4rem 1.5rem; }
    .timeline-item { grid-template-columns: 1fr; gap: 0.5rem 0; }
    .tl-date { text-align: left; }
    .tl-line { display: none; }
    .contact-inner { grid-template-columns: 1fr; gap: 2.5rem; }
  }
`;

const SKILLS = [
  { icon: "🖥️", name: "IT Technical Support", desc: "Help desk services, hardware diagnostics, end-user troubleshooting and system maintenance." },
  { icon: "🌐", name: "Network Administration", desc: "Network configuration, troubleshooting, secure integration, and infrastructure monitoring." },
  { icon: "⚙️", name: "System Administration", desc: "System performance management, upgrades, and IT infrastructure support." },
  { icon: "🛡️", name: "Cybersecurity & Monitoring", desc: "Proactive system monitoring, security protocols, and vulnerability awareness." },
  { icon: "💾", name: "Database Management", desc: "Database support, integration, and management using industry-standard tools." },
  { icon: "🔧", name: "Software Development", desc: "ASP.NET, .NET Framework, React, APIs, and web application development." },
  { icon: "📋", name: "Technical Documentation", desc: "Writing process docs, user guides, troubleshooting procedures, and reports." },
  { icon: "🎓", name: "User Training & Support", desc: "Training staff and community members on software systems and digital tools." },
];

const EXPERIENCE = [
  {
    date: "Jun 2024 – Present",
    company: "Seltech Technology Ghana Ltd",
    role: "Technical Development Assistant",
    bullets: [
      "Developed and optimized software applications for improved system efficiency.",
      "Supported backend testing, debugging, and system optimization.",
      "Contributed to database management and system integration.",
      "Collaborated with developers to design scalable technical solutions.",
    ],
  },
  {
    date: "Oct 2024 – Sep 2025",
    company: "Consolidated Bank Ghana",
    role: "Junior Software Developer (National Service)",
    bullets: [
      "Designed and maintained software applications for organizational operations.",
      "Provided technical support and troubleshooting to bank staff.",
      "Trained users on software systems and applications.",
      "Documented system processes and prepared user guides.",
    ],
  },
  {
    date: "May 2023 – May 2024",
    company: "Seltech Technology Ghana Ltd",
    role: "Graduate Intern, Technical Support",
    bullets: [
      "Delivered remote technical support, resolving hardware and software issues.",
      "Monitored and maintained IT infrastructure for stable operations.",
      "Assisted with network configuration and secure system integration.",
      "Improved service delivery through proactive system monitoring.",
    ],
  },
  {
    date: "Sep 2018 – Jul 2019",
    company: "Gomoa West District Assembly",
    role: "IT Support / Network & Hardware Technician",
    bullets: [
      "Diagnosed and resolved networking and hardware issues.",
      "Supported end-users with system setup, maintenance, and performance.",
      "Assisted in system upgrades and infrastructure maintenance.",
    ],
  },
];

const CERTS = [
  { issuer: "Google · 2025", name: "IT Support Professional Certificate", sub: "Hardware, networking, OS, security & cloud" },
  { issuer: "Board Infinity · 2025", name: "Building React & ASP.NET MVC 5 Applications Specialization", sub: "Full-stack web application development" },
  { issuer: "IPMC · 2017", name: "IT Expert in System Engineering", sub: "Foundational systems and hardware engineering" },
];

const NAV_LINKS = ["About", "Skills", "Experience", "Certifications", "Contact"];

function useScrolled(threshold = 20) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > threshold);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, [threshold]);
  return scrolled;
}

function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    ids.forEach((id) => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);
  return active;
}

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export default function Portfolio() {
  const scrolled = useScrolled();
  const active = useActiveSection(["about", "skills", "experience", "certifications", "contact"]);

  return (
    <>
      <style>{styles}</style>

      {/* HEADER */}
      <header className={`ku-header${scrolled ? " scrolled" : ""}`}>
        <span className="ku-logo">K<span>J</span>A</span>
        <nav className="ku-nav">
          {NAV_LINKS.map((n) => (
            <a
              key={n}
              className={active === n.toLowerCase() ? "active" : ""}
              onClick={() => scrollTo(n.toLowerCase())}
            >
              {n}
            </a>
          ))}
        </nav>
      </header>

      {/* HERO */}
      <div id="about" className="ku-hero">
        <div>
          <div className="hero-eyebrow">IT Support · Software Engineering</div>
          <h1 className="hero-h1">Kwaku<br /><em>Jackity</em><br />Ayim</h1>
          <p className="hero-desc">
            Software Engineering graduate with hands-on expertise in IT support, network administration, and system infrastructure. Based in Ghana — building reliable digital systems that work.
          </p>
          <div className="hero-cta">
            <button className="btn btn-primary" onClick={() => scrollTo("experience")}>View Experience →</button>
            <button className="btn btn-outline" onClick={() => scrollTo("contact")}>Get in Touch</button>
            <a className="btn btn-outline" href="/cv.pdf" download="Kwaku_Jackity_Ayim_CV.pdf">Download CV ↓</a>
          </div>
        </div>

        <div className="ku-hero-visual">
          <div className="profile-frame">
            <div className="profile-bg" />
            <div className="profile-card">
              <div className="avatar">KA</div>
              <div className="profile-name">Kwaku Jackity Ayim</div>
              <div className="profile-role">IT Support & Software Engineer</div>
              <div className="profile-badges">
                <span className="badge">B.Sc. Software Eng.</span>
                <span className="badge">Google Certified</span>
                <span className="badge">GCTU · 2024</span>
              </div>
              <div className="profile-stats">
                {[["6+", "Yrs Exp."], ["3", "Certs"], ["4", "Roles"], ["GH", "Ghana"]].map(([n, l]) => (
                  <div className="stat" key={l}>
                    <div className="stat-num">{n}</div>
                    <div className="stat-label">{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SKILLS */}
      <div id="skills" className="ku-section-full skills-bg">
        <div className="ku-section-inner">
          <div className="section-header">
            <span className="section-num">02 — SKILLS</span>
            <h2 className="section-h2">Core Competencies</h2>
          </div>
          <div className="skills-grid">
            {SKILLS.map((s) => (
              <div className="skill-card" key={s.name}>
                <div className="skill-icon">{s.icon}</div>
                <div className="skill-name">{s.name}</div>
                <div className="skill-desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* EXPERIENCE */}
      <div id="experience" className="ku-section">
        <div className="section-header">
          <span className="section-num">03 — EXPERIENCE</span>
          <h2 className="section-h2">Work History</h2>
        </div>
        <div className="timeline">
          {EXPERIENCE.map((e) => (
            <div className="timeline-item" key={e.role}>
              <div className="tl-date"><div className="tl-date-text">{e.date}</div></div>
              <div className="tl-line" />
              <div>
                <div className="tl-company">{e.company}</div>
                <div className="tl-role">{e.role}</div>
                <ul className="tl-bullets">
                  {e.bullets.map((b) => (
                    <li className="tl-bullet" key={b}>{b}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CERTIFICATIONS */}
      <div id="certifications" className="ku-section-full certs-bg">
        <div className="ku-section-inner">
          <div className="section-header">
            <span className="section-num">04 — CERTIFICATIONS</span>
            <h2 className="section-h2">Credentials</h2>
          </div>
          <div className="certs-grid">
            {CERTS.map((c) => (
              <div className="cert-card" key={c.name}>
                <div className="cert-issuer">{c.issuer}</div>
                <div className="cert-name">{c.name}</div>
                <div className="cert-sub">{c.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CONTACT */}
      <div id="contact" className="ku-section-full contact-bg">
        <div className="contact-inner">
          <div>
            <h2 className="contact-h2">Let's Work Together</h2>
            <p className="contact-p">
              Open to IT support roles, system administration, software development opportunities, and consulting engagements across Ghana and remotely.
            </p>
          </div>
          <div className="contact-links">
            <a className="contact-link" href="mailto:kwakujackityayim74@gmail.com">
              <span className="contact-icon">✉</span>
              <span className="contact-text">kwakujackityayim74@gmail.com</span>
            </a>
            <a className="contact-link" href="tel:+233549617074">
              <span className="contact-icon">☏</span>
              <span className="contact-text">+233 549 617 074</span>
            </a>
            <a className="contact-link" href="https://www.linkedin.com/in/kwaku-ayim" target="_blank" rel="noreferrer">
              <span className="contact-icon">in</span>
              <span className="contact-text">linkedin.com/in/kwaku-ayim</span>
            </a>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="ku-footer">
        © 2025 Kwaku Jackity Ayim · Accra, Ghana · Built with React
      </footer>
    </>
  );
}
