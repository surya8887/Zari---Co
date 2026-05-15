import z from 'zod';
import { config } from "dotenv";
config();

const envSchema = z.object({
    PORT: z.string().min(4, "Port is too short"),
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    DATABASE_URL: z.string(),
    ACCESS_TOKEN_SECRET: z.string(),
    REFRESH_TOKEN_SECRET: z.string(),
    ACCESS_TOKEN_EXPIRES: z.string(),
    REFRESH_TOKEN_EXPIRES: z.string(),
});

const env = envSchema.parse(process.env);

export default env;
