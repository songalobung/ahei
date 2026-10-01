export interface UniversityVideo {
  id: string;
  youtubeId: string;
  title: string;
  institutionName: string;
  institutionId: string;
  country: string;
  region: string;
  duration: string;
  category: 'CAMPUS TOUR' | 'RANKINGS & EXCELLENCE' | 'STUDENT LIFE' | 'ACADEMIC & RESEARCH';
  description: string;
  channelName: string;
}

export const VERIFIED_CAMPUS_VIDEOS: UniversityVideo[] = [
  {
    id: 'uct-rankings-feature',
    youtubeId: '6mXlvRCKw8M',
    title: "UCT Remains Africa's Top-Ranked University: Excellence & Continental Leadership",
    institutionName: 'University of Cape Town',
    institutionId: 'uct',
    country: 'South Africa',
    region: 'Southern Africa',
    duration: '4:15',
    category: 'RANKINGS & EXCELLENCE',
    description: "Official feature detailing the University of Cape Town's position as Africa's premier global research institution, faculty perspectives, and continental impact.",
    channelName: 'University of Cape Town'
  },
  {
    id: 'wits-campus-tour',
    youtubeId: 'OGhwL5qNkXo',
    title: 'Wits University Campus Tour: World-Class Architecture, Libraries & Labs',
    institutionName: 'University of the Witwatersrand',
    institutionId: 'wits',
    country: 'South Africa',
    region: 'Southern Africa',
    duration: '12:40',
    category: 'CAMPUS TOUR',
    description: 'An extensive walking and aerial tour through Wits East and West campuses, the Great Hall, science and engineering precincts, and student hubs in Johannesburg.',
    channelName: 'Gift Varsity TV'
  },
  {
    id: 'uon-campus-tour',
    youtubeId: 'Y1__igSejp4',
    title: 'Inside the University of Nairobi: Comprehensive Main Campus Tour',
    institutionName: 'University of Nairobi',
    institutionId: 'uon',
    country: 'Kenya',
    region: 'Eastern Africa',
    duration: '14:22',
    category: 'CAMPUS TOUR',
    description: 'Explore the heart of Kenyan higher education: UoN Towers, historic courtyards, engineering laboratories, and the vibrant campus culture in Nairobi.',
    channelName: 'Ray Isaac Media'
  },
  {
    id: 'auc-international-life',
    youtubeId: 'nP_YVn-YT-E',
    title: 'New International Students: First Takes & Life at AUC New Cairo',
    institutionName: 'The American University in Cairo',
    institutionId: 'auc-egypt',
    country: 'Egypt',
    region: 'Northern Africa',
    duration: '3:50',
    category: 'STUDENT LIFE',
    description: 'International scholars from across Africa, Europe, and the Americas share their experiences arriving on the 260-acre state-of-the-art New Cairo campus.',
    channelName: 'The American University in Cairo'
  },
  {
    id: 'ashesi-tour',
    youtubeId: 'VVCnWwQwfoU',
    title: "Take a Tour of Ashesi University's Modern Berekuso Campus",
    institutionName: 'Ashesi University',
    institutionId: 'ashesi-university',
    country: 'Ghana',
    region: 'Western Africa',
    duration: '5:10',
    category: 'CAMPUS TOUR',
    description: "Discover West Africa's leading technology and leadership university set in the scenic Berekuso hills, featuring eco-friendly engineering studios and collaborative spaces.",
    channelName: 'Ashesi University'
  },
  {
    id: 'makerere-tour',
    youtubeId: 'PCiZQKVxeoo',
    title: 'Inside Makerere University: 4K Drive & Walking Tour of East Africa’s Oldest Flagship',
    institutionName: 'Makerere University',
    institutionId: 'makerere-university',
    country: 'Uganda',
    region: 'Eastern Africa',
    duration: '11:05',
    category: 'CAMPUS TOUR',
    description: 'A 4K journey through the historic ivory tower, Freedom Square, College of Health Sciences, and campus avenues of Makerere in Kampala.',
    channelName: 'Msafiri Tours'
  },
  {
    id: 'uct-commerce-virtual',
    youtubeId: 'RbSJqfAT2w8',
    title: 'UCT Faculty of Commerce & Middle Campus Virtual Tour',
    institutionName: 'University of Cape Town',
    institutionId: 'uct',
    country: 'South Africa',
    region: 'Southern Africa',
    duration: '6:30',
    category: 'ACADEMIC & RESEARCH',
    description: 'Detailed virtual walk-through of the Leslie Social Science and Kramer Law buildings, faculty lecture theatres, and student study plazas.',
    channelName: 'University of Cape Town'
  },
  {
    id: 'stellenbosch-campus',
    youtubeId: 'dpQaKJpBw0c',
    title: 'Stellenbosch University: Academic Innovation & Student Community',
    institutionName: 'Stellenbosch University',
    institutionId: 'stellenbosch',
    country: 'South Africa',
    region: 'Southern Africa',
    duration: '4:45',
    category: 'STUDENT LIFE',
    description: 'Highlights of academic initiatives, research centers, and student support networks nestled in the Western Cape winelands.',
    channelName: 'Stellenbosch University'
  }
];
