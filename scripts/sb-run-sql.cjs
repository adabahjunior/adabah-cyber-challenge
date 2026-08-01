/**
 * Run SQL against the linked Supabase project via Management API.
 * Requires: SUPABASE_ACCESS_TOKEN in the environment.
 *
 * Usage:
 *   node scripts/sb-run-sql.cjs path/to/file.sql
 *   node scripts/sb-run-sql.cjs -e   (reads SQL from stdin)
 */
const fs = require("fs");
const path = require("path");

const PROJECT_REF = "zxxhkhnqcilqktmyblhf";
const token = process.env.SUPABASE_ACCESS_TOKEN;
const uri = `https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`;

if (!token) {
  console.error("Set SUPABASE_ACCESS_TOKEN before running this script.");
  process.exit(1);
}

async function run(sql) {
  const res = await fetch(uri, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: sql }),
  });
  const text = await res.text();
  if (!res.ok) {
    console.error("FAIL", text);
    process.exit(1);
  }
  return text;
}

(async () => {
  const arg = process.argv[2];
  let sql = "";
  if (!arg || arg === "-e") {
    sql = fs.readFileSync(0, "utf8");
  } else {
    sql = fs.readFileSync(path.resolve(arg), "utf8");
    // Strip UTF-8 BOM if present
    if (sql.charCodeAt(0) === 0xfeff) sql = sql.slice(1);
  }
  if (!sql.trim()) {
    console.error("No SQL provided.");
    process.exit(1);
  }
  const out = await run(sql);
  console.log("OK", path.basename(arg || "stdin"));
  console.log(out);
})().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
