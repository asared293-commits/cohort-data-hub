import { DataBundle, CommunityBenefit, FaqItem, CommunityFeedPost } from '../types';

export const LINKS = {
  DATA_SHOP: 'https://www.cheapdata.shop/shop/data-daddy-1772543162425-cohort-tech-data-hub-muaplzct',
  TELEGRAM: 'https://t.me/+8pm-it9B5E1jNzZk',
  WHATSAPP: 'https://whatsapp.com/channel/0029Vb8FZjmCRs1kCJ9OaI3s',
};

export const DATA_BUNDLES: DataBundle[] = [
  // MTN (Customer-facing branding: MTN)
  { id: 'mtn-1gb', network: 'MTN', networkName: 'MTN', size: '1GB', dataGb: 1, priceGhs: 5.0, period: 'Non-expiry • Direct top-up', popular: true },
  { id: 'mtn-2gb', network: 'MTN', networkName: 'MTN', size: '2GB', dataGb: 2, priceGhs: 10.0, period: 'Non-expiry • Direct top-up' },
  { id: 'mtn-3gb', network: 'MTN', networkName: 'MTN', size: '3GB', dataGb: 3, priceGhs: 15.0, period: 'Non-expiry • Direct top-up' },
  { id: 'mtn-4gb', network: 'MTN', networkName: 'MTN', size: '4GB', dataGb: 4, priceGhs: 20.0, period: 'Non-expiry • Direct top-up' },
  { id: 'mtn-5gb', network: 'MTN', networkName: 'MTN', size: '5GB', dataGb: 5, priceGhs: 25.0, period: 'Non-expiry • Direct top-up', popular: true, tag: 'BEST VALUE' },
  { id: 'mtn-6gb', network: 'MTN', networkName: 'MTN', size: '6GB', dataGb: 6, priceGhs: 30.0, period: 'Non-expiry • Direct top-up' },
  { id: 'mtn-8gb', network: 'MTN', networkName: 'MTN', size: '8GB', dataGb: 8, priceGhs: 35.0, period: 'Non-expiry • Direct top-up' },
  { id: 'mtn-10gb', network: 'MTN', networkName: 'MTN', size: '10GB', dataGb: 10, priceGhs: 45.0, period: 'Non-expiry • Direct top-up', popular: true },
  { id: 'mtn-15gb', network: 'MTN', networkName: 'MTN', size: '15GB', dataGb: 15, priceGhs: 65.0, period: 'Non-expiry • Direct top-up' },
  { id: 'mtn-20gb', network: 'MTN', networkName: 'MTN', size: '20GB', dataGb: 20, priceGhs: 85.0, period: 'Non-expiry • Direct top-up' },
  { id: 'mtn-25gb', network: 'MTN', networkName: 'MTN', size: '25GB', dataGb: 25, priceGhs: 105.0, period: 'Non-expiry • Direct top-up' },
  { id: 'mtn-30gb', network: 'MTN', networkName: 'MTN', size: '30GB', dataGb: 30, priceGhs: 130.0, period: 'Non-expiry • Direct top-up' },
  { id: 'mtn-40gb', network: 'MTN', networkName: 'MTN', size: '40GB', dataGb: 40, priceGhs: 165.0, period: 'Non-expiry • Direct top-up' },
  { id: 'mtn-50gb', network: 'MTN', networkName: 'MTN', size: '50GB', dataGb: 50, priceGhs: 210.0, period: 'Non-expiry • Direct top-up' },
  { id: 'mtn-100gb', network: 'MTN', networkName: 'MTN', size: '100GB', dataGb: 100, priceGhs: 420.0, period: 'Non-expiry • Direct top-up' },

  // TELECEL
  { id: 'telecel-10gb', network: 'TELECEL', networkName: 'Telecel', size: '10GB', dataGb: 10, priceGhs: 45.0, period: 'Non-expiry • Direct top-up', popular: true },
  { id: 'telecel-15gb', network: 'TELECEL', networkName: 'Telecel', size: '15GB', dataGb: 15, priceGhs: 60.0, period: 'Non-expiry • Direct top-up' },
  { id: 'telecel-20gb', network: 'TELECEL', networkName: 'Telecel', size: '20GB', dataGb: 20, priceGhs: 80.0, period: 'Non-expiry • Direct top-up', popular: true, tag: 'POPULAR' },
  { id: 'telecel-25gb', network: 'TELECEL', networkName: 'Telecel', size: '25GB', dataGb: 25, priceGhs: 100.0, period: 'Non-expiry • Direct top-up' },
  { id: 'telecel-30gb', network: 'TELECEL', networkName: 'Telecel', size: '30GB', dataGb: 30, priceGhs: 120.0, period: 'Non-expiry • Direct top-up' },
  { id: 'telecel-35gb', network: 'TELECEL', networkName: 'Telecel', size: '35GB', dataGb: 35, priceGhs: 145.0, period: 'Non-expiry • Direct top-up' },
  { id: 'telecel-40gb', network: 'TELECEL', networkName: 'Telecel', size: '40GB', dataGb: 40, priceGhs: 155.0, period: 'Non-expiry • Direct top-up' },
  { id: 'telecel-50gb', network: 'TELECEL', networkName: 'Telecel', size: '50GB', dataGb: 50, priceGhs: 185.0, period: 'Non-expiry • Direct top-up' },
  { id: 'telecel-100gb', network: 'TELECEL', networkName: 'Telecel', size: '100GB', dataGb: 100, priceGhs: 420.0, period: 'Non-expiry • Direct top-up' },

  // AT (AirtelTigo)
  { id: 'at-1gb', network: 'AIRTELTIGO', networkName: 'AT', size: '1GB', dataGb: 1, priceGhs: 5.5, period: 'Non-expiry • Direct top-up', popular: true },
  { id: 'at-2gb', network: 'AIRTELTIGO', networkName: 'AT', size: '2GB', dataGb: 2, priceGhs: 11.0, period: 'Non-expiry • Direct top-up' },
  { id: 'at-3gb', network: 'AIRTELTIGO', networkName: 'AT', size: '3GB', dataGb: 3, priceGhs: 15.0, period: 'Non-expiry • Direct top-up' },
  { id: 'at-4gb', network: 'AIRTELTIGO', networkName: 'AT', size: '4GB', dataGb: 4, priceGhs: 20.0, period: 'Non-expiry • Direct top-up' },
  { id: 'at-5gb', network: 'AIRTELTIGO', networkName: 'AT', size: '5GB', dataGb: 5, priceGhs: 25.0, period: 'Non-expiry • Direct top-up', popular: true, tag: 'BEST VALUE' },
  { id: 'at-6gb', network: 'AIRTELTIGO', networkName: 'AT', size: '6GB', dataGb: 6, priceGhs: 30.0, period: 'Non-expiry • Direct top-up' },
  { id: 'at-8gb', network: 'AIRTELTIGO', networkName: 'AT', size: '8GB', dataGb: 8, priceGhs: 35.0, period: 'Non-expiry • Direct top-up' },
  { id: 'at-10gb', network: 'AIRTELTIGO', networkName: 'AT', size: '10GB', dataGb: 10, priceGhs: 45.0, period: 'Non-expiry • Direct top-up', popular: true },
  { id: 'at-12gb', network: 'AIRTELTIGO', networkName: 'AT', size: '12GB', dataGb: 12, priceGhs: 50.0, period: 'Non-expiry • Direct top-up' },
  { id: 'at-15gb', network: 'AIRTELTIGO', networkName: 'AT', size: '15GB', dataGb: 15, priceGhs: 65.0, period: 'Non-expiry • Direct top-up' },
  { id: 'at-25gb', network: 'AIRTELTIGO', networkName: 'AT', size: '25GB', dataGb: 25, priceGhs: 100.0, period: 'Non-expiry • Direct top-up' },
  { id: 'at-30gb', network: 'AIRTELTIGO', networkName: 'AT', size: '30GB', dataGb: 30, priceGhs: 120.0, period: 'Non-expiry • Direct top-up' },
  { id: 'at-40gb', network: 'AIRTELTIGO', networkName: 'AT', size: '40GB', dataGb: 40, priceGhs: 160.0, period: 'Non-expiry • Direct top-up' },
  { id: 'at-50gb', network: 'AIRTELTIGO', networkName: 'AT', size: '50GB', dataGb: 50, priceGhs: 210.0, period: 'Non-expiry • Direct top-up' },
];

