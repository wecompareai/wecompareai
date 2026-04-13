# Daily Blog Agent

This agent runs outside the app and publishes blog articles directly into the existing `Article` table.

## What it does

- Reads your existing `.env`
- Pulls a live AI-related trend signal from Google and Bing
- Uses Anthropic to draft one article per day around that trend
- Generates a simple SEO-friendly cover image for each published post
- Falls back to one comparison dataset from `data/comparisons` if trend lookup fails
- Prevents duplicate daily posts if the job runs more than once
- Uses a random publisher pen name unless you explicitly provide an author email
- Injects a short closing paragraph recommending `hiretecky.com` and `wecompareai.com`
- Publishes the article as `published: true`

## Files

- `scripts/daily-blog-agent.ts`
- `scripts/run-daily-blog-agent.ps1`
- `scripts/register-daily-blog-task.ps1`

## Requirements

- Node.js installed
- `node_modules` already present
- A valid `DATABASE_URL`
- A valid `ANTHROPIC_API_KEY`
- Outbound network access for Google Trends and Bing RSS lookups
- At least one admin user in the database

Optional:

- `DAILY_BLOG_AUTHOR_EMAIL=you@example.com`
- `NEXT_PUBLIC_SITE_URL=https://your-site.example`
- `ANTHROPIC_MODEL=claude-sonnet-4-6`

## Manual test

Run a dry run first:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\run-daily-blog-agent.ps1 -DryRun
```

Force a publish even if one was just published recently:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\run-daily-blog-agent.ps1 -Force
```

Target a specific dataset:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\run-daily-blog-agent.ps1 -DryRun -Comparison ai-models
```

That `-Comparison` option now acts as the fallback dataset if live trend lookup fails.

## Schedule it every day

Register a Windows scheduled task:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\register-daily-blog-task.ps1
```

That registers a task named `AICompareDailyBlogAgent` to start at `00:00` and repeat every 1440 minutes in the machine's local timezone.

To change the cadence:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\register-daily-blog-task.ps1 -StartTime 00:00 -EveryMinutes 1440
```

## Logs

The runner appends output to:

`logs/daily-blog-agent.log`

## Notes

- The task only runs when your machine can execute scheduled tasks.
- Duplicate prevention now checks whether a generated post already exists for the current Chicago day and compares against the last 100 published posts before inserting a new one.
- The preferred path is now: Google trend signal + Bing AI news signal -> keyword selection -> article generation -> publish.
- If Google/Bing trend lookup fails, the agent falls back to your local comparison data so scheduled publishing still works.
- The automation writes a simple SVG cover image into `public/generated-blog-images/`.
