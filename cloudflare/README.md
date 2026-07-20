# Cloudflare Access for The Witzel Family

Protect `thewitzel.family` and all subdomains (including `ride.thewitzel.family`) with **Cloudflare Access** + **Google sign-in**. No auth code in individual Vercel projects.

## Architecture

```
Browser → Cloudflare (Access gate) → Vercel (your apps)
```

- Unauthenticated visitors see Cloudflare's Google login page.
- Only emails listed in `family-emails.txt` are allowed through.
- Works for every subdomain proxied through Cloudflare.

## Prerequisites

1. **Cloudflare account** (free) with Zero Trust enabled: [dash.cloudflare.com](https://dash.cloudflare.com)
2. **Cloudflare API token** — see [Create API token](#create-api-token) below.

3. **Google OAuth client** for Cloudflare Access:
   - Go to [Google Cloud Console → Credentials](https://console.cloud.google.com/apis/credentials)
   - Create **OAuth 2.0 Client ID** (Web application)
   - Authorized redirect URI: Cloudflare shows this when you add Google as an IdP in Zero Trust → Settings → Authentication. It looks like:
     ```
     https://<your-team-name>.cloudflareaccess.com/cdn-cgi/access/callback
     ```
   - Copy Client ID and Client Secret

4. **Family email allowlist** — Gmail addresses allowed to sign in

## Create API token

Cloudflare does **not** have a template named "Edit Cloudflare Zero Trust". Use a **Custom Token** instead.

### Option A — pre-filled link (fastest)

Open this link while logged into Cloudflare — it pre-fills Access permissions:

[Create Access Management Token](https://dash.cloudflare.com/profile/api-tokens?permissionGroupKeys=%5B%7B%22key%22%3A%22access%22%2C%22type%22%3A%22edit%22%7D%2C%7B%22key%22%3A%22access_acct%22%2C%22type%22%3A%22edit%22%7D%5D&accountId=%2A&zoneId=all&name=thewitzel.family%20Access%20setup)

Then click **Add more permissions** and add the Zone permissions from Option B below.

### Option B — build from scratch

1. Go to [My Profile → API Tokens](https://dash.cloudflare.com/profile/api-tokens)
2. Click **Create Token**
3. Under **Custom token**, click **Get started**
4. Name: `thewitzel.family Access setup`
5. Add these permissions:

**Account permissions** (scope to your account `869d2ae440ce2f06b978d836d401c771`):

| Permission | Access |
|---|---|
| Access: Apps and Policies | Edit |
| Access: Organizations, Identity Providers, and Groups | Edit |

**Zone permissions** (use **All zones** on first run — zone doesn't exist yet):

| Permission | Access |
|---|---|
| Zone | Edit |
| DNS | Edit |
| Zone Settings | Edit |

6. **Continue to summary** → **Create Token** → copy the secret once

Verify:

```bash
curl "https://api.cloudflare.com/client/v4/user/tokens/verify" \
  --header "Authorization: Bearer YOUR_TOKEN"
```

## Quick setup

```bash
cd cloudflare
cp .env.example .env          # fill in API token, account ID, Google OAuth
cp family-emails.txt.example family-emails.txt   # add family Gmail addresses
chmod +x setup.sh
./setup.sh
```

The script will:
- Add `thewitzel.family` to Cloudflare (if needed)
- Create proxied DNS records pointing to Vercel
- Set SSL to Full (strict)
- Configure Google as identity provider
- Create Access apps for apex + `*.thewitzel.family`

## After running the script

### 1. Change nameservers (required)

Your domain is currently on **Vercel nameservers**. Access only works when traffic flows through Cloudflare.

The setup script prints Cloudflare nameservers. Update them at:

**Vercel** → Domains → `thewitzel.family` → Nameservers

Replace Vercel NS with Cloudflare NS (e.g. `ada.ns.cloudflare.com`, `bob.ns.cloudflare.com`).

Keep the domain registered at Vercel — you're only changing where DNS is managed.

### 2. Verify Vercel domains stay configured

These should already exist (no change needed if already set):

| Domain | Vercel project |
|--------|----------------|
| `thewitzel.family` | thewitzel.family |
| `www.thewitzel.family` | thewitzel.family |
| `ride.thewitzel.family` | ride-wall |

### 3. Test

After nameserver propagation (5–30 min):

1. Open https://thewitzel.family in a private window
2. You should see Cloudflare Access → Sign in with Google
3. Sign in with an allowed email → landing page loads
4. Sign in with a non-family email → blocked

### 4. Optional: reduce `.vercel.app` bypass

Direct Vercel URLs (e.g. `thewitzelfamily.vercel.app`) bypass Cloudflare. Options:

- Don't share those URLs
- Enable **Vercel Deployment Protection** on preview/production aliases (Vercel dashboard → Project → Deployment Protection)

Cloudflare Verified Proxy for Vercel is automatic when using Cloudflare's orange-cloud proxy — no extra Vercel config needed.

## Adding a new subdomain later

1. Add the subdomain in Vercel (project settings → Domains)
2. Add a proxied CNAME in Cloudflare DNS: `newapp.thewitzel.family` → `cname.vercel-dns.com`
3. Access on `*.thewitzel.family` covers it automatically — no new auth setup

## Adding a family member

Edit `family-emails.txt` and re-run `./setup.sh`.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Site still public, no login | Nameservers not switched to Cloudflare yet, or DNS not proxied (orange cloud) |
| 403 from Vercel after switching | Confirm SSL mode is **Full (strict)** in Cloudflare |
| Google login fails | Check OAuth redirect URI matches Cloudflare callback exactly |
| `ride.thewitzel.family` not protected | Ensure DNS record exists and is **proxied** in Cloudflare |
| Too many redirects | SSL mode should be Full (strict), not Flexible |

## Manual dashboard setup

If you prefer the UI over the script:

1. **Cloudflare** → Add site → `thewitzel.family`
2. **DNS** → CNAME `@`, `www`, `ride` → `cname.vercel-dns.com` (proxied)
3. **SSL/TLS** → Full (strict)
4. **Zero Trust** → Access → Applications → Add `thewitzel.family` and `*.thewitzel.family`
5. **Policy** → Allow → Emails → add family addresses
6. **Authentication** → Google → add OAuth credentials
