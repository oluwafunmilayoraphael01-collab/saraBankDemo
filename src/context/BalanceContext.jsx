import { createContext, useContext, useState } from "react";

const BalanceContext = createContext(null);

export const BalanceProvider = ({ children }) => {
  const [balance, setBalance] = useState(() => {
    return Number(localStorage.getItem("balance")) || 0;
  });

  const [userName, setUserName] = useState(() => {
    return localStorage.getItem("userName") || "";
  });

  const addMoney = (amount) => {
    const newBalance = balance + Number(amount);

    setBalance(newBalance);
    localStorage.setItem("balance", newBalance);
  };

  const saveUserName = (name) => {
    setUserName(name);
    localStorage.setItem("userName", name);
  };
const clearBalance = () => {
  setBalance(0);
  localStorage.setItem("balance",0);
};
  return (
    <BalanceContext.Provider
      value={{
        balance,
        addMoney,
        userName,
        saveUserName,
        clearBalance,
      }}
    >
      {children}
    </BalanceContext.Provider>
  );
};

export const useBalance = () => {
  const context = useContext(BalanceContext);

 

  return context;
};