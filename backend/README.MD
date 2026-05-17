# Zari & Co Backend API

A robust, scalable, and production-ready RESTful API backend for the Zari & Co e-commerce platform. Built with Node.js, Express, TypeScript, and Prisma ORM backed by PostgreSQL.

## 🚀 Tech Stack

- **Runtime Engine:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Validation:** Zod
- **Authentication:** JWT (JSON Web Tokens) with HttpOnly Cookies & bcrypt
- **Logging:** Pino

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your local machine:

- Node.js (v18 or higher recommended)
- npm (Node Package Manager)
- PostgreSQL (Running locally or a cloud instance)

## 🛠️ Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env` file in the root directory and configure the following variables based on your setup:

```env
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://user:password@localhost:5432/zari_co?schema=public"

# JWT Configuration
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
ACCESS_TOKEN_EXPIRES=15m
REFRESH_TOKEN_EXPIRES=7d
```

### 4. Database Setup

Run Prisma migrations to synchronize your database schema and generate the Prisma Client:

```bash
npx prisma generate
npx prisma db push # Or prisma migrate dev
```

### 5. Running the Application

**Development Mode (with hot-reloading):**
```bash
npm run dev
```

**Watch Mode (TypeScript compiler):**
```bash
npm run watch
```

**Production Build:**
```bash
npm run build
npm run start
```

## 📁 Project Structure

The project follows a modular, feature-based architecture for maintainability and scalability.

```text
src/
├── config/           # Environment and database configuration (e.g., db.ts, env.ts, logger.ts)
├── modules/          # Feature-based modules
│   ├── auth/         # Authentication logic (controllers, routes, services, validation)
│   ├── users/        # User management logic
│   └── ...           # Other domain modules (catalog, orders, inventory, etc.)
├── shared/           # Shared utilities and core application logic
│   ├── exceptions/   # Custom error classes and API response formatter
│   ├── middlewares/  # Express middlewares (auth, error handling)
│   └── utils/        # Helper functions (asyncHandler, cookie utilities)
├── app.ts            # Express application setup and middleware registration
└── server.ts         # Entry point and server initialization
```

## 🔒 Security & Best Practices

- **Authentication:** Uses short-lived Access Tokens and long-lived Refresh Tokens securely stored in `HttpOnly`, `Secure`, and `SameSite=Strict` cookies to mitigate XSS and CSRF attacks.
- **Input Validation:** Strict runtime type-checking and payload validation using Zod schemas at the controller level.
- **Centralized Error Handling:** All asynchronous routes are wrapped in an `asyncHandler` that catches exceptions and forwards them to a centralized `errorMiddleware`, ensuring predictable and structured API responses.
- **Role-Based Access Control (RBAC):** Route-level middleware to enforce granular permissions (e.g., `authenticateUser`, `authenticateAdmin`, `authenticateSuperAdmin`).

## 📜 Available Scripts

- `npm run dev`: Starts the server using `nodemon` and `ts-node` for local development.
- `npm run build`: Compiles the TypeScript source code into plain JavaScript in the `dist/` folder.
- `npm run start`: Runs the compiled JavaScript code (suitable for production).
- `npm run watch`: Runs the TypeScript compiler in watch mode.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
