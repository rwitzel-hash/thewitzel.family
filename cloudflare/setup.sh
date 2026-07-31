#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="${ROOT}/.env"
EMAILS_FILE="${ROOT}/family-emails.txt"

if [[ -f "$ENV_FILE" ]]; then
  set -a
  # shellcheck disable=SC1090
  source "$ENV_FILE"
  set +a
fi

: "${CLOUDFLARE_API_TOKEN:?Set CLOUDFLARE_API_TOKEN in cloudflare/.env}"
: "${CLOUDFLARE_ACCOUNT_ID:?Set CLOUDFLARE_ACCOUNT_ID in cloudflare/.env}"
: "${GOOGLE_CLIENT_ID:?Set GOOGLE_CLIENT_ID in cloudflare/.env}"
: "${GOOGLE_CLIENT_SECRET:?Set GOOGLE_CLIENT_SECRET in cloudflare/.env}"

DOMAIN="${DOMAIN:-thewitzel.family}"
# Project-specific CNAME from Vercel Domains UI (subdomains). Apex uses VERCEL_IP.
VERCEL_CNAME="${VERCEL_CNAME:-0fe9a2c119302701.vercel-dns-017.com}"
VERCEL_IP="${VERCEL_IP:-76.76.21.21}"
# Keep orange-cloud proxy on so Cloudflare Access works. Vercel may show
# "Invalid Configuration" while proxied — that is expected and safe to ignore.
PROXY_DNS="${PROXY_DNS:-true}"
API="https://api.cloudflare.com/client/v4"

cf_api() {
  local method="$1"
  local path="$2"
  local data="${3:-}"

  if [[ -n "$data" ]]; then
    curl -fsS -X "$method" "${API}${path}" \
      -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
      -H "Content-Type: application/json" \
      --data "$data"
  else
    curl -fsS -X "$method" "${API}${path}" \
      -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
      -H "Content-Type: application/json"
  fi
}

json_result() {
  python3 -c 'import json,sys; print(json.load(sys.stdin)["result"])'
}

json_result_id() {
  python3 -c 'import json,sys; print(json.load(sys.stdin)["result"]["id"])'
}

echo "==> Ensuring Cloudflare zone exists for ${DOMAIN}"

ZONE_JSON="$(cf_api GET "/zones?name=${DOMAIN}")"
ZONE_ID="$(echo "$ZONE_JSON" | python3 -c 'import json,sys; r=json.load(sys.stdin)["result"]; print(r[0]["id"] if r else "")')"

if [[ -z "$ZONE_ID" ]]; then
  echo "    Creating zone..."
  CREATE_RESPONSE="$(cf_api POST "/zones" "{\"account\":{\"id\":\"${CLOUDFLARE_ACCOUNT_ID}\"},\"name\":\"${DOMAIN}\",\"type\":\"full\"}" 2>&1 || true)"
  ZONE_ID="$(echo "$CREATE_RESPONSE" | python3 -c 'import json,sys
raw=sys.stdin.read().strip()
if not raw:
    raise SystemExit(1)
data=json.loads(raw)
if data.get("success") and data.get("result"):
    print(data["result"]["id"])
else:
    msg=data.get("errors",[{}])[0].get("message","unknown error")
    print(f"ERROR:{msg}", file=sys.stderr)
    raise SystemExit(1)
' 2>/dev/null)" || {
    echo ""
    echo "ERROR: Could not create zone via API."
    echo "$CREATE_RESPONSE" | python3 -c 'import json,sys
raw=sys.stdin.read().strip()
try:
    data=json.loads(raw)
    print(data.get("errors",[{}])[0].get("message","Permission denied"))
except Exception:
    print(raw)
' 2>/dev/null || echo "$CREATE_RESPONSE"
    echo ""
    echo "Fix: add the site manually at https://dash.cloudflare.com/?to=/:account/add-site"
    echo "     then add Zone DNS Edit + Zone Settings Edit to your API token and re-run."
    exit 1
  }
else
  echo "    Zone already exists: ${ZONE_ID}"
fi

