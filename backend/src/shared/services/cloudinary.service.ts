import { cloudinary } from "../../config/cloudinary.config.js";
import fs from "fs/promises";
import logger from "../../config/logger.js";

export interface CloudinaryUploadResult {
  secureUrl: string;
  publicId: string;
}

/**
 * Extracts Cloudinary public ID from absolute image URL
 */
export const extractPublicIdFromUrl = (url: string): string | null => {
  if (!url) return null;

  // Search for "/zari-co/products/" pattern
  const matches = url.match(/\/zari-co\/products\/[^/.]+/);
  if (matches && matches[0]) {
    return matches[0].substring(1); // removes leading slash
  }

  // Fallback pattern matching
  const parts = url.split("/upload/");
  if (parts.length > 1 && parts[1]) {
    const assetPath = parts[1].replace(/^v\d+\//, ""); // strips version (e.g. v16434857/)
    const dotIndex = assetPath.lastIndexOf(".");
    if (dotIndex !== -1) {
      return assetPath.substring(0, dotIndex);
    }
    return assetPath;
  }

  return null;
};

/**
 * Uploads a local file to Cloudinary and deletes it from local temp afterwards
 */
export const uploadToCloudinary = async (
  localFilePath: string,
  fileName?: string
): Promise<CloudinaryUploadResult> => {
  try {
    const sanitizedPublicId = fileName
      ? fileName.split(".")[0]?.toLowerCase().replace(/[^a-z0-9]+/g, "-")
      : undefined;

    const uploadOptions: any = {
      folder: "zari-co/products",
      overwrite: true,
      resource_type: "auto",
    };

    if (sanitizedPublicId) {
      uploadOptions.public_id = sanitizedPublicId;
    }

    const result = await cloudinary.uploader.upload(localFilePath, uploadOptions);

    // Fire-and-forget: clean up local temp file as soon as upload succeeds
    try {
      await fs.unlink(localFilePath);
    } catch (err) {
      logger.warn(`Could not unlink local temp file: ${localFilePath}`);
    }

    return {
      secureUrl: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    // If the upload fails, we must STILL clean up the local temp file to avoid disk leaks
    try {
      await fs.unlink(localFilePath);
    } catch (err) {
      logger.warn(`Failed to clean up temp file after upload failure: ${localFilePath}`);
    }
    throw new Error(`Cloudinary upload failure: ${error instanceof Error ? error.message : String(error)}`);
  }
};

/**
 * Purges an asset from Cloudinary storage
 */
export const deleteFromCloudinary = async (imageUrl: string): Promise<boolean> => {
  const publicId = extractPublicIdFromUrl(imageUrl);
  if (!publicId) {
    logger.warn(`Could not extract publicId from URL: ${imageUrl}, skipping Cloudinary deletion.`);
    return false;
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId);
    if (result.result === "ok") {
      logger.info(`Purged asset from Cloudinary: ${publicId} ✦`);
      return true;
    }
    logger.warn(`Cloudinary destroy returned unexpected status: ${JSON.stringify(result)}`);
    return false;
  } catch (error) {
    logger.error(`Failed to delete asset from Cloudinary: ${publicId}`);
    return false;
  }
};
