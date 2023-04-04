// adminService.ts
import api from "../utils/api";

export const getAllOrders = async () => {
  const response = await api.get("/admin/orders");
  return response.data;
};

export const markOrderAsShipped = async (orderId: number) => {
  const response = await api.patch(`/admin/orders/${orderId}/mark-shipped`);
  return response.data;
};
