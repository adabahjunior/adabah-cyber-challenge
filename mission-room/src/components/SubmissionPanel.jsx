export default function SubmissionPanel({
  attackType,
  evidenceFound,
  actions,
  onChange,
  onSubmit,
  disabled,
  options,
}) {
  return (
    <section className="glass glass-red" style={{ padding: "1.25rem 1.3rem" }}>
      <p className="eyebrow">Final report</p>
      <h2 style={{ fontSize: "1.15rem", marginBottom: "0.85rem" }}>Submission System</h2>

      <div className="field">
        <label>Attack Type</label>
        <select
          value={attackType}
          disabled={disabled}
          onChange={(e) => onChange({ attackType: e.target.value })}
        >
          <option value="">Select attack type</option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label>Evidence Found</label>
        <textarea
          value={evidenceFound}
          disabled={disabled}
          onChange={(e) => onChange({ evidenceFound: e.target.value })}
          placeholder="List the key clues from the email, website, and headers…"
        />
      </div>

      <div className="field">
        <label>Recommended Actions</label>
        <textarea
          value={actions}
          disabled={disabled}
          onChange={(e) => onChange({ actions: e.target.value })}
          placeholder="What should the student and university do next?"
        />
      </div>

      <button className="btn btn-primary" type="button" disabled={disabled} onClick={onSubmit}>
        Submit Investigation
      </button>
    </section>
  );
}
