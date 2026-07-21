# The Witzel Family

A fun landing page for [thewitzel.family](https://thewitzel.family) — the family's home on the web.

## Projects

| Space | URL | Status |
|-------|-----|--------|
| Ride | [ride.thewitzel.family](https://ride.thewitzel.family) | Live |
| Paul | [paul.thewitzel.family](https://paul.thewitzel.family) | Placeholder |
| Vee | [vee.thewitzel.family](https://vee.thewitzel.family) | Placeholder |
| Gabby | [gabby.thewitzel.family](https://gabby.thewitzel.family) | Placeholder |
| Heidi | [heidi.thewitzel.family](https://heidi.thewitzel.family) | Placeholder |
| Schedule, Alysha, Gardening | — | Coming soon |

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Member placeholder sites (also available at subdomains after deploy):

| Person | Local path |
|--------|------------|
| Paul | [/sites/paul](http://localhost:3000/sites/paul) |
| Vee | [/sites/vee](http://localhost:3000/sites/vee) |
| Gabby | [/sites/gabby](http://localhost:3000/sites/gabby) |
| Heidi | [/sites/heidi](http://localhost:3000/sites/heidi) |

After deploy, add each subdomain in **Vercel → thewitzel.family → Settings → Domains**, then run `cd cloudflare && ./setup.sh` to create proxied DNS records.

## Deploy

Deployed on [Vercel](https://vercel.com).

## Family-only access (Cloudflare)

Site access is gated at the edge with [Cloudflare Access](cloudflare/README.md) + Google sign-in. Individual Vercel projects do not implement auth.

```bash
cd cloudflare && cp .env.example .env && cp family-emails.txt.example family-emails.txt
# Edit .env and family-emails.txt, then:
./setup.sh
```
