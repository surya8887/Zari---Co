// Product API endpoints placeholder
export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  inStock: boolean;
}

export const getProducts = async (): Promise<Product[]> => {
  // TODO: Implement actual API fetch
  return [
    { id: "1", name: "Classic Gold Ring", price: 499.99, category: "Rings", inStock: true },
    { id: "2", name: "Diamond Pendant Necklace", price: 1299.99, category: "Necklaces", inStock: true },
  ];
};
