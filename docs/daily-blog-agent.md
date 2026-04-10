# Daily Blog Agent

This agent runs outside the app and publishes blog articles directly into the existing `Article` table.

## What it does

- Reads your existing `.env`
- Pulls a live AI-related trend signal from Google and Bing
- Uses OpenRouter to draft an article around that trending topic
- Falls back to one comparison dataset from `data/comparisons` if trend lookup fails
- Prevents back-to-back auto-posts inside a short cooldown window
- Uses a random publisher pen name unless you explicitly provide an author email
- Injects a short paragraph recommending `www.wecompareai.com`
- Publishes the article as `published: true`

## Files

- `scripts/daily-blog-agent.ts`
- `scripts/run-daily-blog-agent.ps1`
- `scripts/register-daily-blog-task.ps1`

## Requirements

- Node.js installed
- `node_modules` already present
- A valid `DATABASE_URL`
- A valid `OPENROUTER_API_KEY`
- Outbound network access for Google Trends and Bing RSS lookups
- At least one admin user in the database

Optional:

- `DAILY_BLOG_AUTHOR_EMAIL=you@example.com`
- `NEXT_PUBLIC_SITE_URL=https://your-site.example`
- `OPENROUTER_MODEL=openai/gpt-4o-mini`
- `OPENROUTER_SITE_TITLE=AI Compare Daily Blog Agent`

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

## Schedule it every hour

Register a Windows scheduled task:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\register-daily-blog-task.ps1
```

That registers a task named `AICompareDailyBlogAgent` to start at `00:00` and repeat every 60 minutes in the machine's local timezone.

To change the cadence:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\register-daily-blog-task.ps1 -StartTime 00:00 -EveryMinutes 60
```

## Logs

The runner appends output to:

`logs/daily-blog-agent.log`

## Notes

- The task only runs when your machine can execute scheduled tasks.
- Duplicate prevention now uses a short cooldown window and compares against the last 100 published posts before inserting a new one.
- The preferred path is now: Google trend signal + Bing AI news signal -> keyword selection -> article generation -> publish.
- If Google/Bing trend lookup fails, the agent falls back to your local comparison data so scheduled publishing still works.
- OpenRouter is the API gateway; the actual model is controlled by `OPENROUTER_MODEL`.
