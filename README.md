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
   VITE_API_URL=your_api_url_here
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
- `npm run cap:sync`: Build the web app and synchronize assets with Capacitor Android.
- `npm run android:build`: Build a local debug APK.
- `npm run android:open`: Open the Android project in Android Studio.

### Android APK via GitHub Actions

The repository includes a workflow at `.github/workflows/android-apk.yml`. It runs on pushes to `main` and can also be started manually from the **Actions** tab using **Build Android APK → Run workflow**.

The workflow builds a debug APK and publishes it as an artifact named `chatgram-debug-apk-<commit-sha>`. Download the artifact from the completed workflow run, extract `app-debug.apk`, and install it on an Android device for testing. A repository variable named `VITE_API_URL` may be configured if the CI build must use an API URL different from the checked-in environment template.

The debug APK is intended for testing and is not a Play Store release. Production release signing should use a protected Android keystore stored in GitHub Actions secrets and must not be committed to the repository.

---

## 🔒 Security
- All sensitive information is handled through environment variables.
- Authentication utilizes JWT stored securely in cookies.
- Input validation is enforced strictly using Zod schemas.

---

## 📄 License
This project is private and proprietary.

---

## 📱 Android (Capacitor)

Проект обёрнут в Capacitor — папка `android/` содержит нативный Android-проект.

### Локальная сборка

```bash
npm install
npm run cap:sync        # vite build + copy web assets + cap sync android
npm run cap:open        # открыть проект в Android Studio
# либо собрать APK из консоли:
npm run android:build   # соберёт web + assembleDebug
```

Debug-APK появится в `android/app/build/outputs/apk/debug/app-debug.apk`.

### Сборка APK через GitHub Actions

Workflow `.github/workflows/build-apk.yml` собирает APK автоматически:

- **push в `main` / PR / вручную (`workflow_dispatch`)** → собирает **debug APK**, кладёт как артефакт `chatgram-debug-apk`
- **push тега `v*` (например `v1.0.0`)** → собирает **release APK** и прикрепляет его к GitHub Release

Перед запуском в Settings → Secrets and variables → Actions добавь:

**Variables** (адрес твоего бэкенда, зашивается в сборку):
- `VITE_API_URL` — например `https://api.example.com/api`
- `VITE_WS_URL` — например `https://api.example.com`

**Secrets** (нужны только для подписанного release-APK по тегу; если не заданы — release соберётся с debug-подписью):
- `ANDROID_KEYSTORE_BASE64` — содержимое `.keystore`/`.jks`, закодированное в base64 (`base64 -w0 release.keystore`)
- `ANDROID_KEYSTORE_PASSWORD`
- `ANDROID_KEY_ALIAS`
- `ANDROID_KEY_PASSWORD`

Готовый APK скачивается на вкладке **Actions → выбранный запуск → Artifacts**, либо со страницы **Releases** для тегов.
