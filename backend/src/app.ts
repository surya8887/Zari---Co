import express from "express";
import type { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

//  initalizing express app
const app: Application = express();

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
        origin: [
            "http://localhost:4000",
            "http://127.0.0.1:4000",
            "http://localhost:4001",
            "http://127.0.0.1:4001",
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            "http://127.0.0.1:5174"
        ],
        credentials: true,
    }),
);
app.use(cookieParser());


//  Router imported here

import authRoutes from "./modules/auth/auth.route.js";
import userRoutes from "./modules/users/user.route.js";
import catalogRoutes from "./modules/catalog/catalog.route.js";
import errorMiddleware from "./shared/middlewares/error.middleware.js";

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/catalog", catalogRoutes);

// Error handling middleware (must be last)
app.use(errorMiddleware);

export default app;
