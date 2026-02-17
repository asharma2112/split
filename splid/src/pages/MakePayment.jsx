import React, { useState, useContext } from "react";
import Navbar from "../components/Navbar";
import { GroupContext } from "../context/GroupContext";
import { useNavigate } from "react-router-dom";

const MakePayment = () => {
  const { activeGroup } = useContext(GroupContext);
  const navigate = useNavigate();

  const [amount, setAmount] = useState("");
  const [paidFrom, setPaidFrom] = useState("");
  const [paidTo, setPaidTo] = useState("");
  const [date, setDate] = useState("");

  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!activeGroup) {
      alert("Please select a group first");
      return;
    }

    if (!amount || !paidFrom || !paidTo || !date) {
      alert("All fields are required");
      return;
    }

    if (paidFrom === paidTo) {
      alert("From and To cannot be same");
      return;
    }

    try {
      const res = await fetch(
        "http://localhost:3000/api/auth/make-payment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            groupId: activeGroup._id,
            from: paidFrom,
            to: paidTo,
            amount: Number(amount),
            date
          })
        }
      );

      const data = await res.json();

      if (res.ok) {
        alert("Payment recorded successfully");
        navigate("/expensehistory");
      } else {
        alert(data.message);
      }

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Navbar />

      <div className="flex justify-center">
        <div className="container w-1/2 flex flex-col items-center px-4">
          
          <div className="heading mb-5 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-[rgb(255,94,0)]">
              Make New Payment
            </h1>
          </div>

          <div className="card-container w-full sm:w-3/4 md:w-1/2 lg:w-1/3 shadow-md hover:shadow-[0_0_25px_rgba(59,130,246,0.7)] transition duration-300 flex flex-col justify-center items-center font-mono p-6 bg-white rounded-xl">
            
            <form
              onSubmit={handleSubmit}
              className="form-container flex flex-col gap-3 w-full"
            >

              {/* Amount */}
              <label>Amount</label>
              <input
                type="number"
                placeholder="Enter Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="border p-2 rounded w-full"
              />

              {/* From */}
              <label className="font-bold">From</label>
              <select
                value={paidFrom}
                onChange={(e) => setPaidFrom(e.target.value)}
                className="border p-2 rounded w-full"
              >
                <option value="">Select Member</option>
                {activeGroup?.members?.map((member, index) => (
                  <option key={index} value={member}>
                    {member}
                  </option>
                ))}
              </select>

              {/* To */}
              <label className="font-bold">To</label>
              <select
                value={paidTo}
                onChange={(e) => setPaidTo(e.target.value)}
                className="border p-2 rounded w-full"
              >
                <option value="">Select Member</option>
                {activeGroup?.members?.map((member, index) => (
                  <option key={index} value={member}>
                    {member}
                  </option>
                ))}
              </select>

              {/* Date */}
              <label>Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="border p-2 rounded w-full"
              />

              {/* Submit */}
              <button
                type="submit"
                className="bg-green-500 text-white p-2 rounded font-bold mt-4"
              >
                Make Payment
              </button>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MakePayment;
