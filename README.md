# CyberX Community Platform

A professional, secure community engagement and hiring platform built for the CyberX cybersecurity community. This project features a clean, calm, and professional UI designed for enterprise-grade usability.

## 🚀 Key Features

- **Professional UI**: A calm, dark-themed interface focused on clarity and usability (Next.js + Tailwind CSS).
- **Secure Registration**: robust multi-step form with conditional logic, rate limiting, and honeypot protection.
- **Admin Analytics**: A secure dashboard (`/hot_admin/dashboard`) for application management and filtering.
- **Enterprise Security**:
  - **HttpOnly Cookies**: Secure session management (no client-side tokens).
  - **Protected Routes**: Middleware-enforced checks for all admin paths.
  - **Secure Setup**: Admin creation protected by server-side secrets.
- **Production Ready**: Optimized assets, removed legacy code, and Vercel-ready configuration.

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS (v4)
- **Database**: MongoDB (Mongoose)
- **Authentication**: Custom JWT (jose) with HttpOnly Cookies
- **Language**: JavaScript (ES6+)

## 📦 Getting Started

### 1. Installation

```bash
git clone <repository-url>
cd cyberx-community
npm install
```

### 2. Environment Configuration

Create a `.env.local` file in the root directory:

```env
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/cyberx
JWT_SECRET=your-super-strong-jwt-secret-key-at-least-32-chars
SETUP_SECRET=your-private-setup-key-for-admin-creation
```

### 3. Running Locally

```bash
npm run dev
```
Visit [http://localhost:3000](http://localhost:3000) for the public form.

### 4. Admin Setup (First Run)

To create the initial admin account, you must trigger the protected setup API.

**Using curl or Postman:**
```bash
GET http://localhost:3000/api/setup-admin
Header: x-setup-secret: <your-SETUP_SECRET-from-env>
```

This will create a default admin using credentials configured in your environment variables.

**Note**: Ensure you change the password immediately after your first login!

**Admin Login URL**: [http://localhost:3000/hot_admin](http://localhost:3000/hot_admin)

## 📁 Project Structure

```
src/
├── app/
│   ├── api/                    # Secure API Routes
│   │   ├── applications/       # Form submission & retrieval
│   │   ├── auth/               # Login & Secure Logout
│   │   └── setup-admin/        # Protected Admin Creation
│   ├── hot_admin/              # Admin Panel (Protected)
│   ├── globals.css             # Tailwind Theme Config
│   └── page.jsx                # Public Registration Form
├── lib/                        # DB Connection & Utils
├── models/                     # Mongoose Schemas
└── middleware.js               # Edge Middleware for Auth
```

## 🔒 Security Features implemented

- **Middleware Protection**: All routes under `/hot_admin` are intercepted at the edge.
- **No Client Secrets**: Authentication state is maintained via `HttpOnly` cookies, inaccessible to XSS attacks.
- **Strict Logout**: Server-side endpoint `/api/auth/logout` forcefully clears sessions.
- **Input Validation**: Strict typing and conditional logic in forms.
- **Clean Codebase**: All debug logs and legacy styles removed for production safety.

## 🚀 Deployment

This project is optimized for deployment on **Vercel**.
See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed step-by-step production deployment instructions.

---
© 2026 CyberX Community
