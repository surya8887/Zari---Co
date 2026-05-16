# Zari & Co - Fullstack E-commerce Platform

Welcome to the Zari & Co monorepo. This project is a professional-grade e-commerce platform built with a modern modular architecture.

## 📁 Project Structure

This repository is divided into two main parts:

### 1. [Backend (Node.js + Express + Prisma)](./backend)
A modular Express application following Domain-Driven Design principles.
- **Modularity**: Each domain (Auth, Users, Catalog) has its own routes, controllers, services, and validation.
- **Database**: Prisma ORM with PostgreSQL.
- **Validation**: Zod-based request validation.
- **Security**: JWT-based authentication with refresh tokens and secure cookie handling.

### 2. [Frontend (React + Vite + Tailwind)](./frontend)
A feature-based React application designed for high maintainability.
- **Architecture**: Modular "Features" structure.
- **State Management**: Zustand with Zod schema validation.
- **UI**: Tailwind CSS with custom components.

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- PostgreSQL database

### 2. Backend Setup
```bash
cd backend
npm install
# Configure your .env (see backend/.env.example)
npx prisma db push
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
# Configure your .env (see frontend/.env.example)
npm run dev
```

## 📜 Documentation
- [Backend Documentation](./backend/README.MD)
- [Frontend Documentation](./frontend/README.md)
