# 🗨️ Chatgram - Modern Messaging Platform

![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Tailwind](https://img.shields.io/badge/Tailwind-4.0-38B2AC?logo=tailwind-css)
![Vite](https://img.shields.io/badge/Vite-Rolldown-646CFF?logo=vite)

Chatgram is a high-performance, aesthetically pleasing chat application built with the latest web technologies. It provides a seamless real-time communication experience with a focus on speed, security, and user experience.

---

## ✨ Key Features

- **🔐 Secure Authentication**: Robust login and registration system with JWT-based security.
- **💬 Real-time Messaging**: Instant communication with a fluid, modern chat interface.
- **👤 User Management**: Personalized profiles and user-specific settings.
- 🌍 **Multi-language Support**: Built-in internationalization (i18n) supporting English, Russian, and Tajik.
- **🎨 Premium UI/UX**: Crafted with Tailwind CSS 4 and Framer Motion for smooth, interactive experiences.
- **📱 Fully Responsive**: Optimized for desktop, tablet, and mobile devices.
- **⚡ Performance First**: Powered by Vite (Rolldown) for lightning-fast development and optimized bundles.

---

## 🛠️ Technology Stack

### Core
- **React 19**: The latest React features for efficient UI building.
- **TypeScript**: Static typing for robust and maintainable code.
- **Vite (Rolldown)**: Next-generation build tool for exceptional performance.

### Styling & UI
- **Tailwind CSS 4**: A utility-first CSS framework for rapid UI development.
- **Framer Motion**: Industry-standard library for animations.
- **Radix UI**: High-quality, accessible primitive components.
- **Lucide & Phosphor Icons**: Beautifully crafted icon sets.

### State & Logic
- **TanStack Query (v5)**: Powerful data fetching and state management.
- **React Hook Form**: Performant, flexible forms with easy validation.
- **Zod**: TypeScript-first schema declaration and validation.
- **Axios**: Promised-based HTTP client for API requests.

### Utilities
- **i18next**: Comprehensive translation and localization system.
- **Sonner**: Sleek, customizable toast notifications.
- **js-cookie**: Lightweight JavaScript cookie management.

---

## 📂 Project Structure

```bash
src/
├── api/          # API services (Auth, Chat, User)
├── components/   # UI components, Layouts, Chat-specific components
├── i18n/         # Internationalization configurations
├── lib/          # Utilities, Providers, and shared logic
├── pages/        # Application pages (Auth, Chat, Profile, Home)
├── schemas/       # Zod validation schemas
├── types/         # TypeScript type definitions
└── App.tsx       # Main application routing and entry point
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (Latest LTS recommended)
- npm or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/sultonzoda2011/chatgram-frontend.git
   cd chatgram-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add your backend API URL:
   ```env
   VITE_API_BASE_URL=your_api_url_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

---

## 🛠️ Scripts

- `npm run dev`: Start the development server.
- `npm run build`: Build the application for production.
- `npm run lint`: Run ESLint for code analysis.
- `npm run preview`: Locally preview the production build.

---

## 🔒 Security
- All sensitive information is handled through environment variables.
- Authentication utilizes JWT stored securely in cookies.
- Input validation is enforced strictly using Zod schemas.

---

## 📄 License
This project is private and proprietary.
