import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { supabase } from "../lib/supabase";
import { useAuth } from "./Authcontext";

const BalanceContext = createContext(null);

export function BalanceProvider({ children }) {
  const { user, loading: authLoading } = useAuth();

  const [balance, setBalance] = useState(0);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadUserData() {
      if (authLoading) return;

      if (!user) {
        setBalance(0);
        setUserName("");
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const [profileResult, balanceResult] = await Promise.all([
          supabase
            .from("profiles")
            .select("full_name")
            .eq("id", user.id)
            .maybeSingle(),

          supabase
            .from("balances")
            .select("balance")
            .eq("user_id", user.id)
            .maybeSingle(),
        ]);

        if (profileResult.error) throw profileResult.error;
        if (balanceResult.error) throw balanceResult.error;

        if (!active) return;

        setUserName(
          profileResult.data?.full_name ||
          user.user_metadata?.full_name ||
          user.email ||
          "User"
        );

        setBalance(Number(balanceResult.data?.balance ?? 0));
      } catch (error) {
        console.error("Failed to load account:", error.message);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadUserData();

    return () => {
      active = false;
    };
  }, [user, authLoading]);

  async function addMoney(amount) {
    const value = Number(amount);

    if (!user) throw new Error("Please log in first.");

    if (!Number.isFinite(value) || value <= 0) {
      throw new Error("Enter a valid amount.");
    }

    // Read the current balance from Supabase.
    const { data: account, error: readError } = await supabase
      .from("balances")
      .select("balance")
      .eq("user_id", user.id)
      .single();

    if (readError) throw readError;

    const newBalance = Number(account.balance) + value;

    // Save the new balance to Supabase.
    const { error: updateError } = await supabase
      .from("balances")
      .update({ balance: newBalance, updated_at: new Date().toISOString() })
      .eq("user_id", user.id);

    if (updateError) throw updateError;

    // Record the simulated deposit.
    const { error: transactionError } = await supabase
      .from("transactions")
      .insert({
        user_id: user.id,
        transaction_type: "deposit",
        amount: value,
        status: "completed",
      });

    if (transactionError) {
      console.error("Transaction record error:", transactionError.message);
    }

    setBalance(newBalance);
    return newBalance;
  }

  function saveUserName(name) {
    setUserName(name);
  }

  function clearBalance() {
    // Local display only; does not reset the database balance.
    setBalance(0);
  }

  return (
    <BalanceContext.Provider
      value={{
        balance,
        userName,
        loading: authLoading || loading,
        addMoney,
        saveUserName,
        clearBalance,
      }}
    >
      {children}
    </BalanceContext.Provider>
  );
}

export function useBalance() {
  return useContext(BalanceContext);
}