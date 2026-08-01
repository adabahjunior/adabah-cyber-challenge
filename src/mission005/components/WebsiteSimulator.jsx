import { useState } from "react";

const PAGES = {
  home: {
    title: "Home",
    path: "/",
  },
  about: {
    title: "About",
    path: "/about",
  },
  services: {
    title: "Services",
    path: "/services",
  },
  contact: {
    title: "Contact",
    path: "/contact",
  },
  login: {
    title: "Login",
    path: "/login",
  },
  backup: {
    title: "Backup",
    path: "/backup",
    hidden: true,
  },
};

const SITE_JS = `/* NovaTech Solutions — site.js
   Client helpers for marketing pages.
   DO NOT commit staging tokens to production.
*/

const SITE_CONFIG = {
  company: "NovaTech Solutions",
  supportEmail: "hello@novatech.local",
  // staging residual — remove before go-live
  auditToken: "ACC{js_investigator}",
};

function greetVisitor(name) {
  return "Welcome to " + SITE_CONFIG.company + ", " + name;
}

document.addEventListener("DOMContentLoaded", function () {
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
});

export { SITE_CONFIG, greetVisitor };
`;

const HTML_BY_PAGE = {
  home: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>NovaTech Solutions — Home</title>
  <link rel="stylesheet" href="/assets/site.css" />
  <script src="/assets/site.js" defer></script>
</head>
<body>
  <!--
    Internal QA note (remove before public release):
    ACC{view_source_master}
  -->
  <header>
    <strong>NovaTech Solutions</strong>
    <nav>
      <a href="/">Home</a>
      <a href="/about">About</a>
      <a href="/services">Services</a>
      <a href="/contact">Contact</a>
      <a href="/login">Login</a>
    </nav>
  </header>
  <main>
    <h1>Secure technology for growing teams</h1>
    <p>Cloud consulting, web platforms, and managed IT for West African businesses.</p>
    <img src="/assets/team-campus.jpg" alt="NovaTech team at the campus lab" />
  </main>
</body>
</html>`,
  about: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>About — NovaTech Solutions</title>
  <script src="/assets/site.js" defer></script>
</head>
<body>
  <h1>About NovaTech</h1>
  <p>Founded in Tarkwa, we help universities and startups ship reliable software.</p>
  <!-- devops: old staging mirror still reachable at /backup — rotate credentials -->
  <p>Our engineers believe every public page should be intentional.</p>
</body>
</html>`,
  services: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Services — NovaTech Solutions</title>
</head>
<body>
  <h1>Services</h1>
  <ul>
    <li>Web application development</li>
    <li>Cloud migration</li>
    <li>Security awareness training</li>
  </ul>
</body>
</html>`,
  contact: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Contact — NovaTech Solutions</title>
</head>
<body>
  <h1>Contact</h1>
  <p>Email: hello@novatech.local · Phone: +233 00 000 0000</p>
  <img
    src="/assets/office-front-ACC_image_detective.png"
    alt="Front entrance — ACC{image_detective}"
    title="Campus HQ photograph"
  />
</body>
</html>`,
  login: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Staff Login — NovaTech Solutions</title>
</head>
<body>
  <h1>Staff portal</h1>
  <form>
    <label>Email <input type="email" name="email" /></label>
    <label>Password <input type="password" name="password" /></label>
    <button type="submit">Sign in</button>
  </form>
  <p><small>Authorized personnel only.</small></p>
</body>
</html>`,
  backup: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Staging Backup — RESTRICTED</title>
</head>
<body>
  <h1>Staging backup index</h1>
  <p>This directory should not be publicly reachable.</p>
  <pre>snapshot_id: nt-2026-03-11
flag: ACC{hidden_directory}
owner: devops@novatech.local</pre>
</body>
</html>`,
};

export { PAGES, SITE_JS, HTML_BY_PAGE };

