import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Read source JSON data
const profile = JSON.parse(fs.readFileSync(path.join(rootDir, 'portfolio-data/profile.json'), 'utf8'));
const experience = JSON.parse(fs.readFileSync(path.join(rootDir, 'portfolio-data/experience.json'), 'utf8'));
const internships = JSON.parse(fs.readFileSync(path.join(rootDir, 'portfolio-data/internships.json'), 'utf8'));
const projects = JSON.parse(fs.readFileSync(path.join(rootDir, 'portfolio-data/projects.json'), 'utf8'));
const education = JSON.parse(fs.readFileSync(path.join(rootDir, 'portfolio-data/education.json'), 'utf8'));

export const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Badal_Kumar_Sahu_ATS_Resume</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 10mm 12mm 10mm 12mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #0f172a;
      background: #ffffff;
      font-size: 8.75pt;
      line-height: 1.30;
      -webkit-font-smoothing: antialiased;
    }
    a {
      color: #0369a1;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
    
    /* 3-Page Strict Layout Architecture */
    .resume-page {
      width: 100%;
      height: 275mm;
      max-height: 275mm;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      box-sizing: border-box;
    }
    .page-content {
      flex: 1 1 auto;
    }
    .page-break {
      page-break-after: always;
      break-after: page;
      height: 0;
      margin: 0;
      padding: 0;
      border: none;
    }

    /* Running Document Footer */
    .page-footer {
      flex-shrink: 0;
      border-top: 1px solid #cbd5e1;
      padding-top: 4px;
      margin-top: 4px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 7.5pt;
      color: #64748b;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }

    /* Section Headers */
    .section-title {
      font-size: 9.6pt;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      color: #0f172a;
      border-bottom: 1.5px solid #0f172a;
      padding-bottom: 2px;
      margin-top: 7px;
      margin-bottom: 5px;
    }
    .section-title.first {
      margin-top: 0;
    }

    /* Header Element */
    .header {
      border-bottom: 2px solid #0f172a;
      padding-bottom: 5px;
      margin-bottom: 6px;
    }
    .name {
      font-size: 21pt;
      font-weight: 800;
      letter-spacing: -0.4px;
      color: #0f172a;
      text-transform: uppercase;
      line-height: 1.1;
    }
    .headline {
      font-size: 9.3pt;
      font-weight: 600;
      color: #0369a1;
      margin-top: 2.5px;
    }
    .contact-row {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 10px;
      margin-top: 3.5px;
      font-size: 8.2pt;
      color: #334155;
    }
    .contact-item {
      display: inline-flex;
      align-items: center;
      gap: 3px;
    }
    .sep {
      color: #94a3b8;
    }

    /* Skills Grid */
    .skills-block {
      margin-bottom: 3px;
      font-size: 8.5pt;
      line-height: 1.32;
    }
    .skills-block strong {
      color: #0f172a;
    }
    .skills-block span {
      color: #334155;
    }

    /* Experience Items */
    .exp-item {
      margin-bottom: 6px;
    }
    .exp-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      font-size: 8.9pt;
      margin-bottom: 1.5px;
    }
    .exp-role {
      font-weight: 700;
      color: #0f172a;
    }
    .exp-company {
      font-weight: 600;
      color: #0369a1;
    }
    .exp-meta {
      font-size: 8pt;
      font-weight: 500;
      color: #64748b;
      white-space: nowrap;
    }
    .exp-impact {
      font-size: 8.2pt;
      font-weight: 600;
      color: #0f172a;
      margin-bottom: 2px;
    }
    ul.bullet-list {
      list-style-type: disc;
      padding-left: 15px;
      margin-top: 1.5px;
    }
    ul.bullet-list li {
      font-size: 8.35pt;
      color: #334155;
      margin-bottom: 2px;
      line-height: 1.28;
    }

    /* Projects & Internships */
    .project-item {
      margin-bottom: 5.5px;
    }
    .project-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      font-size: 8.8pt;
      margin-bottom: 1.5px;
    }
    .project-title {
      font-weight: 700;
      color: #0f172a;
    }
    .project-tags {
      font-size: 7.8pt;
      color: #64748b;
    }
    .project-links {
      font-size: 8pt;
      font-weight: 500;
      white-space: nowrap;
    }

    /* Certifications Grid */
    .cert-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      column-gap: 12px;
      row-gap: 3.5px;
      font-size: 8pt;
      line-height: 1.26;
    }
    .cert-item {
      color: #334155;
    }
    .cert-issuer {
      font-weight: 700;
      color: #0f172a;
    }
    .cert-id {
      color: #64748b;
      font-size: 7.5pt;
    }
  </style>
