import { createBrowserRouter } from "react-router"
import UserName from "../pages/UserName";
import Balance from "../pages/Balance";
import AddMoney from "../pages/AddMoney";

const router =  createBrowserRouter (
[
{
    index:true,
    path:"/",
    Component:UserName,
},
{
    path:"/balance",
    Component:Balance,
},
{
path:"/addmoney",
Component:AddMoney,
}
    ]
)

export default router
