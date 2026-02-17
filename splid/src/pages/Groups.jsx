import { useEffect, useState, useContext } from "react";
import Navbar from '../components/Navbar'
import bin from '../assets/bin.png'
import { useNavigate } from 'react-router-dom'
import edit from '../assets/edit.svg'
import { GroupContext } from "../context/GroupContext";
import JoinGroup from "./JoinGroup";
const Groups = () => {
  const [groups, setGroups] = useState([]);
  const { activeGroup, setActiveGroup } = useContext(GroupContext);

  //update members
  const [editingMember, setEditingMember] = useState(null);
  const [updatedName, setUpdatedName] = useState("");




  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [newMember, setNewMember] = useState("");

  // ================= FETCH GROUPS =================
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/auth/groups", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setGroups(Array.isArray(data) ? data : []);
      } catch (error) {
        console.log("Error:", error);
        setGroups([]);
      } finally {
        setLoading(false);
      }
    };
    fetchGroups();
  }, [token]);

  // ================= ADD MEMBER ====================

  const handleAddMember = async () => {
    if (!newMember.trim()) return;

    try {
      const res = await fetch(
        `http://localhost:3000/api/auth/addmember/${activeGroup._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ memberName: newMember }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      // ✅ Use backend updated group directly
      setActiveGroup(data.group);

      setGroups(prev =>
        prev.map(group =>
          group._id === data.group._id ? data.group : group
        )
      );

      setNewMember("");

    } catch (error) {
      console.log(error);
    }
  };

  // ================== Update MEMBER ==================

  const handleUpdateMember = (oldName) => {
    const trimmedName = updatedName.trim();

    // If empty → do nothing
    if (!trimmedName) {
      setEditingMember(null);
      return;
    }

    // If name is same → just close edit mode
    if (trimmedName === oldName) {
      setEditingMember(null);
      return;
    }

    // If name changed → update
    const updatedMembers = activeGroup.members.map((m) =>
      m === oldName ? trimmedName : m
    );

    setActiveGroup((prev) => ({
      ...prev,
      members: updatedMembers,
    }));

    setEditingMember(null);
    setUpdatedName("");
  };




  // ================= REMOVE MEMBER =================
  const handleRemoveMember = async (groupId, memberName) => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/auth/remove-member/${groupId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ memberName }),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Failed to remove member");
        return;
      }

      // Update active group UI
      setActiveGroup(data.group);

      // Update group list UI
      setGroups((prevGroups) =>
        prevGroups.map((group) =>
          group._id === data.group._id ? data.group : group
        )
      );

    } catch (error) {
      console.log("Remove error:", error);
    }
  };

  const handleNavigate = () => {
    navigate('/createnewgroup')
  }

  return (
    <>
      <Navbar />
      <div className="p-6 flex flex-col  w-full h-[90vh] gap-8 ">
        <div className="heading">
          <h1 className="text-6xl font-sans font-bold text-[rgb(255,94,0)]">
            {activeGroup?.name} Group
          </h1>
        </div>
        {loading && <p>Loading groups...</p>}
        {!loading && groups.length === 0 && (
          <p className="text-gray-500">No groups found.</p>
        )}

        {/* Groups List */}

        {/* Update Member */}



        {/* Members Display */}
        <div className="displayMembers flex justify-center">
          <div>
            {activeGroup && (
              <div className="bg-gray-50 p-5 w-[80vw] rounded">
                <h1 className="text-4xl font-bold mb-5">
                  Members of {activeGroup.name}
                </h1>
                <div className="flex gap-3 mb-4">
                  <input
                    type="text"
                    value={newMember}
                    onChange={(e) => setNewMember(e.target.value)}
                    placeholder="Enter new member name"
                    className="border p-2 rounded w-full shadow-lg shadow" />
                  <button onClick={handleAddMember} className="bg-green-500 font-bold text-white px-4 rounded">Add</button>
                </div>
                <ul className="flex flex-col gap-3">
                  {activeGroup.members?.length > 0 ? (
                    activeGroup.members.map((member, index) => (
                      <li
                        key={index}
                        className="text-center p-2 shadow-lg border text-orange-500 rounded-lg text-xl font-bold gap-2 flex justify-between items-center"
                      >
                        {/* If editing this member */}
                        {editingMember === member ? (
                          <input autoFocus
                            value={updatedName}
                            onChange={(e) => setUpdatedName(e.target.value)}
                            className="border p-1 text-sm rounded text-black"
                          />
                        ) : (
                          <span>{member}</span>
                        )}

                        <div className="flex gap-5 items-center">
                          {/* EDIT / SAVE BUTTON */}
                          {editingMember === member ? (
                            <button
                              onClick={() => handleUpdateMember(member)}
                              className="bg-green-500 p-1  text-sm text-white rounded"
                            >
                              Save
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                setEditingMember(member);
                                setUpdatedName(member);
                              }}
                              className="bg-blue-500 p-1  text-sm text-white rounded"
                            >
                              Edit
                            </button>
                          )}

                          {/* DELETE BUTTON */}
                          <img
                            className="w-5 cursor-pointer"
                            src={bin}
                            alt="delete"
                            onClick={() =>
                              handleRemoveMember(activeGroup._id, member)
                            }
                          />
                        </div>
                      </li>
                    ))
                  ) : (
                    <p className="text-gray-500">No members found.</p>
                  )}
                </ul>

              </div>
            )}
          </div>
        </div>
        {activeGroup?.inviteCode && (
          <div className="flex justify-center">

          <div className="bg-white p-4 w-1/4  rounded shadow mt-4">
            <h2 className="font-bold text-lg">Invite Members using Code</h2>

            <div className="flex items-center justify-between mt-2">
              <span className="text-xl font-mono text-green-600">
                {activeGroup.inviteCode}
              </span>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(activeGroup.inviteCode);
                  alert("Code copied!");
                }}
                className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                Copy
              </button>
            </div>
          </div>
                </div>
        )}

      </div>
    </>
  );
};

export default Groups;
