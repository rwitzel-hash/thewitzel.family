# The Witzel Family

A fun landing page for [thewitzel.family](https://thewitzel.family) — the family's home on the web.

## Projects

| Space | URL | Status |
|-------|-----|--------|
| Ride | [ride.thewitzel.family](https://ride.thewitzel.family) | Live |
| Schedule, Heidi, Gabby, Paul, Vee, Alysha, Gardening | — | Coming soon |

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy

Deployed on [Vercel](https://vercel.com).

## Family-only access (Cloudflare)

Site access is gated at the edge with [Cloudflare Access](cloudflare/README.md) + Google sign-in. Individual Vercel projects do not implement auth.

```bash
cd cloudflare && cp .env.example .env && cp family-emails.txt.example family-emails.txt
# Edit .env and family-emails.txt, then:
./setup.sh
```
