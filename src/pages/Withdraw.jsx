
import { useState } from "react";
import { useBalance } from "../context/BalanceContext";

export default function Withdraw() {
  const {
    balance,
    deductMoney,
    loadingBalance,
  } = useBalance();

  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleWithdraw(e) {
    e.preventDefault();
    setMessage("");

    const value = Number(amount);

    if (!Number.isFinite(value) || value <= 0) {
      setMessage("Enter a valid amount.");
      return;
    }

    if (Math.round(value * 100) !== value * 100) {
      setMessage("Use no more than two decimal places.");
      return;
    }

    if (value > balance) {
      setMessage("Insufficient balance.");
      return;
    }

    setBusy(true);

    try {
      await deductMoney(value, "Demo withdrawal");

      setAmount("");
      setMessage("Withdrawal successful!");
    } catch (error) {
      setMessage(
        error.message || "Withdrawal failed. Please try again."
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto max-w-lg p-6">
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold">Withdraw Money</h1>

        <p className="mt-3 text-gray-500">Available balance</p>

        <p className="mb-6 text-3xl font-bold text-blue-600">
          {loadingBalance
            ? "Loading..."
            : `₦${balance.toLocaleString("en-NG", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`}
        </p>

        <form onSubmit={handleWithdraw} className="space-y-4">
          <label htmlFor="amount" className="block font-medium">
            Withdrawal amount (₦)
          </label>

          <input
            id="amount"
            type="number"
            min="0.01"
            step="0.01"
            max={balance}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            required
            disabled={busy || loadingBalance}
            className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
          />

          <button
            type="submit"
            disabled={busy || loadingBalance}
            className="w-full rounded-lg bg-blue-600 p-3 font-semibold text-white disabled:opacity-50"
          >
            {busy ? "Processing..." : "Withdraw"}
          </button>
        </form>

        {message && (
          <p role="status" className="mt-4 text-sm">
            {message}
          </p>
        )}
      </div>
    </main>
  );
}
