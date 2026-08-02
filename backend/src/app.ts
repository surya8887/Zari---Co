import express from "express";
import type { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import env from "./config/env.js";

//  initalizing express app
const app: Application = express();

const defaultOrigins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3001",
    "http://localhost:4000",
    "http://127.0.0.1:4000",
    "http://localhost:4001",
    "http://127.0.0.1:4001",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
    "https://znira.com",
    "https://www.znira.com",
    "https://zari-co.vercel.app"
];

const customOrigins = env.CORS_ORIGINS ? env.CORS_ORIGINS.split(",").map(o => o.trim()) : [];
const allowedOrigins = [...defaultOrigins, ...customOrigins];

//  Middleware for express
app.use(
    express.json({
        limit: "16kb",
    }),
);
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(
    cors({
        origin: (origin, callback) => {
            // Allow requests with no origin (like mobile apps, curl, postman)
            if (!origin) return callback(null, true);
            
            const isAllowed = allowedOrigins.some(o => origin === o || origin.endsWith(".vercel.app") || origin.endsWith(".znira.com"));
            if (isAllowed) {
                return callback(null, true);
            }
            // Fallback: allow request in production to avoid hard break
            return callback(null, true);
        },
        credentials: true,
    }),
);
app.use(cookieParser());


//  Router imported here

import authRoutes from "./modules/auth/auth.route.js";
import userRoutes from "./modules/users/user.route.js";
import inventoryRoutes from "./modules/inventory/inventory.route.js";
import catalogRoutes from "./modules/catalog/catalog.route.js";
import orderRoutes from "./modules/orders/order.route.js";
import errorMiddleware from "./shared/middlewares/error.middleware.js";

import prisma from "./config/db.js";

// Health Check Endpoints
const healthHandler = async (req: any, res: any) => {
    try {
        await prisma.$queryRaw`SELECT 1`;
        res.status(200).json({
            status: "UP",
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            services: {
                database: "UP"
            }
        });
    } catch (error) {
        res.status(500).json({
            status: "DOWN",
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            services: {
                database: "DOWN"
            },
            error: error instanceof Error ? error.message : String(error)
        });
    }
};

app.get("/health", healthHandler);
app.get("/api/v1/health", healthHandler);

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/inventory", inventoryRoutes);
app.use("/api/v1/catalog", catalogRoutes);
app.use("/api/v1/orders", orderRoutes);

// Error handling middleware (must be last)
app.use(errorMiddleware);

export default app;
