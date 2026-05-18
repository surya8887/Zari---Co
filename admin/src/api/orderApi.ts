// Order API endpoints placeholder
export interface Order {
  id: string;
  customerName: string;
  total: number;
  status: "pending" | "completed" | "cancelled";
  createdAt: string;
}

export const getOrders = async (): Promise<Order[]> => {
  // TODO: Implement actual API fetch
  return [
    { id: "ORD-001", customerName: "John Doe", total: 499.99, status: "completed", createdAt: "2026-05-18" },
    { id: "ORD-002", customerName: "Jane Smith", total: 1299.99, status: "pending", createdAt: "2026-05-17" },
  ];
};
