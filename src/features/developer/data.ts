import type { Project, TimelineEntry, OpenSourceItem } from '@/services/types'

export const TERM_SCRIPT = [
  { prompt: true,  text: 'npm run build' },
  { prompt: false, text: '> Compiling TypeScript .............. ✓' },
  { prompt: false, text: '> Building frontend layer ........... ✓' },
  { prompt: false, text: '> Hydrating client state ............ ✓' },
  { prompt: false, text: '> Initialising backend services ..... ✓' },
  { prompt: false, text: '> Handling REST API routes .......... ✓' },
  { prompt: false, text: '> Connecting MySQL database ......... ✓' },
  { prompt: false, text: '> Running schema migrations ......... ✓' },
  { prompt: false, text: '> Optimising production bundle ...... ✓' },
  { prompt: true,  text: '[ONLINE] Full-stack system ready →' },
]

export const PROJECTS: Project[] = [
  {
    name:     'Rehbox Motion',
    desc:     'Web-based physiotherapy platform for guided rehab sessions using real-time pose tracking. Uses MediaPipe to monitor joint angles and provide corrective feedback during exercises.',
    tags:     ['React', 'TypeScript', 'MediaPipe', 'Node.js'],
    year:     '2025',
    featured: true,
  },
  {
    name:     'PostureCheck',
    desc:     'Computer vision tool that detects poor sitting and standing posture via webcam and provides simple real-time correction cues for users.',
    tags:     ['Python', 'OpenCV', 'MediaPipe', 'FastAPI'],
    year:     '2024',
    featured: true,
  },
  {
    name:     'PhysioTrack',
    desc:     'Patient progress tracking system for physiotherapists to log sessions, monitor recovery trends, and manage home exercise programs.',
    tags:     ['Laravel', 'MySQL', 'REST API'],
    year:     '2024',
  },
  {
    name:     'Exercise Feedback Engine',
    desc:     'Rule-based engine for evaluating rehab exercises using joint angle thresholds and movement patterns, designed for real-time coaching systems.',
    tags:     ['TypeScript', 'MediaPipe'],
    year:     '2023',
  },

  {
    name:     'Inifnite Luxury Real Estate',
    desc:     'Real estate web application for listing and browsing properties with search filters, image galleries and agent contact features.',
    tags:     ['React', 'Laravel', 'MySQL'],
    year:     '2024',
  },
  {
    name:     'BooBooEats Landing',
    desc:     'High-conversion landing page for a food delivery startup, focused on mobile-first design, fast load performance and clear call-to-actions.',
    tags:     ['React', 'Tailwind', 'PHP', 'Laravel'],
    year:     '2024',
  },
  {
    name:     'Neuron AI Landing',
    desc:     'Modern landing page for an AI startup with clean UI, animated sections and strong product storytelling for early-stage positioning.',
    tags:     ['React', 'Framer Motion', 'TypeScript'],
    year:     '2025',
  },
  {
    name:     'Personal Portfolio',
    desc:     'Interactive portfolio with motion-driven UI, smooth transitions and 3D elements to showcase physiotherapy and development work.',
    tags:     ['React', 'Three.js', 'Framer Motion', 'Tailwind'],
    year:     '2025',
  },
]

export const TIMELINE: TimelineEntry[] = [
  {
    year: '2025',
    role: 'Physiotherapist & Motion Developer',
    org: 'Independent / Rehbox Motion',
    desc: 'Building rehabilitation tools using real-time pose tracking, combining clinical physiotherapy knowledge with web-based motion analysis systems.',
  },
  {
    year: '2024',
    role: 'Full-Stack Developer',
    org: 'DES & DEV',
    desc: 'Worked on modern web applications and landing pages, focusing on responsive UI, performance, and scalable frontend architecture.',
  },
  {
    year: '2024',
    role: 'Frontend Developer',
    org: 'The Pragmatic Approach',
    desc: 'Built and refined user interfaces for client projects, improving usability, mobile responsiveness, and overall user experience.',
  },
  {
    year: '2023',
    role: 'Computer Vision & Rehab Systems',
    org: 'Independent Research',
    desc: 'Developed posture detection and exercise feedback systems using MediaPipe and OpenCV for physiotherapy applications.',
  },
  {
    year: '2022',
    role: 'Web Developer',
    org: 'Admas Computer',
    desc: 'Built and maintained websites for local clients, working across frontend and backend with a focus on practical business needs.',
  },
  {
    year: '2021',
    role: 'Junior Web Developer',
    org: 'The Pragmatic Approach',
    desc: 'Supported development of web projects, gaining hands-on experience with HTML, CSS, JavaScript, and basic backend integration.',
  },
]

export const OPEN_SOURCE: OpenSourceItem[] = [
  { name: 'three-body-kit',    desc: 'React component library for anatomical 3D body models',  stars: 1240, lang: 'TypeScript' },
  { name: 'motion-hooks',      desc: 'Physics-based animation hooks for React',                  stars: 876,  lang: 'TypeScript' },
  { name: 'laravel-healthkit', desc: 'Laravel package for HIPAA-compliant health data APIs',    stars: 543,  lang: 'PHP' },
]

export const TECH_STACK = {
  Frontend:  ['React 18', 'TypeScript', 'Next.js 14', 'Three.js', 'WebGL / GLSL', 'Tailwind CSS'],
  Backend:   ['Node.js', 'Laravel / PHP', 'Python / FastAPI', 'REST APIs', 'WebSockets'],
  Data:      ['PostgreSQL', 'MySQL', 'MongoDB', 'Prisma ORM'],
  DevOps:    ['Docker', 'AWS (ECS, S3, RDS)', 'GitHub Actions', 'Nginx'],
  AI_ML:     ['TensorFlow.js', 'PyTorch', 'OpenCV', 'MediaPipe', 'LangChain', 'OpenAI API'],
}
