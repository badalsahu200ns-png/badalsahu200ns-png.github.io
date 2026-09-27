export interface Project {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  technologies: string[];
  liveUrl: string;
  githubUrl?: string;
  category: string;
  metrics: string;
}

export const projects: Project[] = [
  {
    id: 'reflectai',
    number: '01',
    title: 'ReflectAI',
    subtitle: 'Gemini Reflection Journal',
    description: 'An intelligent journaling application leveraging Gemini and Retrieval-Augmented Generation (RAG) to generate deep cognitive reflections, semantic theme indexing, and real-time behavioral insights stored in Firestore.',
    technologies: ['Gemini', 'RAG', 'Firestore', 'Google Cloud', 'Streamlit'],
    liveUrl: 'https://reflection-journal-by-badal-200ns.ai.studio/',
    githubUrl: 'https://github.com/badalsahu200ns-png/reflectai-gemini-reflection-journal',
    category: 'GenAI & RAG',
    metrics: 'Cognitive Vector Retrieval & Theme Clustering'
  },
  {
    id: 'cymbalmart',
    number: '02',
    title: 'CymbalMart',
    subtitle: 'AI Party Planner & Shopping Assistant',
    description: 'Autonomous multi-step event planning agent that transforms free-form party requirements into comprehensive itineraries, dynamic budget allocations, and optimized itemized shopping carts.',
    technologies: ['Gemini', 'AI Agents', 'Google AI Studio', 'Python'],
    liveUrl: 'https://cymbalmart-ai-party-planner.ai.studio/',
    githubUrl: 'https://github.com/badalsahu200ns-png/CymbalMart-AI-Party-Planner-Shopping-Assistant',
    category: 'Agentic Workflow',
    metrics: 'Automated 100% of event planning cart assembly'
  },
  {
    id: 'ai-chef',
    number: '03',
    title: 'AI Chef',
    subtitle: 'Gemini-Powered Recipe Assistant',
    description: 'Interactive culinary intelligence system that synthesizes personalized recipes based on pantry ingredients, nutritional constraints, dietary profiles, and step-by-step cooking timelines.',
    technologies: ['Gemini', 'Prompt Engineering', 'Streamlit', 'Google Cloud'],
    liveUrl: 'https://cymbal.ai.studio/',
    githubUrl: 'https://github.com/badalsahu200ns-png/AI-Chef-Application',
    category: 'Generative AI',
    metrics: 'Zero-waste pantry matching & macro calculation'
  },
  {
    id: 'bigquery-data-agent',
    number: '04',
    title: 'BigQuery Data Agent',
    subtitle: 'Natural Language to Enterprise Analytics',
    description: 'Enterprise data intelligence interface allowing business stakeholders to query petabyte-scale Google BigQuery datasets via plain English, producing verified SQL, visual charts, and actionable executive summaries.',
    technologies: ['BigQuery', 'Cloud Run', 'SQL Synthesis', 'LLM Agents'],
    liveUrl: 'https://bq-data-agent-489073495110.asia-southeast1.run.app/dev-ui/?app=data_agent&userId=user',
    category: 'Cloud & BI Agent',
    metrics: 'Sub-3s natural language to verified SQL execution'
  },
  {
    id: 'coffee-barista',
    number: '05',
    title: 'Coffee Barista AI Agent',
    subtitle: 'Conversational Order & Recommendation Agent',
    description: 'Specialized conversational beverage curation agent handling dynamic menu modifications, customer taste profiling, inventory constraints, and real-time order orchestrations.',
    technologies: ['Cloud Run', 'Conversational AI', 'Dialog Flow', 'FastAPI'],
    liveUrl: 'https://coffee-barista-489073495110.asia-south1.run.app/',
    category: 'AI Agents',
    metrics: 'Low-latency real-time voice & text state machine'
  },
  {
    id: 'coffee-monitor',
    number: '06',
    title: 'Coffee Shop Monitor',
    subtitle: 'Real-Time Operational Analytics',
    description: 'Executive operations dashboard and telemetry monitor tracking order pipelines, barista workstation loads, throughput anomalies, and peak-hour predictive staffing metrics.',
    technologies: ['Google Cloud Run', 'Operational Analytics', 'Real-Time Telemetry'],
    liveUrl: 'https://coffee-mgr-agent-489073495110.asia-southeast1.run.app/',
    category: 'Product Analytics',
    metrics: 'Real-time bottleneck telemetry & workload balancing'
  }
];
