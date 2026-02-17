import React, { useEffect, useContext, useState } from "react";
import { Link } from 'react-router-dom'
import Logo from '../assets/download.svg'
import Navbar from './Navbar'
import '../index.css'
import { useNavigate } from 'react-router-dom'
import { GroupContext } from "../context/GroupContext";
import Footer from "./Footer";
import JoinGroup from "../pages/JoinGroup";



const Dashboard = () => {
  const { activeGroup } = useContext(GroupContext);
  const [expenses, setExpenses] = useState([]);
  const [balance, setBalance] = useState({})


  //group Balance
useEffect(() => {
  if (!activeGroup) return;

  const fetchBalance = async () => {
    const res = await fetch(
      `https://split-g38i.onrender.com/api/auth/groupbalance/${activeGroup._id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      }
    );

    const data = await res.json();
    setBalance(data);
  };

  fetchBalance();

}, [activeGroup]);


 useEffect(() => {
  if (!activeGroup) return;

  fetch(`https://split-g38i.onrender.com/api/auth/expenses/${activeGroup._id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  })
    .then(res => {
      if (!res.ok) throw new Error("Unauthorized");
      return res.json();
    })
    .then(data => setExpenses(data))
    .catch(err => console.log(err));

}, [activeGroup]);

  const navigate = useNavigate();
  if (!activeGroup) {
    return (
      <>
        <Navbar />
        <div className="text-white text-center mt-20">
          Please select a group from the navbar.
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar></Navbar>

<div className="heading m-10">
        <h1 className='text-6xl font-sans font-bold text-[rgb(255,94,0)]  '>Group Overview</h1>
      </div>

      <div >
        <div className="flex flex-wrap justify-center gap-6 mt-10">
          {Object.entries(balance).map(([member, amount]) => (
            <div
              key={member}
              className="bg-white w-[220px] p-6 rounded-xl shadow-md text-center hover:shadow-[0_0_25px_rgba(59,130,246,0.7)] 
            transition duration-300"
            >
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold">
                {member.charAt(0).toUpperCase()}
              </div>

              <h2 className="font-bold text-lg">{member}</h2>

              <p
                className={`text-xl font-bold mt-2 ${amount > 0
                    ? "text-green-600"
                    : amount < 0
                      ? "text-red-600"
                      : "text-gray-500"
                  }`}
              >
                {amount > 0
                  ? `+₹${amount}`
                  : amount < 0
                    ? `-₹${Math.abs(amount)}`
                    : "₹0"}
              </p>
            </div>
          ))}
        </div>



      </div >

      <div className="heading m-10">
        <h1 className='text-6xl font-sans font-bold text-[rgb(255,94,0)]  '>Quick Actions</h1>
      </div>
      <div className="balanceSummary   flex gap-[2%] justify-center  ">

        <div className="you-owe card w-[15%]   bg-white border-3 rounded-xl bg-white border-[rgb(2,149,21)] shadow-md 
            hover:shadow-[0_0_25px_rgba(59,130,246,0.7)] 
            transition duration-300" onClick={() => navigate("/addexpense")}>
          <h2 className=' text-black font-bold font-sans sans-serif  text-2xl '>➕<br></br> Add Expense</h2>
        </div>

        <div className="you-owe card w-[15%]   bg-white border-3 rounded-xl bg-white border-[rgb(2,149,21)] shadow-md 
            hover:shadow-[0_0_25px_rgba(59,130,246,0.7)] 
            transition duration-300 items-center" onClick={() => navigate("/settleup")}>
          <h2 className=' text-black font-bold font-sans sans-serif  text-2xl text-center'>🤝<br /> Settle Up </h2>
        </div>

        <div className="you-owe card w-[15%]   bg-white border-3 rounded-xl bg-white border-[rgb(2,149,21)] shadow-md 
            hover:shadow-[0_0_25px_rgba(59,130,246,0.7)] 
            transition duration-300" onClick={() => navigate("/createnewgroup")}>
          <h2 className=' text-black font-bold font-sans sans-serif  text-2xl '>👥 <br />Create Group </h2>
        </div>

      </div>

     
      <Footer></Footer>
    </>

  )
}


export default Dashboard

