# Central Portfolio Data & Asset Architecture

This directory houses the structured JSON data sources that power the entire Badal Kumar Sahu portfolio. **All UI components consume these files directly.** You do not need to modify React code to update your profile, career milestones, projects, credentials, or skills.

---

## Data Files Overview

| File | Purpose | Key Fields |
| :--- | :--- | :--- |
| `profile.json` | Core brand identity, executive bio, status, contact info, video/photo paths | `name`, `headline`, `summary`, `email`, `linkedin`, `github`, `cinematic`, `workMode` |
| `internships.json` | Internship timeline entries & verification details | `organization`, `role`, `startDate`, `endDate`, `domain`, `responsibilities`, `skills` |
| `experience.json` | Professional experience milestones and commercial impact metrics | `experiences[]`, `impactMetrics[]`, `businessImpact`, `highlightMetric` |
| `education.json` | Formal academic degrees and coursework | `degree`, `institution`, `dates`, `relevantSubjects`, `currentStatus` |
| `certifications.json` | Industry credentials, job simulations & verification links | `name`, `issuer`, `issueDate`, `credentialId`, `verificationUrl`, `status` |
| `skills.json` | Core capability clusters & 3D technical skills categories | `coreExpertise[]`, `technicalCategories[]` |
| `projects.json` | Curated project showcases, priority ordering & live links | `repo`, `featured`, `priority`, `displayTitle`, `category`, `customDescription`, `technologyTags`, `demoUrl` |
| `github-projects.json` | Automatically synchronized public repositories from GitHub | Generated automatically via `scripts/sync-github-projects.mjs` |

---

## Media Storage Structure

Media assets live in `public/media/` and `public/certificates/`:

- `public/media/cinematic/badal-walking.mp4` — Hero cinematic background loop
- `public/media/cinematic/badal-walking-poster.webp` — Poster fallback for mobile / reduced motion
- `public/media/profile/` — Professional portrait photographs (e.g. `badal-portrait.png`)
- `public/media/projects/` — Project screenshots and architecture diagrams
- `public/certificates/` — Certification credential PDFs and badges

---

## Step-by-Step Manual Update Workflows

### 1. Updating Profile & Headline
1. Open `portfolio-data/profile.json`.
2. Edit `headline`, `summary`, `workplaceStatus`, or social endpoints.
3. Save the file.

### 2. Adding a New Internship
1. Open `portfolio-data/internships.json`.
2. Add a new object to the array:
   ```json
   {
     "id": "new-internship-id",
     "organization": "Company Name",
     "role": "Role Title",
     "startDate": "Month Year",
     "endDate": "Present",
     "period": "Month Year – Present",
     "location": "Location / Remote",
     "domain": "Domain Name",
     "description": "Overview of domain responsibilities.",
     "responsibilities": ["Item 1", "Item 2"],
     "skills": ["Skill A", "Skill B"],
     "outcomes": "Key verified outcome"
   }
   ```

### 3. Adding Professional Experience
1. Open `portfolio-data/experience.json`.
2. Add a new entry under `"experiences"` with verified responsibilities and business metrics.

### 4. Adding Education
1. Open `portfolio-data/education.json`.
2. Append a new degree entry with `degree`, `institution`, `dates`, and `relevantSubjects`.

### 5. Adding Certifications
1. Open `portfolio-data/certifications.json`.
2. Append a new credential entry. If you have a certificate image or PDF, place it in `public/certificates/` and set `"certificateImage": "/certificates/your-certificate.png"`.

### 6. Curating Projects
1. Open `portfolio-data/projects.json`.
2. Adjust `priority` (1 = highest), set `featured: true`, or provide custom live demo URLs.

### 7. Updating Profile Photos & Walking Video
- Replace `public/media/profile/badal-portrait.png` with your portrait photograph.
- Replace `public/media/cinematic/badal-walking.mp4` with your walking video.
- Replace `public/media/cinematic/badal-walking-poster.webp` with your video poster frame.

---

## Standard Deployment Workflow

To build and deploy changes to GitHub Pages:

1. **Edit the relevant JSON file** (or update media).
2. **Synchronize GitHub repository metadata** (optional if already up to date):
   ```bash
   npm run sync:github
   ```
3. **Build the production bundle**:
   ```bash
   npm run build
   ```
4. **Commit and push to GitHub**:
   ```bash
   git add .
   git commit -m "feat(portfolio): update profile data"
   git push origin main
   ```
5. **GitHub Actions** will automatically verify, build, and deploy the updated site to GitHub Pages.

---

## Automatic Synchronization Note

The automated GitHub Action (`.github/workflows/sync-github-projects.yml`) runs daily on a schedule and on repository updates to refresh public repositories into `portfolio-data/github-projects.json` without any manual intervention.
