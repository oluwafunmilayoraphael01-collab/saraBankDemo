import { useState } from "react";
import { useBalance } from "../context/BalanceContext";
import { useNavigate } from "react-router";

const userName = () => {
  const [name, setName] = useState("");

  const { saveUserName } = useBalance();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (!name.trim()) return;

    saveUserName(name);
        navigate("/balance");

  };

  return (
    <div className="">
      <div></div>
      <div className="  bg-blue-800 text-amber-50 font-serif">
      <form onSubmit={handleLogin}>
      <h1>Welcome to Saramonie</h1>

      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border px-2  mx-4"
      />

      <button type="submit" className=" border rounded-2xl px-4 bg-green-600">
        Continue
      </button>
    </form></div>
    </div>
  )
}

export default userName
