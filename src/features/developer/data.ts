import type { Project, TimelineEntry, OpenSourceItem } from '@/services/types'

export const TERM_SCRIPT = [
  { prompt: true,  text: 'npm run build --mode=production' },
  { prompt: false, text: '> Compiling TypeScript .............. ✓' },
  { prompt: false, text: '> Bundling assets with Vite ......... ✓' },
  { prompt: false, text: '> Three.js WebGL renderer ........... ✓' },
  { prompt: false, text: '> Optimising GPU shaders ............ ✓' },
  { prompt: false, text: '> Docker image push → AWS ECR ....... ✓' },
  { prompt: false, text: '> API Gateway deployed (us-east-1) .. ✓' },
  { prompt: true,  text: '[ONLINE] Available for collaboration →' },
]

export const PROJECTS: Project[] = [
  {
    name:     'NeuroSync AI',
    desc:     'Real-time EEG signal processing dashboard with WebGL neural map visualisation, BCI device integration and ML-powered brainwave classification. Reduced signal latency by 68%.',
    tags:     ['React', 'WebGL', 'TensorFlow.js', 'Node.js', 'WebSockets'],
    year:     '2024',
    featured: true,
  },
  {
    name:     'VitalTrack Pro',
    desc:     'Health monitoring SaaS platform serving 50K+ active users. Sub-100ms latency with predictive analytics, HIPAA-compliant infrastructure and real-time alerting system.',
    tags:     ['Next.js', 'Node.js', 'PostgreSQL', 'Redis', 'AWS ECS'],
    year:     '2024',
    featured: true,
  },
  {
    name:     'PhysioBot',
    desc:     'AI-powered physiotherapy assessment tool using computer vision and MediaPipe pose estimation. Provides clinically guided exercise feedback with 92% accuracy vs manual assessment.',
    tags:     ['Python', 'OpenCV', 'FastAPI', 'MediaPipe', 'React'],
    year:     '2023',
  },
  {
    name:     'FlowState XR',
    desc:     '3D spatial collaboration workspace with full WebXR support, spatial audio channels, real-time document co-editing and physics-based object manipulation.',
    tags:     ['Three.js', 'WebRTC', 'TypeScript', 'WebXR', 'Socket.io'],
    year:     '2023',
  },
  {
    name:     'NutriEngine API',
    desc:     'Personalised macro-nutrition calculation engine with meal planning optimisation, barcode scanning integration and Laravel backend serving 12K daily API requests.',
    tags:     ['Laravel', 'PHP', 'MySQL', 'Redis', 'REST API'],
    year:     '2022',
  },
]

export const TIMELINE: TimelineEntry[] = [
  { year: '2024', role: 'Senior Full-Stack Engineer',   org: 'NeuroSync Labs',      desc: 'Led a 6-person team building brain-computer interface dashboards.' },
  { year: '2023', role: 'Software Architect',           org: 'VitalTrack Health',   desc: 'Designed microservices handling 2M+ daily health data records.' },
  { year: '2022', role: 'Full-Stack Developer',         org: 'Freelance / Remote',  desc: 'Built bespoke SaaS products for health-tech and fitness clients.' },
  { year: '2021', role: 'Junior Developer',             org: 'Axiom Digital',       desc: 'Developed e-commerce platforms with React and Laravel backends.' },
  { year: '2019', role: 'BSc Computer Science',         org: 'University of Lagos', desc: 'First Class Honours. Thesis on ML-based physiotherapy assessment.' },
]

export const OPEN_SOURCE: OpenSourceItem[] = [
  { name: 'three-body-kit',    desc: 'React component library for anatomical 3D body models',  stars: 1240, lang: 'TypeScript' },
  { name: 'motion-hooks',      desc: 'Physics-based animation hooks for React',                  stars: 876,  lang: 'TypeScript' },
  { name: 'laravel-healthkit', desc: 'Laravel package for HIPAA-compliant health data APIs',    stars: 543,  lang: 'PHP' },
]

export const TECH_STACK = {
  Frontend:  ['React 18', 'TypeScript', 'Next.js 14', 'Three.js', 'WebGL / GLSL', 'Tailwind CSS'],
  Backend:   ['Node.js', 'Laravel / PHP', 'Python / FastAPI', 'GraphQL', 'REST APIs', 'WebSockets'],
  Data:      ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch', 'Prisma ORM'],
  DevOps:    ['Docker', 'AWS (ECS, S3, RDS)', 'GitHub Actions', 'Nginx', 'Linux', 'Terraform'],
  AI_ML:     ['TensorFlow.js', 'PyTorch', 'OpenCV', 'MediaPipe', 'LangChain', 'OpenAI API'],
}
