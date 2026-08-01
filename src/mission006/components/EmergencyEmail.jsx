export default function EmergencyEmail() {
  return (
    <div className="em-mail">
      <div className="headers mono">
        <div><span>From</span> ICT Director &lt;ict.director@umat.edu.gh&gt;</div>
        <div><span>To</span> ADABAH Cyber Response Team &lt;acrt@adabah.local&gt;</div>
        <div><span>Cc</span> UTC Duty Manager · University Security Office</div>
        <div><span>Subject</span> PRIORITY — Technology Centre outage / possible intrusion</div>
        <div><span>Sent</span> 07:44 GMT · 01 Aug 2026</div>
      </div>
      <article className="body">
        <p>Team,</p>
        <p>
          At approximately 07:42 we lost access to student records and several departmental networks. Authentication
          and the primary database cluster are offline. Treat this as a confirmed incident until proven otherwise.
        </p>
        <p>
          Do not reboot production hosts yet. Preserve volatile evidence, open the IR channel, and report status every
          fifteen minutes. Priority instruction for ACRT: ACC{"{"}email_priority{"}"} — escalate containment decisions
          through this office before public statements.
        </p>
        <p>
          Campus messaging will say we are investigating a technical fault. Internally, assume an active adversary may
          still be present. Part II of this response will begin once initial evidence is catalogued.
        </p>
        <p>Stand by.<br />— ICT Director</p>
      </article>
      <style>{`
        .em-mail {
          border:1px solid var(--border); border-radius:12px; overflow:hidden;
          background:linear-gradient(180deg, rgba(176,0,32,.08), #070707 28%);
        }
        .em-mail .headers {
          padding:.9rem 1rem; border-bottom:1px solid var(--border); font-size:.78rem;
          display:grid; gap:.35rem; color:var(--muted);
        }
        .em-mail .headers span { color:var(--dim); display:inline-block; min-width:4.2rem; text-transform:uppercase; letter-spacing:.06em; font-size:.65rem; }
        .em-mail .body { padding:1.1rem 1.15rem 1.25rem; line-height:1.65; color:var(--muted); }
        .em-mail .body p { margin:0 0 .9rem; }
      `}</style>
    </div>
  );
}
