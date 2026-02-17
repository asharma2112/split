import React, { useState } from 'react'
import '../components/Register.css'
import Logo from '../assets/download.svg'
import { useNavigate } from 'react-router-dom'

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData, [e.target.name]: e.target.value
    });
  };

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    console.log("Submit clicked");
    e.preventDefault();
    setLoading(true)
    try {

      const res = await fetch("https://split-g38i.onrender.com/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Registration failed");
        setLoading(false);
        return;
      }

      alert("Registration Successfull");
     
        
          navigate("/login");
       
    }
    catch (error) {
      console.log(error);

    }
    finally {
      setLoading(false)
    }
  };

  return (
    <div className='container bg-dark:bg-gray-800'>
      <div className="logo">

        <img src={Logo} alt="" />
      </div>
      <div className="card-container card w-1/3  shadow-md 
            hover:shadow-[0_0_25px_rgba(59,130,246,0.7)] 
            transition duration-300">

        <h1 className='text-3xl font-bold font-sans'>Register</h1>
        <form className='form-container flex flex-col font-mono' onSubmit={handleSubmit}>
          <label htmlFor="name">Name</label>
          <input type="text" name='name' placeholder='Please Enter Name' onChange={handleChange} value={formData.name} />
          <label htmlFor="email">Email</label>
          <input type="text" name='email' placeholder='Please Enter Email' onChange={handleChange} value={formData.email} />
          <label htmlFor="phone">Phone No</label>
          <input type="number" name='phone' placeholder='Please Enter Phone No.' onChange={handleChange} value={formData.phone} />
          <label htmlFor="password">Password</label>

          <input type="password" name='password' placeholder='Please Enter Password' onChange={handleChange} value={formData.password} />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition duration-300"
          >
            {loading ? "Registering..." : "Submit"}
          </button>
          <span className='text-xs cursor-pointer' onClick={() => navigate("/login")}>Already Have an Account? SignIn</span>
        </form>
      </div>
    </div>
  )
}

export default Register