import api from "../utils/api";

export const completePurchase = async (paymentMethodId: number, shippingAddressId: number) => {
  const response = await api.post('/orders', { paymentMethodId, shippingAddressId });
  return response.data;
};

export const getOrderHistory = async () => {
    const response = await api.get("/orders");
    return response.data;
  };