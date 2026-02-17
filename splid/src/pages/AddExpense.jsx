import { useContext, useState } from "react";
import Navbar from "../components/Navbar";
import { GroupContext } from "../context/GroupContext";

const AddExpense = () => {
    const { activeGroup } = useContext(GroupContext);

    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    const [paidBy, setPaidBy] = useState("");
    const [date, setDate] = useState("");
    const [splitMembers, setSplitMembers] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!description || !amount || !paidBy || splitMembers.length === 0 || !date) {
            alert("All fields required");
            return;
        }

        const res = await fetch(
            "https://split-g38i.onrender.com/api/auth/addexpense",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    groupId: activeGroup._id,
                    description,
                    amount: Number(amount),
                    paidBy,
                    date,
                    members: splitMembers,
                }),
            }
        );

        const data = await res.json();

        if (res.ok) {
            alert("Expense added successfully");
            setDescription("");
            setAmount("");
            setPaidBy("");
            setDate("");
            setSplitMembers([]);
        } else {
            alert(data.message);
        }
    };

    return (
        <div>
            <Navbar />
            <div className="flex justify-center">
                <div className="container w-1/2  flex flex-col items-center px-4">
                    <div className="heading mb-5 text-center">
                        <h1 className="text-4xl md:text-6xl font-bold text-[rgb(255,94,0)]">
                            Add New Expense
                        </h1>
                    </div>

                    <div className="card-container  w-full sm:w-3/4 md:w-1/2 lg:w-1/3 shadow-md hover:shadow-[0_0_25px_rgba(59,130,246,0.7)] transition duration-300 flex flex-col justify-center items-center font-mono p-6">
                        <form
                            onSubmit={handleSubmit}
                            className="form-container flex flex-col gap-2 w-full"
                        >
                            {/* Title */}
                            <label>Title</label>
                            <input
                                className="w-full border p-2 rounded"
                                type="text"
                                placeholder="Add Title of your expense"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />

                            {/* Amount */}
                            <label>Amount</label>
                            <input
                                type="number"
                                placeholder="Enter Amount"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="border p-2 rounded w-full"
                            />

                            {/* Expense By */}
                            <label className="font-bold">Expense By</label>
                            <select
                                value={paidBy}
                                onChange={(e) => setPaidBy(e.target.value)}
                                className="border p-2 rounded w-full"
                            >
                                <option value="">Select Member</option>
                                {activeGroup?.members?.map((member, index) => (
                                    <option key={index} value={member}>
                                        {member}
                                    </option>
                                ))}
                            </select>

                            {/* Expense For */}
                            <label className="font-bold mt-2">Expense For</label>
                            <div className="flex flex-col gap-2 bg-white rounded p-2 max-h-40 overflow-y-auto">
                                {activeGroup?.members?.map((member, index) => (
                                    <label key={index} className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={splitMembers.includes(member)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSplitMembers([...splitMembers, member]);
                                                } else {
                                                    setSplitMembers(
                                                        splitMembers.filter((m) => m !== member)
                                                    );
                                                }
                                            }}
                                        />
                                        {member}
                                    </label>
                                ))}


                            </div>

                            <div>
                                <input type="date" name="date" onChange={(e)=>setDate(e.target.value)} />
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                className="bg-green-500 text-white p-2 rounded font-bold mt-4"
                            >
                                Add Expense
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddExpense;
