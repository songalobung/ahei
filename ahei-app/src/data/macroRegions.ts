export interface MacroRegion {
  id: string;
  name: string;
  nationsCount: number;
  description: string;
  topInstitution: string;
  rankedBodies: number;
  medianScore: number;
  topField: string;
  accentColor: string;
}

export const MACRO_REGIONS: MacroRegion[] = [
  {
    id: 'east-africa',
    name: 'East Africa',
    nationsCount: 14,
    description: 'EAC academic exchange area with high mobility across Kenya, Uganda, Rwanda, and Tanzania.',
    topInstitution: 'Univ. of Nairobi',
    rankedBodies: 112,
    medianScore: 68.4,
    topField: 'Software & Agri-tech',
    accentColor: '#164A3A',
  },
  {
    id: 'west-africa',
    name: 'West Africa',
    nationsCount: 15,
    description: 'ECOWAS university network led by Nigerian federal institutions and Ghanaian polytechnics.',
    topInstitution: 'Univ. of Ibadan',
    rankedBodies: 168,
    medianScore: 66.1,
    topField: 'Health Sciences & Biotech',
    accentColor: '#B28A45',
  },
  {
    id: 'north-africa',
    name: 'North Africa',
    nationsCount: 6,
    description: 'Intensive research universities in Egypt, Morocco, and Tunisia with Mediterranean joint labs.',
    topInstitution: 'Cairo University',
    rankedBodies: 94,
    medianScore: 73.2,
    topField: 'Clinical Medicine & Physics',
    accentColor: '#164A3A',
  },
  {
    id: 'southern-africa',
    name: 'Southern Africa',
    nationsCount: 10,
    description: 'SADC research powerhouse with the highest density of top-100 ranked continental faculties.',
    topInstitution: 'Univ. of Cape Town',
    rankedBodies: 76,
    medianScore: 76.8,
    topField: 'Mining Tech & Ecology',
    accentColor: '#B28A45',
  },
  {
    id: 'central-africa',
    name: 'Central Africa',
    nationsCount: 9,
    description: 'ECCAS scientific zone accelerating forestry biology, infectious disease epidemiology, and law.',
    topInstitution: 'Univ. de Yaoundé I',
    rankedBodies: 50,
    medianScore: 61.5,
    topField: 'Tropical Ecology',
    accentColor: '#164A3A',
  },
];

export interface InsightArticle {
  id: string;
  category: string;
  readTime: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  fullBody?: string[];
}

