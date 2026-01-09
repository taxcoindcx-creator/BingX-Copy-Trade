import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Currency = "USD" | "INR";

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  convert: (amount: number) => number;
  format: (amount: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const EXCHANGE_RATE = 83.5; // Example rate

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>(() => {
    return (localStorage.getItem("app_currency") as Currency) || "USD";
  });

  useEffect(() => {
    localStorage.setItem("app_currency", currency);
  }, [currency]);

  const convert = (amount: number) => {
    if (currency === "USD") return amount;
    return amount * EXCHANGE_RATE;
  };

  const format = (amount: number) => {
    const value = convert(amount);
    if (currency === "USD") {
      return "$" + value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    return "₹" + value.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, convert, format }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error("useCurrency must be used within CurrencyProvider");
  return context;
}