</head>
<body>

  <!-- =========================================================================
       PAGE 1: PROFILE, SKILLS & RECENT PROFESSIONAL EXPERIENCE
       ========================================================================= -->
  <div class="resume-page" id="page-1">
    <div class="page-content">
      
      <!-- Document Header -->
      <header class="header">
        <h1 class="name">BADAL KUMAR SAHU</h1>
        <div class="headline">
          Senior Business &amp; Data Analyst &bull; Generative AI &amp; Autonomous AI Agents &bull; Cloud Architectures (GCP/AWS)
        </div>
        <div class="contact-row">
          <span class="contact-item">Bhubaneswar, India</span>
          <span class="sep">&bull;</span>
          <a href="mailto:${profile.email}" class="contact-item">${profile.email}</a>
          <span class="sep">&bull;</span>
          <a href="${profile.linkedin}" target="_blank" class="contact-item">linkedin.com/in/badalsahu200ns</a>
          <span class="sep">&bull;</span>
          <a href="${profile.github}" target="_blank" class="contact-item">github.com/badalsahu200ns-png</a>
          <span class="sep">&bull;</span>
          <a href="https://badalsahu200ns-png.github.io/" target="_blank" class="contact-item">badalsahu200ns-png.github.io</a>
        </div>
      </header>

      <!-- 1. Professional Summary -->
      <div class="section-title first">Professional Summary</div>
      <p style="font-size: 8.5pt; color: #334155; text-align: justify; margin-bottom: 6px; line-height: 1.32;">
        ${profile.summary}
      </p>

      <!-- 2. Core Competencies & Domain Specialization -->
      <div class="section-title">Core Competencies &amp; Domain Specialization</div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; column-gap: 12px; row-gap: 2.5px; font-size: 8.3pt; margin-bottom: 6px;">
        <div>&bull; <strong style="color: #0f172a;">Business Analytics &amp; Forecasting:</strong> Trend analysis &amp; KPI metrics</div>
        <div>&bull; <strong style="color: #0f172a;">Autonomous AI Multi-Agents:</strong> Tool calling, RAG &amp; reasoning systems</div>
        <div>&bull; <strong style="color: #0f172a;">Petabyte Cloud Warehousing:</strong> BigQuery SQL &amp; Dataform ETL</div>
        <div>&bull; <strong style="color: #0f172a;">Product Thinking &amp; Strategy:</strong> ROI tracking, roadmap &amp; stakeholder advisory</div>
        <div>&bull; <strong style="color: #0f172a;">Operations Optimization:</strong> Lean process engineering &amp; Six Sigma</div>
        <div>&bull; <strong style="color: #0f172a;">Enterprise Infrastructure:</strong> Google Cloud Platform, AWS, Docker microservices</div>
      </div>

      <!-- 3. Technical Skills Matrix -->
      <div class="section-title">Technical Skills Matrix</div>
      <div class="skills-block">
        <strong>Data Analytics &amp; BI:</strong> 
        <span>SQL (Advanced Window Functions, CTEs), Google BigQuery, Power BI, Tableau, Advanced Excel (XLOOKUP, Power Pivot), EDA, KPI Dashboards, MIS Automation, Statistical Modeling</span>
      </div>
      <div class="skills-block">
        <strong>Artificial Intelligence &amp; GenAI:</strong> 
        <span>Gemini API, Anthropic Claude, Prompt Engineering, RAG Systems, Multi-Agent Architecture, Vector Search &amp; Embeddings, Google AI Studio, LLM Orchestration</span>
      </div>
      <div class="skills-block">
        <strong>Programming &amp; Software:</strong> 
        <span>Python (Pandas, NumPy, Matplotlib, Scikit-learn), Core Java, TypeScript, React, Streamlit, FastAPI, Git, GitHub CI/CD, Salesforce CRM</span>
      </div>
      <div class="skills-block" style="margin-bottom: 6px;">
        <strong>Cloud Platforms &amp; Databases:</strong> 
        <span>Google Cloud Platform (BigQuery, Cloud Run, Cloud Storage, IAM), Amazon Web Services (EC2, S3, RDS, IAM, VPC), Docker, Distributed Systems</span>
      </div>

      <!-- 4. Professional Experience (Part 1 - Recent Roles) -->
      <div class="section-title">Professional Experience (5+ Years Enterprise Track Record)</div>
      
      <!-- Role 1: Magicbricks -->
      <div class="exp-item">
        <div class="exp-header">
          <div>
            <span class="exp-role">${experience.experiences[0].role}</span>
            <span style="color: #94a3b8;"> &mdash; </span>
            <span class="exp-company">${experience.experiences[0].company}</span>
          </div>
          <div class="exp-meta">${experience.experiences[0].period} | ${experience.experiences[0].location}</div>
        </div>
        <div class="exp-impact">Key Impact: ${experience.experiences[0].businessImpact}</div>
        <ul class="bullet-list">
          ${experience.experiences[0].responsibilities.map(r => `<li>${r}</li>`).join('')}
        </ul>
      </div>

      <!-- Role 2: redBus -->
      <div class="exp-item" style="margin-bottom: 0;">
        <div class="exp-header">
          <div>
            <span class="exp-role">${experience.experiences[1].role}</span>
            <span style="color: #94a3b8;"> &mdash; </span>
            <span class="exp-company">${experience.experiences[1].company}</span>
          </div>
          <div class="exp-meta">${experience.experiences[1].period} | ${experience.experiences[1].location}</div>
        </div>
        <div class="exp-impact">Key Impact: ${experience.experiences[1].businessImpact}</div>
        <ul class="bullet-list">
          ${experience.experiences[1].responsibilities.map(r => `<li>${r}</li>`).join('')}
        </ul>
      </div>

    </div>

    <!-- Running Page 1 Footer -->
    <div class="page-footer">
      <span>BADAL KUMAR SAHU &bull; CURRICULUM VITAE</span>
      <span>PAGE 1 OF 3</span>
    </div>
  </div>

  <div class="page-break"></div>

  <!-- =========================================================================
       PAGE 2: PROFESSIONAL EXPERIENCE (CONT.), PROJECTS & INTERNSHIPS
       ========================================================================= -->
  <div class="resume-page" id="page-2">
    <div class="page-content">

      <!-- 4. Professional Experience (Part 2 - Foundational Enterprise Leadership) -->
      <div class="section-title first">Professional Experience (Continued)</div>

      <!-- Role 3: Reliance Retail -->
      <div class="exp-item">
        <div class="exp-header">
          <div>
            <span class="exp-role">${experience.experiences[2].role}</span>
            <span style="color: #94a3b8;"> &mdash; </span>
            <span class="exp-company">${experience.experiences[2].company}</span>
          </div>
          <div class="exp-meta">${experience.experiences[2].period} | ${experience.experiences[2].location}</div>
        </div>
        <div class="exp-impact">Key Impact: ${experience.experiences[2].businessImpact}</div>
        <ul class="bullet-list">
          ${experience.experiences[2].responsibilities.map(r => `<li>${r}</li>`).join('')}
        </ul>
      </div>

      <!-- Role 4: ICICI Prudential -->
      <div class="exp-item" style="margin-bottom: 8px;">
        <div class="exp-header">
          <div>
            <span class="exp-role">${experience.experiences[3].role}</span>
            <span style="color: #94a3b8;"> &mdash; </span>
            <span class="exp-company">${experience.experiences[3].company}</span>
          </div>
          <div class="exp-meta">${experience.experiences[3].period} | ${experience.experiences[3].location}</div>
        </div>
        <div class="exp-impact">Key Impact: ${experience.experiences[3].businessImpact}</div>
        <ul class="bullet-list">
          ${experience.experiences[3].responsibilities.map(r => `<li>${r}</li>`).join('')}
        </ul>
      </div>

      <!-- 5. Selected Featured Projects (AI, Cloud & Data Architectures) -->
      <div class="section-title">Selected Featured Projects (AI, Cloud &amp; Analytics)</div>
      
      <!-- Project 1: BigQuery Data Agent -->
      <div class="project-item">
        <div class="project-header">
          <div>
            <span class="project-title">BigQuery Data Agent (Autonomous AI Multi-Agent)</span>
            <span class="project-tags"> | Python, Gemini API, BigQuery SQL, AGY SDK, FastAPI</span>
          </div>
          <div class="project-links">
            <a href="https://github.com/badalsahu200ns-png/bigquery-data-agent" target="_blank">GitHub</a>
          </div>
        </div>
        <ul class="bullet-list">
          <li>Architected autonomous multi-agent system translating complex natural language requests into production-grade BigQuery SQL with schema discovery and automated error correction.</li>
          <li>Engineered intelligent fallback strategies and automated validation test suites achieving 99.4% execution accuracy and sub-second metadata latency.</li>
        </ul>
      </div>

      <!-- Project 2: ReflectAI Gemini Journal -->
      <div class="project-item">
        <div class="project-header">
          <div>
            <span class="project-title">ReflectAI — Intelligent AI Reflection &amp; Sentiment Journal</span>
            <span class="project-tags"> | Gemini 1.5 Pro, Vector Search, Python, React, Tailwind CSS</span>
          </div>
          <div class="project-links">
            <a href="https://reflectai-journal.web.app/" target="_blank">Live App</a> &bull;
            <a href="https://github.com/badalsahu200ns-png/reflectai-gemini-reflection-journal" target="_blank">GitHub</a>
          </div>
        </div>
        <ul class="bullet-list">
          <li>Built multimodal reflective journal integrating Gemini 1.5 Pro with vector embeddings for semantic recall across chronological user reflections.</li>
          <li>Implemented automated cognitive trend analysis, weekly sentiment velocity mapping, and private client-side encryption.</li>
        </ul>
      </div>

      <!-- Project 3: Coffee Shop Monitor -->
      <div class="project-item">
        <div class="project-header">
          <div>
            <span class="project-title">Coffee Shop Monitor — Full-Stack Telemetry System</span>
            <span class="project-tags"> | Python, FastAPI, Real-time WebSockets, TypeScript, SQLite</span>
          </div>
          <div class="project-links">
            <a href="https://github.com/badalsahu200ns-png/coffee-shop-monitor" target="_blank">GitHub</a>
          </div>
        </div>
        <ul class="bullet-list">
          <li>Developed high-throughput operational telemetry dashboard monitoring multi-point retail queue velocity, stock thresholds, and transaction speed.</li>
          <li>Engineered automated inventory depletion alerts, peak-hour customer flow predictive modeling, and live operational analytics charts.</li>
        </ul>
      </div>

      <!-- Project 4: Seasonal Agriculture Performance Analysis -->
      <div class="project-item" style="margin-bottom: 8px;">
        <div class="project-header">
          <div>
            <span class="project-title">Seasonal Agriculture Performance Analytics</span>
            <span class="project-tags"> | Python, Pandas, Matplotlib, Statistical Modeling, Seaborn</span>
          </div>
          <div class="project-links">
            <a href="https://github.com/badalsahu200ns-png/Seasonal-Agriculture-Performance-Analysis" target="_blank">GitHub</a>
          </div>
        </div>
        <ul class="bullet-list">
          <li>Performed multi-decade agrarian yield modeling correlating rainfall variability, soil mineral parameters, and harvest price indices.</li>
          <li>Constructed predictive yield variance dashboards identifying key vulnerability zones to assist institutional agricultural planning.</li>
        </ul>
      </div>

      <!-- 6. Current Internships & Applied Practical Programs -->
      <div class="section-title">Current Internships &amp; Applied Analytics Programs</div>

      <!-- Internship 1: Edunet / VOIS -->
      <div class="exp-item">
        <div class="exp-header">
          <div>
            <span class="exp-role">${internships[0].role}</span>
            <span style="color: #94a3b8;"> &mdash; </span>
            <span class="exp-company">${internships[0].organization}</span>
          </div>
          <div class="exp-meta">${internships[0].period} | Virtual &bull; Active Engagement</div>
        </div>
        <ul class="bullet-list">
          ${internships[0].responsibilities.map(r => `<li>${r}</li>`).join('')}
        </ul>
      </div>

      <!-- Internship 2: Neo Skillz -->
      <div class="exp-item" style="margin-bottom: 0;">
        <div class="exp-header">
          <div>
            <span class="exp-role">${internships[1].role}</span>
            <span style="color: #94a3b8;"> &mdash; </span>
            <span class="exp-company">${internships[1].organization}</span>
          </div>
          <div class="exp-meta">${internships[1].period} | Virtual &bull; Active Engagement</div>
        </div>
        <ul class="bullet-list">
          ${internships[1].responsibilities.map(r => `<li>${r}</li>`).join('')}
        </ul>
      </div>

    </div>

    <!-- Running Page 2 Footer -->
    <div class="page-footer">
      <span>BADAL KUMAR SAHU &bull; CURRICULUM VITAE</span>
      <span>PAGE 2 OF 3</span>
    </div>
  </div>

  <div class="page-break"></div>

  <!-- =========================================================================
       PAGE 3: EDUCATION, CERTIFICATIONS & QUALIFICATIONS REGISTRY
       ========================================================================= -->
  <div class="resume-page" id="page-3">
    <div class="page-content">

      <!-- 7. Education & Academic Foundations -->
      <div class="section-title first">Education &amp; Academic Qualifications</div>
      
      <!-- Education 1: MCA -->
      <div style="margin-bottom: 6px;">
        <div class="exp-header">
          <div>
            <span class="exp-role">${education[0].degree}</span>
            <span style="color: #94a3b8;"> &mdash; </span>
            <span class="exp-company">${education[0].institution}</span>
          </div>
          <div class="exp-meta">${education[0].dates} | ${education[0].currentStatus}</div>
        </div>
        <div style="font-size: 8.1pt; color: #475569; margin-top: 1px;">
          <strong>Core Curriculum:</strong> ${education[0].relevantSubjects.join(', ')}
        </div>
      </div>

      <!-- Education 2: PGDM -->
      <div style="margin-bottom: 6px;">
        <div class="exp-header">
          <div>
            <span class="exp-role">${education[1].degree} (${education[1].field})</span>
            <span style="color: #94a3b8;"> &mdash; </span>
            <span class="exp-company">${education[1].institution}</span>
          </div>
          <div class="exp-meta">${education[1].dates} | Completed &bull; First Class</div>
        </div>
        <div style="font-size: 8.1pt; color: #475569; margin-top: 1px;">
          <strong>Core Curriculum:</strong> ${education[1].relevantSubjects.join(', ')}
        </div>
      </div>

      <!-- Education 3: B.Com -->
      <div style="margin-bottom: 8px;">
        <div class="exp-header">
          <div>
            <span class="exp-role">${education[2].degree} (${education[2].field})</span>
            <span style="color: #94a3b8;"> &mdash; </span>
            <span class="exp-company">${education[2].institution}</span>
          </div>
          <div class="exp-meta">${education[2].dates} | Completed &bull; Honours</div>
        </div>
        <div style="font-size: 8.1pt; color: #475569; margin-top: 1px;">
          <strong>Core Curriculum:</strong> Corporate Accounting, Business Statistics, Economic Theory, Quantitative Business Mathematics, Commercial Law
        </div>
      </div>

      <!-- 8. Key Certifications & Professional Credentials -->
      <div class="section-title">Verified Industry Certifications &amp; Credentials</div>
      
      <div style="margin-bottom: 6px;">
        <div style="font-size: 8.4pt; font-weight: 700; color: #0369a1; margin-bottom: 3px;">Cloud &amp; Artificial Intelligence Engineering:</div>
        <div class="cert-grid">
          <div class="cert-item"><span class="cert-issuer">Oracle:</span> Agentic AI Certified Foundations Associate <span class="cert-id">(ID: 330350216AAI26OFA)</span></div>
          <div class="cert-item"><span class="cert-issuer">Google Cloud:</span> Configure Service Accounts &amp; IAM Roles <span class="cert-id">(ID: 28873618)</span></div>
          <div class="cert-item"><span class="cert-issuer">Google Cloud:</span> The Basics of Google Cloud Compute Skill Badge</div>
          <div class="cert-item"><span class="cert-issuer">Google Cloud:</span> Prompt Design in Vertex AI &amp; Gemini Foundations</div>
          <div class="cert-item"><span class="cert-issuer">Anthropic:</span> AI Fluency Framework &amp; Foundations <span class="cert-id">(ID: 9hn4e7kttj9r)</span></div>
          <div class="cert-item"><span class="cert-issuer">Anthropic:</span> Claude 101 Certification <span class="cert-id">(ID: 7yiy97wnu58o)</span></div>
        </div>
      </div>

      <div style="margin-bottom: 6px;">
        <div style="font-size: 8.4pt; font-weight: 700; color: #0369a1; margin-bottom: 3px;">Data Analytics, Quality Management &amp; Security:</div>
        <div class="cert-grid">
          <div class="cert-item"><span class="cert-issuer">OneRoadmap:</span> Data Analyst Certification <span class="cert-id">(ID: CERT-F821520B)</span></div>
          <div class="cert-item"><span class="cert-issuer">OneRoadmap:</span> Excel Certification <span class="cert-id">(ID: CERT-536F4B9F)</span></div>
          <div class="cert-item"><span class="cert-issuer">Kennesaw State Univ:</span> Six Sigma Principles <span class="cert-id">(ID: 7JJSRPCE9FS9)</span></div>
          <div class="cert-item"><span class="cert-issuer">Cisco:</span> Introduction to Cybersecurity</div>
        </div>
      </div>

      <div style="margin-bottom: 8px;">
        <div style="font-size: 8.4pt; font-weight: 700; color: #0369a1; margin-bottom: 3px;">Business Analytics &amp; Strategic Consulting Simulations:</div>
        <div class="cert-grid">
          <div class="cert-item"><span class="cert-issuer">Coursera / ESSEC:</span> Marketing Analytics <span class="cert-id">(ID: E58C37P3BFQ3)</span></div>
          <div class="cert-item"><span class="cert-issuer">Coursera / Wharton:</span> Customer Analytics <span class="cert-id">(ID: WRUELYD2V6BP)</span></div>
          <div class="cert-item"><span class="cert-issuer">Forage / Deloitte:</span> Technology &amp; Data Analytics Simulation</div>
          <div class="cert-item"><span class="cert-issuer">Forage / BCG:</span> Strategy Consulting Virtual Experience</div>
        </div>
      </div>

      <!-- 9. Technical & Research Domain Interests -->
      <div class="section-title">Technical Domain Interests &amp; Governance</div>
      <div style="font-size: 8.35pt; color: #334155; line-height: 1.32; margin-bottom: 8px;">
        Autonomous Multi-Agent AI Architectures &bull; Petabyte-Scale Cloud Data Pipelines &bull; Real-Time Streaming Analytics &bull; Enterprise Data Governance &bull; Responsible AI System Design &bull; Cross-Functional Analytics Advisory
      </div>

      <!-- 10. Portfolio Web Verification -->
      <div style="padding: 7px 10px; border: 1px solid #cbd5e1; border-radius: 4px; background: #f8fafc; font-size: 8.1pt; color: #334155;">
        <strong style="color: #0f172a;">Live Credential Verification Registry:</strong> 
        The complete interactive repository containing 40+ verified industry credential records, project repositories, interactive live systems, and academic certifications is hosted online at: 
        <a href="https://badalsahu200ns-png.github.io/#certifications" target="_blank" style="font-weight: 600;">https://badalsahu200ns-png.github.io/</a>
      </div>

    </div>

    <!-- Running Page 3 Footer -->
    <div class="page-footer">
      <span>BADAL KUMAR SAHU &bull; CURRICULUM VITAE</span>
      <span>PAGE 3 OF 3</span>
    </div>
  </div>

