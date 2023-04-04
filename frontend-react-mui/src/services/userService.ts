import api from "../utils/api";

export const getProfile = async () => {
  const response = await api.get("/users/me");
  return response.data;
};

export const addShippingAddress = async (address: {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}) => {
  const response = await api.post('/users/me/addresses', address);
  return response.data;
};

export const addCreditCard = async (card: {
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
}) => {
  const response = await api.post('/users/me/cards', card);
  return response.data;
};

export const getUserBillingInfo = async (): Promise<BillingInfo> => {
  const response = await api.get('/users/me/billing');
  return response.data;
};

export interface Address {
  id: number;
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export interface CreditCard {
  id: number;
  cardNumber: string;
  expiryMonth: number;
  expiryYear: number;
}

export interface BillingInfo {
  addresses: Address[];
  cards: CreditCard[];
}
