
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { supabase } from "../lib/supabase";

const BalanceContext = createContext(null);

function formatTransaction(row) {
  return {
    id: row.id,
    amount: Number(row.amount),
    type:
      row.transaction_type === "deposit"
        ? "credit"
        : "debit",
    transaction_type: row.transaction_type,
    description: row.description ?? "",
    date: row.created_at,
    created_at: row.created_at,
  };
}

export function BalanceProvider({ children }) {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loadingBalance, setLoadingBalance] = useState(true);
  const [transactionError, setTransactionError] = useState("");

  const refreshData = useCallback(async () => {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) throw authError;

    if (!user) {
      setBalance(0);
      setTransactions([]);
      return;
    }

    const [profileResult, transactionResult] =
      await Promise.all([
        supabase
          .from("profiles")
          .select("balance")
          .eq("id", user.id)
          .single(),

        supabase
          .from("transactions")
          .select(
            "id, amount, transaction_type, description, created_at"
          )
          .eq("user_id", user.id)
          .order("created_at", { ascending: false }),
      ]);

    if (profileResult.error) throw profileResult.error;
    if (transactionResult.error) throw transactionResult.error;

    setBalance(Number(profileResult.data.balance ?? 0));
    setTransactions(
      transactionResult.data.map(formatTransaction)
    );
  }, []);

  useEffect(() => {
    let active = true;

    async function load() {
      setLoadingBalance(true);

      try {
        await refreshData();
      } catch (error) {
        console.error("Failed to load account data:", error);

        if (active) {
          setTransactionError(
            error.message || "Could not load account data."
          );
        }
      } finally {
        if (active) setLoadingBalance(false);
      }
    }

    load();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      // Defer the database fetch until the auth callback finishes.
      setTimeout(() => {
        if (active) {
          load();
        }
      }, 0);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [refreshData]);

  const processTransaction = useCallback(
    async (amount, type, description = "") => {
      const value = Number(amount);

      if (!Number.isFinite(value) || value <= 0) {
        throw new Error("Enter a valid amount greater than zero.");
      }

      if (Math.round(value * 100) !== value * 100) {
        throw new Error("Amount can have at most two decimal places.");
      }

      setTransactionError("");

      const { data, error } = await supabase.rpc(
        "process_transaction",
        {
          p_amount: value,
          p_type: type,
          p_description: description,
        }
      );

      if (error) {
        setTransactionError(error.message);
        throw error;
      }

      // Reload the authoritative database state.
      await refreshData();

      return data;
    },
    [refreshData]
  );

  const addMoney = useCallback(
    (amount, description = "Demo deposit") =>
      processTransaction(amount, "deposit", description),
    [processTransaction]
  );

  const deductMoney = useCallback(
    (amount, description = "Demo withdrawal") =>
      processTransaction(amount, "withdrawal", description),
    [processTransaction]
  );

  return (
    <BalanceContext.Provider
      value={{
        balance,
        transactions,
        loadingBalance,
        transactionError,
        addMoney,
        deductMoney,
        refreshData,
      }}
    >
      {children}
    </BalanceContext.Provider>
  );
}

export function useBalance() {
  const context = useContext(BalanceContext);

  if (!context) {
    throw new Error(
      "useBalance must be used inside BalanceProvider."
    );
  }

  return context;
}
