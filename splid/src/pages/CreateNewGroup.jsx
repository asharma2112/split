import { React, useState } from 'react'
import Navbar from '../components/Navbar'
import { useNavigate } from 'react-router-dom'
import FloatingMenu from '../components/FloatingMenu';
import Footer from '../components/Footer';
const CreateNewGroup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        currency: "",
        members: []
    });

    const [memberName, setMemberName] = useState("");
    const [memberInput, setMemberInput] = useState("");
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const addMember = () => {
        const trimmedName = memberName.trim();
        if (!trimmedName) {
            alert("Please Add Member")
            return;
        }

        // Only add if not already in members
        if (!formData.members.includes(trimmedName)) {
            setFormData((prev) => ({
                ...prev,
                members: [...prev.members, trimmedName]
            }));
        } else {
            alert("Member already added");
        }
        setMemberName("")
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");

            const res = await fetch("https://split-g38i.onrender.com/api/auth/creategroup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.message || "Creation failed");
                return;
            }

            alert("Group Created Successfully");
            navigate("/groups");

        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        

                    <div className="heading  mb-10">
                        <h1 className='text-5xl font-sans font-bold text-[rgb(255,94,0)]  '>Create New Group</h1>
                    </div>
                    <div className="card-container inline-block px-8 py-6 shadow-md hover:shadow-[0_0_25px_rgba(59,130,246,0.7)] transition duration-300 font-mono rounded-lg bg-white">
                        <div className=" flex flex-col   flex-wrap  transition duration-300 justify-center items-center font-mono">
                            <form onSubmit={handleSubmit} className=' flex flex-col text-left justify-center item-center font-roboto'>
                                <label htmlFor="groupname">Group Name</label>
                                <input className='' type="text" name="name" placeholder='Add Group Name' onChange={handleChange} value={formData.name} />
                                <label htmlFor="currency">Currency</label>
                                <select onChange={handleChange} name="currency" value={formData.currency} className='p-2'>
                                    <option value="">--Select Currency--</option>
                                    <option value="INR">INR</option>
                                    <option value="USD">USD</option>
                                </select>

                                <label htmlFor="member">Add Member</label>
                                <input
                                    type="text"
                                    placeholder="Enter member name"
                                    value={memberName}
                                    onChange={(e) => setMemberName(e.target.value)} />
                                <ul >
                                    {formData.members.map((m, i) => (
                                        <li className=' bg-yellow-600 p-1 mt-2 rounded' key={i}>{m}</li>
                                    ))}
                                </ul>
                                <div className='justify-around flex  flex flex-col '>
                                    <button type="button" onClick={addMember} className=' bg-blue-600 text-center text-white p-2 rounded'>Add Member</button>
                                    <button className=' bg-green-600 text-center text-white p-2 rounded' type="submit" >Submit</button>
                                </div>

                            </form>



                        </div>
                    </div>
                    {/* <FloatingMenu></FloatingMenu> */}
            
                </main>
                <Footer className="flex justify-bottom"></Footer>
           
        </div>
    )
}
export default CreateNewGroup