</body>
</html>
`;

// Ensure public/resume directory exists
const publicResumeDir = path.join(rootDir, 'public/resume');
if (!fs.existsSync(publicResumeDir)) {
  fs.mkdirSync(publicResumeDir, { recursive: true });
}

// Temporary HTML for Chrome headless printing
const tempHtmlPath = path.join(publicResumeDir, 'resume_template.html');
fs.writeFileSync(tempHtmlPath, htmlContent, 'utf8');

const outputPdfATS = path.join(publicResumeDir, 'Badal_Kumar_Sahu_ATS_Resume.pdf');
const outputPdfLegacy1 = path.join(publicResumeDir, 'Badal_Kumar_Sahu_Resume.pdf');
const outputPdfLegacy2 = path.join(publicResumeDir, 'Badal-Kumar-Sahu-Resume.pdf');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const chromeUrl = 'file:///' + tempHtmlPath.replace(/\\/g, '/');

console.log('Generating 3-Page ATS PDF via Headless Chrome...');
const args = [
  '--headless',
  '--disable-gpu',
  '--no-pdf-header-footer',
  `--print-to-pdf=${outputPdfATS}`,
  chromeUrl
];
spawnSync(chromePath, args, { stdio: 'inherit' });

if (fs.existsSync(outputPdfATS)) {
  fs.copyFileSync(outputPdfATS, outputPdfLegacy1);
  fs.copyFileSync(outputPdfATS, outputPdfLegacy2);
  console.log('Successfully generated:');
  console.log(' - ' + outputPdfATS);
  console.log(' - ' + outputPdfLegacy1);
  console.log(' - ' + outputPdfLegacy2);
} else {
  console.error('PDF file was not found at expected path: ' + outputPdfATS);
  process.exit(1);
}
