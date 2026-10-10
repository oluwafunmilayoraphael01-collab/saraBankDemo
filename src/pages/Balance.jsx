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
  Monitor
} from "lucide-react";
import Greetings from "./Greetings";
import { Link } from "react-router";
import { useBalance } from "../context/BalanceContext";

const Balance = () => {
  const { balance, userName, clearBalance } = useBalance();

  return (
    <div>
      <div className="border rounded-b-4xl h-60 px-5 py-5 bg-blue-950 text-amber-50">
        
        <div className="flex justify-between">
          
          <div className="flex gap-3">
            <div className="border rounded-full bg-blue-600 h-10 w-10"></div>

            <div>
              <h1>Hello, {userName}</h1>
              <Greetings/>
            </div>
          </div>

          <Bell />
        </div>

        <div className="mt-5 rounded-2xl h-30 bg-blue-700">
          <div className="py-2 px-5">
            <p>Total Balance:</p>

            <h1 className="font-semibold text-2xl">
              ₦{balance.toLocaleString()}
            </h1>
           <button onClick={clearBalance} className="border hover:text-cyan-400 w-15 text-red-600 rounded-2xl">Clear</button> 
          </div>
          <div className="h-30 md:px-20 px-4 bg-amber-50 rounded-2xl justify-between flex py-5">

        <Link to="/addmoney">
          <div className="flex flex-col items-center">
            <div className="rounded-full bg-blue-600 h-10 w-10 p-2">
              <Plus />
            </div>

            <p className="py-3 text-black font-black">
              Add Money
            </p>
          </div>
        </Link>

        <div className="flex flex-col items-center">
          <div className="rounded-full bg-blue-600 h-10 w-10 p-2">
            <Send />
          </div>

          <p className="py-3 text-black font-black">
            Send Money
          </p>
        </div>

        <div className="flex flex-col items-center">
          <div className="rounded-full bg-blue-600 h-10 w-10 p-2">
            <ArrowRightLeft />
          </div>

          <p className="py-3 text-black font-black">
            Transfer
          </p>
        </div>

        <div className="flex flex-col items-center">
          <div className="rounded-full bg-blue-600 h-10 w-10 p-2">
            <Ellipsis />
          </div>

          <p className="py-3 text-black font-black">
            More
          </p>
        </div>

      </div>
        </div>
      </div>

      

      {/* Quick Service */}
      <h1 className="text-black mt-20 px-7  font-medium text-2xl md:text-3xl md:px-70">
        Quick Service
      </h1>
      
      <div className="grid grid-cols-3 gap-4 md:grid-cols-3 sm:px-20 px-2 py-4 md:px-70  ">
        <Link to="/NotAvaliable">
<div className="border h-30 w-30 px-8 py-5 rounded-2xl "><div className="text-blue-600"><Smartphone size={40} /></div><h2 className="font-bold ">Airtime</h2></div>
      </Link>
<Link to="/NotAvaliable">
<div className="border h-30 w-30 px-8 py-5 rounded-2xl "><div className="text-blue-600"><GlobeCheck size={40} /></div><h2 className="font-bold ">Data</h2></div>
      </Link>
      <Link to="/NotAvaliable">
<div className="border h-30 w-30 px-8 py-5 rounded-2xl "><div className="text-blue-600"><Lightbulb size={40} /></div><h2 className="font-bold ">Electricity</h2></div>
      </Link>
      <Link to="/NotAvaliable">
<div className="border h-30 w-30 px-8 py-5 rounded-2xl "><div className="text-blue-600"><Monitor size={40} /></div><h2 className="font-bold ">Cable Tv</h2></div>
      </Link>
<Link to="/NotAvaliable">
<div className="border h-30 w-30 px-8 py-5 rounded-2xl "><div className="text-blue-600"><CircleX size={40} /></div><h2 className="font-bold px-2">Bet</h2></div>
      </Link>
      <Link to="/NotAvaliable">
<div className="border h-30 w-30 px-8 py-5 rounded-2xl "><div className="text-blue-600"><Ellipsis  size={40} /></div><h2 className="font-bold ">More</h2></div>
      </Link>
      </div>
    </div>
  );
};

export default Balance;