const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER;
const GITHUB_REPO = process.env.GITHUB_REPO;
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || "main";

function isConfigured(): boolean {
  return !!(GITHUB_TOKEN && GITHUB_OWNER && GITHUB_REPO);
}

async function githubApi(path: string, options: RequestInit = {}) {
  const res = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status} ${await res.text()}`);
  }
  return res.json();
}

export async function readFileFromGitHub(filePath: string): Promise<string> {
  const data = await githubApi(`contents/${filePath}?ref=${GITHUB_BRANCH}`);
  return Buffer.from(data.content, "base64").toString("utf-8");
}

export async function writeFileToGitHub(
  filePath: string,
  content: string,
  commitMessage: string
): Promise<void> {
  // Get current file SHA (needed for updates)
  let sha: string | undefined;
  try {
    const existing = await githubApi(`contents/${filePath}?ref=${GITHUB_BRANCH}`);
    sha = existing.sha;
  } catch {
    // File doesn't exist yet, that's fine
  }

  await githubApi(`contents/${filePath}`, {
    method: "PUT",
    body: JSON.stringify({
      message: commitMessage,
      content: Buffer.from(content).toString("base64"),
      branch: GITHUB_BRANCH,
      ...(sha ? { sha } : {}),
    }),
  });
}

export { isConfigured };
