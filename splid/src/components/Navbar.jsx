import { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/download.svg";
import { GroupContext } from "../context/GroupContext";

const Navbar = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const { activeGroup, setActiveGroup } = useContext(GroupContext);

  // 🔥 NEW: Groups state
  const [groups, setGroups] = useState([]);

  // 🔥 Fetch groups when navbar loads
 useEffect(() => {
  const token = localStorage.getItem("token");

  fetch("http://localhost:3000/api/auth/groups", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(res => res.json())
    .then(data => {
      if (Array.isArray(data)) {
        setGroups(data);
      }
    });

}, []);


  const logout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (!confirmLogout) return;

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };
  const JoinGroup = () => {
    
  


    navigate("/join-group");
  };

  return (
    <nav className="flex items-center justify-between py-3 ">

      <img className="w-[250px]" src={Logo} alt="logo" />

      <div className="text-white flex gap-6">
        <Link to="/" className="hover:text-green-600">Dashboard</Link>
        <Link to="/groups" className="hover:text-green-600">Members List</Link>
        <Link to="/createnewgroup" className="hover:text-green-600">Create Group</Link>
        <Link to="/addexpense" className="hover:text-green-600">Add Expense</Link>
        <Link to="/expensehistory" className="hover:text-green-600">Expense History</Link>
        <Link to="/makepayment" className="hover:text-green-600">Make Payment</Link>
        <Link to="/settleup" className="hover:text-green-600">Settle Up</Link>
      </div>

      {/* 🔥 Active Group Dropdown */}
      <select
        className="bg-green-600 font-bold ml-2  text-white cursor-pointer  rounded px-1  py-1"
        value={activeGroup?._id || ""}
        onChange={(e) => {
          const selected = groups.find(g => g._id === e.target.value);
          setActiveGroup(selected);
        }}
      >
        <option className="cursor-pointer hover:bg-indigo-500 " value="">Select Group</option>
        {groups.map((group) => (
          <option className=" cursor-pointer" key={group._id} value={group._id}>
            {group.name}
          </option>
        ))}
      </select>

      {/* Profile */}
      <div className="relative ml-4">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => setOpen(!open)}
        >
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm font-medium text-white">{user?.name}</span>
        </div>

        {open && (
          <div className="absolute right-0 mt-2 w-20 bg-white shadow-lg rounded-md overflow-hidden">
            <button
              
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Profile
            </button>

            <button
              onClick={JoinGroup}
              className="block w-full text-left px-4 py-2  hover:bg-gray-100"
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

    </nav>
  );
};

export default Navbar;
