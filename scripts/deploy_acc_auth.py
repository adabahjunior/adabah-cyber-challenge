import json
import os
import pathlib
import subprocess
import urllib.request

TOKEN = os.environ["SUPABASE_ACCESS_TOKEN"]
REF = "zxxhkhnqcilqktmyblhf"
SQL_PATH = pathlib.Path(__file__).resolve().parents[1] / "supabase" / "migrations" / "20260801000001_acc_auth_profiles.sql"
SQL = SQL_PATH.read_text(encoding="utf-8")

url = f"https://api.supabase.com/v1/projects/{REF}/database/query"
req = urllib.request.Request(
    url,
    data=json.dumps({"query": SQL}).encode("utf-8"),
    headers={
        "Authorization": f"Bearer {TOKEN}",
        "Content-Type": "application/json",
    },
    method="POST",
)
try:
    with urllib.request.urlopen(req, timeout=120) as resp:
        body = resp.read().decode("utf-8")
        print("OK", resp.status)
        print(body[:2000])
except Exception as e:
    if hasattr(e, "read"):
        print("FAIL", e.read().decode("utf-8", errors="replace"))
    else:
        print("FAIL", e)

# Auth URL config via management API
auth_url = f"https://api.supabase.com/v1/projects/{REF}/config/auth"
auth_payload = {
    "site_url": "http://127.0.0.1:5500",
    "uri_allow_list": "http://127.0.0.1:5500/**,http://localhost:5500/**,http://127.0.0.1:5500/login.html,http://localhost:5500/login.html",
    "mailer_autoconfirm": True,
}
req2 = urllib.request.Request(
    auth_url,
    data=json.dumps(auth_payload).encode("utf-8"),
    headers={
        "Authorization": f"Bearer {TOKEN}",
        "Content-Type": "application/json",
    },
    method="PATCH",
)
try:
    with urllib.request.urlopen(req2, timeout=60) as resp:
        print("AUTH_CONFIG", resp.status)
        print(resp.read().decode("utf-8")[:1500])
except Exception as e:
    if hasattr(e, "read"):
        print("AUTH_FAIL", e.read().decode("utf-8", errors="replace")[:1500])
    else:
        print("AUTH_FAIL", e)
