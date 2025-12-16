# ForgeMancer

*Automatically synced with your [v0.app](https://v0.app) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/yadnesh-telis-projects/v0-forgemancer)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/projects/UG7JkK4tyn8)

## Overview

ForgeMancer is a modern full-stack web application built with Next.js 14, featuring a comprehensive authentication system and dashboard interface. The application leverages cutting-edge technologies to deliver a seamless user experience with real-time data visualization and AI-powered features.

## 🚀 Tech Stack

- **Framework:** Next.js 14.2.16 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS with custom animations
- **UI Components:** Radix UI primitives
- **Authentication:** Supabase Auth
- **Database:** Supabase
- **AI Integration:** Google Generative AI
- **Animations:** Framer Motion
- **Forms:** React Hook Form with Zod validation
- **Charts:** Recharts
- **Package Manager:** pnpm

## ✨ Features

- 🔐 **Complete Authentication Flow**
  - User login and signup
  - Password reset and recovery
  - Protected routes with middleware
  - Supabase authentication integration

- 📊 **Dashboard Interface**
  - Interactive data visualization
  - Real-time analytics
  - Responsive design

- 🎨 **Modern UI/UX**
  - Dark mode support via next-themes
  - Smooth animations with Framer Motion
  - Accessible components built with Radix UI
  - Toast notifications with Sonner

- 🤖 **AI-Powered Features**
  - Integration with Google Generative AI
  - Smart form validation and processing

- 📱 **Responsive Design**
  - Mobile-first approach
  - Adaptive layouts
  - Touch-optimized interactions

## 📁 Project Structure

```
ForgeMancer/
├── app/                    # Next.js app directory
│   ├── actions/           # Server actions
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard interface
│   ├── login/             # Login page
│   ├── signup/            # Signup page
│   ├── onboarding/        # User onboarding flow
│   ├── forgot-password/   # Password recovery
│   └── reset-password/    # Password reset
├── components/            # Reusable UI components
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions and configs
├── styles/                # Global styles and themes
├── types/                 # TypeScript type definitions
├── public/                # Static assets
└── middleware.ts          # Route protection and auth middleware
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
   Create a `.env.local` file in the root directory and add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   GOOGLE_GENERATIVE_AI_API_KEY=your_google_ai_key
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
