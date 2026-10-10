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
    <div className=" bg-blue-700 h-199 md:h-159 text-3xl ">
      <div className="text-center py-40 ">
      <div className="py-10 text-2xl text-green-600 font-bold"><h1> <span className="text-amber-300 text-3xl font-bold">S</span>araMonie</h1></div>
      <div className="   text-amber-50 font-serif">
      <form onSubmit={handleLogin}>
      <h1>Welcome to Saramonie</h1>

      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border px-2 md:w-100  w-80 rounded mx-4"
      /> <br />

      <button type="submit" className=" mt-10 hover:text-amber-400 border rounded-2xl px-20 bg-green-600">
        Continue
      </button>
    </form></div>
    </div></div>
  )
}

export default userName