export const WHY_US_CARDS = [
  {
    id: 'affordable',
    icon: 'BadgeDollarSign',
    badge: '💰 AFFORDABLE',
    title: 'Affordable Rates',
    description: 'Competitive bundle prices designed to help you stay connected without overspending.',
  },
  {
    id: 'easy',
    icon: 'Zap',
    badge: '⚡ EASY',
    title: 'Easy Online Ordering',
    description: 'Choose your preferred bundle and complete your order online in a few clicks.',
  },
  {
    id: 'convenient',
    icon: 'Smartphone',
    badge: '📱 CONVENIENT',
    title: 'Anywhere Convenience',
    description: 'Buy data wherever you are in Ghana using your phone or computer with Mobile Money.',
  },
  {
    id: 'more-than-data',
    icon: 'Rocket',
    badge: '🚀 MORE THAN DATA',
    title: 'Community & Upskilling',
    description: 'Get access to a growing technology community with useful digital opportunities, AI, and jobs.',
  },
];

export const COMMUNITY_BENEFITS: CommunityBenefit[] = [
  {
    id: 'ai',
    icon: 'Bot',
    badge: '🤖 AI & AUTOMATION',
    title: 'AI & Automation',
    description: 'Discover useful AI tools, prompts and automation ideas to accelerate your workflow and study.',
    highlights: ['Prompt engineering guides', 'ChatGPT & Claude workflows', 'Local automation tutorials'],
  },
  {
    id: 'security',
    icon: 'ShieldCheck',
    badge: '🔐 CYBERSECURITY',
    title: 'Cybersecurity',
    description: 'Learn about cybersecurity, online safety and security trends to protect your devices and accounts.',
    highlights: ['Momo fraud awareness', 'Two-factor auth setups', 'Phishing defense tips'],
  },
  {
    id: 'programming',
    icon: 'Code2',
    badge: '💻 PROGRAMMING',
    title: 'Programming',
    description: 'Find programming resources, tutorials and developer opportunities across web, mobile, and cloud.',
    highlights: ['Frontend & backend paths', 'Free curated roadmaps', 'Open-source collaboration'],
  },
  {
    id: 'jobs',
    icon: 'Briefcase',
    badge: '💼 REMOTE JOBS',
    title: 'Remote Jobs',
    description: 'Discover selected remote jobs and digital work opportunities for Ghanaian and African talents.',
    highlights: ['Verified remote job boards', 'Tech CV & resume advice', 'Freelance gig leads'],
  },
  {
    id: 'news',
    icon: 'Newspaper',
    badge: '📰 TECH NEWS',
    title: 'Tech News',
    description: 'Stay updated with important technology developments happening across Ghana and the global tech scene.',
    highlights: ['African startup funding', 'Telco & fintech policy', 'New gadget & software releases'],
  },
  {
    id: 'opportunities',
    icon: 'Target',
    badge: '🎯 OPPORTUNITIES',
    title: 'Opportunities',
    description: 'Find useful learning resources, events, hackathons, projects, scholarships, and tech opportunities.',
    highlights: ['Free bootcamps & certs', 'Local tech meetups in Accra/Kumasi', 'Cohort tech challenges'],
  },
];

