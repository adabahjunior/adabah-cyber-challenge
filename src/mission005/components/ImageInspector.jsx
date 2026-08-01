export default function ImageInspector() {
  const images = [
    {
      file: "team-campus.jpg",
      alt: "NovaTech team at the campus lab",
      page: "Home",
      note: "Marketing photo — no sensitive payload.",
    },
    {
      file: "office-front-ACC_image_detective.png",
      alt: "Front entrance — ACC{image_detective}",
      page: "Contact",
      note: "Suspicious filename and alt text contain investigator evidence.",
      flagged: true,
    },
  ];

  return (
    <div className="img-inspect">
      <p className="muted" style={{ marginBottom: "0.85rem" }}>
        Image assets recovered from the public site. Inspect filenames, alt text, and captions.
      </p>
      <div className="img-grid">
        {images.map((img) => (
          <article key={img.file} className={`card ${img.flagged ? "flag" : ""}`}>
            <div className="thumb" aria-hidden="true" />
            <p className="mono file">{img.file}</p>
            <p className="meta">
              <span className="dim">Page</span> {img.page}
            </p>
            <p className="meta">
              <span className="dim">Alt</span> {img.alt}
            </p>
            <p className="note">{img.note}</p>
          </article>
        ))}
      </div>
      <style>{`
        .img-grid { display:grid; gap:.75rem; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); }
        .img-inspect .card {
          border:1px solid var(--border); border-radius:12px; padding:.9rem;
          background:rgba(255,255,255,.02);
        }
        .img-inspect .card.flag {
          border-color:rgba(224,17,54,.55); background:rgba(176,0,32,.1);
          box-shadow:0 0 20px rgba(176,0,32,.15);
        }
        .img-inspect .thumb {
          height:72px; border-radius:8px; margin-bottom:.65rem;
          background:
            linear-gradient(135deg, rgba(176,0,32,.35), transparent 55%),
            repeating-linear-gradient(90deg,#151515 0 8px,#101010 8px 16px);
        }
        .img-inspect .file { color:var(--red-bright); font-size:.85rem; word-break:break-all; }
        .img-inspect .meta { margin-top:.35rem; font-size:.86rem; color:var(--muted); }
        .img-inspect .dim { color:var(--dim); font-family:var(--font-mono); font-size:.68rem; text-transform:uppercase; margin-right:.35rem; }
        .img-inspect .note { margin-top:.55rem; font-size:.82rem; color:var(--muted); }
      `}</style>
    </div>
  );
}
