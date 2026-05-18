# 💎 Zari & Co — Admin Portal

Welcome to the **Zari & Co Admin Portal**. This modern, high-performance web console serves as the administrative core of the Zari & Co luxury jewelry platform, enabling the management of products, inventory stock levels, order fulfillments, and customer analytics.

Built using a state-of-the-art frontend stack incorporating **React 19**, **Vite**, **TypeScript**, **Tailwind CSS v4**, **shadcn/ui**, **Zustand**, and **Zod**, the dashboard is optimized for fluid visual performance, type safety, and efficient development.

---

## ⚡ Tech Stack & Tools

| Technology | Category | Purpose | Key Benefit |
| :--- | :--- | :--- | :--- |
| **React 19** | Core Framework | Component architecture & state synchronization | Next-gen React Compiler, optimized render loops |
| **Vite 8** | Build System | Hot Module Replacement (HMR) & build bundling | Insanely fast start times and sub-millisecond hot reloads |
| **TypeScript 6** | Lang Runtime | Compile-time static type-safety | Avoids runtime type crashes, rich autocompletion |
| **Tailwind CSS v4** | Design Engine | Utility-first styling & styling token variables | CSS-first configuration, ultra-fast `@tailwindcss/vite` compiling |
| **shadcn/ui** | UI Primitives | Accessible and modular Radix component primitives | Beautiful, accessible, fully customizable dashboard components |
| **Zustand 5** | State Engine | Application-wide global stores | Extremely lightweight, hook-based, zero-boilerplate state |
| **Zod 4** | Schema Engine | Input form schemas and runtime data validations | Type-safe inference of schema formats and user input |
| **Geist Sans** | Typography | High-end variable font aesthetic | Premium, modern visual tone of the Zari & Co brand |

---

## 📂 Project Architecture

The workspace is organized into highly modular, clean directories that separate concerns:

```
admin/
├── public/                  # Static assets that bypass the bundle loader
├── src/
│   ├── api/                 # Axios/Fetch client queries and API request endpoints
│   │   ├── productApi.ts    # Product catalogue and inventory fetches
│   │   └── orderApi.ts      # Transactional order data queries
│   │
│   ├── components/          # Reusable presentation ("dumb") components
│   │   ├── ui/              # shadcn/ui Radix component primitives (e.g., Button)
│   │   ├── common/          # Custom shared UI parts (e.g. Modals, Inputs)
│   │   └── charts/          # Analytics data visualization cards
│   │
│   ├── context/             # React context providers for standard states
│   │   └── AuthContext.tsx  # User session verification & login/logout state
│   │
│   ├── hooks/               # Custom React lifecycle hooks
│   │   ├── useAuth.ts       # Simplifies accessing global authentication context
│   │   └── useFetch.ts      # Generic hook for handling loader/error states during GET fetches
│   │
│   ├── layouts/             # Dashboard shell structures
│   │   └── AdminLayout.tsx  # Layout template with sidebar and top navigation bars
│   │
│   ├── pages/               # Top-level "smart" routing pages
│   │   ├── Dashboard/       # Overview panel showcasing shop metrics
│   │   ├── Products/        # Listing sheet for catalogue management
│   │   ├── Orders/          # Customer order monitoring interface
│   │   └── Login/           # Admin sign-in forms
│   │
│   ├── store/               # Zustand global state configurations
│   │   └── index.ts         # Global app-wide theme and layout settings store
│   │
│   ├── utils/               # Formatting helper utilities
│   │   ├── formatCurrency.ts# Converts numbers to formatted currencies (e.g., $1,250.00)
│   │   └── formatDate.ts    # Localizes raw date strings into readable text
│   │
│   ├── App.tsx              # Main routing connector and app container
│   ├── index.css            # Entry point for Tailwind CSS v4 variables & base styles
│   └── main.tsx             # Application entrypoint mounting React to DOM
├── tsconfig.json            # Base path-mapping compiler options
├── tsconfig.app.json        # Main TypeScript compiler rules
├── vite.config.ts           # Vite compile plugins and alias resolvers configuration
└── package.json             # NPM package scripts and lists
```

---

## 🚀 Getting Started

### 1. Prerequisite Installations
Ensure you have **Node.js (v18.x or above)** and **npm** installed on your machine.

### 2. Install Project Dependencies
Run this command at the root of the `/admin` directory to restore all libraries:
```bash
npm install --legacy-peer-deps
```

### 3. Run Development Server
Start the local server with instant HMR compilation:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser to view the application.

### 4. Create Production Build
Generate an optimized static production bundle in `/dist` along with full TypeScript compilation checks:
```bash
npm run build
```

---

## 🎨 Component Development Recipes

Here are quick-reference development guides to help you maintain clean, standard practices when adding features:

### 1. Adding shadcn/ui Components
Since we use Tailwind CSS v4, use the next-generation canary CLI to download and scaffold components instantly:
```bash
npx shadcn@canary add <component-name>
```
*Example:*
```bash
npx shadcn@canary add dialog dropdown-menu input
```

### 2. Creating custom Zustand Stores
Keep global stores focused on one domain and place them inside `src/store/`:
```typescript
import { create } from "zustand";

interface CategoryStore {
  selectedCategory: string;
  setCategory: (category: string) => void;
}

export const useCategoryStore = create<CategoryStore>((set) => ({
  selectedCategory: "All",
  setCategory: (category) => set({ selectedCategory: category }),
}));
```

### 3. Creating a Zod Schema
Create validation schemas for APIs and user forms inside a dedicated file or directly in the page:
```typescript
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please provide a valid administrative email"),
  password: z.string().min(8, "Password must contain at least 8 characters"),
});

export type LoginInput = z.infer<typeof loginSchema>;
```

---

## 📐 Best Practices & Coding Standards

*   **Extensions**: Always use `.ts` for standard modules/utilities and `.tsx` for components containing React rendering logic.
*   **Path Aliases**: Make all imports absolute using the `@/` prefix (configured to map directly to `src/`).
    *   *Correct:* `import { Button } from "@/components/ui/button";`
    *   *Incorrect:* `import { Button } from "../../components/ui/button";`
*   **Styling**: Use utility Tailwind CSS classes. For custom tokens, utilize the CSS variables block defined in `src/index.css` inside the `@theme` block.
*   **TypeScript Types**: Keep schemas, network models, and parameter formats strictly typed. Avoid the `any` keyword to preserve full compiler safety.
