import { useState } from "react";

export default function PdfEvidenceViewer() {
  const [page, setPage] = useState(1);

  return (
    <div className="ev-viewer">
      <div className="ev-toolbar">
        <button type="button" className="btn btn-ghost btn-sm" disabled={page === 1} onClick={() => setPage(1)}>
          Page 1
        </button>
        <button type="button" className="btn btn-ghost btn-sm" disabled={page === 2} onClick={() => setPage(2)}>
          Page 2
        </button>
        <span className="mono dim" style={{ fontSize: "0.75rem", marginLeft: "auto" }}>
          farewell_letter.pdf · Interactive viewer
        </span>
      </div>

      <div className="pdf-page">
        {page === 1 ? (
          <>
            <h4>To whoever finds this</h4>
            <p>
              I did not mean for things to go this far. Campus felt smaller every day, and the messages kept coming after
              dark.
            </p>
            <p>
              If you are reading this, start with what I left behind — the photo from the path near the library, and the
              notes I never meant to share.
            </p>
            <p style={{ color: "#ffffff", userSelect: "text" }}>
              {"ACC{hidden_pdf}"}
            </p>
            <p className="mono dim" style={{ fontSize: "0.72rem" }}>
              (Page 1 of 2 — some ink may not print well.)
            </p>
          </>
        ) : (
          <>
            <h4>Page 2 — unfinished</h4>
            <p>I will delete the account tonight. Do not look for me on campus.</p>
            <p style={{ fontSize: "0.55rem", letterSpacing: "0.08em", opacity: 0.55, lineHeight: 1.8 }}>
              look closer · select blank lines · white on white · ACC{"{"}hidden_pdf{"}"}
            </p>
            <div
              style={{
                marginTop: "2rem",
                color: "#f7f7f7",
                background: "#f7f7f7",
                padding: "0.75rem",
                borderRadius: "6px",
                userSelect: "text",
              }}
              title="Highlight this area"
            >
              ACC{"{"}hidden_pdf{"}"}
            </div>
            <p className="mono dim" style={{ marginTop: "0.85rem", fontSize: "0.72rem" }}>
              Tip: select pale regions on the page.
            </p>
          </>
        )}
      </div>

      <style>{`
        .pdf-page {
          min-height: 320px; padding: 1.4rem 1.5rem; border-radius: 10px;
          background: #f4f4f5; color: #18181b; font-family: "IBM Plex Sans", Georgia, serif;
          border: 1px solid rgba(176,0,32,.35); box-shadow: 0 12px 40px rgba(0,0,0,.35);
        }
        .pdf-page h4 { margin: 0 0 .85rem; font-family: Georgia, serif; font-size: 1.15rem; }
        .pdf-page p { margin: 0 0 .85rem; line-height: 1.6; }
      `}</style>
    </div>
  );
}
