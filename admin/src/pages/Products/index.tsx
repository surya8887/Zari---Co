import React, { useState, useEffect } from "react";
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Sparkles, 
  Save, 
  ChevronLeft, 
  Gem, 
  Info,
  Heart,
  Scale,
  FolderTree,
  Eye,
  EyeOff,
  Star,
  UploadCloud,
  Image as ImageIcon
} from "lucide-react";
import { useAppStore, type Product, type Category } from "@/store";
import { RichTextEditor } from "@/components/common/RichTextEditor";
import { FormField } from "@/components/common/FormField";
import { EmptyState } from "@/components/common/EmptyState";
import { ProductSchema, CategorySchema } from "@/utils/validation";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Products: React.FC = () => {
  const { 
    currentPage, 
    setCurrentPage, 
    products, 
    addProduct, 
    updateProduct, 
    deleteProduct,
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    collectionStory,
    updateCollectionStory,
    shippingNotes,
    updateShippingNotes,
    uploadProductImages,
    deleteProductImage,
    setPrimaryImage
  } = useAppStore();

  // Local state for Product Form
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("cat-rings");
  const [isPublished, setIsPublished] = useState(true);
  const [description, setDescription] = useState("");
  const [details, setDetails] = useState("");
  const [careInstructions, setCareInstructions] = useState("");

  // Local state for Multiple Files Upload
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [primaryIndex, setPrimaryIndex] = useState(0);
  const [uploading, setUploading] = useState(false);

  const [productErrors, setProductErrors] = useState<{
    name?: string;
    sku?: string;
    price?: string;
    description?: string;
    details?: string;
    careInstructions?: string;
    categoryId?: string;
  }>({});

  // Local state for Category Form
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  
  const [catName, setCatName] = useState("");
  const [catSlug, setCatSlug] = useState("");
  const [catParentId, setCatParentId] = useState<string>("");
  const [catDescription, setCatDescription] = useState("");
  const [catIsPublished, setCatIsPublished] = useState(true);
  
  const [categoryError, setCategoryError] = useState("");

  // Heritage Story Local State
  const [storyText, setStoryText] = useState(collectionStory);
  const [storyError, setStoryError] = useState("");

  // Shipping Notes Local State
  const [shippingText, setShippingText] = useState(shippingNotes);
  const [shippingError, setShippingError] = useState("");

  // Helper: Auto-generate slug from name in real-time
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "") // remove non-word chars
      .replace(/[\s_-]+/g, "-") // replace spaces and hyphens with a single hyphen
      .replace(/^-+|-+$/g, ""); // trim hyphens
  };

  // Sync slug whenever category name is modified
  const handleCatNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCatName(val);
    if (!isEditingCategory) {
      setCatSlug(generateSlug(val));
    }
  };

  // Synchronize state when sidebar routing page changes
  useEffect(() => {
    if (currentPage === "new-product") {
      setIsEditingProduct(false);
      setEditingProductId(null);
      setName("");
      setSku("");
      setPrice("");
      setCategoryId(categories[0]?.id || "cat-rings");
      setIsPublished(true);
      setDescription("");
      setDetails("");
      setCareInstructions("");
      setSelectedFiles([]);
      setPreviewUrls([]);
      setPrimaryIndex(0);
      setProductErrors({});
    }
  }, [currentPage, categories]);

  // Handle Product Edit action click
  const handleProductEdit = (product: Product) => {
    setIsEditingProduct(true);
    setEditingProductId(product.id);
    setName(product.name);
    setSku(product.sku);
    setPrice(product.price);
    setCategoryId(product.categoryId);
    setIsPublished(product.isPublished);
    setDescription(product.description);
    setDetails(product.details);
    setCareInstructions(product.careInstructions);
    setSelectedFiles([]);
    setPreviewUrls([]);
    setPrimaryIndex(0);
    setProductErrors({});
    
    setCurrentPage("products-list"); 
    
    toast.success(`Loaded rich text for: "${product.name}" ✦`, {
      description: "Pre-filled TinyMCE editor sections with catalog HTML."
    });
  };

  // Handle Product Delete action click
  const handleProductDelete = (id: string, productName: string) => {
    deleteProduct(id);
    toast.error(`Removed "${productName}" from jewelry catalog.`);
  };

  // Handle Category Edit action click
  const handleCategoryEdit = (cat: Category) => {
    setIsEditingCategory(true);
    setEditingCategoryId(cat.id);
    setCatName(cat.name);
    setCatSlug(cat.slug);
    setCatParentId(cat.parentId || "");
    setCatDescription(cat.description);
    setCatIsPublished(cat.isPublished);
    setCategoryError("");
    
    toast.success(`Loaded Category details: "${cat.name}" ✦`, {
      description: "Pre-filled category description narrative."
    });
  };

  // Handle Category Delete action click
  const handleCategoryDelete = (id: string, name: string) => {
    if (categories.length <= 1) {
      toast.warning("Broken Relational Bounds: At least one base category must exist.");
      return;
    }
    deleteCategory(id);
    toast.error(`Deleted category: "${name}"`, {
      description: "Products pointing to it are safely re-assigned to Solitaire Rings."
    });
    
    // Clear edit form if currently editing deleted item
    if (editingCategoryId === id) {
      handleCategoryCancel();
    }
  };

  // Cancel editing category
  const handleCategoryCancel = () => {
    setIsEditingCategory(false);
    setEditingCategoryId(null);
    setCatName("");
    setCatSlug("");
    setCatParentId("");
    setCatDescription("");
    setCatIsPublished(true);
    setCategoryError("");
  };

  // Image Selection & Instant Upload Helper Functions
  const handleLocalImageSelect = (files: FileList) => {
    const fileArray = Array.from(files);
    setSelectedFiles(prev => [...prev, ...fileArray]);
    
    const newUrls = fileArray.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newUrls]);
  };

  const handleLocalImageDelete = (idx: number) => {
    if (previewUrls[idx]) {
      URL.revokeObjectURL(previewUrls[idx]);
    }
    
    setSelectedFiles(prev => prev.filter((_, i) => i !== idx));
    setPreviewUrls(prev => prev.filter((_, i) => i !== idx));
    
    if (primaryIndex === idx) {
      setPrimaryIndex(0);
    } else if (primaryIndex > idx) {
      setPrimaryIndex(prev => prev - 1);
    }
  };

  const handleInstantImageUpload = async (files: FileList) => {
    if (!files || files.length === 0 || !editingProductId) return;
    setUploading(true);
    try {
      await uploadProductImages(editingProductId, Array.from(files));
    } finally {
      setUploading(false);
    }
  };

  // Submit Product Form (Create / Edit)
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const parsed = ProductSchema.safeParse({
      name: name.trim(),
      sku: sku.trim().toUpperCase(),
      price: price.trim(),
      description: (!description || description === "<p><br></p>") ? "" : description,
      details: (!details || details === "<p><br></p>") ? "" : details,
      careInstructions: (!careInstructions || careInstructions === "<p><br></p>") ? "" : careInstructions,
      isPublished,
      categoryId
    });

    if (!parsed.success) {
      const fieldErrors: any = {};
      parsed.error.issues.forEach((err: any) => {
        const path = err.path[0];
        if (path) {
          fieldErrors[path] = err.message;
        }
      });
      setProductErrors(fieldErrors);
      toast.warning("Validation Failed: Please fill out all required fields.", {
        description: parsed.error.issues[0]?.message
      });
      return;
    }

    const payload = {
      categoryId: parsed.data.categoryId,
      name: parsed.data.name,
      sku: parsed.data.sku,
      price: parsed.data.price,
      description: parsed.data.description,
      details: parsed.data.details,
      careInstructions: parsed.data.careInstructions,
      isPublished: parsed.data.isPublished
    };

    if (isEditingProduct && editingProductId !== null) {
      await updateProduct(editingProductId, payload);
      toast.success(`Successfully updated: "${name}" ✨`, {
        description: "Synchronized rich HTML data to store catalogs."
      });
      setIsEditingProduct(false);
      setEditingProductId(null);
    } else {
      const createdProduct = await addProduct(payload);
      if (createdProduct && selectedFiles.length > 0) {
        // Sort files so that the chosen primary cover is uploaded first
        let uploadFiles = [...selectedFiles];
        if (primaryIndex > 0 && primaryIndex < uploadFiles.length) {
          const primaryFile = uploadFiles[primaryIndex];
          uploadFiles.splice(primaryIndex, 1);
          uploadFiles.unshift(primaryFile);
        }
        await uploadProductImages(createdProduct.id, uploadFiles);
      }
      toast.success(`Added new piece: "${name}" ✦`, {
        description: "Registered rich content guides into house collections."
      });
      setCurrentPage("products-list");
    }

    // Reset Form Fields
    setName("");
    setSku("");
    setPrice("");
    setCategoryId(categories[0]?.id || "cat-rings");
    setIsPublished(true);
    setDescription("");
    setDetails("");
    setCareInstructions("");
    setSelectedFiles([]);
    setPreviewUrls([]);
    setPrimaryIndex(0);
    setProductErrors({});
  };

  // Submit Category Form (Create / Edit)
  const handleCategorySubmit = (e: React.FormEvent) => {
     e.preventDefault();
     
     const parsed = CategorySchema.safeParse({
       parentId: catParentId ? catParentId : undefined,
       name: catName.trim(),
       slug: catSlug.trim(),
       description: (!catDescription || catDescription === "<p><br></p>") ? "" : catDescription,
       isPublished: catIsPublished,
       sortOrder: 0
     });
 
     if (!parsed.success) {
       setCategoryError(parsed.error.issues[0]?.message || "Validation Error");
       toast.warning("Validation Error: Please fix category fields.", {
         description: parsed.error.issues[0]?.message
       });
       return;
     }
 
     const payload = {
       parentId: (parsed.data.parentId && parsed.data.parentId.trim() !== "") ? parsed.data.parentId : undefined,
       name: parsed.data.name,
       slug: parsed.data.slug,
       description: parsed.data.description,
       isPublished: parsed.data.isPublished,
       sortOrder: parsed.data.sortOrder
     };
 
     if (isEditingCategory && editingCategoryId !== null) {
       updateCategory(editingCategoryId, payload);
       toast.success(`Category Updated: "${catName}" ✨`, {
         description: "Updated database mappings and published settings."
       });
     } else {
       // Check for duplicate slug
       const isDuplicateSlug = categories.some(c => c.slug === payload.slug);
       if (isDuplicateSlug) {
         setCategoryError("Prisma Constraint Check: Duplicate slug. Please provide a unique slug URL.");
         toast.warning("Prisma Validation Error: Unique slug required.");
         return;
       }
       addCategory(payload);
       toast.success(`Category Created: "${catName}" ✦`, {
         description: "Added category UUID mappings for products."
       });
     }
 
     handleCategoryCancel();
   };

  // Submit Heritage Collections Story Form
  const handleStorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!storyText.trim() || storyText === "<p><br></p>") {
      setStoryError("Story narrative cannot be empty.");
      toast.warning("Validation Failed: Rich text story editor is empty.");
      return;
    }

    updateCollectionStory(storyText);
    setStoryError("");
    
    toast.success("Collections Story Updated! ✨", {
      description: "Heritage narrative synchronized to catalog brochures."
    });
  };

  // Submit Shipping / Inventory Notes Form
  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!shippingText.trim() || shippingText === "<p><br></p>") {
      setShippingError("Shipping notes and return rules are required.");
      toast.warning("Validation Failed: Rich text shipping guidelines are empty.");
      return;
    }

    updateShippingNotes(shippingText);
    setShippingError("");
    
    toast.success("Shipping & Return Guidelines Updated! 📍", {
      description: "Policy briefs updated across transaction nodes."
    });
  };

  // Render Category specific styling helper
  const getCategoryBadgeTheme = (id: string) => {
    switch (id) {
      case "cat-rings": return "text-primary bg-[#241e17] border-[#3b3227]";
      case "cat-necklaces": return "text-blue-400 bg-[#171e2c] border-[#252f44]";
      case "cat-earrings": return "text-[#a58b68] bg-[#241e17] border-[#3b3227]";
      case "cat-bracelets": return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
      default: return "text-muted-foreground bg-secondary/30 border-border";
    }
  };

  // ROUTER LOGIC FOR PAGES
  
  // 1. EDIT PRODUCT OR NEW PRODUCT FORM LAYOUT
  if (currentPage === "new-product" || isEditingProduct) {
    return (
      <div className="space-y-6 animate-in fade-in duration-200 text-left">
        {/* Header toolbar */}
        <div className="flex justify-between items-center border-b border-border/10 pb-4">
          <div className="flex items-center gap-3">
            {isEditingProduct && (
              <button 
                onClick={() => { setIsEditingProduct(false); setEditingProductId(null); }}
                className="w-8 h-8 rounded-lg border border-border bg-[#101216]/50 flex items-center justify-center hover:bg-secondary/40 text-foreground transition-all cursor-pointer"
                title="Go back"
              >
                <ChevronLeft size={16} />
              </button>
            )}
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground font-serif">
                {isEditingProduct ? `Edit Jewelry Piece: ${name}` : "Launch New Jewelry Collection"}
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                {isEditingProduct ? "Modify rich text GIA certificates and catalog files." : "Register new luxury pieces into GIA databases."}
              </p>
            </div>
          </div>
          
          <button 
            onClick={handleProductSubmit}
            className="flex items-center gap-1.5 bg-primary text-[#090a0f] px-5 py-2 rounded-lg text-xs font-bold hover:bg-primary/95 transition-all cursor-pointer shadow-[0_0_12px_rgba(197,168,128,0.25)] select-none"
          >
            <Save size={14} />
            Save Collection
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleProductSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT: Standard Text inputs & Publish Checkbox */}
          <div className="lg:col-span-1 space-y-6">
            <div className="rounded-xl border border-border bg-card p-6 space-y-4 h-fit">
              <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5 select-none">
                <Gem size={14} className="text-primary" />
                Product Specification
              </h3>
              
              {/* Name */}
              <FormField label="Piece Name" error={productErrors.name} required>
                <input 
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Elysian Diamond Ring"
                  className={cn(
                    "w-full px-3 py-2 text-xs border bg-[#0d0f14]/50 rounded-lg text-foreground focus:outline-none",
                    productErrors.name ? "border-rose-500 ring-1 ring-rose-500/20" : "border-border focus:border-primary/50"
                  )}
                />
              </FormField>

              {/* SKU & Price */}
              <div className="grid grid-cols-2 gap-4">
                {/* SKU */}
                <FormField label="Catalogue SKU" error={productErrors.sku} required>
                  <input 
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="e.g. ELY-004"
                    className={cn(
                      "w-full px-3 py-2 text-xs border bg-[#0d0f14]/50 rounded-lg text-foreground focus:outline-none uppercase",
                      productErrors.sku ? "border-rose-500 ring-1 ring-rose-500/20" : "border-border focus:border-primary/50"
                    )}
                  />
                </FormField>

                {/* Price */}
                <FormField label="Price (USD)" error={productErrors.price} required>
                  <input 
                    type="text"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g. 28450.30"
                    className={cn(
                      "w-full px-3 py-2 text-xs border bg-[#0d0f14]/50 rounded-lg text-foreground focus:outline-none",
                      productErrors.price ? "border-rose-500 ring-1 ring-rose-500/20" : "border-border focus:border-primary/50"
                    )}
                  />
                </FormField>
              </div>

              {/* Dynamic DB Category Selector */}
              <FormField label="Jewelry Type (Dynamic Categories)" error={productErrors.categoryId} required>
                <select 
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-border bg-[#0d0f14] rounded-lg text-foreground focus:outline-none focus:border-primary/50 cursor-pointer"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name} {cat.parentId ? `(Subcategory)` : ""}
                    </option>
                  ))}
                </select>
              </FormField>

              {/* Publish Checkbox mapping the schema's isPublished */}
              <div className="border-t border-border/40 pt-4 mt-2">
                <div className="flex items-center gap-2 select-none cursor-pointer">
                  <input 
                    type="checkbox"
                    id="prodIsPublished"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="w-4 h-4 rounded border-border bg-[#0d0f14] text-primary focus:ring-primary/20 accent-[#c5a880] cursor-pointer"
                  />
                  <label htmlFor="prodIsPublished" className="text-xs font-semibold text-foreground cursor-pointer flex items-center gap-1.5 select-none">
                    {isPublished ? <Eye size={13} className="text-primary" /> : <EyeOff size={13} className="text-muted-foreground" />}
                    Publish to Boutique Catalogue
                  </label>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1.5 leading-relaxed pl-6">
                  If checked, the jewelry piece is published instantly. Otherwise, it remains saved as an admin draft.
                </p>
              </div>
            </div>

            {/* Product Media Gallery Card */}
            <div className="rounded-xl border border-border bg-card p-6 space-y-4 h-fit">
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5 select-none">
                <ImageIcon size={14} className="text-primary" />
                Product Media Gallery
              </h3>
              
              {/* Uploader Box */}
              <div 
                className="border-2 border-dashed border-border/80 hover:border-primary/50 transition-all rounded-lg p-6 text-center cursor-pointer bg-[#0d0f14]/50 group"
                onClick={() => document.getElementById("productImageFileInput")?.click()}
              >
                <input 
                  type="file"
                  id="productImageFileInput"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const files = e.target.files;
                    if (!files || files.length === 0) return;
                    if (isEditingProduct) {
                      handleInstantImageUpload(files);
                    } else {
                      handleLocalImageSelect(files);
                    }
                  }}
                />
                
                <UploadCloud className="mx-auto text-muted-foreground group-hover:text-primary transition-colors mb-2" size={28} />
                <p className="text-[11px] font-semibold text-foreground">Drag & drop or click to upload</p>
                <p className="text-[9px] text-muted-foreground mt-1">JPEG, PNG, WEBP, or GIF (max 10MB per file)</p>
              </div>

              {uploading && (
                <div className="flex items-center justify-center gap-2 text-xs font-semibold text-primary py-2">
                  <span className="w-2.5 h-2.5 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
                  Uploading assets live...
                </div>
              )}

              {/* Gallery Previews / Displays */}
              {isEditingProduct ? (
                // EDIT MODE: Render already-uploaded images from product
                (() => {
                  const currentProd = products.find(p => p.id === editingProductId);
                  const uploadedImages = currentProd?.images || [];
                  
                  if (uploadedImages.length === 0) {
                    return (
                      <p className="text-[10px] text-muted-foreground text-center py-4">No images uploaded for this catalog item.</p>
                    );
                  }

                  return (
                    <div className="grid grid-cols-3 gap-3 pt-2">
                      {uploadedImages.map((img) => (
                        <div key={img.id} className="relative aspect-square border border-border/80 rounded-lg overflow-hidden group bg-black/30">
                          <img 
                            src={img.imageUrl.startsWith("http") ? img.imageUrl : `http://localhost:5000${img.imageUrl}`} 
                            alt={img.altText || "Product Image"}
                            className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                          />
                          
                          {/* Overlay Controls */}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setPrimaryImage(editingProductId as string, img.id);
                              }}
                              className={cn(
                                "p-1.5 rounded-full backdrop-blur-md cursor-pointer transition-all",
                                img.isPrimary 
                                  ? "bg-primary text-[#090a0f]" 
                                  : "bg-black/60 text-white hover:text-primary hover:bg-black/80"
                              )}
                              title={img.isPrimary ? "Primary Cover" : "Make Primary"}
                            >
                              <Star size={12} fill={img.isPrimary ? "currentColor" : "none"} />
                            </button>
                            
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteProductImage(editingProductId as string, img.id);
                              }}
                              className="p-1.5 rounded-full bg-rose-500/80 hover:bg-rose-600 text-white cursor-pointer transition-all"
                              title="Delete Image"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                          
                          {img.isPrimary && (
                            <span className="absolute top-1 left-1 text-[8px] bg-primary text-[#090a0f] font-bold px-1.5 py-0.5 rounded shadow-md uppercase tracking-wider">
                              Cover
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  );
                })()
              ) : (
                // CREATE MODE: Render local selected files previews
                previewUrls.length > 0 && (
                  <div className="grid grid-cols-3 gap-3 pt-2">
                    {previewUrls.map((url, idx) => (
                      <div key={idx} className="relative aspect-square border border-border/80 rounded-lg overflow-hidden group bg-black/30">
                        <img 
                          src={url} 
                          alt="preview" 
                          className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                        />
                        
                        {/* Overlay Controls */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPrimaryIndex(idx);
                            }}
                            className={cn(
                              "p-1.5 rounded-full backdrop-blur-md cursor-pointer transition-all",
                              primaryIndex === idx 
                                ? "bg-primary text-[#090a0f]" 
                                : "bg-black/60 text-white hover:text-primary hover:bg-black/80"
                            )}
                            title={primaryIndex === idx ? "Primary Cover" : "Make Primary"}
                          >
                            <Star size={12} fill={primaryIndex === idx ? "currentColor" : "none"} />
                          </button>
                          
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLocalImageDelete(idx);
                            }}
                            className="p-1.5 rounded-full bg-rose-500/80 hover:bg-rose-600 text-white cursor-pointer transition-all"
                            title="Delete Preview"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                        
                        {primaryIndex === idx && (
                          <span className="absolute top-1 left-1 text-[8px] bg-primary text-[#090a0f] font-bold px-1.5 py-0.5 rounded shadow-md uppercase tracking-wider">
                            Cover
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )
              )}
            </div>
          </div>

          {/* RIGHT: Multiple TinyMCE Editors */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Description Editor */}
            <div className="rounded-xl border border-border bg-card p-6 space-y-4">
              <div className="flex justify-between items-center border-b border-border/40 pb-2">
                <span className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5 select-none">
                  <Info size={14} className="text-primary animate-pulse" />
                  Product Story & Narrative
                </span>
                <span className="text-[9px] text-muted-foreground bg-[#241e17] px-2 py-0.5 rounded font-mono text-primary font-semibold">HTML Editor</span>
              </div>
              <RichTextEditor 
                value={description}
                onChange={(content) => {
                  setDescription(content);
                  if (productErrors.description) setProductErrors(prev => ({ ...prev, description: undefined }));
                }}
                placeholder="Write compelling narrative styling guides for this luxury piece..."
                error={productErrors.description}
              />
            </div>

            {/* Product Details Specs Editor */}
            <div className="rounded-xl border border-border bg-card p-6 space-y-4">
              <div className="flex justify-between items-center border-b border-border/40 pb-2">
                <span className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5 select-none">
                  <Scale size={14} className="text-blue-400" />
                  GIA Specifications & Diamond Metrology
                </span>
                <span className="text-[9px] text-muted-foreground bg-[#171e2c] px-2 py-0.5 rounded font-mono text-blue-400 font-semibold">HTML Editor</span>
              </div>
              <RichTextEditor 
                value={details}
                onChange={(content) => {
                  setDetails(content);
                  if (productErrors.details) setProductErrors(prev => ({ ...prev, details: undefined }));
                }}
                placeholder="Bullet points outlining diamond carats, metal alloy weights, certifications..."
                error={productErrors.details}
              />
            </div>

            {/* Care Instructions Editor */}
            <div className="rounded-xl border border-border bg-card p-6 space-y-4">
              <div className="flex justify-between items-center border-b border-border/40 pb-2">
                <span className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5 select-none">
                  <Heart size={14} className="text-[#a58b68]" />
                  Care & Preservation Guidelines
                </span>
                <span className="text-[9px] text-muted-foreground bg-[#241e17] px-2 py-0.5 rounded font-mono text-[#a58b68] font-semibold">HTML Editor</span>
              </div>
              <RichTextEditor 
                value={careInstructions}
                onChange={(content) => {
                  setCareInstructions(content);
                  if (productErrors.careInstructions) setProductErrors(prev => ({ ...prev, careInstructions: undefined }));
                }}
                placeholder="Instructions on safe wear, clean regimes, and boutique warranty visits..."
                error={productErrors.careInstructions}
              />
            </div>
            
          </div>
        </form>
      </div>
    );
  }

  // 2. HERITAGE story & DYNAMIC CATEGORY MANAGER (collections)
  if (currentPage === "collections") {
    return (
      <div className="space-y-8 animate-in fade-in duration-200 text-left">
        
        {/* UPPER: Story Heritage Narrative */}
        <form onSubmit={handleStorySubmit} className="space-y-6 border-b border-border/30 pb-8">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground font-serif">Boutique Story & Brand Heritage</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Draft and preserve Zari & Co's historical legacy and brand narratives.
              </p>
            </div>
            <button 
              type="submit"
              className="flex items-center gap-1.5 bg-primary text-[#090a0f] px-5 py-2 rounded-lg text-xs font-bold hover:bg-primary/95 transition-all cursor-pointer shadow-[0_0_12px_rgba(197,168,128,0.25)] select-none"
            >
              <Save size={14} />
              Save Story
            </button>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-border/40 pb-2">
              <span className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5 select-none">
                <Sparkles size={14} className="text-primary animate-pulse" />
                Aurelia Legacy Narrative Editor
              </span>
              <span className="text-[9px] text-muted-foreground bg-[#241e17] px-2 py-0.5 rounded font-mono text-primary font-semibold">HTML Editor</span>
            </div>
            
            <RichTextEditor 
              value={storyText}
              onChange={(content) => {
                setStoryText(content);
                if (storyError) setStoryError("");
              }}
              placeholder="Narrate the house's Paris history, structural philosophies, and premium GIA parameters..."
              error={storyError}
            />
          </div>
        </form>

        {/* LOWER: Categories Manager aligned with Prisma models */}
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-foreground font-serif">Database Categories Manager</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Add subcategories, toggle published feeds, and manage slug directories corresponding to backend Prisma tables.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left: Dynamic Categories Database Table */}
            <div className="lg:col-span-2 rounded-xl border border-border bg-card p-6 space-y-4">
              <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5 border-b border-border/50 pb-3">
                <FolderTree size={15} className="text-primary" />
                Registered Category Trees
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground font-semibold">
                      <th className="pb-3 pl-2">Name / Slug</th>
                      <th className="pb-3">Parent Link</th>
                      <th className="pb-3 text-center">Status</th>
                      <th className="pb-3 pr-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {categories.map((cat) => {
                      const parentName = categories.find(c => c.id === cat.parentId)?.name || "—";
                      return (
                        <tr key={cat.id} className="hover:bg-secondary/15 transition-colors group">
                          <td className="py-3 pl-2">
                            <h5 className="font-semibold text-foreground group-hover:text-primary-foreground transition-all">{cat.name}</h5>
                            <p className="text-[9px] font-mono text-muted-foreground mt-0.5">Slug: /{cat.slug}</p>
                          </td>
                          <td className="py-3">
                            {cat.parentId ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-semibold bg-[#171e2c] text-blue-400 border border-[#252f44]">
                                {parentName}
                              </span>
                            ) : (
                              <span className="text-[10px] text-muted-foreground italic">Top-Level</span>
                            )}
                          </td>
                          <td className="py-3 text-center select-none">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[9px] font-bold border ${cat.isPublished ? "text-primary bg-[#241e17] border-[#3b3227]" : "text-muted-foreground bg-secondary/30 border-border"}`}>
                              {cat.isPublished ? <Eye size={10} /> : <EyeOff size={10} />}
                              {cat.isPublished ? "Published" : "Draft"}
                            </span>
                          </td>
                          <td className="py-3 pr-2 text-right">
                            <div className="flex justify-end gap-2.5 select-none">
                              <button 
                                onClick={() => handleCategoryEdit(cat)}
                                className="w-6 h-6 rounded border border-border bg-[#0d0f14]/50 flex items-center justify-center text-primary hover:bg-primary hover:text-[#090a0f] transition-all cursor-pointer"
                                title="Edit category specs"
                              >
                                <Edit3 size={11} />
                              </button>
                              <button 
                                onClick={() => handleCategoryDelete(cat.id, cat.name)}
                                className="w-6 h-6 rounded border border-border bg-[#0d0f14]/50 flex items-center justify-center text-rose-400 hover:bg-rose-500 hover:text-white transition-all cursor-pointer"
                                title="Delete category"
                              >
                                <Trash2 size={11} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right: Category Editor Form */}
            <div className="lg:col-span-1 rounded-xl border border-border bg-card p-6 space-y-4 h-fit">
              <div className="flex justify-between items-center border-b border-border/50 pb-3">
                <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5 select-none">
                  <Sparkles size={14} className="text-primary animate-pulse" />
                  {isEditingCategory ? "Modify Category" : "Add DB Category"}
                </h3>
                {isEditingCategory && (
                  <button 
                    onClick={handleCategoryCancel}
                    className="text-[10px] text-muted-foreground hover:text-foreground font-semibold hover:underline cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
              </div>

              <form onSubmit={handleCategorySubmit} className="space-y-4">
                {/* Error */}
                {categoryError && (
                  <p className="p-2.5 rounded bg-rose-500/10 border border-rose-500/20 text-[10px] font-semibold text-rose-400 leading-relaxed">
                    {categoryError}
                  </p>
                )}

                {/* Name */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Category Name</label>
                  <input 
                    type="text"
                    value={catName}
                    onChange={handleCatNameChange}
                    placeholder="e.g. Royal Necklaces"
                    className="w-full px-3 py-2 text-xs border border-border bg-[#0d0f14]/50 rounded-lg text-foreground focus:outline-none focus:border-primary/50"
                  />
                </div>

                {/* Slug Auto-Generated */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Slug URL (Unique)</label>
                  <input 
                    type="text"
                    value={catSlug}
                    onChange={(e) => setCatSlug(e.target.value)}
                    placeholder="e.g. royal-necklaces"
                    className="w-full px-3 py-2 text-xs border border-border bg-[#0d0f14]/50 rounded-lg text-foreground focus:outline-none focus:border-primary/50 font-mono"
                  />
                </div>

                {/* Parent Category Tree */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Parent Category (Prisma Tree)</label>
                  <select 
                    value={catParentId}
                    onChange={(e) => setCatParentId(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-border bg-[#0d0f14] rounded-lg text-foreground focus:outline-none focus:border-primary/50 cursor-pointer"
                  >
                    <option value="">— None (Top-Level Category) —</option>
                    {categories
                      .filter(c => c.id !== editingCategoryId && !c.parentId) // Prevent self-referential or deeper nesting loop
                      .map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))
                    }
                  </select>
                </div>

                {/* TinyMCE Description for Category */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Category Description Narrative</label>
                  <RichTextEditor 
                    value={catDescription}
                    onChange={(content) => setCatDescription(content)}
                    placeholder="Rich description for the collection brochure..."
                  />
                </div>

                {/* Category Published Toggle */}
                <div className="flex items-center gap-2 select-none pt-1">
                  <input 
                    type="checkbox"
                    id="catIsPublished"
                    checked={catIsPublished}
                    onChange={(e) => setCatIsPublished(e.target.checked)}
                    className="w-4 h-4 rounded border-border bg-[#0d0f14] text-primary focus:ring-primary/20 accent-[#c5a880] cursor-pointer"
                  />
                  <label htmlFor="catIsPublished" className="text-xs font-semibold text-foreground cursor-pointer select-none">
                    Publish Category to Storefront
                  </label>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full bg-primary text-[#090a0f] py-2 rounded-lg text-xs font-bold hover:bg-primary/95 transition-all cursor-pointer shadow-[0_0_8px_rgba(197,168,128,0.15)] flex items-center justify-center gap-1"
                >
                  <Save size={13} />
                  {isEditingCategory ? "Update Category" : "Save DB Category"}
                </button>
              </form>
            </div>

          </div>
        </div>

      </div>
    );
  }

  // 3. INVENTORY & SHIPPING RETURN NOTES
  if (currentPage === "inventory") {
    return (
      <div className="space-y-6 animate-in fade-in duration-200 text-left">
        <form onSubmit={handleShippingSubmit} className="space-y-6">
          <div className="flex justify-between items-center border-b border-border/10 pb-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground font-serif">Inventory Notes & Delivery Policies</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Configure delivery insurance coverage limits, dispatch packaging, and return windows.
              </p>
            </div>
            <button 
              type="submit"
              className="flex items-center gap-1.5 bg-primary text-[#090a0f] px-5 py-2 rounded-lg text-xs font-bold hover:bg-primary/95 transition-all cursor-pointer shadow-[0_0_12px_rgba(197,168,128,0.25)] select-none"
            >
              <Save size={14} />
              Save Policies
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left: Mock Inventory Rules */}
            <div className="lg:col-span-1 rounded-xl border border-[#22252e] bg-[#12141a] p-6 space-y-4 h-fit select-none">
              <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Info size={14} className="text-primary animate-pulse" />
                Inventory Stock Thresholds
              </h3>
              <div className="space-y-3">
                <div className="p-3 bg-secondary/15 rounded-lg border border-border/40">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold">Critical Low Limit</p>
                  <p className="text-sm font-semibold text-foreground mt-0.5">2 pieces remaining</p>
                </div>
                <div className="p-3 bg-secondary/15 rounded-lg border border-border/40">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold">Auto-Reorder Dispatch</p>
                  <p className="text-sm font-semibold text-primary mt-0.5">10 units (Prong Settings)</p>
                </div>
                <div className="p-3 bg-[#241e17]/30 rounded-lg border border-[#3b3227]/40">
                  <p className="text-[10px] text-primary uppercase font-bold">Bespoke Lead Time</p>
                  <p className="text-sm font-semibold text-foreground mt-0.5">14 Standard Business Days</p>
                </div>
              </div>
            </div>

            {/* Right: TinyMCE Shipping Policies Editor */}
            <div className="lg:col-span-2 rounded-xl border border-[#22252e] bg-[#12141a] p-6 space-y-4">
              <div className="flex justify-between items-center border-b border-border/40 pb-2">
                <span className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5 select-none">
                  <Scale size={14} className="text-blue-400" />
                  Shipping Insurances & Returns Policy
                </span>
                <span className="text-[9px] text-muted-foreground bg-[#171e2c] px-2 py-0.5 rounded font-mono text-blue-400 font-semibold">HTML Editor</span>
              </div>
              
              <RichTextEditor 
                value={shippingText}
                onChange={(content) => {
                  setShippingText(content);
                  if (shippingError) setShippingError("");
                }}
                placeholder="Detail packaging guidelines, customs clearance codes, and 30-day exchange windows..."
                error={shippingError}
              />
            </div>
            
          </div>
        </form>
      </div>
    );
  }

  // 4. MAIN PRODUCTS CATALOG LIST (products-list)
  return (
    <div className="space-y-6 animate-in fade-in duration-200 text-left select-none">
      
      {/* Products Table Card */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-xs space-y-4">
        <div className="flex justify-between items-center border-b border-border/50 pb-4">
          <div>
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Boutique Catalog Database</h3>
            <p className="text-xs text-muted-foreground mt-0.5">View GIA registered pieces and edit corresponding rich text descriptions.</p>
          </div>
          <button 
            onClick={() => setCurrentPage("new-product")}
            className="flex items-center gap-1.5 bg-primary text-[#090a0f] px-3.5 py-1.5 rounded-lg text-xs font-bold hover:bg-primary/95 transition-all cursor-pointer shadow-[0_0_8px_rgba(197,168,128,0.15)]"
          >
            <Plus size={14} />
            Add Piece
          </button>
        </div>

        {products.length === 0 ? (
          <div className="py-8">
            <EmptyState 
              title="Catalog is Currently Empty"
              description="No luxury jewelry pieces exist in your database yet. Start by adding your first collection piece above."
              actionText="Launch New Piece"
              onAction={() => setCurrentPage("new-product")}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border text-muted-foreground font-semibold">
                  <th className="pb-3 pl-2">Product Details</th>
                  <th className="pb-3">Catalog SKU</th>
                  <th className="pb-3">Category Relation</th>
                  <th className="pb-3">GIA Price</th>
                  <th className="pb-3 text-center">Status</th>
                  <th className="pb-3 pr-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {products.map((prod) => {
                  const resolvedCategory = categories.find(c => c.id === prod.categoryId);
                  const catName = resolvedCategory ? resolvedCategory.name : "Unknown";
                  return (
                    <tr key={prod.id} className="hover:bg-secondary/20 transition-colors group">
                      <td className="py-4 pl-2 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#241e17] border border-[#3b3227] flex items-center justify-center text-primary font-bold text-xs select-none shadow-[0_0_10px_rgba(197,168,128,0.05)]">
                          {prod.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div>
                          <h5 className="font-semibold text-foreground group-hover:text-primary-foreground transition-all">{prod.name}</h5>
                          <p className="text-[10px] text-muted-foreground mt-0.5">Code: {prod.sku}</p>
                        </div>
                      </td>
                      <td className="py-4 font-mono font-medium text-muted-foreground uppercase">{prod.sku}</td>
                      <td className="py-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold border ${getCategoryBadgeTheme(prod.categoryId)}`}>
                          {catName}
                        </span>
                      </td>
                      <td className="py-4 font-semibold text-foreground">${Number(prod.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                      
                      {/* Publish / Draft status mapping schema */}
                      <td className="py-4 text-center select-none">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[9px] font-bold border ${prod.isPublished ? "text-primary bg-[#241e17] border-[#3b3227]" : "text-muted-foreground bg-secondary/30 border-border"}`}>
                          {prod.isPublished ? <Eye size={10} /> : <EyeOff size={10} />}
                          {prod.isPublished ? "Published" : "Draft"}
                        </span>
                      </td>

                      <td className="py-4 pr-2 text-right">
                        <div className="flex justify-end gap-2.5 select-none">
                          {/* Edit Button */}
                          <button 
                            onClick={() => handleProductEdit(prod)}
                            className="w-7 h-7 rounded-lg border border-border bg-[#0d0f14]/50 flex items-center justify-center text-primary hover:bg-primary hover:text-[#090a0f] transition-all cursor-pointer"
                            title="Edit GIA rich sheets"
                          >
                            <Edit3 size={12} />
                          </button>
                          
                          {/* Delete Button */}
                          <button 
                            onClick={() => handleProductDelete(prod.id, prod.name)}
                            className="w-7 h-7 rounded-lg border border-border bg-[#0d0f14]/50 flex items-center justify-center text-rose-400 hover:bg-rose-500 hover:text-white transition-all cursor-pointer"
                            title="Delete piece"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
    </div>
  );
};

export default Products;