export const COMMUNITY_TOPICS = [
  '💻 Technology News',
  '🤖 AI Tools & Updates',
  '🔐 Cybersecurity Tips',
  '👨‍💻 Programming Resources',
  '💼 Remote Job Opportunities',
  '🎓 Learning Resources',
  '🌍 Ghana + Global Tech Updates',
  '🔥 Tech Opportunities',
  '📊 Polls & Community Discussions',
  '😂 Tech Memes & Tech Culture',
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'How do I buy data?',
    answer: "Click Buy Data Now. You'll be taken to the Cohort Tech Data Hub shop where you can view available bundles and complete your order.",
  },
  {
    id: 'faq-2',
    question: 'Which networks are available?',
    answer: 'MTN, Telecel and AirtelTigo bundles are available through the shop, depending on current availability.',
  },
  {
    id: 'faq-3',
    question: 'Can I buy data for someone else?',
    answer: 'Use the recipient information requested during checkout to purchase a bundle for another person.',
  },
  {
    id: 'faq-4',
    question: 'How can I receive data promotions?',
    answer: 'Subscribe to SMS and/or email alerts and select the communication channels you want.',
  },
  {
    id: 'faq-5',
    question: 'Can I unsubscribe?',
    answer: 'Yes. Marketing communications should always provide an easy way to unsubscribe.',
  },
  {
    id: 'faq-6',
    question: 'What is Cohort Tech?',
    answer: 'Cohort Tech is a technology-focused community sharing technology news, AI tools, cybersecurity content, programming resources, remote opportunities and useful digital resources.',
  },
];

export const TRUST_POINTS = [
  '✓ Online ordering',
  '✓ Mobile-friendly',
  '✓ Multiple network options',
  '✓ SMS alerts available',
  '✓ Email alerts available',
  '✓ Technology community',
  '✓ Telegram community',
  '✓ WhatsApp updates',
];

export const LIVE_COMMUNITY_POSTS: CommunityFeedPost[] = [
  {
    id: 'post-1',
    author: 'Kofi Mensah',
    role: 'Full-Stack Dev / Cohort Tech Member',
    timeAgo: '12m ago',
    tag: '💼 Remote Work',
    content: 'Just closed my first international frontend gig after polishing my portfolio with the advice shared in our Telegram channel! Thanks to the fast bundle that let me upload demo videos without lag.',
    likes: 38,
    comments: 11,
    platform: 'telegram',
  },
  {
    id: 'post-2',
    author: 'Akosua Darko',
    role: 'Cybersecurity Student @ KNUST',
    timeAgo: '45m ago',
    tag: '🔐 Security Tip',
    content: 'Always enable 2FA on your Mobile Money and email! Cohort Tech’s weekly security drop saved my friend from a SIM-swap phishing attempt yesterday. Stay vigilant tech fam!',
    likes: 54,
    comments: 16,
    platform: 'whatsapp',
  },
  {
    id: 'post-3',
    author: 'Emanuel Osei',
    role: 'AI Explorer & Data Analyst',
    timeAgo: '2h ago',
    tag: '🤖 AI Automation',
    content: 'Automated our inventory tracking with Python and DeepSeek using the free GitHub codespaces tips dropped in Cohort Tech. The 10GB bundle gave me zero headaches downloading datasets.',
    likes: 42,
    comments: 9,
    platform: 'telegram',
  },
];
