import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/Authcontext";

export default function Register() {
  const { register } = useAuth();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const data = await register(
        email,
        password,
        fullName.trim(),
        phone.trim()
      );

      if (data.session) {
        setMessage("Registration successful! You can now log in.");
      } else {
        setMessage(
          "Account created! Check your email to confirm your account."
        );
      }
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
          Create Account
        </h1>

        <p className="text-center text-slate-400">
          Join Saramonie today
        </p>

        <div>
          <label className="mb-2 block">Full name</label>
          <input
            type="text"
            required
            autoComplete="name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Enter your full name"
            className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3 outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="mb-2 block">Phone number</label>
          <input
            type="tel"
            required
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+2348012345678"
            className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3 outline-none focus:border-blue-500"
          />
        </div>

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
            minLength={6}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 6 characters"
            className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3 outline-none focus:border-blue-500"
          />
        </div>

        {message && (
          <p role="status" className="text-sm text-blue-300">
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-blue-600 p-3 font-semibold hover:bg-blue-500 disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Register"}
        </button>

        <p className="text-center text-sm text-slate-400">
          Already have an account?{" "}
          <Link to="/auth/login" className="text-blue-400">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}