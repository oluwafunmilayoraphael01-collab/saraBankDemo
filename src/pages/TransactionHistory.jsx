
import { useBalance } from "../context/BalanceContext";

export default function TransactionHistory() {
  const {
    transactions,
    loadingBalance,
    transactionError,
  } = useBalance();

  if (loadingBalance) {
    return <p className="p-4">Loading transactions...</p>;
  }

  if (transactionError) {
    return (
      <p role="alert" className="p-4 text-red-600">
        {transactionError}
      </p>
    );
  }

  return (
    <section className="rounded-2xl border bg-white p-5">
      <h2 className="mb-4 text-xl font-bold">
        Transaction History
      </h2>

      {transactions.length === 0 ? (
        <p className="text-gray-500">
          No transactions yet.
        </p>
      ) : (
        <div className="space-y-3">
          {transactions.map((transaction) => {
            const isDeposit =
              transaction.transaction_type === "deposit";

            return (
              <div
                key={transaction.id}
                className="flex items-center justify-between gap-4 border-b pb-3 last:border-0"
              >
                <div>
                  <p className="font-medium">
                    {isDeposit ? "Deposit" : "Withdrawal"}
                  </p>

                  <p className="text-sm text-gray-500">
                    {transaction.description}
                  </p>

                  <p className="text-xs text-gray-400">
                    {new Date(
                      transaction.created_at
                    ).toLocaleString()}
                  </p>
                </div>

                <p
                  className={`whitespace-nowrap font-semibold ${
                    isDeposit
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {isDeposit ? "+" : "-"}₦
                  {transaction.amount.toLocaleString("en-NG", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
