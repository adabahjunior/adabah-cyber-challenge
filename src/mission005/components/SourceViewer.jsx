import { HTML_BY_PAGE, SITE_JS } from "./WebsiteSimulator";

export default function SourceViewer({ pageKey = "home", mode = "html" }) {
  const html = HTML_BY_PAGE[pageKey] || HTML_BY_PAGE.home;
  const content = mode === "js" ? SITE_JS : html;
  const label = mode === "js" ? "/assets/site.js" : `${pageKey}.html · View Source`;

  return (
    <div className="source-view">
      <div className="row" style={{ justifyContent: "space-between", marginBottom: "0.55rem" }}>
        <p className="mono dim" style={{ fontSize: "0.75rem" }}>
          {label}
        </p>
        <span className="badge badge-red">{mode === "js" ? "JavaScript" : "HTML"}</span>
      </div>
      <pre className="mono code-pane">{content}</pre>
      <style>{`
        .source-view .code-pane {
          margin:0; padding:1rem; max-height:340px; overflow:auto;
          background:#050505; border:1px solid var(--border); border-radius:10px;
          color:#d4d4d8; font-size:.78rem; line-height:1.55; white-space:pre-wrap; word-break:break-word;
        }
      `}</style>
    </div>
  );
}
