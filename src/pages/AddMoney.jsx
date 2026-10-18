
import { useState } from "react";
import { useBalance } from "../context/BalanceContext";

export default function AddMoney() {
  const { addMoney, balance, loadingBalance } = useBalance();

  const [amount, setAmount] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    const value = Number(amount);

    if (!Number.isFinite(value) || value <= 0) {
      setMessage("Enter a valid amount.");
      return;
    }

    setBusy(true);

    try {
      await addMoney(value, "Demo deposit");
      setAmount("");
      setMessage("Deposit recorded successfully.");
    } catch (error) {
      setMessage(error.message || "Deposit failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto max-w-lg p-6">
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold">Add Money</h1>

        <p className="mt-2 text-gray-500">
          Current balance
        </p>

        <p className="mb-6 text-3xl font-bold text-blue-600">
          {loadingBalance
            ? "Loading..."
            : `₦${balance.toLocaleString("en-NG", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label
            htmlFor="amount"
            className="block font-medium"
          >
            Amount (₦)
          </label>

          <input
            id="amount"
            type="number"
            min="0.01"
            step="0.01"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            placeholder="Enter amount"
            required
            className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
          />

          <button
            type="submit"
            disabled={busy || loadingBalance}
            className="w-full rounded-lg bg-blue-600 p-3 font-semibold text-white disabled:opacity-50"
          >
            {busy ? "Processing..." : "Add Money"}
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
