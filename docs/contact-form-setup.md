# Contact form email setup (Resend)

The Sage Six contact form (and the Ask Sage Six assistant's quick-enquiry
panel) send their enquiry notifications through [Resend](https://resend.com).
This document is a beginner-friendly, step-by-step guide to the **manual**
setup required — none of this can be done from the codebase, because it
involves your Resend account, your domain's DNS records, and your Vercel
project settings.

Nothing in this repository contains a real API key. You will create one
yourself and paste it only into `.env.local` (which Git ignores) and into
Vercel's environment variable settings — never into a file that gets
committed, and never into a chat with an AI assistant.

## Why this is needed

The server-side code is already implemented and waiting for these three
environment variables:

- `RESEND_API_KEY`
- `CONTACT_FROM_EMAIL`
- `CONTACT_TO_EMAIL`

Until they're set, the form correctly refuses to pretend an email was sent —
you'll see a safe error message asking the visitor to email
`hello@sagesix.co.uk` directly instead.

## Step-by-step setup

1. **Create or sign in to Resend.**
   Go to [resend.com](https://resend.com) and create an account (or sign in
   if you already have one).

2. **Add and verify `send.sagesix.co.uk`.**
   In the Resend dashboard, go to **Domains → Add Domain** and enter
   `send.sagesix.co.uk` (a dedicated subdomain, so the main `sagesix.co.uk`
   domain's existing email — e.g. Google Workspace or Outlook — is
   untouched).

3. **Copy the DNS records supplied by Resend into your DNS provider for
   `sagesix.co.uk`.**
   Resend will show you a small set of DNS records (typically a few `TXT`
   and `CNAME` / `MX` records) to add. Log in to wherever `sagesix.co.uk`'s
   DNS is managed (your domain registrar or DNS host) and add each record
   exactly as shown — same type, same host/name, same value.

4. **Wait until Resend reports the domain as verified.**
   DNS changes can take anywhere from a few minutes to a few hours to
   propagate. Refresh the domain's page in Resend until its status changes
   to **Verified**. Sending will fail (or Resend will reject the request)
   until this is done.

5. **Create a restricted API key named "Sage Six Website."**
   Go to **API Keys → Create API Key**. Name it `Sage Six Website` and scope
   it to **Sending access** only (not full account access) if that option is
   available — the app only ever needs to send emails.

6. **Copy the key immediately and keep it secret.**
   Resend shows the full key exactly once. Copy it now — you cannot view it
   again later (you'd have to create a new key). Treat it like a password:
   don't paste it into chat messages, tickets, or commit it to Git.

7. **Put it in your local `.env.local` as `RESEND_API_KEY`.**
   Open `.env.local` in the project root (create it from `.env.example` if
   it doesn't exist yet) and set:

   ```env
   RESEND_API_KEY=re_your_real_key_here
   ```

   `.env.local` is already listed in `.gitignore`, so it will not be
   committed.

8. **Add all three variables to Vercel under Project Settings → Environment
   Variables.**
   In your Vercel project, go to **Settings → Environment Variables** and
   add:

   - `RESEND_API_KEY` — the key from step 6
   - `CONTACT_FROM_EMAIL` — `Sage Six Website <enquiries@send.sagesix.co.uk>`
   - `CONTACT_TO_EMAIL` — `hello@sagesix.co.uk`

9. **Enable them for the appropriate Production and Preview environments.**
   When adding each variable, tick the environments it should apply to.
   Typically you'll want all three enabled for both **Production** and
   **Preview**, so preview deployments can also send real test enquiries.

10. **Redeploy — environment variable changes do not affect an existing
    deployment.**
    Trigger a new deployment (push a commit, or use **Deployments → Redeploy**
    in Vercel) so the running app actually picks up the new variables. An
    already-running deployment keeps using whatever variables it started
    with.

11. **Submit a real test form.**
    Once redeployed, open the live Contact page and submit a genuine test
    enquiry with your own name and email address.

12. **Check the Resend email logs and the `hello@sagesix.co.uk` inbox.**
    In the Resend dashboard, go to **Logs → Emails** and confirm the message
    shows as sent/delivered. Then check the `hello@sagesix.co.uk` inbox
    (and spam folder, just in case) to confirm it actually arrived, and try
    replying to it — the reply should go to the test email address you
    submitted, not to `hello@sagesix.co.uk`.

## Node.js version on Vercel

The `resend` package requires **Node.js 22.12 or newer**. In your Vercel
project, go to **Settings → General → Node.js Version** and make sure it's
set to 22.x or newer before deploying. If it's set to an older version,
sending will fail even with correct environment variables.

## Optional improvement: real rate limiting

The API route includes a basic in-memory rate limiter (5 submissions per IP
per 10 minutes) as a first line of defence against rapid abuse. Because
Vercel serverless functions don't share memory across instances or regions,
this is **best-effort only** — it does not guarantee a hard limit under real
traffic or across cold starts. If spam becomes a real problem, a good next
step is a shared rate limiter such as
[Upstash Redis](https://upstash.com/docs/redis/sdks/ratelimit-ts/overview)
(a small paid/free-tier add-on), which was not added here because it's a
paid dependency the project hasn't opted into.

## What NOT to do

- Do not use `onboarding@resend.dev` as the sender in production — it's
  Resend's own test address and is not meant for real sending.
- Do not paste a real API key into `.env.example`, into this document, into
  a commit, or into a chat with an AI assistant.
- Do not skip domain verification — Resend will not deliver mail from an
  unverified domain.
