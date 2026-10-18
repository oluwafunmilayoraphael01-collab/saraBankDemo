
import { useState } from "react";
import {
  CircleX,
  Smartphone,
  Bell,
  Plus,
  Send,
  Ellipsis,
  ArrowRightLeft,
  GlobeCheck,
  Lightbulb,
  Monitor,
  LogOut,
  LoaderCircle,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";
import { useBalance } from "../context/BalanceContext";
import { useAuth } from "../context/Authcontext";
import { supabase } from "../lib/supabase";

import TransactionHistory from "./TransactionHistory";
import ProfileHeader from "./profileHeader";
import Greetings from "./Greetings";

const formatMoney = (amount) =>
  Number(amount || 0).toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const Balance = () => {
  const { balance, loadingBalance } = useBalance();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  const fullName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "User";

  const handleLogout = async () => {
    if (loggingOut) return;

    setLoggingOut(true);
    setLogoutError("");

    try {
      const { error } = await supabase.auth.signOut();

      if (error) throw error;

      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
      setLogoutError(error.message || "Unable to log out. Try again.");
    } finally {
      setLoggingOut(false);
    }
  };

  const services = [
    { name: "Airtime", icon: Smartphone },
    { name: "Data", icon: GlobeCheck },
    { name: "Electricity", icon: Lightbulb },
    { name: "Cable TV", icon: Monitor },
    { name: "Betting", icon: CircleX },
    { name: "More", icon: Ellipsis },
  ];

  return (
    <main className="min-h-screen bg-gray-50 pb-8">
      {/* Header and balance */}
      <section className="rounded-b-[2rem] bg-blue-950 px-4 pb-8 pt-5 text-amber-50 sm:px-6">
        {/* Profile and logout */}
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <ProfileHeader />

            <div className="min-w-0">
              <p className="text-sm text-gray-300">Welcome back 👋</p>

              <h2 className="truncate text-lg font-bold capitalize sm:text-xl">
                {fullName}
              </h2>

              <Greetings />
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <button
              type="button"
              aria-label="Notifications"
              className="rounded-full p-2 transition hover:bg-blue-900"
            >
              <Bell size={21} />
            </button>

            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="flex items-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loggingOut ? (
                <LoaderCircle size={18} className="animate-spin" />
              ) : (
                <LogOut size={18} />
              )}

              <span className="hidden sm:inline">
                {loggingOut ? "Logging out..." : "Logout"}
              </span>
            </button>
          </div>
        </div>

        {logoutError && (
          <p role="alert" className="mx-auto mt-3 max-w-6xl text-sm text-red-300">
            {logoutError}
          </p>
        )}

        {/* Balance card */}
        <div className="mx-auto mt-6 max-w-6xl rounded-2xl bg-blue-700 p-5 shadow-lg sm:p-6">
          <p className="text-sm text-blue-100">Total Balance</p>

          <h1 className="mt-2 break-words text-3xl font-bold sm:text-4xl">
            {loadingBalance ? (
              <span className="inline-flex items-center gap-2 text-xl">
                <LoaderCircle size={22} className="animate-spin" />
                Loading balance...
              </span>
            ) : (
              `₦${formatMoney(balance)}`
            )}
          </h1>

          <p className="mt-2 text-xs text-blue-100">
            Your available demo account balance
          </p>
        </div>

        {/* Quick actions */}
        <div className="mx-auto mt-5 grid max-w-6xl grid-cols-4 gap-2 rounded-2xl bg-amber-50 px-2 py-5 text-gray-900 sm:gap-4 sm:px-5">
          <Link
            to="/addmoney"
            className="flex min-w-0 flex-col items-center rounded-xl p-2 transition hover:bg-blue-50"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-white">
              <Plus size={23} />
            </span>
            <span className="mt-2 text-center text-xs font-bold sm:text-sm">
              Add Money
            </span>
          </Link>

          <Link
            to="/withdraw"
            className="flex min-w-0 flex-col items-center rounded-xl p-2 transition hover:bg-blue-50"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-white">
              <Send size={21} />
            </span>
            <span className="mt-2 text-center text-xs font-bold sm:text-sm">
              Withdraw
            </span>
          </Link>

          <button
            type="button"
            onClick={() => navigate("/transfer")}
            className="flex min-w-0 flex-col items-center rounded-xl p-2 transition hover:bg-blue-50"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-white">
              <ArrowRightLeft size={22} />
            </span>
            <span className="mt-2 text-center text-xs font-bold sm:text-sm">
              Transfer
            </span>
          </button>

          <button
            type="button"
            onClick={() => navigate("/NotAvaliable")}
            className="flex min-w-0 flex-col items-center rounded-xl p-2 transition hover:bg-blue-50"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-white">
              <Ellipsis size={23} />
            </span>
            <span className="mt-2 text-center text-xs font-bold sm:text-sm">
              More
            </span>
          </button>
        </div>
      </section>

      {/* Quick services */}
      <section className="mx-auto mt-8 max-w-6xl px-4 sm:px-6">
        <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          Quick Services
        </h2>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {services.map(({ name, icon: Icon }) => (
            <Link
              key={name}
              to="/NotAvaliable"
              className="flex min-h-32 flex-col items-start justify-center rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-md"
            >
              <span className="text-blue-600">
                <Icon size={34} />
              </span>

              <span className="mt-3 font-bold text-gray-900">{name}</span>

              <span className="mt-1 text-xs text-gray-500">
                Explore service
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Transaction history */}
      <section className="mx-auto mt-8 max-w-6xl px-4 sm:px-6">
        <TransactionHistory />
      </section>
    </main>
  );
};

export default Balance;
