export default function PolicyViewer() {
  return (
    <div className="policy">
      <p className="eyebrow">UMaT Information Security Office</p>
      <h3 style={{ fontSize: "1.05rem", marginBottom: "0.85rem" }}>Campus Password Policy · 2026</h3>
      <article className="policy-body">
        <p>
          All university accounts must use unique passwords of at least twelve characters. Passwords must not
          include the account holder&apos;s name, student ID, or the word &quot;password.&quot;
        </p>
        <p>
          Shared service accounts are prohibited. Administrative credentials require multi-factor authentication
          and must be rotated every ninety days.
        </p>
        <p>
          Credential stuffing and password spraying remain the leading cause of campus account compromise.
          Staff must never reuse personal passwords on university systems. Evidence review note for investigators:
          ACC{"{"}policy_guardian{"}"} — archive this reference with the case file.
        </p>
        <p>
          Password managers are approved for faculty and student use. Plaintext storage of credentials in
          spreadsheets, chat messages, or shared drives violates this policy and may result in account lockout.
        </p>
        <p>
          Failed login thresholds: five consecutive failures trigger a fifteen-minute lockout. Security Operations
          must be notified of any successful Admin login following multiple failures.
        </p>
      </article>
      <style>{`
        .policy-body {
          display:grid; gap:1rem; line-height:1.65; color:var(--muted);
          border-left:2px solid rgba(176,0,32,.55); padding-left:1rem;
          background:linear-gradient(90deg, rgba(176,0,32,.06), transparent 55%);
          padding:.85rem 1rem .85rem 1.1rem; border-radius:0 10px 10px 0;
        }
        .policy-body p { margin:0; font-size:.95rem; }
      `}</style>
    </div>
  );
}
