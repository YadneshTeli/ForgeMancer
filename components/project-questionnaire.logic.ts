export const TOTAL_STEPS = 5

export function updateProgress(currentStep: number, totalSteps: number = TOTAL_STEPS): number {
  return (currentStep / totalSteps) * 100
}

export function toggleProjectGoal(currentGoals: string[], goal: string): string[] {
  if (currentGoals.includes(goal)) {
    return currentGoals.filter((g) => g !== goal)
  } else {
    return [...currentGoals, goal]
  }
}

export const stepCount = 5

export const projectTypes = [
  {
    value: "web-app",
    label: "Web Application",
    description: "Interactive web applications with user authentication and database",
  },
  {
    value: "mobile-app",
    label: "Mobile Application",
    description: "Native or cross-platform mobile apps for iOS and Android",
  },
  {
    value: "e-commerce",
    label: "E-commerce Site",
    description: "Online store with product catalog, cart, and payment processing",
  },
  {
    value: "portfolio",
    label: "Portfolio Website",
    description: "Showcase your work, skills, and experience",
  },
  {
    value: "blog",
    label: "Blog",
    description: "Content management system for publishing articles",
  },
  {
    value: "dashboard",
    label: "Dashboard",
    description: "Data visualization and analytics interface",
  },
  {
    value: "blockchain",
    label: "Blockchain Application",
    description: "Decentralized applications using blockchain technology",
  },
  {
    value: "digital-marketing",
    label: "Digital Marketing",
    description: "SEO, content marketing, and social media campaigns",
  },
  {
    value: "ai-ml",
    label: "AI/ML Project",
    description: "Machine learning models and AI-powered applications",
  },
]

export const techStackOptions: Record<string, { value: string; label: string }[]> = {
  "web-app": [
    { value: "React", label: "React" },
    { value: "Next.js", label: "Next.js" },
    { value: "Vue", label: "Vue.js" },
    { value: "Angular", label: "Angular" },
    { value: "Node.js", label: "Node.js" },
    { value: "Django", label: "Django" },
    { value: "Ruby on Rails", label: "Ruby on Rails" },
    { value: "Laravel", label: "Laravel" },
  ],
  "mobile-app": [
    { value: "React Native", label: "React Native" },
    { value: "Flutter", label: "Flutter" },
    { value: "Swift", label: "Swift (iOS)" },
    { value: "Kotlin", label: "Kotlin (Android)" },
    { value: "Xamarin", label: "Xamarin" },
  ],
  "e-commerce": [
    { value: "Shopify", label: "Shopify" },
    { value: "WooCommerce", label: "WooCommerce" },
    { value: "Magento", label: "Magento" },
    { value: "Next.js Commerce", label: "Next.js Commerce" },
    { value: "Saleor", label: "Saleor" },
  ],
  portfolio: [
    { value: "HTML/CSS/JS", label: "HTML/CSS/JavaScript" },
    { value: "React", label: "React" },
    { value: "Next.js", label: "Next.js" },
    { value: "Gatsby", label: "Gatsby" },
    { value: "WordPress", label: "WordPress" },
  ],
  blog: [
    { value: "WordPress", label: "WordPress" },
    { value: "Ghost", label: "Ghost" },
    { value: "Next.js", label: "Next.js" },
    { value: "Gatsby", label: "Gatsby" },
    { value: "Medium", label: "Medium" },
  ],
  dashboard: [
    { value: "React", label: "React" },
    { value: "Next.js", label: "Next.js" },
    { value: "Vue", label: "Vue.js" },
    { value: "D3.js", label: "D3.js" },
    { value: "Grafana", label: "Grafana" },
  ],
  blockchain: [
    { value: "Ethereum", label: "Ethereum" },
    { value: "Solidity", label: "Solidity" },
    { value: "Web3.js", label: "Web3.js" },
    { value: "Hardhat", label: "Hardhat" },
    { value: "Solana", label: "Solana" },
  ],
  "digital-marketing": [
    { value: "Google Ads", label: "Google Ads" },
    { value: "Facebook Ads", label: "Facebook Ads" },
    { value: "SEO", label: "SEO" },
    { value: "Content Marketing", label: "Content Marketing" },
    { value: "Email Marketing", label: "Email Marketing" },
  ],
  "ai-ml": [
    { value: "TensorFlow", label: "TensorFlow" },
    { value: "PyTorch", label: "PyTorch" },
    { value: "scikit-learn", label: "scikit-learn" },
    { value: "Hugging Face", label: "Hugging Face" },
    { value: "OpenAI API", label: "OpenAI API" },
  ],
}

export const projectGoals = [
  "Increase revenue",
  "Improve user experience",
  "Expand market reach",
  "Automate processes",
  "Reduce costs",
  "Enhance security",
  "Improve performance",
  "Add new features",
  "Rebrand/redesign",
  "Launch new product",
  "Educational/learning",
  "Personal portfolio",
]
