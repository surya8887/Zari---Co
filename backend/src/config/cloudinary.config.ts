import { v2 as cloudinary } from "cloudinary";
import env from "./env.js";

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME.trim().replace(/^['"]|['"]$/g, ""),
  api_key: env.CLOUDINARY_API_KEY.trim().replace(/^['"]|['"]$/g, ""),
  api_secret: env.CLOUDINARY_API_SECRET.trim().replace(/^['"]|['"]$/g, ""),
});

export { cloudinary };
