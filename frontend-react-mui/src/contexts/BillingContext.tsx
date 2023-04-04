// src/contexts/BillingContext.tsx
import React from "react";
import { createContext, useContext, useState, useEffect } from 'react';
import { BillingInfo } from '../services/userService';
import { getUserBillingInfo } from '../services/userService';
import { addShippingAddress as apiAddShippingAddress, addCreditCard as apiAddCreditCard } from '../services/userService';

type BillingContextData = {
    billingInfo: BillingInfo | null;
    fetchBillingInfo: () => Promise<void>;
    hasAddress: () => boolean;
    hasCard: () => boolean;
    addShippingAddress: (address: {
      street: string;
      city: string;
      state: string;
      country: string;
      postalCode: string;
    }) => Promise<void>;
    addCreditCard: (card: {
      cardNumber: string;
      expiryMonth: string;
      expiryYear: string;
      cvv: string;
    }) => Promise<void>;
  };
  
  const BillingContext = createContext<BillingContextData>({
    billingInfo: null,
    fetchBillingInfo: async () => {},
    hasAddress: () => false,
    hasCard: () => false,
    addShippingAddress: async () => {},
    addCreditCard: async () => {},
  });

export const useBilling = () => useContext(BillingContext);

interface BillingProviderProps {
    children: React.ReactNode;
  }

export const BillingProvider: React.FC<BillingProviderProps> = ({ children }) => {
  const [billingInfo, setBillingInfo] = useState<BillingInfo | null>(null);

  const fetchBillingInfo = async () => {
    try {
      const fetchedBillingInfo = await getUserBillingInfo();
      setBillingInfo(fetchedBillingInfo);
    } catch (error) {
      console.error('Failed to fetch billing information:', error);
    }
  };

  useEffect(() => {
    fetchBillingInfo();
  }, []);

  const hasAddress = () => {
    if (!billingInfo) return false;
    if (!billingInfo.addresses) return false;
    return billingInfo.addresses.length > 0;
  };

  const hasCard = () => {
    if (!billingInfo) return false;
    if (!billingInfo.cards) return false;
    return billingInfo.cards.length > 0;
  };

  const addShippingAddress = async (address: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  }) => {
    const newAddress = await apiAddShippingAddress(address);
    setBillingInfo((prevBillingInfo) => {
      if (prevBillingInfo) {
        return { ...prevBillingInfo, addresses: [...prevBillingInfo.addresses, newAddress] };
      }
      return prevBillingInfo;
    });
  };

  const addCreditCard = async (card: {
    cardNumber: string;
    expiryMonth: string;
    expiryYear: string;
    cvv: string;
  }) => {
    const newCard = await apiAddCreditCard(card);
    setBillingInfo((prevBillingInfo) => {
      if (prevBillingInfo) {
        return { ...prevBillingInfo, cards: [...prevBillingInfo.cards, newCard] };
      }
      return prevBillingInfo;
    });
  };

  return (
    <BillingContext.Provider
      value={{
        billingInfo,
        fetchBillingInfo,
        hasAddress,
        hasCard,
        addShippingAddress,
        addCreditCard,
      }}>
      {children}
    </BillingContext.Provider>
  );
};