export const INSIGHT_ARTICLES: InsightArticle[] = [
  {
    id: 'east-african-corridor',
    category: 'Regional Integration',
    readTime: '8 min read',
    title: 'The East African Research Corridor: How Nairobi, Makerere, and Addis Ababa are Scaling Graduate Research',
    excerpt: 'Joint doctoral fellowships across the EAC common market have reduced Western brain-drain by 18% over four continuous academic cycles.',
    author: 'Dr. Wanjiru Mwangi',
    date: 'Nov 2, 2026',
    fullBody: [
      'Over the past decade, institutional fragmentation among East African universities imposed severe limits on scientific capacity. Researchers faced burdensome customs tariffs on reagent imports, incompatible visa regimes for doctoral candidates, and disconnected credit transfer policies.',
      'Under the revitalization of the Inter-University Council for East Africa (IUCEA) and bilateral compacts between the University of Nairobi, Makerere University, and Addis Ababa University, the newly established "Eastern Rift Research Corridor" has unified 28 postgraduate centres of excellence.',
      'The results of this harmonized regional market are already visible: doctoral completions within 48 months rose from 41% in 2020 to 67% in 2026, while cross-institutional co-authorship among East African researchers rose by 42%. By pooling specialized laboratory cleanrooms—such as the Chiromo Genomics facility in Nairobi and the Mulago Infectious Disease laboratories in Kampala—participating departments have doubled their grant capture from international funders without sacrificing regional priority alignment.',
    ],
  },
  {
    id: 'citation-economics',
    category: 'Citation Economics',
    readTime: '11 min read',
    title: 'De-dollarizing Academic Citations: Measuring Continental Relevance in Agricultural Patents',
    excerpt: 'Why commercial citations in African patent registries offer a truer metric of scientific efficacy than Northern citation cartels.',
    author: 'Prof. Tunde Oladipo',
    date: 'Oct 24, 2026',
    fullBody: [
      'Standard international higher education league tables have long suffered from structural metric distortion: by relying almost exclusively on global commercial databases like Scopus and Clarivate Web of Science, they systematically penalize research published in regional, open-access, and non-commercial African periodicals.',
      'In agricultural sciences, this bias is acute. A breakthrough drought-resistant teff variant developed in Ethiopia or a solar-powered cassava peeler patented in Nigeria may generate enormous economic surplus across rural cooperatives, yet receive zero citations in high-impact Northern agronomy journals whose review boards prioritize temperate monoculture issues.',
      'The AHEI 2027 Index introduces the Continental Citation Parity (CCP) weighting: integrating direct disclosures from the African Regional Intellectual Property Organization (ARIPO) and the Organisation Africaine de la Propriété Intellectuelle (OAPI). Under this audited standard, commercial adoption within the continent carries equal empirical standing to foreign peer review.',
    ],
  },
  {
    id: 'methodology-2027',
    category: 'Methodology 2027',
    readTime: '6 min read',
    title: 'Why Teaching-to-Faculty Ratios Were Re-weighted for Clinical Medicine & Surgery',
    excerpt: 'An explanatory note detailing changes in indicator 4.2: moving from gross student counts to hospital-bed bedside instruction hours.',
    author: 'AHEI Standards Board',
    date: 'Oct 15, 2026',
    fullBody: [
      'In response to joint petitions from the Association of Medical Councils of Africa (AMCOA), the AHEI Methodology Board has implemented a formal revision to indicator 4.2 (Faculty-to-Student Operating Load) specifically for healthcare professional programmes.',
      'Historically, institutions with large lecture halls registered artificially deflated student-to-faculty ratios that concealed critical deficits in clinical preceptorship. Under the revised 2027 protocol, clinical disciplines are benchmarked against direct bedside teaching ratios (maximum 6:1 in ward rounds) and verified access to tertiary referral beds.',
      'This adjustment has re-calibrated the rankings of teaching hospitals across Egypt, Kenya, South Africa, and Nigeria, rewarding medical schools that maintain dedicated resident tutoring cadres over those relying on mass didactic lectures.',
    ],
  },
  {
    id: 'west-african-stem',
    category: 'Capital & Labs',
    readTime: '9 min read',
    title: 'West African STEM Infrastructure: The Funding and Faculty Landscape Across Nigeria and Ghana',
    excerpt: 'A physical audit of 42 laboratory cleanrooms, electrical grids, and supercomputing clusters backing computer science faculties.',
    author: 'Dr. Koffi Mensah',
    date: 'Sep 29, 2026',
    fullBody: [
      'The greatest impediment to African computer science research has historically not been intellect, but continuous electrical power and low-latency supercomputing infrastructure. For decades, researchers at leading federal universities suffered rolling blackouts that interrupted longitudinal machine-learning training cycles.',
      'The 2026 AHEI Physical Infrastructure Audit conducted on-site inspections of 42 university cleanrooms and computational data centers across Nigeria, Ghana, Senegal, and Côte d\'Ivoire.',
      'A notable bright spot has been the emergence of campus microgrids and sovereign cloud clusters: Kwame Nkrumah University of Science and Technology (KNUST) and the University of Lagos have both commissioned 2-megawatt dedicated solar microgrids, ensuring 99.8% uptime for their AI diagnostic and fintech laboratories.',
    ],
  },
];
