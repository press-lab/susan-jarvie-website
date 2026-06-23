# Cloudflare Pages Setup Guide

This guide walks through everything needed to get this site live on Cloudflare Pages with the Decap CMS admin panel working. Estimated time: ~45 minutes.

---

## Overview

The stack:
- **Hosting**: Cloudflare Pages (free tier)
- **Source**: GitHub repository
- **CMS**: Decap CMS at `/admin` — Susan edits content through a web form, changes auto-deploy
- **Contact form**: Formspree (free tier, 50 submissions/month)

How it works: Susan opens `yourdomain.com/admin`, logs in with GitHub, edits any page's text, hits Publish → Cloudflare detects the git change and redeploys the site in ~30 seconds.

---

## Step 1 — Create a GitHub Account and Repository

1. Go to [github.com](https://github.com) and sign up (or log in if you have one).
2. Click the **+** icon → **New repository**
3. Settings:
   - Repository name: `susan-jarvie-website` (or anything you like)
   - Visibility: **Private** (recommended)
   - Leave everything else unchecked
4. Click **Create repository**
5. Upload the site files:
   - On the new repo page, click **uploading an existing file**
   - Drag the entire project folder contents in, then click **Commit changes**

   Or use Git from the terminal (if you have it installed):
   ```bash
   cd "C:\Users\sethp\Documents\GitHub\susan jarvie website"
   git init
   git add .
   git commit -m "Initial site"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/susan-jarvie-website.git
   git push -u origin main
   ```

---

## Step 2 — Create a Cloudflare Account

1. Go to [cloudflare.com](https://cloudflare.com) and sign up for a free account.
2. Verify your email address.

---

## Step 3 — Deploy to Cloudflare Pages

1. In the Cloudflare dashboard, click **Workers & Pages** in the left sidebar.
2. Click **Create** → **Pages** → **Connect to Git**
3. Authorize Cloudflare to access your GitHub account.
4. Select the `susan-jarvie-website` repository.
5. Build settings:
   - **Framework preset**: None
   - **Build command**: *(leave blank)*
   - **Build output directory**: `/` (or leave blank)
6. Click **Save and Deploy**

Cloudflare will give you a URL like `susan-jarvie-website.pages.dev`. The site is live.

---

## Step 4 — Connect a Custom Domain (optional)

If Susan has a domain (or you're transferring `susanjarvie.com`):

1. In your Pages project, go to **Custom domains** → **Set up a custom domain**
2. Enter the domain name and follow the DNS instructions
3. If the domain is registered elsewhere, update its nameservers to Cloudflare's (shown in the dashboard) — this is the easiest approach and unlocks free SSL, DDoS protection, etc.

---

## Step 5 — Set Up the CMS (Decap CMS + GitHub OAuth)

The CMS needs a way for Susan to log in via GitHub. We use a lightweight OAuth proxy hosted on Cloudflare Workers (free).

### 5a — Create a GitHub OAuth App

1. Go to [github.com/settings/developers](https://github.com/settings/developers)
2. Click **OAuth Apps** → **New OAuth App**
3. Fill in:
   - **Application name**: Susan Jarvie Website CMS
   - **Homepage URL**: `https://your-site.pages.dev` (or your custom domain)
   - **Authorization callback URL**: `https://sveltia-cms-auth.YOUR_WORKER.workers.dev/callback`
     *(You'll fill in the Worker URL after Step 5b)*
4. Click **Register application**
5. Copy the **Client ID** and click **Generate a new client secret** — copy that too. Keep these safe.

### 5b — Deploy the OAuth Worker

We use [sveltia-cms-auth](https://github.com/sveltia/sveltia-cms-auth), a one-click Cloudflare Worker that handles OAuth.

1. Click this deploy button (opens Cloudflare dashboard):
   [Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/?url=https://github.com/sveltia/sveltia-cms-auth)
2. Follow the prompts — it creates a Worker automatically.
3. Once deployed, go to your Worker → **Settings** → **Variables** and add:
   - `GITHUB_CLIENT_ID` = *(your Client ID from 5a)*
   - `GITHUB_CLIENT_SECRET` = *(your Client Secret from 5a)*
4. Note your Worker URL: `https://sveltia-cms-auth.YOUR_SUBDOMAIN.workers.dev`

### 5c — Update the GitHub OAuth App callback

Go back to your GitHub OAuth App settings and update the **Authorization callback URL** to:
```
https://sveltia-cms-auth.YOUR_SUBDOMAIN.workers.dev/callback
```

### 5d — Update admin/config.yml

Open `admin/config.yml` and fill in these two lines:

```yaml
backend:
  name: github
  repo: YOUR_GITHUB_USERNAME/susan-jarvie-website   # ← your actual repo
  branch: main
  base_url: https://sveltia-cms-auth.YOUR_SUBDOMAIN.workers.dev  # ← your worker URL
```

Commit and push this change. Cloudflare Pages will redeploy automatically.

---

## Step 6 — Set Up the Contact Form (Formspree)

1. Go to [formspree.io](https://formspree.io) and create a free account.
2. Click **New Form** → name it "Susan Jarvie Contact"
3. Set the notification email to Susan's email address.
4. Copy the form endpoint — it looks like: `https://formspree.io/f/abcd1234`
5. Log in to the CMS at `your-site.pages.dev/admin`
6. Go to **Contact Page** → find the **Formspree Endpoint URL** field → paste the endpoint → hit **Publish**

The contact form is now live and Susan will receive emails.

---

## Step 7 — Give Susan CMS Access

Susan needs a GitHub account to use the CMS:

1. Susan creates a free GitHub account at [github.com](https://github.com)
2. Go to your repository → **Settings** → **Collaborators** → **Add people**
3. Add Susan's GitHub username with **Write** access
4. Susan accepts the invite in her email

Susan can now go to `your-site.pages.dev/admin`, click **Login with GitHub**, and edit any page.

---

## Using the CMS

Susan's editing workflow:

1. Open `yourdomain.com/admin` in a browser
2. Click **Login with GitHub** (only needed once per device)
3. Click any page in the left sidebar (e.g. "Schedule")
4. Edit the fields — what she sees matches what's on the website
5. Click **Publish** in the top right
6. The site automatically updates within ~30 seconds

### Adding or changing photos

1. In the CMS, go to **Media** in the top bar
2. Upload a photo — it saves directly to the `/images/` folder in the repo
3. In the HTML files, replace the image placeholder comment with:
   ```html
   <img src="/images/your-photo.jpg" alt="Description">
   ```
   (This requires a small code edit — ask your developer the first time, or repeat as needed.)

---

## File Reference

```
/
├── index.html              ← Home page
├── about.html              ← About page
├── schedule.html           ← Class schedule
├── classes-online.html     ← Online classes
├── work-with-me.html       ← Private sessions & services
├── contact.html            ← Contact form
├── css/style.css           ← All styles (colors, fonts, layout)
├── js/content.js           ← Content loader (reads JSON → fills page)
├── data/                   ← Content files (edited via CMS)
│   ├── home.json
│   ├── about.json
│   ├── schedule.json
│   ├── classes-online.json
│   ├── work-with-me.json
│   └── contact.json
├── images/                 ← Add photos here
├── admin/
│   ├── index.html          ← CMS entry point (don't edit)
│   └── config.yml          ← CMS configuration ← UPDATE THIS (Step 5d)
└── CLOUDFLARE_SETUP.md     ← This file
```

---

## Quick Troubleshooting

| Problem | Fix |
|---|---|
| CMS login doesn't work | Check `base_url` in `config.yml` matches your Worker URL exactly |
| Changes don't appear on site | Wait 60 seconds, then hard-refresh (Ctrl+Shift+R). Check Cloudflare Pages dashboard for deploy status. |
| Contact form not sending | Confirm Formspree endpoint is set in CMS → Contact Page. Check spam folder. |
| Site shows old content | The JSON files are cached by the browser — try hard-refresh |
| Want to add a new page | Copy an existing HTML file, create a matching JSON in `/data/`, add a new `file:` block in `admin/config.yml` |
