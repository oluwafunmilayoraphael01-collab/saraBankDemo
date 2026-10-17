
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/Authcontext";
export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      await login(email, password);
      navigate("/balance", { replace: true });
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 text-white">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-5 rounded-2xl bg-slate-900 p-8"
      >
        <h1 className="text-3xl font-bold text-center">
          Welcome Back
        </h1>

        <p className="text-center text-slate-400">
          Log in to Demo Bank
        </p>

        <div>
          <label className="mb-2 block">Email address</label>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3 outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="mb-2 block">Password</label>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password"
            className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3 outline-none focus:border-blue-500"
          />
        </div>

        {message && (
          <p role="alert" className="text-sm text-red-400">
            {message}
          </p>
        )}

        <button
          disabled={loading}
          className="w-full rounded-lg bg-blue-600 p-3 font-semibold hover:bg-blue-500 disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Log In"}
        </button>

        <p className="text-center text-sm text-slate-400">
          Don't have an account?{" "}
          <Link to="/auth/register" className="text-blue-400">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
