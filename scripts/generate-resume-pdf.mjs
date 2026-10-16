import fs from 'fs';
import path from 'path';
import { execSync, spawnSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const profile = JSON.parse(fs.readFileSync(path.join(rootDir, 'portfolio-data/profile.json'), 'utf8'));
const experience = JSON.parse(fs.readFileSync(path.join(rootDir, 'portfolio-data/experience.json'), 'utf8'));
const internships = JSON.parse(fs.readFileSync(path.join(rootDir, 'portfolio-data/internships.json'), 'utf8'));
const projects = JSON.parse(fs.readFileSync(path.join(rootDir, 'portfolio-data/projects.json'), 'utf8'));
const skills = JSON.parse(fs.readFileSync(path.join(rootDir, 'portfolio-data/skills.json'), 'utf8'));
const education = JSON.parse(fs.readFileSync(path.join(rootDir, 'portfolio-data/education.json'), 'utf8'));
const certifications = JSON.parse(fs.readFileSync(path.join(rootDir, 'portfolio-data/certifications.json'), 'utf8'));

// Curate 4 target-relevant projects matching Business Analytics / AI / GCP
const selectedProjectKeys = [
  'bigquery-data-agent',
  'reflectai-gemini-reflection-journal',
  'coffee-shop-monitor',
  'Seasonal-Agriculture-Performance-Analysis'
];
const selectedProjects = selectedProjectKeys.map(key => projects.find(p => p.repo === key)).filter(Boolean);

// Curate top key certifications for resume display
const topCertIds = [
  'oracle-agentic-ai-certified-foundations',
  'google-configure-service-accounts-iam',
  'google-basics-cloud-compute-skill-badge',
  'anthropic-ai-fluency-framework',
  'anthropic-claude-101',
  'oneroadmap-data-analyst-certification',
  'oneroadmap-excel-certification',
  'ksu-six-sigma-principles',
  'coursera-marketing-analytics',
  'coursera-customer-analytics',
  'forage-deloitte-data-analytics',
  'forage-bcg-strategy-consulting',
  'cisco-introduction-to-cybersecurity'
];
const selectedCerts = topCertIds.map(id => certifications.find(c => c.id === id)).filter(Boolean);

export const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Badal_Kumar_Sahu_Resume</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 9mm 12mm 9mm 12mm;
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
      font-size: 9.15pt;
      line-height: 1.34;
      -webkit-font-smoothing: antialiased;
    }
    a {
      color: #0369a1;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
    .page {
      width: 100%;
    }
    .page-break {
      page-break-after: always;
      break-after: page;
      height: 0;
      margin: 0;
      padding: 0;
    }
    
    /* Header */
    .header {
      border-bottom: 2px solid #0f172a;
      padding-bottom: 6px;
      margin-bottom: 7px;
    }
    .name {
      font-size: 20pt;
      font-weight: 800;
      letter-spacing: -0.5px;
      color: #0f172a;
      text-transform: uppercase;
      line-height: 1.1;
    }
    .headline {
      font-size: 9.4pt;
      font-weight: 600;
      color: #0369a1;
      margin-top: 3px;
    }
    .contact-row {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 10px;
      margin-top: 4px;
      font-size: 8.5pt;
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

    /* Section Styles */
    .section {
      margin-bottom: 7px;
    }
    .section-title {
      font-size: 9.8pt;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      color: #0f172a;
      border-bottom: 1px solid #cbd5e1;
      padding-bottom: 2px;
      margin-bottom: 5px;
      break-after: avoid;
      page-break-after: avoid;
    }

    /* Summary */
    .summary-text {
      font-size: 8.8pt;
      color: #1e293b;
      line-height: 1.35;
      text-align: justify;
    }

    /* Experience & Roles */
    .item {
      margin-bottom: 5.5px;
      break-inside: avoid;
      page-break-inside: avoid;
    }
    .item-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 1.5px;
    }
    .item-title-group {
      font-size: 9.2pt;
    }
    .item-role {
      font-weight: 700;
      color: #0f172a;
    }
    .item-company {
      font-weight: 600;
      color: #0369a1;
    }
    .item-meta {
      font-size: 8.2pt;
      color: #475569;
      font-weight: 500;
      white-space: nowrap;
      text-align: right;
    }
    .impact-line {
      font-size: 8.7pt;
      font-weight: 600;
      color: #0f172a;
      margin-bottom: 2px;
    }
    ul.bullets {
      list-style-type: disc;
      padding-left: 14px;
      font-size: 8.6pt;
      color: #1e293b;
    }
    ul.bullets li {
      margin-bottom: 1.5px;
      line-height: 1.32;
    }

    /* Skills Grid / Rows */
    .skills-row {
      font-size: 8.6pt;
      margin-bottom: 3.5px;
      line-height: 1.32;
    }
    .skills-label {
      font-weight: 700;
      color: #0f172a;
      display: inline;
    }
    .skills-val {
      color: #1e293b;
      display: inline;
    }

    /* Education & Certs compact */
    .edu-item {
      margin-bottom: 4px;
      break-inside: avoid;
      page-break-inside: avoid;
    }
    .cert-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3px 12px;
      font-size: 8.2pt;
    }
    .cert-item {
      break-inside: avoid;
      page-break-inside: avoid;
      line-height: 1.25;
    }
    .cert-issuer {
      font-weight: 700;
      color: #0f172a;
    }
    .cert-name {
      color: #1e293b;
    }
    .cert-id {
      color: #64748b;
      font-size: 7.8pt;
    }
  </style>
