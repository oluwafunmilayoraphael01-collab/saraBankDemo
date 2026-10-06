import { createRoot } from "react-dom/client";
import "./index.css";
import router from "./router/router.jsx";
import { RouterProvider } from "react-router/dom";
import { BalanceProvider } from "./context/BalanceContext";

createRoot(document.getElementById("root")).render(
  <BalanceProvider>
    <RouterProvider router={router} />
  </BalanceProvider>
);