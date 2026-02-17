import { useEffect, useState, useContext } from "react";
import Navbar from "../components/Navbar";
import { GroupContext } from "../context/GroupContext";

const SettleUp = () => {
  const { activeGroup } = useContext(GroupContext);
  const [settlements, setSettlements] = useState([]);
  const [selected, setSelected] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!activeGroup) return;

    fetch(`http://localhost:3000/api/auth/settle-up/${activeGroup._id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setSettlements(data); 
        }
      });
  }, [activeGroup]);

const handleSettle = async () => {
  try {

    await Promise.all(
      selected.map(tx =>
        fetch("http://localhost:3000/api/auth/make-payment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            groupId: activeGroup._id,
            from: tx.from,
            to: tx.to,
            amount: tx.amount
          })
        })
      )
    );

    alert("Settlement Completed ✅");

    // Wait small delay to ensure DB update
    setTimeout(async () => {
      const res = await fetch(
        `http://localhost:3000/api/auth/settle-up/${activeGroup._id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const data = await res.json();
      setSettlements(data);
      setSelected([]);
    }, 300);

  } catch (error) {
    console.log(error);
  }
};



  return (
    <>
      <Navbar />

      <div className="p-6">
        <h1 className="text-5xl font-bold text-orange-500 mb-8">
          Settle Up
        </h1>

        {settlements.length === 0 && (
          <p className="text-white font-bold text-5xl">Everyone is settled 🎉</p>
        )}

        <div className="flex flex-col gap-4">
          {settlements.map((tx, index) => (
            <label key={index} className="flex items-center gap-3 bg-white p-4 rounded shadow">
              <input
                type="checkbox"
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelected(prev => [...prev, tx]);
                  } else {
                    setSelected(prev =>
                      prev.filter(s => s !== tx)
                    );
                  }
                }}
              />
              <span className="font-bold">
                {tx.from} → {tx.to} ₹{tx.amount}
              </span>
            </label>
          ))}
        </div>

        {settlements.length > 0 && (
          <button
            onClick={handleSettle}
            className="bg-green-500 text-white px-6 py-2 mt-6 rounded"
          >
            Settle Selected
          </button>
        )}
      </div>
    </>
  );
};

export default SettleUp;
