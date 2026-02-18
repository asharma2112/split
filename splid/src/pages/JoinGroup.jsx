import { useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import FloatingMenu from "../components/FloatingMenu";
import Footer from "../components/Footer";

const JoinGroup = () => {

  const [code, setCode] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleJoin = async (e) => {
    e.preventDefault();

    if (!code) {
      alert("Code is required");
      return;
    }

    try {
      const res = await fetch(
        "https://split-g38i.onrender.com/api/auth/join-group",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            code,

          })
        }
      );

      const data = await res.json();

      if (res.ok) {
        alert("Joined Successfully 🎉");
        navigate("/");
      } else {
        alert(data.message);
      }

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col ">
      <Navbar></Navbar>

      <main className="flex-grow flex justify-center items-start pt-5">

        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">

          <h1 className="text-3xl font-bold text-orange-500 mb-6 text-center">
            Join Group
          </h1>

          <form onSubmit={handleJoin} className="flex flex-col gap-4">

            <input
              type="text"
              placeholder="Enter Invite Code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="border p-2 rounded"
            />

            <button
              type="submit"
              className="bg-green-500 text-white p-2 rounded font-bold hover:bg-green-600"
            >
              Join Group
            </button>

          </form>

        </div>

        <FloatingMenu />

      </main>

      <Footer></Footer>
    </div>

  );
};

export default JoinGroup;
