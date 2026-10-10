import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";
import { useState } from "react";
import { useBalance } from "../context/BalanceContext";

const AddMoney = () => {
  const [amount, setAmount] = useState("");
  const { addMoney } = useBalance();

  const handleAddMoney = () => {
    if (!amount || Number(amount) <= 0) return;

    addMoney(amount);
    setAmount("");
  };

  return (
    <div className="min-h-screen px-5 py-5 bg-amber-50">

      {/* Header */}
      <div className="flex items-center gap-5">
        <Link to="/balance">
          <ArrowLeft />
        </Link>

        <h1 className="font-bold text-xl">
          Add Money
        </h1>
      </div>

      {/* Amount */}
      <div className="mt-20 text-center">
        <p className="font-medium text-2xl">
          Enter Amount
        </p>

        <input
          type="number"
          placeholder="Add Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border rounded-lg w-full max-w-md h-12 px-3 mt-5"
        />
<br />
        <button
          onClick={handleAddMoney}
          className="bg-blue-700  text-white font-semibold rounded-lg px-6 py-3 mt-5"
        >
          Add Money
        </button>
      </div>

    </div>
  );
};

export default AddMoney;