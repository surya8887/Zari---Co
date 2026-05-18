import prisma from "../../../config/db.js";
import ApiError from "../../../shared/exceptions/apiError.js";
import path from "path";
import fs from "fs/promises";
import { getProductById } from "./product.services.js";

// Upload and register multiple image entries in DB
export const createProductImages = async (productId: string, files: Express.Multer.File[]) => {
  try {
    // 1. Verify parent product exists
    await getProductById(productId);

    if (files.length === 0) {
      throw new ApiError(400, "No image files provided for upload");
    }

    // 2. Check if product already has a primary cover image
    const currentPrimary = await prisma.productImage.findFirst({
      where: { productId, isPrimary: true }
    });

    const hasPrimary = !!currentPrimary;

    // 3. Map uploaded files to ProductImage records
    const images = await Promise.all(
      files.map(async (file, idx) => {
        // Automatically make the first image primary if there are no existing ones
        const isPrimary = !hasPrimary && idx === 0;

        return prisma.productImage.create({
          data: {
            productId,
            imageUrl: `/uploads/${file.filename}`,
            altText: (file.originalname.split(".")[0] || "product-image").replace(/[-_]+/g, " "),
            isPrimary,
            sortOrder: idx
          }
        });
      })
    );

    return images;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, `Failed to register product images: ${error instanceof Error ? error.message : "Database error"}`);
  }
};

// Physically delete an image file and remove DB record
export const deleteProductImage = async (id: string) => {
  try {
    // 1. Retrieve the image record
    const image = await prisma.productImage.findUnique({
      where: { id }
    });

    if (!image) {
      throw new ApiError(404, "Product image not found in database");
    }

    // 2. Resolve local filesystem path and physically remove the file
    const filename = path.basename(image.imageUrl);
    const localPath = path.join(process.cwd(), "public", "uploads", filename);

    try {
      await fs.unlink(localPath);
      console.log(`Physically deleted: ${localPath} ✦`);
    } catch (fsError) {
      // Log warning but proceed to delete row if file was already unlinked or missing
      console.warn(`Asset file missing on disk: ${localPath}`, fsError);
    }

    // 3. Delete database record
    await prisma.productImage.delete({
      where: { id }
    });

    // 4. Relational safeguard: If we deleted the primary cover, auto-promote the next available image
    if (image.isPrimary) {
      const nextAvailable = await prisma.productImage.findFirst({
        where: { productId: image.productId },
        orderBy: { sortOrder: "asc" }
      });

      if (nextAvailable) {
        await prisma.productImage.update({
          where: { id: nextAvailable.id },
          data: { isPrimary: true }
        });
        console.log(`Auto-promoted sibling image to primary cover: ${nextAvailable.imageUrl} ✦`);
      }
    }

    return image;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, `Failed to delete product image: ${error instanceof Error ? error.message : "Database error"}`);
  }
};

// Toggle an image as the primary cover thumbnail
export const setPrimaryImage = async (id: string) => {
  try {
    const targetImage = await prisma.productImage.findUnique({
      where: { id }
    });

    if (!targetImage) {
      throw new ApiError(404, "Product image not found");
    }

    // 1. Reset all images for this product to false
    await prisma.productImage.updateMany({
      where: { productId: targetImage.productId },
      data: { isPrimary: false }
    });

    // 2. Set target image as primary
    const updated = await prisma.productImage.update({
      where: { id },
      data: { isPrimary: true }
    });

    return updated;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, "Failed to toggle primary image cover");
  }
};
