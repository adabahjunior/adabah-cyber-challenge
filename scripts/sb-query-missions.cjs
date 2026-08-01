const token = process.env.SUPABASE_ACCESS_TOKEN;
const uri = "https://api.supabase.com/v1/projects/zxxhkhnqcilqktmyblhf/database/query";

async function q(sql) {
  const res = await fetch(uri, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: sql }),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(text);
  return text;
}

(async () => {
  const out = await q(
    "select id, title, week, active, sort_order from public.acc_missions order by sort_order"
  );
  console.log(out);
})().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
