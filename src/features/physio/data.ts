import type { BodyRegion, BodyRegionId } from '@/services/types'

export const BODY_DATA: Record<BodyRegionId, BodyRegion> = {
  head: {
    label: 'Head & Cervical Spine',
    desc:  'Cervical spine mobilisation, tension headache management, TMJ dysfunction, whiplash injury recovery and postural correction for screen-related fatigue.',
    tags:  ['Stroke', 'Cervical Mob', 'Dry Needling', 'Vestibular Rehab', 'Taping', 'Postural Correction'],
  },
  shoulder: {
    label: 'Shoulder Complex',
    desc:  'Rotator cuff injuries, frozen shoulder (adhesive capsulitis), impingement syndrome, AC joint injuries, glenohumeral instability and post-arthroplasty rehabilitation.',
    tags:  ['Rotator Cuff', 'Impingement', 'AC Joint', 'Surgical Rehab', 'Stabilisation'],
  },

  // ── NEW ──
  elbow: {
    label: 'Elbow & Forearm',
    desc:  'Tennis elbow (lateral epicondylitis), golfer\'s elbow (medial epicondylitis), olecranon bursitis, elbow ligament sprains, cubital tunnel syndrome and post-fracture rehabilitation of the radial head.',
    tags:  ['Tennis Elbow', 'Golfer\'s Elbow', 'Epicondylitis', 'Bursitis', 'Cubital Tunnel'],
  },
  hand: {
    label: 'Wrist, Hand & Fingers',
    desc:  'Carpal tunnel syndrome, De Quervain\'s tenosynovitis, trigger finger, wrist sprains, TFCC injuries, gamekeeper\'s thumb and post-surgical rehabilitation following fractures or tendon repair.',
    tags:  ['Carpal Tunnel', 'De Quervain\'s', 'Trigger Finger', 'TFCC', 'Wrist Rehab'],
  },
  // ── END NEW ──

  chest: {
    label: 'Chest &Thoracic Spine',
    desc:  'Mid-back pain management, thoracic outlet syndrome, rib mobilisation techniques, postural kyphosis correction, breathing pattern disorders and costovertebral joint dysfunction.',
    tags:  ['Chest Physiotherapy', 'Thoracic Mob', 'Rib Release', 'Posture', 'Breathing Rehab'],
  },
  core: {
    label: 'Lumbar Spine & Core',
    desc:  'Lower back pain, disc herniation, sciatica management, spondylosis, core stability retraining, McKenzie method and spinal manipulation therapy.',
    tags:  ['McKenzie Method', 'Disc Rehab', 'Core Stability', 'Manipulation', 'Sciatica'],
  },
  hip: {
    label: 'Hip & Pelvis',
    desc:  'Hip flexor strains, labral tears, piriformis syndrome, sacroiliac joint dysfunction, greater trochanteric pain syndrome and post-arthroplasty rehabilitation.',
    tags:  ['Labral Tears', 'SIJ Dysfunction', 'Piriformis', 'Arthroplasty'],
  },
  knee: {
    label: 'Knee Joint',
    desc:  'ACL/PCL reconstruction rehab, meniscus injuries, patellofemoral syndrome, osteoarthritis management, Osgood-Schlatter syndrome and ligament sprains.',
    tags:  ['ACL Rehab', 'Meniscus', 'PFJ Syndrome', 'OA Management'],
  },
  ankle: {
    label: 'Ankle & Foot',
    desc:  'Plantar fasciitis, Achilles tendinopathy, ankle instability, post-fracture rehabilitation, Morton\'s neuroma and custom orthotics prescription.',
    tags:  ['Plantar Fasciitis', 'Achilles', 'Orthotics', 'Ankle Stability'],
  },
}

export const PHYSIO_SERVICES = [
  'Manual Therapy', 'Soft Tissue Mobilisation', 'Exercise Rehab',
  'Kinesiology Taping', 'Ultrasound', 'Hydrotherapy',
  'Clinical Pilates', 'Massage',
]

export const PHYSIO_STATS = [
  { label: 'Years Experience', value: '3+' },
  { label: 'Patients Treated', value: '400+' },
  { label: 'Rehab Sessions Delivered', value: '1,000+' },
  { label: 'Goal Achievement Rate', value: '85%+' },
]