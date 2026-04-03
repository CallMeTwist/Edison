export const CONTACT_INFO = {
  whatsapp: {
    number:  '+2348012345678',
    display: '+234 801 234 5678',
    link:    'https://wa.me/2347064412910',
  },
  email: {
    address: 'sukaxavier@gmail.com',
    link:    'mailto:sukaxavier@gmail.com',
  },
}

export type ServiceType =
  | 'Physiotherapy'
  | 'Software Development'
  | 'Fitness Coaching'
  | 'Art Commission'
  | 'General Enquiry'

export const SERVICE_OPTIONS: ServiceType[] = [
  'Physiotherapy',
  'Software Development',
  'Fitness Coaching',
  'Art Commission',
  'General Enquiry',
]