</head>
<body>

  <!-- ==================== PAGE 1 ==================== -->
  <div class="page">
    <div class="header">
      <h1 class="name">Badal Kumar Sahu</h1>
      <div class="headline">Business Analytics · Generative AI · Data Analytics · AI Products · Google Cloud</div>
      <div class="contact-row">
        <span class="contact-item"><strong>Location:</strong> Bhubaneswar, India</span>
        <span class="sep">•</span>
        <span class="contact-item"><strong>Email:</strong> <a href="mailto:${profile.email}">${profile.email}</a></span>
        <span class="sep">•</span>
        <span class="contact-item"><strong>LinkedIn:</strong> <a href="${profile.linkedin}">linkedin.com/in/badalsahu200ns</a></span>
        <span class="sep">•</span>
        <span class="contact-item"><strong>GitHub:</strong> <a href="${profile.github}">github.com/badalsahu200ns-png</a></span>
        <span class="sep">•</span>
        <span class="contact-item"><strong>Portfolio:</strong> <a href="https://badalsahu200ns-png.github.io/">badalsahu200ns-png.github.io</a></span>
      </div>
    </div>

    <!-- Professional Summary -->
    <div class="section">
      <div class="section-title">Professional Summary</div>
      <p class="summary-text">
        Results-driven Data Analyst, Generative AI Specialist, and Business Manager with 5+ years of frontline business experience spanning PropTech, Travel-tech, BFSI, and Telecom. Proven track record of scaling commercial developer portfolios by 30%, coaching and leading 20+ professionals, and sustaining 130% KPI achievement. Specializes in translating complex commercial requirements into petabyte-scale Google BigQuery analytics pipelines, automated Gemini LLM agents, RAG vector architectures, and executive BI dashboards.
      </p>
    </div>

    <!-- Professional Experience -->
    <div class="section">
      <div class="section-title">Professional Experience (5+ Years)</div>
      
      <!-- Magicbricks -->
      <div class="item">
        <div class="item-header">
          <div class="item-title-group">
            <span class="item-role">Business Manager</span> &mdash; <span class="item-company">Magicbricks</span>
          </div>
          <div class="item-meta">Apr 2025 &ndash; Mar 2026 | Bhubaneswar, Odisha</div>
        </div>
        <div class="impact-line">Impact: Drove 30% business growth across real estate developer portfolios by identifying market liquidity pockets.</div>
        <ul class="bullets">
          <li>Identified market liquidity pockets and analyzed supply-demand elasticity across tier-1 real estate developer segments.</li>
          <li>Managed cross-functional stakeholder alignments between digital product engineering teams and enterprise commercial clients.</li>
          <li>Utilized property search behavioral telemetry and churn indicators to design high-conversion personalized retention campaigns.</li>
        </ul>
      </div>

      <!-- redBus -->
      <div class="item">
        <div class="item-header">
          <div class="item-title-group">
            <span class="item-role">Key Account Manager</span> &mdash; <span class="item-company">redBus India Pvt Ltd</span>
          </div>
          <div class="item-meta">Mar 2024 &ndash; Mar 2025 | India</div>
        </div>
        <div class="impact-line">Impact: Achieved 130% KPI performance by optimizing inventory availability and route pricing strategies.</div>
        <ul class="bullets">
          <li>Led predictive demand forecasting analysis across major intercity transit corridors during seasonal high-volume demand spikes.</li>
          <li>Negotiated high-value strategic partnerships with enterprise bus fleet operators and mobility ecosystem partners.</li>
          <li>Optimized inventory availability, route fill rates, and dynamic route pricing models to maximize occupancy and revenue.</li>
        </ul>
      </div>

      <!-- Reliance PPM -->
      <div class="item">
        <div class="item-header">
          <div class="item-title-group">
            <span class="item-role">JBA Sales Manager</span> &mdash; <span class="item-company">Reliance PPM Services Ltd</span>
          </div>
          <div class="item-meta">Feb 2022 &ndash; Feb 2024 | India</div>
        </div>
        <div class="impact-line">Impact: Built, coached, and led a high-performance team of 20+ professionals while scaling territory revenue.</div>
        <ul class="bullets">
          <li>Led, mentored, and coached a sales force of 20+ professionals, driving sustained market penetration and territory expansion.</li>
          <li>Established disciplined performance tracking frameworks utilizing sales pipeline analytics and conversion rate metrics.</li>
          <li>Expanded enterprise channel footprint and authored structured operational playbooks for rapid representative onboarding.</li>
        </ul>
      </div>

      <!-- ICICI Prudential -->
      <div class="item">
        <div class="item-header">
          <div class="item-title-group">
            <span class="item-role">Business Trainee &ndash; IndusInd Bank Partnership</span> &mdash; <span class="item-company">ICICI Prudential Life Insurance</span>
          </div>
          <div class="item-meta">Sep 2020 &ndash; Jan 2022 | India</div>
        </div>
        <div class="impact-line">Impact: Achieved 91% renewal collection improvement through structured portfolio risk engagement.</div>
        <ul class="bullets">
          <li>Achieved 91% renewal collection rate through structured customer engagement workflows and churn mitigation analytics.</li>
          <li>Collaborated with IndusInd Bank retail branch leaders to drive wealth protection penetration across priority retail customer accounts.</li>
          <li>Analyzed customer portfolio risk categories to match customized insurance and investment solutions.</li>
        </ul>
      </div>

    </div>
  </div>

  <!-- Page Break -->
  <div class="page-break"></div>

  <!-- ==================== PAGE 2 ==================== -->
  <div class="page">
    
    <!-- Current Internships -->
    <div class="section">
      <div class="section-title">Current Internships &amp; Applied Analytics Programs</div>
      
      <!-- AWS Cloud Computing -->
      <div class="item">
        <div class="item-header">
          <div class="item-title-group">
            <span class="item-role">AWS Cloud Computing Intern</span> &mdash; <span class="item-company">EWB EDU TECH PRIVATE LIMITED (AICTE Portal)</span>
          </div>
          <div class="item-meta">Sep 2026 &ndash; Present | Virtual &bull; Ongoing</div>
        </div>
        <ul class="bullets">
          <li>Configuring and managing AWS cloud infrastructure spanning EC2 compute, S3 storage, IAM security policies, and VPC networking.</li>
          <li>Deploying relational database instances with Amazon RDS and instrumenting serverless event pipelines with AWS Lambda &amp; CloudWatch.</li>
        </ul>
      </div>

      <!-- Edunet / Vodafone -->
      <div class="item">
        <div class="item-header">
          <div class="item-title-group">
            <span class="item-role">Data Analytics Intern</span> &mdash; <span class="item-company">Edunet Foundation / Vodafone Idea Foundation</span>
          </div>
          <div class="item-meta">Aug 2026 &ndash; Present | Remote &bull; Ongoing</div>
        </div>
        <ul class="bullets">
          <li>Engineered structured data pipelines, Power BI dashboards, and exploratory analytics models for telecom social impact assessment.</li>
          <li>Applied predictive analytics on telemetry indicators to improve engagement and retention tracking across regional programs.</li>
        </ul>
      </div>

      <!-- Neo Skillz -->
      <div class="item">
        <div class="item-header">
          <div class="item-title-group">
            <span class="item-role">Data Analytics Training &amp; Internship</span> &mdash; <span class="item-company">Neo Skillz</span>
          </div>
          <div class="item-meta">Aug 2026 &ndash; Present | Remote &bull; Ongoing</div>
        </div>
        <ul class="bullets">
          <li>Spearheading modern analytics implementations with focus on end-to-end data transformation pipelines and Tableau analytical dashboards.</li>
          <li>Pioneered automated prompt engineering workflows and RAG vector search pipelines for rapid business insight extraction.</li>
        </ul>
      </div>
    </div>

    <!-- Selected Projects -->
    <div class="section">
      <div class="section-title">Selected Projects (AI, Cloud &amp; Analytics)</div>

      <!-- BigQuery Data Agent -->
      <div class="item">
        <div class="item-header">
          <div class="item-title-group">
            <span class="item-role">BigQuery Data Agent &ndash; Natural Language to Enterprise Analytics</span>
            <span style="font-size: 8pt; color: #475569;">| Google BigQuery, Cloud Run, SQL Synthesis, LLM Agents</span>
          </div>
          <div class="item-meta"><a href="https://bq-data-agent-489073495110.asia-southeast1.run.app/dev-ui/?app=data_agent&userId=user">Live System</a> &bull; <a href="https://github.com/badalsahu200ns-png">GitHub</a></div>
        </div>
        <ul class="bullets">
          <li>Architected enterprise data intelligence system enabling stakeholders to query petabyte-scale BigQuery datasets using plain English.</li>
          <li>Generates verified SQL queries, visual analytical charts, and actionable executive summaries with sub-3s query execution latency.</li>
        </ul>
      </div>

      <!-- ReflectAI -->
      <div class="item">
        <div class="item-header">
          <div class="item-title-group">
            <span class="item-role">ReflectAI &ndash; Gemini Cognitive Reflection Journal</span>
            <span style="font-size: 8pt; color: #475569;">| Google AI Studio, Gemini, Cloud Run, Firestore, Streamlit</span>
          </div>
          <div class="item-meta"><a href="https://reflection-journal-by-badal-200ns.ai.studio/">Live System</a> &bull; <a href="https://github.com/badalsahu200ns-png/reflectai-gemini-reflection-journal">GitHub</a></div>
        </div>
        <ul class="bullets">
          <li>Built intelligent journaling application leveraging Gemini and Cloud Run to generate cognitive reflections and semantic theme clustering.</li>
          <li>Engineered vector retrieval and real-time behavioral insights stored persistently in Google Cloud Firestore.</li>
        </ul>
      </div>

      <!-- Coffee Shop Monitor & Barista AI Agent -->
      <div class="item">
        <div class="item-header">
          <div class="item-title-group">
            <span class="item-role">Coffee Shop Monitor &amp; Barista AI Agent &ndash; Operational Telemetry</span>
            <span style="font-size: 8pt; color: #475569;">| Google Cloud Run, FastAPI, Real-Time Telemetry</span>
          </div>
          <div class="item-meta"><a href="https://coffee-mgr-agent-489073495110.asia-southeast1.run.app/">Live System</a> &bull; <a href="https://github.com/badalsahu200ns-png">GitHub</a></div>
        </div>
        <ul class="bullets">
          <li>Engineered operations monitor and conversational agent tracking order queues, barista station throughput, and bottleneck anomalies.</li>
        </ul>
      </div>

      <!-- Seasonal Agriculture Performance Analysis -->
      <div class="item">
        <div class="item-header">
          <div class="item-title-group">
            <span class="item-role">Seasonal Agriculture Performance Analysis</span>
            <span style="font-size: 8pt; color: #475569;">| Python, Pandas, Matplotlib, Seaborn, Jupyter</span>
          </div>
          <div class="item-meta"><a href="https://github.com/badalsahu200ns-png/Seasonal-Agriculture-Performance-Analysis">GitHub</a></div>
        </div>
        <ul class="bullets">
          <li>Executed empirical data analysis across Kharif, Rabi, and Zaid seasons analyzing crop yield, production, profitability, and climate correlations.</li>
        </ul>
      </div>
    </div>

    <!-- Technical Skills -->
    <div class="section">
      <div class="section-title">Technical Skills &amp; Core Competencies</div>
      <div class="skills-row">
        <span class="skills-label">Data Analytics &amp; BI:</span>
        <span class="skills-val">SQL, Google BigQuery, Power BI, Tableau, Advanced Excel (Pivot Tables, Lookups), Exploratory Data Analysis (EDA), KPI Dashboards, MIS Reporting, Statistical Modeling</span>
      </div>
      <div class="skills-row">
        <span class="skills-label">AI &amp; Generative AI:</span>
        <span class="skills-val">Gemini LLMs, Retrieval-Augmented Generation (RAG), Prompt Engineering, Autonomous AI Agents, Google AI Studio, LLM Integration Strategy</span>
      </div>
      <div class="skills-row">
        <span class="skills-label">Programming &amp; Tools:</span>
        <span class="skills-val">Python (Pandas, NumPy, Matplotlib), Core Java, TypeScript, React, Streamlit, FastAPI, Git, GitHub CI/CD, Salesforce CRM</span>
      </div>
      <div class="skills-row">
        <span class="skills-label">Cloud &amp; Databases:</span>
        <span class="skills-val">Google Cloud Platform (Cloud Run, BigQuery, Firestore), Amazon Web Services (EC2, S3, RDS, IAM, VPC), Distributed Systems</span>
      </div>
    </div>

    <!-- Education -->
    <div class="section">
      <div class="section-title">Education</div>
      <div class="edu-item">
        <div class="item-header">
          <div><strong style="color: #0f172a;">Master of Computer Applications (MCA)</strong> &mdash; <span style="color: #0369a1; font-weight: 600;">Amity University</span></div>
          <div class="item-meta">Jul 2025 &ndash; Present | Pursuing</div>
        </div>
        <div style="font-size: 8pt; color: #475569;">Relevant Subjects: Distributed Systems, Advanced DBMS, Data Structures &amp; Algorithms, Cloud Architectures, Machine Learning &amp; AI</div>
      </div>
      <div class="edu-item">
        <div class="item-header">
          <div><strong style="color: #0f172a;">Post Graduate Diploma in Management (PGDM)</strong> &mdash; <span style="color: #0369a1; font-weight: 600;">Institute of Management &amp; Information Science</span></div>
          <div class="item-meta">Graduated | Bhubaneswar, India</div>
        </div>
        <div style="font-size: 8pt; color: #475569;">Specialization: Quantitative Business Analytics, Strategic Financial Management, Market Economics, Sales &amp; Distribution Strategy</div>
      </div>
      <div class="edu-item">
        <div class="item-header">
          <div><strong style="color: #0f172a;">Bachelor of Commerce (B.Com)</strong> &mdash; <span style="color: #0369a1; font-weight: 600;">J.R.N. Rajasthan Vidyapeeth University</span></div>
          <div class="item-meta">Graduated | India</div>
        </div>
        <div style="font-size: 8pt; color: #475569;">Core: Corporate Accounting, Business Statistics, Economic Modeling, Commercial Contracts &amp; Law, Business Mathematics</div>
      </div>
    </div>

    <!-- Key Certifications -->
    <div class="section" style="margin-bottom: 0;">
      <div class="section-title">Key Certifications &amp; Credentials</div>
      <div class="cert-grid">
        <div class="cert-item"><span class="cert-issuer">Oracle:</span> <span class="cert-name">Agentic AI Certified Foundations Associate</span> <span class="cert-id">(ID: 330350216AAI26OFA)</span></div>
        <div class="cert-item"><span class="cert-issuer">Google Cloud:</span> <span class="cert-name">Configure Service Accounts &amp; IAM Roles</span> <span class="cert-id">(ID: 28873618)</span></div>
        <div class="cert-item"><span class="cert-issuer">Google Cloud:</span> <span class="cert-name">The Basics of Google Cloud Compute Skill Badge</span></div>
        <div class="cert-item"><span class="cert-issuer">Anthropic:</span> <span class="cert-name">AI Fluency Framework &amp; Foundations</span> <span class="cert-id">(ID: 9hn4e7kttj9r)</span></div>
        <div class="cert-item"><span class="cert-issuer">Anthropic:</span> <span class="cert-name">Claude 101 Certification</span> <span class="cert-id">(ID: 7yiy97wnu58o)</span></div>
        <div class="cert-item"><span class="cert-issuer">OneRoadmap:</span> <span class="cert-name">Data Analyst Certification</span> <span class="cert-id">(ID: CERT-F821520B)</span></div>
        <div class="cert-item"><span class="cert-issuer">OneRoadmap:</span> <span class="cert-name">Excel Certification</span> <span class="cert-id">(ID: CERT-536F4B9F)</span></div>
        <div class="cert-item"><span class="cert-issuer">Kennesaw State Univ:</span> <span class="cert-name">Six Sigma Principles</span> <span class="cert-id">(ID: 7JJSRPCE9FS9)</span></div>
        <div class="cert-item"><span class="cert-issuer">Coursera:</span> <span class="cert-name">Marketing Analytics</span> <span class="cert-id">(ID: E58C37P3BFQ3)</span> &bull; <span class="cert-name">Customer Analytics</span> <span class="cert-id">(ID: WRUELYD2V6BP)</span></div>
        <div class="cert-item"><span class="cert-issuer">Forage / Deloitte / BCG:</span> <span class="cert-name">Data Analytics &amp; Strategy Consulting Simulations</span></div>
        <div class="cert-item"><span class="cert-issuer">Cisco:</span> <span class="cert-name">Introduction to Cybersecurity</span></div>
        <div class="cert-item"><span class="cert-issuer">Portfolio Registry:</span> <a href="https://badalsahu200ns-png.github.io/#certifications" style="font-weight: 600;">View complete 40+ verified credentials gallery &rarr;</a></div>
      </div>
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

const outputPdf1 = path.join(publicResumeDir, 'Badal_Kumar_Sahu_Resume.pdf');
const outputPdf2 = path.join(publicResumeDir, 'Badal-Kumar-Sahu-Resume.pdf');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const chromeUrl = 'file:///' + tempHtmlPath.replace(/\\/g, '/');

console.log('Generating PDF via Headless Chrome...');
const args = [
  '--headless',
  '--disable-gpu',
  '--no-pdf-header-footer',
  `--print-to-pdf=${outputPdf1}`,
  chromeUrl
];
spawnSync(chromePath, args, { stdio: 'inherit' });

if (fs.existsSync(outputPdf1)) {
  fs.copyFileSync(outputPdf1, outputPdf2);
  console.log('Successfully generated:');
  console.log(' - ' + outputPdf1);
  console.log(' - ' + outputPdf2);
} else {
  console.error('PDF file was not found at expected path: ' + outputPdf1);
  process.exit(1);
}
