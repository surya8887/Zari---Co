export interface Image { 
    imageUrl: string;
    altText: string;
    isPrimary: boolean;
    sortOrder: number;
}

export interface CreateCategory {
    name: string;
    slug?: string | undefined;
    description?: string | undefined;
    isPublished?: boolean | undefined;
    parentId?: string | undefined;
    sortOrder?: number | undefined;
}

export interface UpdateCategory {
    name?: string | undefined;
    slug?: string | undefined;
    description?: string | undefined;
    isPublished?: boolean | undefined;
    parentId?: string | undefined;
    sortOrder?: number | undefined;
}

export interface Product { 
    name: string;
    slug?: string;
    categoryId: string;
    description?: string;
    basePrice: number;
    sku: string;
    isPublished: boolean;
}

export interface ProductVariant { 
    id?: string;
    productId: string;
    name: string;
    sku: string;
    priceOverride: number;
    isActive: boolean;
    attributes: Record<string, unknown>;
}