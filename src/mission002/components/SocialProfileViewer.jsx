export default function SocialProfileViewer() {
  return (
    <div className="social-card">
      <div className="social-cover" />
      <div className="social-head">
        <img className="social-avatar" src="/mission-002/profile_kwame.png" alt="Profile" />
        <div>
          <div className="social-name">Kwame M.</div>
          <div className="mono dim">@trailwalker_km · Tarkwa</div>
          <p className="social-bio">
            Engineering student. Night walks. Collecting quiet places. DMs closed.
          </p>
          <div className="mono dim" style={{ fontSize: "0.75rem" }}>
            📍 Tagged location: Library Path · UMaT
          </div>
        </div>
      </div>

      <div className="social-stats">
        <span><strong>128</strong> posts</span>
        <span><strong>842</strong> followers</span>
        <span><strong>310</strong> following</span>
      </div>

      <article className="social-post">
        <div className="mono dim" style={{ fontSize: "0.72rem" }}>2d ago</div>
        <p>Last campus walk for a while. The path behind the library feels different after sunset.</p>
        <div className="social-actions">♥ 46 · 💬 8 · ↗ Share</div>
        <div className="social-comments">
          <div><strong>@net_nana</strong> Stay safe out there.</div>
          <div><strong>@lab_group</strong> You still coming to the meeting?</div>
        </div>
      </article>

      <article className="social-post">
        <div className="mono dim" style={{ fontSize: "0.72rem" }}>18h ago</div>
        <p>If you find the letter, you already know too much.</p>
        <div className="social-actions">♥ 12 · 💬 3 · ↗ Share</div>
        <div className="social-comments">
          <div><strong>@ghostline_x</strong> weird flex but ok</div>
          <div>
            <strong>@signal_drop</strong> check the replies carefully —{" "}
            <span className="flag-inline">ACC{"{"}social_detective{"}"}</span>
          </div>
          <div><strong>@trailwalker_km</strong> logging off.</div>
        </div>
      </article>

      <style>{`
        .social-card {
          border:1px solid var(--border-red); border-radius:14px; overflow:hidden; background:#0a0a0a;
        }
        .social-cover {
          height:96px; background:
            linear-gradient(120deg, rgba(176,0,32,.55), transparent 55%),
            linear-gradient(#1a1a1a, #0d0d0d);
        }
        .social-head { display:flex; gap:1rem; padding:0 1rem 1rem; margin-top:-28px; align-items:flex-end; }
        .social-avatar {
          width:84px; height:84px; border-radius:50%; object-fit:cover;
          border:3px solid #000; background:#222;
        }
        .social-name { font-family:var(--font-display); letter-spacing:.04em; font-size:1.05rem; }
        .social-bio { color:var(--muted); margin:.35rem 0 .45rem; font-size:.92rem; }
        .social-stats {
          display:flex; gap:1rem; padding:.65rem 1rem; border-top:1px solid var(--border);
          border-bottom:1px solid var(--border); font-family:var(--font-mono); font-size:.8rem; color:var(--muted);
        }
        .social-stats strong { color:var(--white); margin-right:.25rem; }
        .social-post { padding:1rem; border-bottom:1px solid var(--border); }
        .social-post p { margin:.45rem 0; }
        .social-actions { font-family:var(--font-mono); font-size:.72rem; color:var(--dim); }
        .social-comments { margin-top:.7rem; display:grid; gap:.35rem; font-size:.9rem; color:var(--muted); }
        .flag-inline { color: var(--red-bright); font-family: var(--font-code); font-size: .86rem; }
        @media (max-width:560px){ .social-head { flex-direction:column; align-items:flex-start; } }
      `}</style>
    </div>
  );
}
