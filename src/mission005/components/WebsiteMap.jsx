import { PAGES } from "./WebsiteSimulator";

export default function WebsiteMap({ currentPage, visited, onJump }) {
  const entries = Object.entries(PAGES);

  return (
    <div className="web-map">
      <div className="mono dim label">Website map</div>
      <ul>
        {entries.map(([key, meta]) => (
          <li key={key} className={`${visited[key] ? "seen" : ""} ${currentPage === key ? "here" : ""}`}>
            <button type="button" onClick={() => onJump?.(key)}>
              <span className="path mono">{meta.path}</span>
              <span className="name">
                {meta.title}
                {meta.hidden ? " · unlinked" : ""}
              </span>
            </button>
          </li>
        ))}
      </ul>
      <p className="mono dim tip">Type a path in the browser bar (e.g. /backup) or jump from this map.</p>
      <style>{`
        .web-map .label {
          font-size:.68rem; letter-spacing:.08em; text-transform:uppercase; margin-bottom:.35rem;
        }
        .web-map ul { list-style:none; margin:0; padding:0; display:grid; gap:.3rem; }
        .web-map button {
          width:100%; text-align:left; background:rgba(255,255,255,.02); border:1px solid var(--border);
          border-radius:8px; padding:.45rem .55rem; cursor:pointer; color:var(--muted);
          display:grid; gap:.1rem;
        }
        .web-map li.seen button { color:#86efac; border-color:rgba(34,197,94,.25); }
        .web-map li.here button { border-color:rgba(224,17,54,.5); color:#fff; background:rgba(176,0,32,.12); }
        .web-map .path { font-size:.72rem; color:var(--dim); }
        .web-map .name { font-size:.8rem; font-family:var(--font-mono); }
        .web-map .tip { margin:.55rem 0 0; font-size:.68rem; line-height:1.4; }
      `}</style>
    </div>
  );
}
