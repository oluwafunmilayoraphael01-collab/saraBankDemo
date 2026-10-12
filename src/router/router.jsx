import { createBrowserRouter,  } from "react-router"
import UserName from "../pages/UserName";
import Balance from "../pages/Balance";
import AddMoney from "../pages/AddMoney";

const router =  createBrowserRouter (
[
{

    path:"/",
    element:<UserName />,
},
{
    path:"/balance",
    element:
    <Balance />,
},
{
path:"/addmoney",
element:<AddMoney/>,
}
    ]
)

export default router
