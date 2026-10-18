import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Balance from "../pages/Balance";
import AddMoney from "../pages/AddMoney";
import ProtectedRoute from "../context/ProtectedRoute";
import PublicRoute from "../context/PublicRoute";
import Withdraw from "../pages/Withdraw";

export const router = createBrowserRouter([
  {
    element: <PublicRoute/>,
    children: [
         {
        path: "/",
        element:<Login/>,
      },
      {
        path: "/auth/login",
        element: <Login/>,
      },
      {
        path: "/auth/register",
        element: <Register/> ,
      },
    ],
  },
  {
    element: <ProtectedRoute/>,
    children: [
      {
        path: "/balance",
        element: <Balance/>,
      },
      {
        path: "/addmoney",
        element: <AddMoney/>,
      },
      {
        path: "/withdraw",
        element: <Withdraw/>
      }
    ],
  },
]);
