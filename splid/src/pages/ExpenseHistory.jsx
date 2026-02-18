import { useEffect, useState, useContext } from "react";
import Navbar from "../components/Navbar";
import { GroupContext } from "../context/GroupContext";
import FloatingMenu from "../components/FloatingMenu";
import Footer from "../components/Footer";

const ExpenseHistory = () => {
  const { activeGroup } = useContext(GroupContext);
  const [transactions, setTransactions] = useState([]);
  const token = localStorage.getItem("token");

  // ================= FETCH TRANSACTIONS =================
  useEffect(() => {
    if (!activeGroup || !token) return;

    fetch(`https://split-g38i.onrender.com/api/auth/expenses/${activeGroup._id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(async (res) => {
        const data = await res.json();

        if (!res.ok) {
          console.log(data.message);
          return;
        }

        if (Array.isArray(data)) {
          setTransactions(data);
        } else {
          setTransactions([]);
        }
      })
      .catch(err => console.log(err));

  }, [activeGroup]);

  // ================= DELETE TRANSACTION =================
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this transaction?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(
        `http://localhost:3000/api/auth/delete-transaction/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await res.json();

      if (res.ok) {
        setTransactions(prev =>
          prev.filter(tx => tx._id !== id)
        );
      } else {
        alert(data.message);
      }

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">

        <div className="p-6">
          <h1 className="text-5xl font-bold text-orange-500 mb-8">
            {activeGroup?.name} Transaction History
          </h1>

          {transactions.length === 0 && (
            <p className="text-gray-500">No transactions found.</p>
          )}

          <div className="flex flex-col gap-6 text-left">
            {transactions.map(tx => (
              <div
                key={tx._id}
                className="bg-white flex-col justify-between shadow-md rounded-xl p-5"
              >
                {/* Top Section */}
                <div className="flex gap-2 justify-between">
                  <div>
                    <h2 className="text-xl font-bold">
                      {tx.description}
                    </h2>

                    {tx.type === "expense" && (
                      <p className="text-gray-500">
                        Paid by {tx.paidBy}
                      </p>
                    )}

                    <p className="text-gray-400 text-sm">
                      {new Date(tx.date).toLocaleDateString()}
                    </p>
                  </div>

                  <div
                    className={`text-lg font-bold ${tx.type === "payment"
                      ? "text-green-600"
                      : "text-red-600"
                      }`}
                  >
                    ₹{tx.amount}
                  </div>
                </div>

                {/* Bottom Section */}
                <div className="mt-4 flex gap-5 justify-between items-center">

                  {/* Split info only for expenses */}
                  {tx.type === "expense" && tx.splitBetween?.length > 0 ? (
                    <div className="bg-yellow-500 px-1 py-2  rounded font-bold text-sm">
                      Split:
                      {tx.splitBetween.map((member, i) => (
                        <span key={i} className="ml-2">
                          {member.member} (₹{member.amount})
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div></div>  // keeps alignment clean
                  )}

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(tx._id)}
                    className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition"
                  >
                    Delete
                  </button>

                </div>

              </div>
            ))}
          </div>
          <FloatingMenu></FloatingMenu>
        </div>
      </main>
        <Footer></Footer>
    </div>
  );
};

export default ExpenseHistory;