NS="$(cf_api GET "/zones/${ZONE_ID}" | python3 -c 'import json,sys; print("\n".join(json.load(sys.stdin)["result"]["name_servers"]))')"
echo
echo "IMPORTANT: Update nameservers at Vercel registrar to:"
echo "$NS" | sed 's/^/  /'
echo
echo "Vercel dashboard: https://vercel.com/witz1/thewitzel.family/settings/domains"
echo "(Or Vercel Domains → thewitzel.family → Nameservers)"
echo

upsert_dns() {
  local name="$1"
  local record_type="$2"
  local target="$3"
  PROXY_DNS="$PROXY_DNS" RECORD_TYPE="$record_type" python3 - <<PY
import json, os, urllib.request

token = os.environ["CLOUDFLARE_API_TOKEN"]
zone_id = os.environ["ZONE_ID"]
name = "${name}"
target = "${target}"
record_type = os.environ["RECORD_TYPE"]
proxied = os.environ.get("PROXY_DNS", "true").lower() in ("1", "true", "yes")
ttl = 1 if proxied else 300
api = "https://api.cloudflare.com/client/v4"

def call(method, path, data=None):
    req = urllib.request.Request(
        f"{api}{path}",
        method=method,
        headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
        data=json.dumps(data).encode() if data is not None else None,
    )
    with urllib.request.urlopen(req) as resp:
        return json.load(resp)

records = call("GET", f"/zones/{zone_id}/dns_records?name={name}")["result"]
match = next(
    (
        r for r in records
        if r["type"] == record_type
        and r.get("content", "").rstrip(".") == target.rstrip(".")
        and bool(r.get("proxied")) == proxied
    ),
    None,
)

mode = "proxied" if proxied else "DNS-only"
if match:
    print(f"    DNS {name} already points to {target} ({mode})")
else:
    for r in records:
        if r["type"] in ("A", "AAAA", "CNAME"):
            call("DELETE", f"/zones/{zone_id}/dns_records/{r['id']}")
            print(f"    Removed conflicting {r['type']} record for {name}")

    payload = {
        "type": record_type,
        "name": name,
        "content": target,
        "proxied": proxied,
        "ttl": ttl,
    }
    call("POST", f"/zones/{zone_id}/dns_records", payload)
    print(f"    Created {record_type} {name} -> {target} ({mode})")
PY
}

export ZONE_ID
export PROXY_DNS

echo "==> Configuring DNS records for Vercel (proxy=${PROXY_DNS})"
upsert_dns "${DOMAIN}" "A" "${VERCEL_IP}"
upsert_dns "www.${DOMAIN}" "CNAME" "${VERCEL_CNAME}"
upsert_dns "ride.${DOMAIN}" "A" "${VERCEL_IP}"
for member in paul vee gabby heidi; do
  upsert_dns "${member}.${DOMAIN}" "CNAME" "${VERCEL_CNAME}"
done

echo "==> Setting SSL mode to Full (strict)"
cf_api PATCH "/zones/${ZONE_ID}/settings/ssl" '{"value":"strict"}' >/dev/null

echo "==> Ensuring Google identity provider exists"
IDP_JSON="$(cf_api GET "/accounts/${CLOUDFLARE_ACCOUNT_ID}/access/identity_providers")"
GOOGLE_IDP_ID="$(echo "$IDP_JSON" | python3 -c "
import json, sys
for p in json.load(sys.stdin).get('result', []):
    if p.get('type') == 'google':
        print(p['id'])
        break
")"

if [[ -z "$GOOGLE_IDP_ID" ]]; then
  echo "    Creating Google IdP..."
  GOOGLE_IDP_ID="$(cf_api POST "/accounts/${CLOUDFLARE_ACCOUNT_ID}/access/identity_providers" "$(python3 - <<PY
import json
print(json.dumps({
  "name": "Google",
  "type": "google",
  "config": {
    "client_id": "${GOOGLE_CLIENT_ID}",
    "client_secret": "${GOOGLE_CLIENT_SECRET}",
  },
}))
PY
)" | json_result_id)"
else
  echo "    Google IdP already exists: ${GOOGLE_IDP_ID}"
fi

AZURE_IDP_ID="$(echo "$IDP_JSON" | python3 -c "
import json, sys
for p in json.load(sys.stdin).get('result', []):
    if p.get('type') == 'azureAD':
        print(p['id'])
        break
