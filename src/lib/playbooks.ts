export type Tool = {
  name: string;
  badge: "Free" | "Freemium" | "Paid";
  price: string;
  bestFor: string;
  pros: string[];
  cons: string[];
  freeTier: string;
  paidTier: string;
  apiAccess: boolean;
};

export type Workflow = {
  title: string;
  steps: string[];
};

export type Playbook = {
  slug: string;
  emoji: string;
  title: string;
  subtitle: string;
  tagline: string;
  bullets: string[];
  tools: Tool[];
  workflows: Workflow[];
};

export const playbooks: Playbook[] = [
  {
    slug: "students",
    emoji: "🎓",
    title: "Best AI for Students",
    subtitle: "Cut research time in half, write better essays, and ace your exams with the right AI tools.",
    tagline: "Research, writing, and studying made faster.",
    bullets: [
      "Top free and freemium AI tools for academic work",
      "Essay drafting, citation help, and summarisation",
      "Study planning and exam prep workflows",
    ],
    tools: [
      {
        name: "ChatGPT (GPT-4o)",
        badge: "Freemium",
        price: "$0 / $20 per month",
        bestFor: "Essays, explanations, Q&A",
        pros: [
          "Excellent at explaining complex topics in plain language",
          "Strong essay outlining and drafting capabilities",
          "Huge knowledge base covering virtually all subjects",
        ],
        cons: [
          "Free tier has usage limits and no internet access",
          "Can confidently state incorrect information (hallucinations)",
        ],
        freeTier: "GPT-4o mini with usage caps",
        paidTier: "GPT-4o + o1 + o3-mini, image input — $20/mo",
        apiAccess: true,
      },
      {
        name: "Claude (Anthropic)",
        badge: "Freemium",
        price: "$0 / $20 per month",
        bestFor: "Long document analysis, writing feedback",
        pros: [
          "200k token context window — paste entire papers or textbooks",
          "More careful and nuanced writing than most competitors",
          "Very good at structured feedback on essays",
        ],
        cons: [
          "No internet browsing or image generation",
          "Free tier daily message limit can be restrictive",
        ],
        freeTier: "Claude 3.5 Haiku with daily limits",
        paidTier: "Claude 3.7 Sonnet, 200k context — $20/mo",
        apiAccess: true,
      },
      {
        name: "Perplexity AI",
        badge: "Freemium",
        price: "$0 / $20 per month",
        bestFor: "Research with cited sources",
        pros: [
          "Answers include real-time web citations — great for research",
          "Academic mode pulls from scholarly sources",
          "Clean, concise answers without filler content",
        ],
        cons: [
          "Less suited for long-form writing or creative tasks",
          "Pro plan required for unlimited searches",
        ],
        freeTier: "5 pro searches per day, unlimited basic",
        paidTier: "Unlimited pro searches, file uploads — $20/mo",
        apiAccess: true,
      },
    ],
    workflows: [
      {
        title: "Research Essay from Scratch",
        steps: [
          "Use Perplexity AI to research your topic — collect 5–8 cited sources from the Academic mode.",
          "Paste your research notes into Claude and ask it to identify the 3 strongest arguments and any gaps.",
          "Ask ChatGPT to generate a detailed essay outline based on your arguments and word count requirement.",
          "Draft each section using Claude, pasting the outline section by section for consistent tone.",
          "Run the final draft through Claude again with the prompt: 'Give me specific feedback on argument strength, flow, and clarity.'",
        ],
      },
      {
        title: "Exam Study Session",
        steps: [
          "Paste your lecture notes or textbook chapter into Claude and ask: 'Create 20 practice questions with answers covering the key concepts.'",
          "Ask ChatGPT to explain any concepts you got wrong in a simpler way with an analogy.",
          "Use Claude to create a one-page summary cheat sheet of the most important formulas, dates, or definitions.",
          "Do a final quiz: ask ChatGPT to quiz you verbally and score your answers.",
        ],
      },
    ],
  },
  {
    slug: "coding",
    emoji: "💻",
    title: "Best AI for Coding",
    subtitle: "Ship faster, debug smarter, and write cleaner code with AI pair programmers built for developers.",
    tagline: "From autocomplete to architecture — AI for every stage of development.",
    bullets: [
      "IDE-integrated tools vs. standalone coding assistants",
      "Debugging, code review, and refactoring workflows",
      "Pricing breakdown: free plans vs. team tiers",
    ],
    tools: [
      {
        name: "GitHub Copilot",
        badge: "Paid",
        price: "$10 / $19 per month",
        bestFor: "Inline autocomplete inside VS Code, JetBrains, Neovim",
        pros: [
          "Deeply integrated into VS Code and JetBrains IDEs",
          "Context-aware autocomplete from your entire codebase",
          "Copilot Chat for inline Q&A, debugging, and explanations",
        ],
        cons: [
          "No free tier (trial only)",
          "Suggestions can be subtly wrong — always review",
        ],
        freeTier: "30-day trial only",
        paidTier: "Individual $10/mo, Business $19/user/mo",
        apiAccess: false,
      },
      {
        name: "Claude (Anthropic)",
        badge: "Freemium",
        price: "$0 / $20 per month",
        bestFor: "Architecture decisions, large refactors, code review",
        pros: [
          "200k context — paste an entire codebase for review",
          "Excellent at explaining why code is wrong, not just fixing it",
          "Strong reasoning for system design and architecture questions",
        ],
        cons: [
          "Not embedded in an IDE by default",
          "No real-time autocomplete",
        ],
        freeTier: "Claude 3.5 Haiku with daily limits",
        paidTier: "Claude 3.7 Sonnet, 200k context — $20/mo",
        apiAccess: true,
      },
      {
        name: "Cursor",
        badge: "Freemium",
        price: "$0 / $20 per month",
        bestFor: "Full AI-native coding environment",
        pros: [
          "VS Code fork with built-in GPT-4o, Claude 3.7, and Gemini integration",
          "Codebase-wide context awareness with @codebase",
          "Agent mode can write, run, and debug multi-file features autonomously",
        ],
        cons: [
          "Requires switching from your existing IDE setup",
          "Pro plan needed for high-usage or GPT-4 models",
        ],
        freeTier: "2000 code completions + 50 slow requests",
        paidTier: "Unlimited completions, fast requests — $20/mo",
        apiAccess: false,
      },
    ],
    workflows: [
      {
        title: "Debug a Tricky Bug",
        steps: [
          "Copy the error message, relevant stack trace, and the surrounding code (50–100 lines).",
          "Paste into Claude with: 'Here is the error and the code. Explain what is causing this and why.'",
          "Ask for a fix, then ask: 'What tests should I add to prevent this from regressing?'",
          "Copy the fix into your IDE and use GitHub Copilot to autocomplete the test cases Claude suggested.",
        ],
      },
      {
        title: "Build a New Feature End-to-End",
        steps: [
          "Describe the feature to Claude: 'I need to build X. Here is my current data model and tech stack. Draft the architecture.'",
          "Iterate on the architecture plan until it covers edge cases and fits your stack.",
          "Open Cursor, use @codebase to give it full context, and implement each component using the plan.",
          "Ask Claude to do a final code review: paste the final implementation and ask for security, performance, and readability feedback.",
          "Write a one-paragraph summary of what the feature does and ask ChatGPT to turn it into a PR description.",
        ],
      },
    ],
  },
  {
    slug: "business-automation",
    emoji: "⚙️",
    title: "Best AI for Business Automation",
    subtitle: "Automate repetitive tasks, connect your apps, and build AI-powered workflows without writing code.",
    tagline: "Connect your tools and let AI handle the busywork.",
    bullets: [
      "No-code and low-code automation platforms compared",
      "AI agents for email, CRM, and data workflows",
      "Real workflow templates for ops and sales teams",
    ],
    tools: [
      {
        name: "Zapier (with AI Actions)",
        badge: "Freemium",
        price: "$0 / $29 per month",
        bestFor: "Connecting 6,000+ apps with AI-triggered workflows",
        pros: [
          "Largest app ecosystem — 6,000+ integrations",
          "AI Actions let you trigger ChatGPT steps inside any zap",
          "No code required; visual workflow builder",
        ],
        cons: [
          "Costs escalate quickly at high task volumes",
          "Free tier limited to 100 tasks/month and 2-step zaps",
        ],
        freeTier: "100 tasks/mo, single-step zaps",
        paidTier: "Starter $29/mo — 750 tasks, multi-step zaps",
        apiAccess: true,
      },
      {
        name: "Notion AI",
        badge: "Paid",
        price: "$10 per user/month (add-on)",
        bestFor: "AI-enhanced docs, databases, and project management",
        pros: [
          "AI built directly into your workspace — no context switching",
          "Summarise meeting notes, draft SOPs, and auto-fill databases",
          "Q&A over your entire Notion workspace",
        ],
        cons: [
          "Requires a Notion subscription first",
          "Not suitable for connecting external apps",
        ],
        freeTier: "No free AI tier (Notion free plan exists without AI)",
        paidTier: "$10/user/mo added onto any Notion plan",
        apiAccess: false,
      },
      {
        name: "Make (formerly Integromat)",
        badge: "Freemium",
        price: "$0 / $9 per month",
        bestFor: "Complex multi-step automations with advanced logic",
        pros: [
          "Visual canvas builder — much more flexible than Zapier for complex flows",
          "Cheaper than Zapier at scale",
          "Native HTTP/API module for custom integrations",
        ],
        cons: [
          "Steeper learning curve than Zapier",
          "Smaller app library (~1,500 integrations)",
        ],
        freeTier: "1,000 operations/mo, unlimited scenarios",
        paidTier: "Core $9/mo — 10,000 operations",
        apiAccess: true,
      },
    ],
    workflows: [
      {
        title: "AI-Powered Lead Triage",
        steps: [
          "Set up a Zapier trigger: new form submission in Typeform or Google Forms fires the zap.",
          "Add a Zapier AI Action step: send the lead's answers to ChatGPT with a prompt to score the lead (hot/warm/cold) and write a 2-sentence summary.",
          "Add a step to create a CRM record in HubSpot or Pipedrive with the score and summary appended to the notes field.",
          "Add a final step to send a Slack message to the sales channel with the lead summary and score.",
        ],
      },
      {
        title: "Automated Meeting-to-Action Workflow",
        steps: [
          "Record your meeting with Otter.ai or Fireflies.ai — both export a transcript automatically.",
          "In Make, trigger on a new Otter.ai transcript. Pass the transcript to the OpenAI module with a prompt: 'Extract action items, owners, and deadlines. Return as JSON.'",
          "Parse the JSON response and create individual tasks in Asana or Notion for each action item with the assigned owner.",
          "Send a formatted summary to the team Slack channel so everyone is aligned.",
        ],
      },
    ],
  },
  {
    slug: "youtube-creators",
    emoji: "🎬",
    title: "Best AI for YouTube Creators",
    subtitle: "Ideate faster, produce better scripts, and grow your channel with AI tools built for video content.",
    tagline: "From idea to upload — AI at every step of your workflow.",
    bullets: [
      "AI tools for scripting, thumbnails, and SEO",
      "Editing assistants and automatic captioning compared",
      "Workflow for going from idea to published video faster",
    ],
    tools: [
      {
        name: "ChatGPT (GPT-4o)",
        badge: "Freemium",
        price: "$0 / $20 per month",
        bestFor: "Scripts, titles, descriptions, and content ideation",
        pros: [
          "Excellent at generating video scripts with hooks and structured sections",
          "Can generate 20 title ideas in seconds with SEO keywords",
          "Great for repurposing video content into blog posts or tweets",
        ],
        cons: [
          "No video or image output natively",
          "Free tier has usage limits on GPT-4o — pay for unlimited access",
        ],
        freeTier: "GPT-3.5 with usage caps",
        paidTier: "GPT-4o, image input — $20/mo",
        apiAccess: true,
      },
      {
        name: "Descript",
        badge: "Freemium",
        price: "$0 / $24 per month",
        bestFor: "AI-powered video editing via transcript",
        pros: [
          "Edit video by editing the text transcript — remove filler words in one click",
          "AI voice clone for re-recording mistakes without going back to camera",
          "Automatic captions and studio sound noise removal",
        ],
        cons: [
          "Free tier limited to 1 hour of transcription",
          "Not a full NLE — complex edits still need Premiere/DaVinci",
        ],
        freeTier: "1 hour transcription, watermarked export",
        paidTier: "Creator $24/mo — 10 hours transcription, no watermark",
        apiAccess: false,
      },
      {
        name: "VidIQ",
        badge: "Freemium",
        price: "$0 / $7.50 per month",
        bestFor: "YouTube SEO, keyword research, and competitor analysis",
        pros: [
          "Keyword scores and search volume data directly on YouTube",
          "Daily video idea suggestions based on your channel niche",
          "Competitor tracking and trending topic alerts",
        ],
        cons: [
          "AI features require Pro or Boost plan",
          "Data is YouTube-specific — doesn't help with other platforms",
        ],
        freeTier: "Basic keyword overlay and limited daily ideas",
        paidTier: "Pro $7.50/mo — full keyword data, AI coach",
        apiAccess: false,
      },
    ],
    workflows: [
      {
        title: "Idea to Published Video in 48 Hours",
        steps: [
          "Use VidIQ's daily ideas or enter your niche into ChatGPT: 'Give me 10 YouTube video ideas about [topic] targeting beginners with high search potential.'",
          "Pick the best idea and ask ChatGPT: 'Write a 8-minute YouTube script for [title] with a strong hook, 3 main sections, and a clear CTA. Use a conversational, energetic tone.'",
          "Record your video using the script. Aim for one continuous take per section.",
          "Import footage into Descript. Remove filler words automatically, add captions, and run Studio Sound.",
          "Export and upload to YouTube. Use VidIQ to research the optimal title, tags, and description keywords before publishing.",
        ],
      },
      {
        title: "Repurpose One Video into 5 Assets",
        steps: [
          "Paste your final video transcript into ChatGPT.",
          "Ask: 'Turn this transcript into: (1) a Twitter/X thread, (2) a LinkedIn post, (3) a blog post outline, (4) 3 short-form video hooks, (5) an email newsletter summary.'",
          "Copy each output and schedule across your social channels using Buffer or Hypefury.",
          "Use the blog post outline as a new piece of written content — link it back to the YouTube video for SEO.",
        ],
      },
    ],
  },
  {
    slug: "marketing-teams",
    emoji: "📣",
    title: "Best AI for Marketing Teams",
    subtitle: "Produce more content, run smarter campaigns, and turn data into decisions with AI built for marketers.",
    tagline: "Scale your content output without scaling your headcount.",
    bullets: [
      "Content creation, SEO, and campaign copywriting tools",
      "AI for ad copy, email sequences, and A/B testing",
      "Workflow for briefing, drafting, and publishing at scale",
    ],
    tools: [
      {
        name: "Claude (Anthropic)",
        badge: "Freemium",
        price: "$0 / $20 per month",
        bestFor: "Long-form content, brand voice consistency, campaign briefs",
        pros: [
          "Best-in-class for following detailed brand guidelines and tone of voice",
          "200k context window lets you paste a full content library for style matching",
          "Nuanced, human-sounding copy that avoids the 'AI smell'",
        ],
        cons: [
          "No internet browsing for real-time trend data",
          "No built-in SEO keyword data",
        ],
        freeTier: "Claude 3.5 Haiku with daily limits",
        paidTier: "Claude 3.7 Sonnet, 200k context — $20/mo",
        apiAccess: true,
      },
      {
        name: "Jasper AI",
        badge: "Paid",
        price: "$49 per month",
        bestFor: "Marketing-specific templates, brand voice, team collaboration",
        pros: [
          "50+ marketing-specific templates (ad copy, emails, blog posts, product descriptions)",
          "Brand voice feature trains the AI on your tone and style",
          "Team workflows with approval stages and document sharing",
        ],
        cons: [
          "Expensive compared to general-purpose tools",
          "Output quality doesn't always exceed well-prompted ChatGPT or Claude",
        ],
        freeTier: "7-day free trial only",
        paidTier: "Creator $49/mo, Teams $125/mo (3 seats)",
        apiAccess: false,
      },
      {
        name: "Semrush + AI Writing Assistant",
        badge: "Paid",
        price: "$139.95 per month",
        bestFor: "SEO-driven content creation with keyword data integration",
        pros: [
          "SEO Writing Assistant gives real-time readability and keyword scores as you write",
          "Content gap analysis identifies topics competitors rank for that you don't",
          "Full marketing suite — keyword research, backlinks, and PPC in one tool",
        ],
        cons: [
          "Expensive for small teams",
          "AI writing features are secondary to the core SEO toolset",
        ],
        freeTier: "Limited free account — 10 searches/day",
        paidTier: "Pro $139.95/mo includes AI Writing Assistant",
        apiAccess: true,
      },
    ],
    workflows: [
      {
        title: "Monthly Content Calendar in 2 Hours",
        steps: [
          "Use Semrush to identify 8–12 target keywords for next month based on search volume and difficulty.",
          "Paste the keyword list into Claude with your brand guidelines: 'Create a content calendar for next month with one blog post per keyword. Include title, target keyword, audience angle, and 5-bullet outline for each.'",
          "Review and approve the calendar as a team. Assign each piece to a writer.",
          "Writers use Claude with the brief to draft each post. Use Semrush SEO Writing Assistant to score and optimise each draft before publishing.",
          "Repurpose the top 3 posts into email newsletter content, LinkedIn articles, and social snippets using ChatGPT.",
        ],
      },
      {
        title: "Ad Copy A/B Test at Scale",
        steps: [
          "Define your campaign goal, target audience, and key value proposition.",
          "Paste your brief into Claude: 'Write 5 variations of a Facebook ad for [product]. Each variation should test a different hook: curiosity, social proof, fear of missing out, direct benefit, and question. Keep each under 125 characters for the primary text.'",
          "Launch all 5 variations with equal budget in Meta Ads Manager.",
          "After 3–5 days, identify the winning hook. Ask Claude to generate 5 more variations based on the winning angle with different CTAs.",
          "Scale budget to the top performer and iterate monthly.",
        ],
      },
    ],
  },
];

export function getPlaybook(slug: string): Playbook | undefined {
  return playbooks.find((p) => p.slug === slug);
}
