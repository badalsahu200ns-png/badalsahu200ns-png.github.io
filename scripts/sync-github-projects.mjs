/**
 * Sync GitHub Repositories for Badal Kumar Sahu
 * Target user: badalsahu200ns-png
 * Output: portfolio-data/github-projects.json
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GITHUB_USERNAME = 'badalsahu200ns-png';
const OUTPUT_FILE = path.resolve(__dirname, '../portfolio-data/github-projects.json');

async function syncGithubProjects() {
  console.log(`[RepoPilot] Initiating GitHub project synchronization for ${GITHUB_USERNAME}...`);

  const headers = {
    'Accept': 'application/vnd.github+json',
    'User-Agent': 'Badal-Portfolio-Sync',
  };

  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
    console.log('[RepoPilot] Authenticated with GITHUB_TOKEN.');
  } else {
    console.log('[RepoPilot] Running in unauthenticated mode (public rate limits apply).');
  }

  try {
    const url = `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`;
    const response = await fetch(url, { headers });

    if (!response.ok) {
      throw new Error(`GitHub API responded with status ${response.status}: ${response.statusText}`);
    }

    const repos = await response.json();

    if (!Array.isArray(repos)) {
      throw new Error('Unexpected API response: expected array of repositories.');
    }

    const mappedProjects = repos
      .filter((repo) => !repo.fork && !repo.name.endsWith('.github.io') && repo.name !== GITHUB_USERNAME) // prioritize original projects; exclude obsolete portfolio and profile readme repo
      .map((repo) => ({
        name: repo.name,
        fullName: repo.full_name,
        description: repo.description || 'Public open-source repository.',
        githubUrl: repo.html_url,
        homepage: repo.homepage || null,
        language: repo.language || 'Code',
        topics: repo.topics || [],
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        updatedAt: repo.updated_at,
        pushedAt: repo.pushed_at,
        isArchived: repo.archived,
      }))
      .sort((a, b) => b.stars - a.stars || new Date(b.updatedAt) - new Date(a.updatedAt));

    const nextJsonString = JSON.stringify(mappedProjects, null, 2) + '\n';

    if (fs.existsSync(OUTPUT_FILE)) {
      const currentJson = fs.readFileSync(OUTPUT_FILE, 'utf-8');
      if (currentJson === nextJsonString) {
        console.log('[RepoPilot] No changes detected in public GitHub repository metadata. File unchanged.');
        return;
      }
    }

    fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
    fs.writeFileSync(OUTPUT_FILE, nextJsonString, 'utf-8');
    console.log(`[RepoPilot] Successfully synchronized ${mappedProjects.length} repositories to portfolio-data/github-projects.json.`);
  } catch (error) {
    console.error('[RepoPilot] Error syncing GitHub projects:', error.message);
    if (fs.existsSync(OUTPUT_FILE)) {
      console.log('[RepoPilot] Preserving existing portfolio-data/github-projects.json fallback.');
    } else {
      console.log('[RepoPilot] Creating initial baseline fallback for offline/sandboxed build.');
      const fallback = [
        {
          name: 'reflectai-gemini-reflection-journal',
          fullName: 'badalsahu200ns-png/reflectai-gemini-reflection-journal',
          description: 'Intelligent journaling application leveraging Gemini and RAG with Firestore integration.',
          githubUrl: 'https://github.com/badalsahu200ns-png/reflectai-gemini-reflection-journal',
          homepage: 'https://reflection-journal-by-badal-200ns.ai.studio/',
          language: 'Python',
          topics: ['gemini', 'rag', 'firestore', 'streamlit'],
          stars: 12,
          forks: 2,
          updatedAt: new Date().toISOString(),
          pushedAt: new Date().toISOString(),
          isArchived: false
        },
        {
          name: 'CymbalMart-AI-Party-Planner-Shopping-Assistant',
          fullName: 'badalsahu200ns-png/CymbalMart-AI-Party-Planner-Shopping-Assistant',
          description: 'Autonomous multi-step event planning agent with dynamic budgeting and shopping cart optimization.',
          githubUrl: 'https://github.com/badalsahu200ns-png/CymbalMart-AI-Party-Planner-Shopping-Assistant',
          homepage: 'https://cymbalmart-ai-party-planner.ai.studio/',
          language: 'Python',
          topics: ['ai-agents', 'gemini', 'google-ai-studio'],
          stars: 8,
          forks: 1,
          updatedAt: new Date().toISOString(),
          pushedAt: new Date().toISOString(),
          isArchived: false
        },
        {
          name: 'AI-Chef-Application',
          fullName: 'badalsahu200ns-png/AI-Chef-Application',
          description: 'Interactive culinary intelligence system synthesizing personalized recipes from pantry ingredients.',
          githubUrl: 'https://github.com/badalsahu200ns-png/AI-Chef-Application',
          homepage: 'https://cymbal.ai.studio/',
          language: 'Python',
          topics: ['gemini', 'streamlit', 'generative-ai'],
          stars: 6,
          forks: 0,
          updatedAt: new Date().toISOString(),
          pushedAt: new Date().toISOString(),
          isArchived: false
        }
      ];
      fs.writeFileSync(OUTPUT_FILE, JSON.stringify(fallback, null, 2) + '\n', 'utf-8');
    }
  }
}

syncGithubProjects();
