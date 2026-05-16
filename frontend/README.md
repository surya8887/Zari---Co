# Zari & Co - Frontend

A professional, feature-based React application built with TypeScript, Vite, and Tailwind CSS. This project is designed for scalability and maintainability using a modular architecture.

## 🚀 Tech Stack

- **Framework**: [React 18](https://reactjs.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Validation**: [Zod](https://zod.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Routing**: [React Router v6](https://reactrouter.com/)
- **HTTP Client**: [Axios](https://axios-http.com/)

## 📂 Project Structure

The project follows a **Feature-Based Architecture**, where all logic related to a specific domain (like Auth, Products, Users) is encapsulated within its own feature folder.

```
src/
├── api/                # Global API configuration (Axios instance, interceptors)
├── app/                # Application-wide setup (Router, Providers)
├── components/         # Shared UI components (Common, UI, Forms, Layout)
├── features/           # Domain-driven feature modules (The core of the app)
│   ├── auth/           # Authentication feature
│   │   ├── components/ # Auth-specific components
│   │   ├── hooks/      # Auth-specific hooks (useAuth)
│   │   ├── pages/      # Auth pages (Login, Register)
│   │   ├── schemas/    # Zod validation schemas
│   │   ├── services/   # Auth API services
│   │   ├── store/      # Auth state management (Zustand)
│   │   └── types.ts    # Auth-specific types
├── hooks/              # Global custom hooks
├── layouts/            # Shared layouts (AuthLayout, DashboardLayout)
├── lib/                # Third-party library configurations (utils, constants)
├── pages/              # Static or top-level pages
├── routes/             # Route guards (ProtectedRoute, PublicRoute)
├── styles/             # Global styles and Tailwind config
├── types/              # Global TypeScript interfaces
└── utils/              # Generic utility functions
```

## 🔐 State Management & Validation

We use **Zustand** combined with **Zod** for robust state management. 

- **Zod Schemas**: Used for validating API responses and form inputs.
- **Strict State**: Before updating the global store (e.g., `authStore`), we validate the data against a Zod schema to ensure that only valid data enters the application state. This prevents "silent" bugs caused by unexpected API changes.

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root and add the backend URL:
   ```env
   VITE_API_URL=http://localhost:5000/api/v1
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## 🏗️ Development Guidelines

1. **Features First**: When adding a new module (e.g., Orders), create a new folder in `src/features/orders`.
2. **Component Library**: Use `src/components/ui` for small, reusable components (buttons, inputs) and `src/components/common` for larger shared components.
3. **Type Safety**: Always define Zod schemas for API responses and use `z.infer` to generate TypeScript types.
4. **Hooks over Logic**: Keep components thin by moving business logic into custom hooks within the feature's `hooks/` directory.
