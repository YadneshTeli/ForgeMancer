# ForgeMancer

*Automatically synced with your [v0.app](https://v0.app) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/yadnesh-telis-projects/v0-forgemancer)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/projects/UG7JkK4tyn8)

## Overview

ForgeMancer is an AI-assisted project management platform for freelancers. It combines a Next.js 16 App Router frontend with Supabase auth/data and Groq-powered planning and chat, plus a dashboard for projects, tasks, and resources.

## 🚀 Tech Stack

- **Framework:** Next.js 16.1.1 (App Router)
- **Language:** TypeScript
- **UI:** Tailwind CSS, tailwindcss-animate, Radix UI primitives (custom components)
- **Auth + Database:** Supabase with SSR helpers
- **AI Integration:** Groq SDK (chat + project planning)
- **Forms + Validation:** React Hook Form + Zod
- **Animations:** Framer Motion
- **Charts:** Recharts
- **Markdown Rendering:** react-markdown + remark-gfm
- **Analytics:** Vercel Analytics
- **Package Manager:** pnpm

## ✨ Features

- 🔐 **Authentication & Onboarding**
  - Email/password login and OAuth (GitHub, Google)
  - Password reset and recovery
  - Profile onboarding and settings management

- 🧠 **AI Assistance (Groq)**
  - AI chat for project planning and Q&A
  - Project plan generation with task breakdowns and recommendations

- 📋 **Project Workspace**
  - Create, update, and delete projects
  - Task tracking with status updates
  - Resource links per project

- 📊 **Dashboard Experience**
  - Project/task stats and activity snapshots
  - Responsive layouts with animated transitions

- 🎨 **Modern UI/UX**
  - Dark mode via `next-themes`
  - Radix-based UI primitives
  - Toast notifications

## 📁 Project Structure

```
ForgeMancer/
├── app/                    # Next.js App Router
│   ├── actions/            # Server actions (projects, profile, chat)
│   ├── api/                # API routes
│   ├── auth/               # OAuth callback
│   ├── dashboard/          # Authenticated dashboard pages
│   ├── login/              # Login
│   ├── signup/             # Signup
│   ├── onboarding/         # Onboarding
│   ├── forgot-password/    # Password recovery
│   └── reset-password/     # Password reset
├── components/             # Reusable UI components
│   └── ui/                 # Radix-based primitives
├── hooks/                  # Custom hooks
├── lib/                    # Supabase + Groq clients, utils
├── styles/                 # Global styles
├── types/                  # TypeScript + Supabase types
├── public/                 # Static assets
└── proxy.ts                # Supabase auth proxy helper
```

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YadneshTeli/ForgeMancer. git
   cd ForgeMancer
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
  Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
  SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
  GROQ_API_KEY=your_groq_api_key
   ```
  Optional server-side fallbacks (used if public vars are not set):
  ```env
  SUPABASE_URL=your_supabase_url
  SUPABASE_ANON_KEY=your_supabase_anon_key
  ```

4. **Run the development server**
   ```bash
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📦 Available Scripts

- `pnpm dev` - Start the development server
- `pnpm build` - Build the production application
- `pnpm start` - Start the production server
- `pnpm lint` - Run ESLint for code quality checks

## 🌐 Deployment

Your project is live at: 

**[https://vercel.com/yadnesh-telis-projects/v0-forgemancer](https://vercel.com/yadnesh-telis-projects/v0-forgemancer)**

## 🔄 How It Works

1. Create and modify your project using [v0.app](https://v0.app)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository

## 🏗️ Build your app

Continue building your app on: 

**[https://v0.app/chat/projects/UG7JkK4tyn8](https://v0.app/chat/projects/UG7JkK4tyn8)**

## 📊 Analytics

This project includes Vercel Analytics for performance monitoring and user insights. 

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is private and proprietary. 

## 👤 Author

**Yadnesh Teli**
- GitHub: [@YadneshTeli](https://github.com/YadneshTeli)

---

Built with ❤️ using [v0.app](https://v0.app) and deployed on [Vercel](https://vercel.com)
