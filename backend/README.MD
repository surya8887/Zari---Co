# Zari & Co Backend API

A robust, scalable, and production-ready RESTful API backend for the Zari & Co premium e-commerce platform. Built with Node.js, Express, TypeScript, and Prisma ORM backed by PostgreSQL.

---

## 🚀 Tech Stack

- **Runtime Engine:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Validation:** Zod
- **Authentication:** JWT (JSON Web Tokens) with HttpOnly Cookies & bcrypt
- **Logging:** Pino
- **File Processing:** Multer for secure multipart uploads

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your local machine:

- Node.js (v18 or higher recommended)
- npm (Node Package Manager)
- PostgreSQL (Running locally or a cloud instance)

---

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
```

---

## 🛣️ API Endpoints Summary

### 🔑 Authentication Module (`/api/v1/auth`)
- `POST /register`: Registers a new user account with hashed passwords.
- `POST /login`: Authenticates credentials and issues HttpOnly Cookies.
- `POST /refresh-token`: Rotates access tokens securely.
- `POST /logout`: Clears HttpOnly cookies and terminates session tokens.

### 👥 Users Module (`/api/v1/users`)
- `GET /`: Lists all users (Admin only).
- `GET /:id`: Retrieves profile details for a specific user.
- `DELETE /:id`: Deletes a user profile (Admin only).

### 🏠 Address Book Sub-Module (`/api/v1/users/address`)
- `POST /address`: Creates a new shipping/billing address. Automatically enforces the **Single Default Address** rule.
- `GET /address`: Retrieves all active addresses for the authenticated user.
- `GET /address/:id`: Gets details for a specific address.
- `PUT /address/:id`: Updates an address, handles default resets.
- `DELETE /address/:id`: Safely unlinks and deletes an address. Promotes the next available sibling to default automatically if the deleted one was default.

### 💍 Catalog Module (`/api/v1/catalog`)
- `GET /product`: Lists all products in the catalogue.
- `POST /product`: Creates a new product catalog item.
- `PUT /product/:id`: Updates a product's text and rich parameters.
- `DELETE /product/:id`: Unlinks a product record.

### 🖼️ Product Media Sub-Module (`/api/v1/catalog/product/:productId/images`)
- `POST /product/:productId/images`: Uploads multiple images (supports up to 10 files simultaneously) via secure **Multer** middlewares. Validates against size limits (max 10MB) and image types (`JPEG, PNG, WEBP, GIF`).
- `DELETE /image/:id`: Deletes an image record from PostgreSQL and unlinks the physical asset from the local disk. Promotes the next available sibling if the deleted cover was primary.
- `PUT /image/:id/primary`: Instantly updates and marks the selected asset as the main primary thumbnail cover.

### 🧬 Product Variant Sub-Module (`/api/v1/catalog`)
- `POST /product/:productId/variants`: Creates a new product variant. Executes a transactional query that automatically initializes matching, zero-stock **Inventory** rows in PostgreSQL.
- `GET /product/:productId/variants`: Lists all variants for a specific product alongside active inventory levels.
- `GET /variant/:id`: Retrieves specific variant details (includes nested product references and stock summaries).
- `PUT /variant/:id`: Updates variant attributes, names, price overrides, and active statuses.
- `DELETE /variant/:id`: Safely unlinks and deletes a variant, cascading physical and inventory unlinks safely.

---

## 📁 Project Structure

The project follows a modular, feature-based architecture for maintainability and scalability.

```text
src/
├── config/           # Environment and database configuration (e.g., db.ts, env.ts, logger.ts)
├── modules/          # Feature-based modules
│   ├── auth/         # Authentication logic (controllers, routes, services, validation)
│   ├── users/        # User management and Address Book logic
│   └── catalog/      # Catalog, categories, and Multer Media Upload controllers
├── shared/           # Shared utilities and core application logic
│   ├── exceptions/   # Custom error classes and API response formatter
│   ├── middlewares/  # Express middlewares (auth, error handling, Multer filters)
│   └── utils/        # Helper functions (asyncHandler, cookie utilities, token helpers)
├── app.ts            # Express application setup and route mounting
└── server.ts         # Entry point and server initialization
```

---

## 🔒 Security & Best Practices

- **Authentication:** Uses short-lived Access Tokens and long-lived Refresh Tokens securely stored in `HttpOnly`, `Secure`, and `SameSite=Strict` cookies to mitigate XSS and CSRF attacks.
- **Input Validation:** Strict runtime type-checking and payload validation using Zod schemas at the controller level.
- **Centralized Error Handling:** All asynchronous routes are wrapped in an `asyncHandler` that catches exceptions and forwards them to a centralized `errorMiddleware`, ensuring predictable and structured API responses.
- **Role-Based Access Control (RBAC):** Route-level middleware to enforce granular permissions (e.g., `authenticateUser`, `authenticateAdmin`, `authenticateSuperAdmin`).
- **Route Masking Prevention:** Express route definitions order static directories (such as `/address` sub-paths) before dynamic parameters (`/:id`) to prevent parameter shadowing.

---

## 📜 Available Scripts

- `npm run dev`: Starts the server using `nodemon` and `ts-node` for local development.
- `npm run build`: Compiles the TypeScript source code into plain JavaScript in the `dist/` folder.
- `npm run start`: Runs the compiled JavaScript code (suitable for production).
- `npm run watch`: Runs the TypeScript compiler in watch mode.

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