export default function WebsiteSimulator({ onNavigate, initialPage = "home" }) {
  const start = PAGES[initialPage] ? initialPage : "home";
  const [page, setPage] = useState(start);
  const [address, setAddress] = useState(
    `https://novatech.local${PAGES[start].path === "/" ? "/" : PAGES[start].path}`
  );
  const [error, setError] = useState("");

  function go(key) {
    if (!PAGES[key]) return;
    setPage(key);
    setAddress(`https://novatech.local${PAGES[key].path === "/" ? "/" : PAGES[key].path}`);
    setError("");
    onNavigate?.(key, PAGES[key]);
  }

  function submitAddress(e) {
    e.preventDefault();
    const raw = address.trim().toLowerCase();
    let path = "/";
    try {
      if (raw.includes("://")) path = new URL(raw).pathname || "/";
      else if (raw.startsWith("/")) path = raw.split("?")[0];
      else path = `/${raw.replace(/^novatech\.local/, "").replace(/^\//, "")}`;
    } catch (_) {
      setError("Could not parse that URL.");
      return;
    }
    path = path.replace(/\/+$/, "") || "/";
    const match = Object.entries(PAGES).find(([, meta]) => meta.path === path);
    if (!match) {
      setError(`404 — No page at ${path}`);
      return;
    }
    go(match[0]);
  }

  return (
    <div className="site-sim">
      <div className="browser-chrome">
        <div className="dots" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <form className="addr" onSubmit={submitAddress}>
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            spellCheck={false}
            aria-label="Address bar"
          />
          <button type="submit" className="btn btn-ghost btn-sm">
            Go
          </button>
        </form>
      </div>
      {error ? <p className="mono err">{error}</p> : null}

      <div className="site-frame">
        <header className="site-nav">
          <div className="brand-mark">NovaTech <span>Solutions</span></div>
          <nav>
            {["home", "about", "services", "contact", "login"].map((key) => (
              <button
                key={key}
                type="button"
                className={page === key ? "on" : ""}
                onClick={() => go(key)}
              >
                {PAGES[key].title}
              </button>
            ))}
          </nav>
        </header>

        {page === "home" && (
          <main className="site-main">
            <p className="eyebrow">Home</p>
            <h2>Secure technology for growing teams</h2>
            <p className="lede">
              Cloud consulting, web platforms, and managed IT for West African businesses.
            </p>
            <div className="hero-band" role="img" aria-label="NovaTech team at the campus lab">
              <span className="mono dim">team-campus.jpg</span>
            </div>
            <p className="muted tip">
              Tip: use View Source / Inspect in the investigation tools to examine this page&apos;s HTML.
            </p>
          </main>
        )}

        {page === "about" && (
          <main className="site-main">
            <p className="eyebrow">About</p>
            <h2>Built in Tarkwa. Shipping for campus &amp; industry.</h2>
            <p>
              NovaTech partners with universities and startups to deliver reliable software. Our engineers believe
              every public page should be intentional — temporary staging paths never belong in production.
            </p>
            <p className="mono dim" style={{ marginTop: "1rem", fontSize: "0.82rem" }}>
              robots.txt mentions Disallow: /backup
            </p>
          </main>
        )}

        {page === "services" && (
          <main className="site-main">
            <p className="eyebrow">Services</p>
            <h2>What we deliver</h2>
            <ul className="svc">
              <li>Web application development</li>
              <li>Cloud migration &amp; hardening</li>
              <li>Security awareness training</li>
            </ul>
          </main>
        )}

        {page === "contact" && (
          <main className="site-main">
            <p className="eyebrow">Contact</p>
            <h2>Talk to the team</h2>
            <p>Email: hello@novatech.local · Phone: +233 00 000 0000</p>
            <figure className="img-card">
              <div
                className="img-placeholder"
                role="img"
                aria-label="Front entrance — ACC{image_detective}"
                title="Campus HQ photograph"
              >
                <span className="mono">office-front-ACC_image_detective.png</span>
              </div>
              <figcaption className="mono dim">
                Filename: office-front-ACC_image_detective.png · alt: Front entrance — ACC{"{"}image_detective{"}"}
              </figcaption>
            </figure>
          </main>
        )}

        {page === "login" && (
          <main className="site-main">
            <p className="eyebrow">Staff portal</p>
            <h2>Sign in</h2>
            <form className="login-form" onSubmit={(e) => e.preventDefault()}>
              <label>
                Email
                <input type="email" placeholder="you@novatech.local" autoComplete="off" />
              </label>
              <label>
                Password
                <input type="password" placeholder="••••••••" autoComplete="off" />
              </label>
              <button type="submit" className="btn btn-primary">
                Sign in
              </button>
            </form>
            <p className="muted" style={{ marginTop: "0.75rem", fontSize: "0.85rem" }}>
              Authorized personnel only. This form is simulated for investigation.
            </p>
          </main>
        )}

        {page === "backup" && (
          <main className="site-main backup">
            <p className="eyebrow">RESTRICTED</p>
            <h2>Staging backup index</h2>
            <p>This directory should not be publicly reachable.</p>
            <pre className="mono dump">
{`snapshot_id: nt-2026-03-11
flag: ACC{hidden_directory}
owner: devops@novatech.local`}
            </pre>
          </main>
        )}

        <footer className="site-foot">
          <span>© <span id="year">2026</span> NovaTech Solutions</span>
          <span className="mono dim">site.js loaded</span>
        </footer>
      </div>

      <style>{`
        .site-sim { border:1px solid var(--border); border-radius:14px; overflow:hidden; background:#0a0a0a; }
        .browser-chrome {
          display:flex; align-items:center; gap:.65rem; padding:.55rem .7rem;
          background:linear-gradient(180deg,#161616,#0d0d0d); border-bottom:1px solid var(--border);
        }
        .dots { display:flex; gap:.35rem; }
        .dots span { width:9px; height:9px; border-radius:50%; background:#333; }
        .dots span:nth-child(1){background:#ef4444} .dots span:nth-child(2){background:#eab308} .dots span:nth-child(3){background:#22c55e}
        .addr { flex:1; display:flex; gap:.4rem; }
        .addr input {
          flex:1; background:#070707; border:1px solid var(--border); border-radius:999px;
          color:var(--text); padding:.45rem .9rem; font-family:var(--font-mono); font-size:.8rem;
        }
        .site-sim .err { color:var(--red-bright); padding:.45rem .85rem; font-size:.8rem; margin:0; background:rgba(176,0,32,.12); }
        .site-frame {
          background:
            radial-gradient(ellipse at top right, rgba(176,0,32,.1), transparent 40%),
            linear-gradient(165deg, #101010 0%, #070707 55%, #0c0c0c 100%);
          min-height:420px; display:flex; flex-direction:column;
        }
        .site-nav {
          display:flex; flex-wrap:wrap; justify-content:space-between; gap:.75rem;
          padding:1rem 1.15rem; border-bottom:1px solid rgba(255,255,255,.06);
        }
        .brand-mark {
          font-family:var(--font-display); letter-spacing:.04em; font-size:.95rem; color:#fff;
        }
        .brand-mark span { color:var(--red-bright); }
        .site-nav nav { display:flex; flex-wrap:wrap; gap:.25rem; }
        .site-nav button {
          background:transparent; border:0; color:var(--muted); font-family:var(--font-mono);
          font-size:.78rem; padding:.4rem .65rem; border-radius:8px; cursor:pointer;
        }
        .site-nav button.on, .site-nav button:hover { color:#fff; background:rgba(176,0,32,.18); }
        .site-main { padding:1.35rem 1.25rem 1.5rem; flex:1; }
        .site-main h2 { font-size:1.45rem; margin:.35rem 0 .75rem; max-width:18ch; line-height:1.2; }
        .lede { color:var(--muted); max-width:42ch; line-height:1.55; }
        .hero-band {
          margin:1.15rem 0; height:140px; border-radius:12px;
          border:1px solid rgba(176,0,32,.35);
          background:
            linear-gradient(120deg, rgba(0,0,0,.55), rgba(176,0,32,.25)),
            repeating-linear-gradient(45deg, #141414 0 12px, #101010 12px 24px);
          display:flex; align-items:flex-end; padding:.75rem;
        }
        .tip { margin-top:1rem; font-size:.85rem; }
        .svc { margin:.75rem 0 0; padding-left:1.1rem; color:var(--muted); display:grid; gap:.4rem; }
        .img-card { margin:1rem 0 0; }
        .img-placeholder {
          height:120px; border-radius:10px; border:1px dashed rgba(224,17,54,.45);
          background:rgba(176,0,32,.08); display:flex; align-items:center; justify-content:center;
          padding:1rem; text-align:center;
        }
        .img-card figcaption { margin-top:.45rem; font-size:.75rem; word-break:break-all; }
        .login-form { display:grid; gap:.65rem; max-width:280px; margin-top:.75rem; }
        .login-form label { display:grid; gap:.3rem; font-family:var(--font-mono); font-size:.72rem; color:var(--dim); text-transform:uppercase; }
        .login-form input {
          background:#070707; border:1px solid var(--border); border-radius:8px; color:var(--text);
          padding:.55rem .65rem; font-size:.9rem;
        }
        .backup .dump {
          margin-top:1rem; padding:1rem; border-radius:10px; border:1px solid rgba(224,17,54,.45);
          background:rgba(176,0,32,.1); color:#fecaca; white-space:pre-wrap;
        }
        .site-foot {
          display:flex; justify-content:space-between; gap:.75rem; flex-wrap:wrap;
          padding:.75rem 1.15rem; border-top:1px solid rgba(255,255,255,.06);
          font-size:.78rem; color:var(--muted);
        }
      `}</style>
    </div>
  );
}
