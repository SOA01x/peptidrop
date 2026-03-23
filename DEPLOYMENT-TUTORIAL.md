# Peptidrop — Complete Deployment & Domain Setup Tutorial

## Table of Contents

1. Prerequisites & Accounts
2. Supabase Setup (Database & Auth)
3. Anthropic API Setup (AI Engine)
4. Coinbase Commerce Setup (Crypto Payments)
5. Deploy to Vercel (Recommended Hosting)
6. Connect peptidrop.me Domain (Namecheap)
7. Post-Deployment Configuration
8. Testing & Going Live

---

## 1. Prerequisites & Accounts

Before starting, you'll need accounts on these platforms (all have free tiers):

**Required accounts:**
- **GitHub** — https://github.com (to host your code repository)
- **Vercel** — https://vercel.com (hosting — free tier works, recommended for Next.js)
- **Supabase** — https://supabase.com (database + auth — free tier includes 50K monthly active users)
- **Anthropic** — https://console.anthropic.com (AI API — pay-as-you-go)
- **Namecheap** — https://namecheap.com (where your domain peptidrop.me is registered)

**Optional:**
- **Coinbase Commerce** — https://commerce.coinbase.com (crypto payments)

**Local requirements:**
- Node.js 18+ installed (https://nodejs.org)
- Git installed
- A code editor (VS Code recommended)

---

## 2. Supabase Setup

### Step 2.1 — Create a Supabase Project

1. Go to https://supabase.com and sign in
2. Click **"New Project"**
3. Fill in:
   - **Name:** `peptidrop`
   - **Database Password:** Generate a strong password (save this!)
   - **Region:** Choose the closest to your target users (e.g., `US East` for North America)
4. Click **"Create new project"** — wait 2-3 minutes for provisioning

### Step 2.2 — Get Your API Keys

1. In your project dashboard, go to **Settings → API**
2. Copy these values (you'll need them later):
   - **Project URL** → This is your `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → This is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → This is your `SUPABASE_SERVICE_ROLE_KEY` (keep this secret!)

### Step 2.3 — Create Database Tables

1. In Supabase, go to **SQL Editor**
2. Click **"New query"**
3. Paste the entire contents of the `supabase-schema.sql` file from the project
4. Click **"Run"**
5. You should see "Success. No rows returned" — this means all tables, policies, triggers, and indexes were created

### Step 2.4 — Configure Authentication

1. Go to **Authentication → Providers**
2. Ensure **Email** provider is enabled (it is by default)
3. Go to **Authentication → URL Configuration**
4. Set:
   - **Site URL:** `https://peptidrop.me`
   - **Redirect URLs:** Add `https://peptidrop.me/**` and `http://localhost:3000/**`

### Step 2.5 — Disable Email Confirmation (Optional, for faster testing)

1. Go to **Authentication → Email Templates**
2. Under **Settings**, toggle off **"Enable email confirmations"** for development
3. Remember to re-enable this before going fully live

---

## 3. Anthropic API Setup

### Step 3.1 — Get Your API Key

1. Go to https://console.anthropic.com
2. Sign in or create an account
3. Go to **API Keys**
4. Click **"Create Key"**
5. Name it `peptidrop-production`
6. Copy the key — this is your `ANTHROPIC_API_KEY`

### Step 3.2 — Add Credits

1. Go to **Billing** in the Anthropic console
2. Add a payment method
3. Add credits ($20-50 to start; each protocol generation costs roughly $0.01-0.05)

---

## 4. Coinbase Commerce Setup (Crypto Payments)

### Step 4.1 — Create a Coinbase Commerce Account

1. Go to https://commerce.coinbase.com
2. Sign up with your email
3. Complete identity verification

### Step 4.2 — Get API Keys

1. Go to **Settings → Security**
2. Create a new **API Key** → This is your `COINBASE_COMMERCE_API_KEY`
3. Create a **Webhook Subscription:**
   - Endpoint URL: `https://peptidrop.me/api/webhook`
   - Events: Select all `charge:*` events
4. Copy the **Webhook Shared Secret** → This is your `COINBASE_WEBHOOK_SECRET`

---

## 5. Deploy to Vercel (Recommended)

Vercel is the company behind Next.js and provides the best hosting experience for Next.js apps. The free "Hobby" tier is sufficient to start.

### Why Vercel over Namecheap hosting?

Namecheap's shared hosting runs Apache/PHP — it **cannot run Next.js** (a Node.js framework). You need a platform that supports Node.js server-side rendering. Vercel is purpose-built for this and offers:

- Automatic builds on every git push
- Edge network (fast globally)
- Serverless functions (for your API routes)
- Free SSL certificates
- Zero-config Next.js support

**Namecheap will only be used for domain DNS management** — pointing peptidrop.me to Vercel's servers.

### Step 5.1 — Push Code to GitHub

Open your terminal in the project directory:

```bash
cd peptidrop

# Initialize git repository
git init
git add .
git commit -m "Initial commit - Peptidrop v1.0"

# Create repo on GitHub (via browser or CLI)
# Go to github.com → New Repository → Name: "peptidrop" → Create

# Connect and push
git remote add origin https://github.com/YOUR_USERNAME/peptidrop.git
git branch -M main
git push -u origin main
```

### Step 5.2 — Connect to Vercel

1. Go to https://vercel.com and sign in with GitHub
2. Click **"Add New..." → "Project"**
3. Find and select your `peptidrop` repository
4. Vercel auto-detects Next.js — leave the framework preset as-is

### Step 5.3 — Add Environment Variables

Before deploying, add your environment variables in Vercel:

1. In the project setup screen, expand **"Environment Variables"**
2. Add each variable one by one:

| Key | Value | Environment |
|-----|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | All |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key | All |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key | All |
| `ANTHROPIC_API_KEY` | Your Anthropic API key | All |
| `COINBASE_COMMERCE_API_KEY` | Your Coinbase Commerce key | All |
| `COINBASE_WEBHOOK_SECRET` | Your webhook secret | All |
| `NEXT_PUBLIC_APP_URL` | `https://peptidrop.me` | All |

3. Click **"Deploy"**
4. Wait 2-3 minutes for the build to complete
5. Vercel gives you a temporary URL like `peptidrop-abc123.vercel.app` — test this to confirm it works

### Step 5.4 — Install Dependencies Note

Vercel automatically runs `npm install` and `npm run build` during deployment. If the build fails, check the build logs in Vercel's dashboard for the specific error.

---

## 6. Connect peptidrop.me Domain (Namecheap → Vercel)

This is the critical step that connects your domain to your hosted application.

### Step 6.1 — Add Domain in Vercel

1. In your Vercel project, go to **Settings → Domains**
2. Type `peptidrop.me` and click **"Add"**
3. Vercel will show you the DNS records you need to configure
4. Also add `www.peptidrop.me` — Vercel will redirect it to the apex domain

Vercel will show something like:

```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### Step 6.2 — Configure DNS in Namecheap

1. Log in to https://namecheap.com
2. Go to **Domain List** → Find `peptidrop.me` → Click **"Manage"**
3. Go to the **"Advanced DNS"** tab
4. **Delete** any existing A records, AAAA records, or CNAME records for `@` and `www` (leave MX/TXT records if you have email set up)

5. **Add the following records:**

**Record 1 — Apex Domain (A Record):**
| Field | Value |
|-------|-------|
| Type | A Record |
| Host | `@` |
| Value | `76.76.21.21` |
| TTL | Automatic |

**Record 2 — www Subdomain (CNAME):**
| Field | Value |
|-------|-------|
| Type | CNAME Record |
| Host | `www` |
| Value | `cname.vercel-dns.com` |
| TTL | Automatic |

6. Click the **green checkmark** to save each record

### Step 6.3 — Wait for DNS Propagation

- DNS changes can take **5 minutes to 48 hours** to propagate globally
- Typically it takes **15-30 minutes**
- You can check propagation at https://dnschecker.org — search for `peptidrop.me`

### Step 6.4 — Verify in Vercel

1. Go back to **Vercel → Settings → Domains**
2. Both `peptidrop.me` and `www.peptidrop.me` should show a **green checkmark** once DNS propagates
3. Vercel automatically provisions a free **SSL certificate** (HTTPS) — this usually takes a few minutes after DNS verification

### Step 6.5 — Test Your Domain

Open your browser and visit:
- `https://peptidrop.me` — Should load the homepage
- `https://www.peptidrop.me` — Should redirect to the above
- `http://peptidrop.me` — Should auto-redirect to HTTPS

---

## 7. Post-Deployment Configuration

### Step 7.1 — Update Supabase Redirect URLs

1. Go to Supabase → **Authentication → URL Configuration**
2. Make sure `https://peptidrop.me` is set as the **Site URL**
3. Ensure redirect URLs include `https://peptidrop.me/**`

### Step 7.2 — Update Coinbase Webhook URL

1. Go to Coinbase Commerce → **Settings → Webhook subscriptions**
2. Confirm the endpoint is `https://peptidrop.me/api/webhook`

### Step 7.3 — Test the Full Flow

1. **Sign up** — Create a test account at `https://peptidrop.me/signup`
2. **Browse peptides** — Visit `/peptides` and test search/filters
3. **Generate a protocol** — Go to `/generator`, select a goal, and generate (this tests the Claude API integration)
4. **Check dashboard** — Visit `/dashboard` and verify credits display

### Step 7.4 — Set Up Vercel Analytics (Optional)

1. In Vercel, go to your project → **Analytics** tab
2. Enable **Web Analytics** (free tier available)
3. This gives you page views, performance metrics, and visitor data

---

## 8. Alternative Hosting Options

If you prefer not to use Vercel, here are alternatives that support Next.js:

### Option A: Railway (https://railway.app)
- Supports Next.js natively
- Simple GitHub integration
- $5/month for hobby usage
- **Domain setup:** Add a custom domain in Railway settings, then point your Namecheap DNS A record to Railway's IP

### Option B: Render (https://render.com)
- Free tier available for web services
- Supports Next.js
- Slightly slower cold starts on free tier
- **Domain setup:** Similar to Vercel — add domain in Render, update Namecheap DNS

### Option C: DigitalOcean App Platform
- Starting at $5/month
- More control over the server
- Good for scaling
- **Domain setup:** Add domain in DO, point Namecheap DNS to DO nameservers

### Option D: Self-hosted VPS (Advanced)
If you want full control:

```bash
# On a VPS (Ubuntu 22.04+)
# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Clone and build
git clone https://github.com/YOUR_USERNAME/peptidrop.git
cd peptidrop
npm install
npm run build

# Run with PM2
npm install -g pm2
pm2 start npm --name "peptidrop" -- start
pm2 save
pm2 startup

# Set up Nginx reverse proxy
sudo apt install nginx
# Configure nginx to proxy port 3000
# Set up Let's Encrypt SSL with certbot
```

For VPS hosting with Namecheap:
1. Point your A record to the VPS IP address
2. Set up Nginx as a reverse proxy
3. Use Certbot for free SSL certificates

---

## Quick Reference — All Environment Variables

```env
# Supabase (from supabase.com → Settings → API)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...

# Anthropic (from console.anthropic.com → API Keys)
ANTHROPIC_API_KEY=sk-ant-api...

# Coinbase Commerce (from commerce.coinbase.com → Settings)
COINBASE_COMMERCE_API_KEY=your-key-here
COINBASE_WEBHOOK_SECRET=your-secret-here

# App
NEXT_PUBLIC_APP_URL=https://peptidrop.me
```

---

## Troubleshooting

**Build fails on Vercel:**
- Check Vercel build logs for specific TypeScript or dependency errors
- Ensure all environment variables are set correctly
- Try running `npm run build` locally first to catch errors

**Domain not resolving:**
- Wait up to 48 hours for DNS propagation
- Verify DNS records at https://dnschecker.org
- Make sure you deleted old conflicting DNS records in Namecheap

**Supabase auth not working:**
- Check that Site URL matches your domain exactly (including https://)
- Verify redirect URLs include your domain with a wildcard pattern
- Check browser console for CORS or redirect errors

**AI generation returns errors:**
- Verify your Anthropic API key is correct and has credits
- Check Vercel function logs (Vercel → your project → Logs)
- The API route timeout on Vercel Hobby plan is 10 seconds — upgrade to Pro ($20/mo) for 60-second timeouts if protocols are timing out

**Webhook not receiving events:**
- Verify the webhook URL includes the full path: `https://peptidrop.me/api/webhook`
- Check Coinbase Commerce webhook logs for delivery attempts
- Ensure the webhook secret matches between Coinbase and your env variable

---

## Cost Estimates (Monthly)

| Service | Free Tier | Paid Tier |
|---------|-----------|-----------|
| Vercel | Free (Hobby) | $20/mo (Pro — longer timeouts) |
| Supabase | Free (50K MAU) | $25/mo (Pro) |
| Anthropic API | Pay-per-use | ~$0.01-0.05 per generation |
| Namecheap Domain | N/A | ~$8-12/year |
| Coinbase Commerce | Free | Free (they charge per transaction) |

**Estimated total to start: $8-12/year for the domain + pay-per-use AI costs.**

The entire stack runs within free tiers until you have significant traffic.