")"

ALLOWED_IDPS_JSON="$(python3 - <<PY
import json
idps = ["${GOOGLE_IDP_ID}"]
if "${AZURE_IDP_ID}":
    idps.append("${AZURE_IDP_ID}")
print(json.dumps(idps))
PY
)"

AUTO_REDIRECT_TO_IDENTITY="$(python3 - <<PY
import json
idps = json.loads('${ALLOWED_IDPS_JSON}')
print(repr(len(idps) == 1))
PY
)"

if [[ -n "$AZURE_IDP_ID" ]]; then
  echo "    Azure AD IdP found: ${AZURE_IDP_ID}"
fi

if [[ ! -f "$EMAILS_FILE" ]]; then
  echo "ERROR: Create ${EMAILS_FILE} from family-emails.txt.example with allowed emails."
  exit 1
fi

EMAIL_INCLUDES="$(EMAILS_FILE="$EMAILS_FILE" python3 - <<'PY'
import json
import os
from pathlib import Path

emails = []
path = Path(os.environ["EMAILS_FILE"])
for line in path.read_text().splitlines():
    line = line.strip()
    if line and not line.startswith("#"):
        emails.append({"email": {"email": line}})
if not emails:
    raise SystemExit(f"No emails found in {path}")
print(json.dumps(emails))
PY
)"

create_access_app() {
  local app_domain="$1"
  local app_name="$2"

  local apps
  apps="$(cf_api GET "/accounts/${CLOUDFLARE_ACCOUNT_ID}/access/apps?domain=${app_domain}" 2>/dev/null || echo '{"result":[]}')"
  local app_id
  app_id="$(echo "$apps" | python3 -c "
import json, sys
for a in json.load(sys.stdin).get('result', []):
    if a.get('domain') == '${app_domain}':
        print(a['id'])
        break
")"

  local app_payload
  app_payload="$(python3 - <<PY
import json
print(json.dumps({
  "name": "${app_name}",
  "domain": "${app_domain}",
  "type": "self_hosted",
  "session_duration": "168h",
  "auto_redirect_to_identity": ${AUTO_REDIRECT_TO_IDENTITY},
  "allowed_idps": ${ALLOWED_IDPS_JSON},
  "policies": [{
    "name": "Witzel family",
    "decision": "allow",
    "precedence": 1,
    "include": ${EMAIL_INCLUDES},
  }],
}))
PY
)"

  local response
  if [[ -n "$app_id" ]]; then
    echo "    Updating Access app for ${app_domain}"
    response="$(cf_api PUT "/accounts/${CLOUDFLARE_ACCOUNT_ID}/access/apps/${app_id}" "$app_payload" 2>&1)" && return 0
  else
    echo "    Creating Access app for ${app_domain}"
    response="$(cf_api POST "/accounts/${CLOUDFLARE_ACCOUNT_ID}/access/apps" "$app_payload" 2>&1)" && return 0
  fi

  if echo "$response" | grep -q "domain does not belong to zone"; then
    echo "    Skipped ${app_domain} — zone is still pending (switch nameservers first)"
    return 0
  fi

  echo "$response" >&2
  return 1
}

echo "==> Creating Cloudflare Access applications"
ACCESS_PENDING=0
create_access_app "${DOMAIN}" "The Witzel Family (apex)" || ACCESS_PENDING=1
create_access_app "*.${DOMAIN}" "The Witzel Family (subdomains)" || ACCESS_PENDING=1

echo
if [[ "$ACCESS_PENDING" -eq 1 ]]; then
  echo "Access apps could not be created yet — zone status is likely 'pending'."
  echo "Switch nameservers at Vercel, wait for the zone to become Active, then re-run:"
  echo "  ./setup.sh"
  echo
fi
echo "Done! Next steps:"
echo "  1. Change nameservers at Vercel to the Cloudflare nameservers listed above."
echo "  2. Wait for DNS propagation (usually 5-30 minutes)."
echo "  3. Visit https://${DOMAIN} — you should see Google sign-in."
echo "  4. Optional: enable Vercel Deployment Protection on *.vercel.app URLs to reduce bypass."
echo
