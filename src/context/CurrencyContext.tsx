import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type CurrencyCode = 'EUR' | 'USD' | 'GBP' | 'MAD';

interface CurrencyContextType {
  currencyCode: CurrencyCode;
  setCurrencyCode: (code: CurrencyCode) => void;
  formatPrice: (amountInEur: number) => string;
}

// Exchange rates relative to Base EUR
// Note: In a real large app this could be fetched daily. 
// For tourism precision, fixed average rates or a small margin is standard.
export const EXCHANGE_RATES: Record<CurrencyCode, number> = {
  EUR: 1,
  USD: 1.09,
  GBP: 0.85,
  MAD: 10.70
};

export const formatPriceUtil = (amountInEur: number, code: CurrencyCode): string => {
    if (!amountInEur) return '0';
    
    // Multipliers
    const rawConversion = amountInEur * EXCHANGE_RATES[code];
    
    // Round to nicest number (e.g., ceil to avoid missing cents)
    const total = Math.ceil(rawConversion);

    return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: code,
        maximumFractionDigits: 0 // For travel, we don't display cents usually
    }).format(total);
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currencyCode, setCurrencyState] = useState<CurrencyCode>('EUR');

  useEffect(() => {
    // Load persisted currency
    const saved = localStorage.getItem('app_currency') as CurrencyCode;
    if (saved && ['EUR', 'USD', 'GBP', 'MAD'].includes(saved)) {
      setCurrencyState(saved);
    }
  }, []);

  const setCurrencyCode = (code: CurrencyCode) => {
    setCurrencyState(code);
    localStorage.setItem('app_currency', code);
  };

  const formatPrice = (amountInEur: number) => {
    return formatPriceUtil(amountInEur, currencyCode);
  };

  return (
    <CurrencyContext.Provider value={{ currencyCode, setCurrencyCode, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
