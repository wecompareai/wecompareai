/**
 * Profession-specific AI tool recommendations.
 * Each toolId must match an id in ALL_SCORES (scores.ts).
 */

export interface ProfessionTool {
  toolId: string;
  useCase: string;       // What the profession uses it for
  why: string;           // Why it's great for this profession specifically
}

export interface Profession {
  slug: string;
  name: string;
  plural: string;        // "Lawyers", "Doctors"
  emoji: string;
  headline: string;
  description: string;   // SEO meta description
  intro: string;         // Opening paragraph shown on page
  tools: ProfessionTool[];
  topPickId: string;     // toolId of #1 recommendation
  useCases: string[];    // Quick-win use cases shown as chips
  relatedSlugs: string[]; // Related profession slugs
}

export const PROFESSIONS: Profession[] = [
  // ── Legal ────────────────────────────────────────────────────────────────
  {
    slug: "lawyers",
    name: "Lawyer",
    plural: "Lawyers",
    emoji: "⚖️",
    headline: "Best AI Tools for Lawyers in 2026",
    description: "The top AI tools for lawyers and law firms in 2026. Draft contracts, research case law, transcribe depositions, and write briefs faster with these AI-powered tools.",
    intro: "AI is transforming legal work — not by replacing lawyers, but by eliminating the hours spent on drafting, research, and documentation. These tools help solo practitioners and large firms alike move faster on the work that matters.",
    topPickId: "claude-opus-4",
    tools: [
      { toolId: "claude-opus-4",    useCase: "Contract drafting & legal analysis",   why: "Best reasoning and writing quality for complex legal documents. Handles long contracts with 200K context window." },
      { toolId: "perplexity",       useCase: "Case law research",                    why: "Real-time search with cited sources — find relevant precedents and statutes with direct links to verify." },
      { toolId: "grammarly",        useCase: "Brief and motion editing",              why: "Catches grammar, tone, and clarity issues in legal writing. Works inside Word and Google Docs." },
      { toolId: "openai-whisper",   useCase: "Deposition & hearing transcription",   why: "Accurate transcription of recorded depositions and client calls at near-zero cost." },
      { toolId: "notion-ai",        useCase: "Case file knowledge management",       why: "Q&A over your entire case notes and document library — find anything instantly." },
      { toolId: "assemblyai",       useCase: "Meeting & call transcription with AI", why: "Speaker diarisation and LLM-powered summaries of client calls and partner meetings." },
    ],
    useCases: ["Draft NDAs and contracts", "Research case law", "Summarise depositions", "Write client memos", "Review lengthy documents", "Prepare discovery documents"],
    relatedSlugs: ["accountants", "hr-teams"],
  },

  // ── Healthcare ───────────────────────────────────────────────────────────
  {
    slug: "doctors",
    name: "Doctor",
    plural: "Doctors",
    emoji: "🩺",
    headline: "Best AI Tools for Doctors & Healthcare Professionals in 2026",
    description: "Top AI tools for doctors and healthcare professionals in 2026. AI-powered clinical note-taking, medical transcription, research, and patient communication tools.",
    intro: "Doctors spend up to 2 hours on documentation for every hour of patient care. AI can reclaim that time — automating clinical notes, accelerating research, and improving patient communication — while keeping you fully in control.",
    topPickId: "openai-whisper",
    tools: [
      { toolId: "openai-whisper",   useCase: "Clinical note dictation",              why: "Transcribe patient consultations accurately in 99 languages. Run locally for HIPAA-safe workflows." },
      { toolId: "assemblyai",       useCase: "Medical transcription with summaries",  why: "SOC 2 compliant. LeMUR feature adds AI summarisation over transcribed consultations." },
      { toolId: "claude-opus-4",    useCase: "Medical literature review & summaries", why: "200K context window handles full research papers. Best reasoning for complex clinical questions." },
      { toolId: "consensus",        useCase: "Evidence-based research",               why: "Searches 200M+ peer-reviewed papers. Consensus Meter shows % of studies agreeing on a topic." },
      { toolId: "grammarly",        useCase: "Patient-facing communication",          why: "Ensures referral letters, patient emails, and reports are clear, professional, and error-free." },
      { toolId: "notion-ai",        useCase: "Clinical protocol & knowledge base",    why: "AI-powered Q&A over your department's protocols, guidelines, and reference materials." },
    ],
    useCases: ["Dictate clinical notes", "Review medical literature", "Summarise patient records", "Draft referral letters", "Research treatment options", "Patient education content"],
    relatedSlugs: ["dentists", "nurses"],
  },

  // ── Dental ───────────────────────────────────────────────────────────────
  {
    slug: "dentists",
    name: "Dentist",
    plural: "Dentists",
    emoji: "🦷",
    headline: "Best AI Tools for Dentists in 2026",
    description: "Top AI tools for dental practices in 2026. AI tools for clinical notes, patient education, appointment communications, practice marketing, and treatment planning documentation.",
    intro: "AI helps dental practices run more efficiently — from generating patient-friendly treatment explanations to automating appointment follow-ups and creating marketing content. These tools are used by solo dentists and multi-site practices alike.",
    topPickId: "claude-opus-4",
    tools: [
      { toolId: "claude-opus-4",    useCase: "Treatment plan documentation",         why: "Write clear, thorough treatment plans and chair-side notes faster with natural language." },
      { toolId: "openai-whisper",   useCase: "Voice-to-text clinical notes",         why: "Dictate notes between patients — accurate transcription for perio charts, treatment notes, and recalls." },
      { toolId: "grammarly",        useCase: "Patient communication editing",        why: "Polish appointment reminders, treatment consent letters, and recall campaigns automatically." },
      { toolId: "gamma",            useCase: "Patient education presentations",      why: "Create beautiful slide decks explaining procedures — implants, veneers, orthodontics — in minutes." },
      { toolId: "canva-ai",         useCase: "Practice marketing materials",         why: "Design social posts, flyers, and before/after showcase content without a graphic designer." },
      { toolId: "heygen",           useCase: "Patient education videos",             why: "Create talking-head video explainers of procedures for your website and waiting room screens." },
    ],
    useCases: ["Write clinical notes by voice", "Explain procedures to patients", "Create recall campaigns", "Design social media content", "Generate patient consent forms", "Build practice marketing"],
    relatedSlugs: ["doctors", "nurses"],
  },

  // ── Education ────────────────────────────────────────────────────────────
  {
    slug: "teachers",
    name: "Teacher",
    plural: "Teachers & Educators",
    emoji: "📚",
    headline: "Best AI Tools for Teachers & Educators in 2026",
    description: "Top AI tools for teachers and educators in 2026. AI tools for lesson planning, grading feedback, student communication, presentation creation, and curriculum development.",
    intro: "Teachers are using AI to reclaim planning time, personalise feedback, and create engaging materials — without losing the human connection that makes great teaching. These tools work for K-12 teachers, university lecturers, and corporate trainers.",
    topPickId: "claude-opus-4",
    tools: [
      { toolId: "claude-opus-4",    useCase: "Lesson planning & curriculum design",  why: "Generate differentiated lesson plans, rubrics, and assessments tailored to specific grade levels and standards." },
      { toolId: "grammarly",        useCase: "Student feedback & report writing",    why: "Write detailed, consistent student feedback reports faster while maintaining your professional voice." },
      { toolId: "gamma",            useCase: "Lesson presentations & slide decks",   why: "Create visually engaging classroom presentations from a text prompt in under 2 minutes." },
      { toolId: "canva-ai",         useCase: "Classroom materials & worksheets",     why: "Design worksheets, posters, and infographics without any design experience." },
      { toolId: "notion-ai",        useCase: "Curriculum & resource organisation",   why: "Q&A over your curriculum resources, lesson bank, and student records all in one place." },
      { toolId: "synthesia",        useCase: "Video lessons & flipped classroom",    why: "Create professional instructional videos with AI avatars — no camera, editing software, or studio needed." },
    ],
    useCases: ["Plan lessons in minutes", "Write student feedback", "Create class presentations", "Build quiz questions", "Differentiate instruction", "Make video lessons"],
    relatedSlugs: ["students", "content-creators"],
  },

  // ── Marketing ────────────────────────────────────────────────────────────
  {
    slug: "marketers",
    name: "Marketer",
    plural: "Marketers",
    emoji: "📣",
    headline: "Best AI Tools for Marketers in 2026",
    description: "Top AI tools for marketers in 2026. AI tools for content creation, ad copy, social media, SEO, email campaigns, image generation, and video marketing.",
    intro: "Marketing teams are moving faster than ever — publishing more content, running more experiments, and personalising at scale. These AI tools are the ones actually being used by growth teams, content marketers, and CMOs in 2026.",
    topPickId: "jasper",
    tools: [
      { toolId: "jasper",           useCase: "Brand content at scale",               why: "Brand voice training means every output sounds like you. Built for marketing teams with campaign workflows." },
      { toolId: "copy-ai",          useCase: "GTM and sales copy",                   why: "Best for B2B GTM teams — outreach sequences, landing page copy, and ad variations at speed." },
      { toolId: "writesonic",       useCase: "SEO blog content",                     why: "Built-in keyword research and on-page SEO optimisation — write and optimise in one workflow." },
      { toolId: "canva-ai",         useCase: "Social media visuals",                 why: "200M+ users rely on it for posts, stories, and ad creatives. AI magic tools save hours per week." },
      { toolId: "midjourney",       useCase: "Campaign hero images & brand visuals", why: "The gold standard for AI imagery used by top brands. Produces stunning, photorealistic campaign images." },
      { toolId: "heygen",           useCase: "Video ads & product demos",            why: "Create talking-head sales videos and product walkthroughs in 120+ languages without filming." },
    ],
    useCases: ["Write ad copy variations", "Create SEO blog posts", "Design social graphics", "Generate campaign images", "Build email sequences", "Produce video content"],
    relatedSlugs: ["content-creators", "small-business"],
  },

  // ── Development ──────────────────────────────────────────────────────────
  {
    slug: "developers",
    name: "Developer",
    plural: "Developers",
    emoji: "💻",
    headline: "Best AI Tools for Developers in 2026",
    description: "Top AI coding tools for developers in 2026. AI-powered code editors, completion tools, autonomous coding agents, and code review assistants used by professional engineers.",
    intro: "AI coding tools have fundamentally changed how software gets built. The best developers in 2026 aren't those who avoid AI — they're those who've learned which tool to reach for at each stage of development.",
    topPickId: "cursor",
    tools: [
      { toolId: "cursor",           useCase: "AI-powered code editor",               why: "The editor used by the most productive AI-era developers. Inline edits, chat, and full codebase awareness." },
      { toolId: "github-copilot",   useCase: "Inline code completion",               why: "Best IDE integration for teams already on GitHub. Works across VS Code, JetBrains, and more." },
      { toolId: "claude-opus-4",    useCase: "Architecture & complex problem solving", why: "Best reasoning model for system design, debugging hard problems, and understanding large codebases." },
      { toolId: "aider",            useCase: "CLI-based coding agent",               why: "Zero-markup model costs — use Claude or GPT-4 for coding at the cheapest possible rate from the terminal." },
      { toolId: "cline",            useCase: "VS Code AI agent",                     why: "Full agentic file editing, terminal, and browser control inside VS Code — at model cost only." },
      { toolId: "perplexity",       useCase: "Technical documentation lookup",       why: "Find up-to-date API docs, library docs, and Stack Overflow answers with real citations instantly." },
    ],
    useCases: ["Write and refactor code", "Debug complex issues", "Review pull requests", "Generate tests", "Understand legacy code", "Design system architecture"],
    relatedSlugs: ["small-business", "students"],
  },

  // ── Design ───────────────────────────────────────────────────────────────
  {
    slug: "designers",
    name: "Designer",
    plural: "Designers",
    emoji: "🎨",
    headline: "Best AI Tools for Designers in 2026",
    description: "Top AI tools for graphic designers and UX designers in 2026. AI image generation, UI design assistants, vector creation, presentation tools, and creative workflow automation.",
    intro: "AI hasn't replaced designers — it's made great designers exponentially more productive. Whether you're creating brand assets, UI components, or client presentations, these tools cut production time without cutting creative control.",
    topPickId: "midjourney",
    tools: [
      { toolId: "midjourney",       useCase: "Campaign imagery & concept art",       why: "The industry standard for high-quality AI imagery. Used by design studios, agencies, and brands globally." },
      { toolId: "figma-ai",         useCase: "UI/UX design & prototyping",           why: "AI features built into the tool 85% of Fortune 500 design teams already use daily." },
      { toolId: "adobe-firefly",    useCase: "Brand-safe image generation",          why: "Trained on licensed content — commercially safe for client work. Deep Adobe CC integration." },
      { toolId: "recraft-v4",       useCase: "Vector graphics & SVG generation",     why: "The only AI image tool with true SVG export — essential for logos, icons, and scalable brand assets." },
      { toolId: "canva-ai",         useCase: "Quick client deliverables",            why: "Fastest path from brief to polished output for social, presentations, and marketing collateral." },
      { toolId: "gamma",            useCase: "Client presentation decks",            why: "Beautiful, professional decks from a prompt — ideal for pitching concepts to non-designer clients." },
    ],
    useCases: ["Generate concept imagery", "Create UI components", "Build brand assets", "Design client presentations", "Produce vector graphics", "Mock up ideas quickly"],
    relatedSlugs: ["marketers", "content-creators"],
  },

  // ── Writing & Journalism ─────────────────────────────────────────────────
  {
    slug: "writers",
    name: "Writer",
    plural: "Writers & Journalists",
    emoji: "✍️",
    headline: "Best AI Tools for Writers & Journalists in 2026",
    description: "Top AI tools for writers, journalists, and content creators in 2026. AI writing assistants, research tools, grammar checkers, SEO tools, and transcription software.",
    intro: "The best writers in 2026 use AI to research faster, edit more rigorously, and overcome blocks — while keeping their unique voice at the centre of everything they publish.",
    topPickId: "claude-opus-4",
    tools: [
      { toolId: "claude-opus-4",    useCase: "Long-form writing & editing",          why: "Best writing quality of any AI. Follows style instructions precisely and produces natural, nuanced prose." },
      { toolId: "grammarly",        useCase: "Grammar, tone & style editing",        why: "Real-time editing suggestions that work inside every writing platform — from Gmail to Google Docs." },
      { toolId: "perplexity",       useCase: "Research with cited sources",          why: "Find accurate, sourced information fast. Essential for fact-checking and background research." },
      { toolId: "notion-ai",        useCase: "Research organisation & notes",        why: "AI Q&A over your entire research library — find that quote or source from months ago instantly." },
      { toolId: "writesonic",       useCase: "SEO article writing",                  why: "Keyword research and content optimisation built-in — ideal for writers who also manage SEO." },
      { toolId: "openai-whisper",   useCase: "Interview transcription",              why: "Accurate transcription of recorded interviews and press conferences in 99 languages, free to run locally." },
    ],
    useCases: ["Draft and edit articles", "Research with citations", "Transcribe interviews", "Optimise content for SEO", "Overcome writer's block", "Organise research notes"],
    relatedSlugs: ["marketers", "content-creators"],
  },

  // ── HR ───────────────────────────────────────────────────────────────────
  {
    slug: "hr-teams",
    name: "HR Professional",
    plural: "HR Teams",
    emoji: "🤝",
    headline: "Best AI Tools for HR Teams in 2026",
    description: "Top AI tools for HR professionals in 2026. AI for job descriptions, recruitment, onboarding videos, policy writing, employee communication, and training content creation.",
    intro: "HR teams are using AI to move faster on everything from writing job descriptions and onboarding content to answering employee queries and creating training videos — freeing up time for the human work that actually builds culture.",
    topPickId: "claude-opus-4",
    tools: [
      { toolId: "claude-opus-4",    useCase: "Job descriptions & HR policies",       why: "Draft inclusive JDs, employee handbooks, and HR policies that are clear, comprehensive, and on-brand." },
      { toolId: "grammarly",        useCase: "Employee communication",               why: "Ensure all HR communications — offer letters, performance reviews, memos — are professional and clear." },
      { toolId: "synthesia",        useCase: "Onboarding & compliance training",     why: "Create professional onboarding videos in 140 languages without filming — update any time." },
      { toolId: "notion-ai",        useCase: "HR knowledge base",                    why: "Employees get instant AI-powered answers from your policies, benefits docs, and FAQs." },
      { toolId: "heygen",           useCase: "CEO and leadership videos",            why: "Create personalised welcome videos from leadership for new hires without scheduling film time." },
      { toolId: "zapier-ai",        useCase: "HR workflow automation",               why: "Automate onboarding tasks, survey distribution, and approval workflows without code." },
    ],
    useCases: ["Write job descriptions", "Create onboarding content", "Draft HR policies", "Build training videos", "Automate workflows", "Answer employee FAQs"],
    relatedSlugs: ["lawyers", "small-business"],
  },

  // ── Real Estate ──────────────────────────────────────────────────────────
  {
    slug: "real-estate",
    name: "Real Estate Agent",
    plural: "Real Estate Agents",
    emoji: "🏠",
    headline: "Best AI Tools for Real Estate Agents in 2026",
    description: "Top AI tools for real estate agents in 2026. AI for property listings, client emails, market reports, presentation decks, property tour videos, and marketing content.",
    intro: "Real estate agents who use AI are listing faster, communicating better, and closing more deals. From writing compelling property descriptions to creating professional pitch decks for sellers, these tools give agents an edge.",
    topPickId: "claude-opus-4",
    tools: [
      { toolId: "claude-opus-4",    useCase: "Property listings & market reports",   why: "Write compelling, accurate property descriptions and detailed market reports in minutes." },
      { toolId: "gamma",            useCase: "Seller & buyer presentations",          why: "Create beautiful CMA and listing presentations that impress clients — fast, no design skills needed." },
      { toolId: "heygen",           useCase: "Property tour video walkthroughs",     why: "Create professional video walkthroughs with AI narration — no camera crew or editing required." },
      { toolId: "canva-ai",         useCase: "Marketing materials & social posts",   why: "Design just-listed flyers, open house materials, and social posts in minutes." },
      { toolId: "grammarly",        useCase: "Client email communication",           why: "Every email to buyers, sellers, and attorneys is polished and professional." },
      { toolId: "zapier-ai",        useCase: "Lead follow-up automation",            why: "Automate lead nurture emails, follow-up sequences, and CRM updates without a developer." },
    ],
    useCases: ["Write property listings", "Create CMA presentations", "Make property tour videos", "Design marketing flyers", "Automate client follow-up", "Draft offer letters"],
    relatedSlugs: ["small-business", "marketers"],
  },

  // ── Finance ──────────────────────────────────────────────────────────────
  {
    slug: "accountants",
    name: "Accountant",
    plural: "Accountants & Finance Teams",
    emoji: "📊",
    headline: "Best AI Tools for Accountants & Finance Teams in 2026",
    description: "Top AI tools for accountants and finance professionals in 2026. AI for financial reports, data analysis, client communication, Excel automation, research, and compliance documentation.",
    intro: "Finance teams are using AI to cut time spent on reports, research, and routine communication — while improving accuracy and insight. These tools complement your expertise without touching the work that requires human judgement.",
    topPickId: "claude-opus-4",
    tools: [
      { toolId: "claude-opus-4",    useCase: "Financial analysis & report writing",  why: "Analyse financial statements, draft commentary, and write board-ready reports with high accuracy." },
      { toolId: "microsoft-copilot", useCase: "Excel & spreadsheet automation",     why: "AI built into Microsoft 365 — write Excel formulas, summarise spreadsheets, and automate reporting." },
      { toolId: "grammarly",        useCase: "Client and audit communications",      why: "Polish every client-facing document and audit response to a professional standard." },
      { toolId: "perplexity",       useCase: "Tax law & regulation research",        why: "Find up-to-date regulatory guidance with cited sources — faster than manual search." },
      { toolId: "notion-ai",        useCase: "Client knowledge base",               why: "Q&A over client files, prior-year workpapers, and firm policies for faster onboarding and review." },
      { toolId: "gamma",            useCase: "Client financial presentations",       why: "Turn financial data into clear, professional client presentation decks in minutes." },
    ],
    useCases: ["Write financial reports", "Automate Excel workflows", "Research tax regulations", "Draft client communications", "Summarise financial statements", "Build investor decks"],
    relatedSlugs: ["lawyers", "hr-teams"],
  },

  // ── Sales ────────────────────────────────────────────────────────────────
  {
    slug: "sales-teams",
    name: "Sales Professional",
    plural: "Sales Teams",
    emoji: "🎯",
    headline: "Best AI Tools for Sales Teams in 2026",
    description: "Top AI tools for sales professionals and SDRs in 2026. AI for outreach, proposal writing, sales videos, call transcription, CRM automation, and GTM workflows.",
    intro: "AI gives sales teams an unfair advantage — personalised outreach at scale, call analysis, faster proposals, and automation that means no lead falls through the cracks. These are the tools top-performing sales teams are actually using.",
    topPickId: "copy-ai",
    tools: [
      { toolId: "copy-ai",          useCase: "Outreach sequences & GTM copy",        why: "Built for B2B GTM — personalised email sequences, LinkedIn messages, and ad copy that converts." },
      { toolId: "claude-opus-4",    useCase: "Proposals & RFP responses",            why: "Write compelling, tailored proposals and RFP responses in a fraction of the time." },
      { toolId: "heygen",           useCase: "Personalised sales videos",            why: "Send 1-to-1 video messages to prospects at scale — proven to lift reply rates significantly." },
      { toolId: "assemblyai",       useCase: "Call recording & deal intelligence",   why: "Transcribe sales calls, extract objections and next steps, and feed insights into your CRM." },
      { toolId: "zapier-ai",        useCase: "CRM & lead workflow automation",       why: "Automate lead routing, follow-up tasks, and CRM updates so nothing slips through." },
      { toolId: "gamma",            useCase: "Sales decks & pitch presentations",    why: "Beautiful, on-brand sales decks from a prompt — ideal for fast-moving enterprise sales cycles." },
    ],
    useCases: ["Write cold outreach", "Draft proposals", "Send personalised videos", "Transcribe sales calls", "Automate follow-ups", "Create pitch decks"],
    relatedSlugs: ["marketers", "small-business"],
  },

  // ── Students ─────────────────────────────────────────────────────────────
  {
    slug: "students",
    name: "Student",
    plural: "Students",
    emoji: "🎓",
    headline: "Best Free AI Tools for Students in 2026",
    description: "Top free and affordable AI tools for students in 2026. AI for essay writing, research, note-taking, study, presentations, and academic productivity.",
    intro: "AI can help students learn faster, research more effectively, and write better — without doing the work for them. Used ethically, these tools are like having a personal tutor, research assistant, and writing coach available 24/7.",
    topPickId: "claude-opus-4",
    tools: [
      { toolId: "claude-opus-4",    useCase: "Essay writing & understanding concepts", why: "Explains complex topics clearly, gives feedback on drafts, and helps you think through arguments." },
      { toolId: "perplexity",       useCase: "Research with real citations",          why: "Unlike ChatGPT, Perplexity gives you real cited sources you can actually verify and reference." },
      { toolId: "consensus",        useCase: "Academic research & evidence",          why: "Searches 200M+ peer-reviewed papers — essential for science, medicine, and social science essays." },
      { toolId: "grammarly",        useCase: "Essay editing & proofreading",          why: "Free tier catches grammar, clarity, and tone issues in essays before you submit." },
      { toolId: "notion-ai",        useCase: "Note-taking & study organisation",      why: "Organise lecture notes, reading summaries, and essay plans — then ask AI questions about them." },
      { toolId: "gamma",            useCase: "Presentation slides",                   why: "Create professional presentation decks from notes in under 2 minutes — free tier is generous." },
    ],
    useCases: ["Research with real sources", "Get feedback on essays", "Understand complex topics", "Make presentation slides", "Organise study notes", "Summarise long readings"],
    relatedSlugs: ["teachers", "writers"],
  },

  // ── Content Creators ─────────────────────────────────────────────────────
  {
    slug: "content-creators",
    name: "Content Creator",
    plural: "Content Creators & YouTubers",
    emoji: "🎬",
    headline: "Best AI Tools for Content Creators & YouTubers in 2026",
    description: "Top AI tools for YouTubers and content creators in 2026. AI for video editing, voiceover, music, thumbnails, scriptwriting, avatar videos, and channel growth.",
    intro: "AI has dramatically lowered the production bar for content creators — you can now produce studio-quality audio, music, and video without a team. These tools are used by creators with audiences from 1,000 to 10 million+.",
    topPickId: "elevenlabs",
    tools: [
      { toolId: "elevenlabs",       useCase: "AI voiceover & narration",             why: "Best voice quality of any TTS tool. Clone your own voice or choose from hundreds of natural-sounding voices." },
      { toolId: "suno",             useCase: "Background music & intros",             why: "Generate royalty-free music in any genre for your videos in seconds — no music licence headaches." },
      { toolId: "heygen",           useCase: "Avatar & talking-head videos",          why: "Create video content in 120+ languages with a realistic AI avatar — no camera needed." },
      { toolId: "runway-gen3",      useCase: "Video editing & AI effects",            why: "Professional AI video editing, background removal, and generative effects used by top creators." },
      { toolId: "canva-ai",         useCase: "Thumbnails & channel art",              why: "Design eye-catching thumbnails and channel banners with AI — the most-used tool by small creators." },
      { toolId: "claude-opus-4",    useCase: "Script writing & ideation",             why: "Write engaging scripts, video titles, and descriptions faster — and brainstorm content ideas at scale." },
    ],
    useCases: ["Generate voiceovers", "Create AI music", "Design thumbnails", "Write video scripts", "Edit video with AI", "Build multilingual content"],
    relatedSlugs: ["marketers", "designers"],
  },

  // ── Small Business ───────────────────────────────────────────────────────
  {
    slug: "small-business",
    name: "Small Business Owner",
    plural: "Small Business Owners",
    emoji: "🏪",
    headline: "Best AI Tools for Small Business Owners in 2026",
    description: "Top AI tools for small business owners and entrepreneurs in 2026. AI for marketing, customer communication, automation, content creation, accounting support, and business operations.",
    intro: "Small business owners wear every hat — and AI helps you wear them better. Whether you need to handle marketing, customer comms, operations, or bookkeeping, these tools give you capabilities that used to require a full team.",
    topPickId: "claude-opus-4",
    tools: [
      { toolId: "claude-opus-4",    useCase: "Business writing & communications",    why: "Drafts emails, proposals, business plans, and customer responses that sound professional." },
      { toolId: "canva-ai",         useCase: "Marketing materials & social content", why: "Run your own marketing with no design budget — posts, flyers, ads, and branded content in minutes." },
      { toolId: "zapier-ai",        useCase: "Business workflow automation",         why: "Connect your tools and automate repetitive tasks — no developer needed, 7,000+ integrations." },
      { toolId: "grammarly",        useCase: "Customer communication quality",       why: "Every email and message to customers is clear, professional, and error-free." },
      { toolId: "gamma",            useCase: "Pitch decks & business proposals",     why: "Create investor pitches, partnership decks, and sales proposals that look professionally designed." },
      { toolId: "heygen",           useCase: "Video content & product demos",        why: "Create explainer videos and product demos without filming, editing, or hiring a production team." },
    ],
    useCases: ["Write business proposals", "Create social content", "Automate repetitive tasks", "Handle customer emails", "Build marketing materials", "Make product demo videos"],
    relatedSlugs: ["marketers", "sales-teams"],
  },

  // ── Nurses ───────────────────────────────────────────────────────────────
  {
    slug: "nurses",
    name: "Nurse",
    plural: "Nurses & Healthcare Staff",
    emoji: "💊",
    headline: "Best AI Tools for Nurses & Healthcare Staff in 2026",
    description: "Top AI tools for nurses and allied health professionals in 2026. AI for clinical documentation, shift handovers, patient education, medication research, and care planning.",
    intro: "Nurses spend significant time on documentation that could be automated — shift handovers, care plans, patient education materials. These AI tools help clinical staff reclaim time for direct patient care.",
    topPickId: "openai-whisper",
    tools: [
      { toolId: "openai-whisper",   useCase: "Voice-to-text care notes",             why: "Dictate patient observations and shift notes accurately — free to run locally for privacy compliance." },
      { toolId: "claude-opus-4",    useCase: "Care plan documentation & education",  why: "Draft care plans, patient education materials, and discharge instructions clearly and quickly." },
      { toolId: "assemblyai",       useCase: "Handover summaries from audio",        why: "Record handover conversations and get AI-generated written summaries automatically." },
      { toolId: "grammarly",        useCase: "Patient-facing document review",       why: "Ensure patient letters, discharge notes, and care plans are clear and free of errors." },
      { toolId: "consensus",        useCase: "Evidence-based practice research",     why: "Quickly find the evidence base for clinical decisions from 200M+ peer-reviewed papers." },
      { toolId: "notion-ai",        useCase: "Ward protocol & policy lookup",        why: "Get instant answers from ward protocols, clinical guidelines, and department policies." },
    ],
    useCases: ["Dictate patient notes", "Write care plans", "Summarise handovers", "Research medications", "Create patient education materials", "Look up clinical protocols"],
    relatedSlugs: ["doctors", "dentists"],
  },

  // ── Recruiters ───────────────────────────────────────────────────────────
  {
    slug: "recruiters",
    name: "Recruiter",
    plural: "Recruiters",
    emoji: "🔍",
    headline: "Best AI Tools for Recruiters in 2026",
    description: "Top AI tools for recruiters and talent acquisition teams in 2026. AI for job descriptions, candidate outreach, interview scheduling, video introductions, and hiring workflow automation.",
    intro: "AI has transformed recruiting — from writing better JDs to personalising outreach at scale and automating the admin that slows hiring down. These are the tools used by top recruiters to hire faster and better.",
    topPickId: "claude-opus-4",
    tools: [
      { toolId: "claude-opus-4",    useCase: "Job descriptions & offer letters",     why: "Write inclusive, compelling JDs and professional offer letters that attract the right candidates." },
      { toolId: "copy-ai",          useCase: "Candidate outreach messages",           why: "Personalised InMail and email sequences that get responses — built for high-volume outreach." },
      { toolId: "heygen",           useCase: "Company culture & role intro videos",   why: "Create personalised video outreach to top candidates that stands out in crowded inboxes." },
      { toolId: "assemblyai",       useCase: "Interview recording & notes",           why: "Transcribe interviews and extract key insights — who said what, key skills demonstrated." },
      { toolId: "zapier-ai",        useCase: "ATS & recruitment workflow automation", why: "Automate candidate status updates, interview scheduling, and ATS data entry." },
      { toolId: "notion-ai",        useCase: "Candidate tracking & hiring docs",      why: "Keep all candidate notes, scorecards, and hiring decisions organised with AI-powered search." },
    ],
    useCases: ["Write job descriptions", "Personalise outreach", "Send video introductions", "Transcribe interviews", "Automate scheduling", "Track candidates"],
    relatedSlugs: ["hr-teams", "sales-teams"],
  },
];

export function getProfession(slug: string): Profession | undefined {
  return PROFESSIONS.find((p) => p.slug === slug);
}

export function getProfessionSlugs(): string[] {
  return PROFESSIONS.map((p) => p.slug);
}
