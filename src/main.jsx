import { createRoot } from "react-dom/client";
import "./index.css";
import { router } from "./router/router";
import { RouterProvider } from "react-router-dom";
import { BalanceProvider } from "./context/BalanceContext";
import { AuthProvider } from "./context/Authcontext";

createRoot(document.getElementById("root")).render(
    <AuthProvider>
  <BalanceProvider>
    <RouterProvider router={router} />
  </BalanceProvider>
  </AuthProvider>
);