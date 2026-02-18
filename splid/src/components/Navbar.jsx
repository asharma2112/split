import { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/Logo.png";
import { GroupContext } from "../context/GroupContext";
import '../components/Navbar.css'
import '../index.css'
const Navbar = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const { activeGroup, setActiveGroup } = useContext(GroupContext);

  const [groups, setGroups] = useState([]);
  const [profileOpen, setProfileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("https://split-g38i.onrender.com/api/auth/groups", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setGroups(data);
        }
      });
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <>
      <nav className="text-white px-6 py-4 sm:flex sm:gap-2  justify-between ">

        <div className="max-w-7xl  flex justify-center sm:justify-between items-center">

          {/* Logo */}
          <div className="flex justify-center md:justify-start items-center md:w-auto">
            <img src={Logo} className="w-36 md:w-48" alt="logo" />
          </div>

        </div>

        <div className="hidden md:flex gap-8 font-medium items-center">
          <Link to="/">Dashboard</Link>
          <Link to="/createnewgroup">Create Group</Link>
          <Link to="/expensehistory">Expense History</Link>
          <Link to="/settleup">Settle Up</Link>
        </div>
        <div className="flex justify-center gap-5">


          {/* Right Section */}
          <div className="flex justify-center gap-5 md:justify-end items-center">

            {/* Select Group */}
            <select
              className="bg-green-600 px-3 py-2 rounded-md text-white font-semibold focus:outline-none"
              value={activeGroup?._id || ""}
              onChange={(e) => {
                const selected = groups.find(g => g._id === e.target.value);
                setActiveGroup(selected);
              }}
            >
              <option value="">Select Group</option>
              {groups.map((group) => (
                <option key={group._id} value={group._id}>
                  {group.name}
                </option>
              ))}
            </select>

            {/* Profile */}
            <div className="relative">
              <div
                onClick={() => setProfileOpen(!profileOpen)}
                className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center font-bold cursor-pointer"
              >
                {user?.name?.charAt(0).toUpperCase()}
              </div>

              {profileOpen && (
                <div className="absolute right-0 mt-2 bg-white text-black rounded shadow-md w-40 z-50">
                 
                  <button
                    onClick={() => navigate("/join-group")}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Join Group
                  </button>
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* Hamburger */}
            <button
              className="text-2xl md:hidden"
              onClick={() => setMenuOpen(true)}
            >
              ☰
            </button>

            {menuOpen && (
              <div
                className="fixed inset-0 bg-black/40 z-[9999]"
                onClick={() => setMenuOpen(false)}
              >

                <div
                  className="bg-white w-64 h-full p-6 shadow-lg"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="font-bold text-black text-lg">Menu</h2>
                    <button onClick={() => setMenuOpen(false)} className="text-black">✕</button>
                  </div>

                  <div className="flex flex-col gap-4 text-gray-800 font-medium">
                    <Link to="/" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                    <Link to="/createnewgroup" onClick={() => setMenuOpen(false)}>Create Group</Link>
                    <Link to="/expensehistory" onClick={() => setMenuOpen(false)}>Expense History</Link>
                    <Link to="/settleup" onClick={() => setMenuOpen(false)}>Settle Up</Link>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
