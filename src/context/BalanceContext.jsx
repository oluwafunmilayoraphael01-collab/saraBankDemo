
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
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("full_name, balance")
          .eq("id", user.id)
          .maybeSingle();

        if (error) throw error;
        if (!active) return;

        setUserName(
          profile?.full_name ||
          user.user_metadata?.full_name ||
          user.email ||
          "User"
        );

        setBalance(Number(profile?.balance ?? 0));
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

    if (!user) {
      throw new Error("Please log in first.");
    }

    if (!Number.isFinite(value) || value <= 0) {
      throw new Error("Enter a valid amount.");
    }

    // Read the existing profile and balance.
    const { data: profile, error: readError } = await supabase
      .from("profiles")
      .select("balance, full_name")
      .eq("id", user.id)
      .maybeSingle();

    if (readError) throw readError;

    const currentBalance = Number(profile?.balance ?? 0);
    const newBalance = currentBalance + value;

    // Save the balance to the user's own profile.
    const { data: savedProfile, error: saveError } = await supabase
      .from("profiles")
      .upsert(
        {
          id: user.id,
          full_name:
            profile?.full_name ||
            user.user_metadata?.full_name ||
            user.email ||
            "User",
          balance: newBalance,
        },
        { onConflict: "id" }
      )
      .select("balance")
      .single();

    if (saveError) throw saveError;

    const savedBalance = Number(savedProfile.balance);

    // Update the React display only after Supabase confirms the save.
    setBalance(savedBalance);

    // Record the simulated deposit if the transactions table exists.
    const { error: transactionError } = await supabase
      .from("transactions")
      .insert({
        user_id: user.id,
        transaction_type: "deposit",
        amount: value,
        status: "completed",
      });

    if (transactionError) {
      console.error(
        "Balance saved, but transaction history failed:",
        transactionError.message
      );
    }

    return savedBalance;
  }

  function saveUserName(name) {
    setUserName(name);
  }

  function clearBalance() {
    // Display only. This does not change the database.
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
