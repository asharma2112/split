import { React, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from '../assets/Logo.png'



const Login = () => {
  let navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("https://split-g38i.onrender.com/api/auth/login", {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Login Failed")
        setLoading(false);
        return;
      }
      localStorage.setItem("token", data.token);
      console.log("Login Successful")
      alert("Login Successful")
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/");


    } 
    catch (error) {

    }

  }
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 ">

  {/* Logo */}
  <div className="mb-6">
    <img src={Logo} className="w-[40vw] md:w-[30vw] mx-auto" alt="logo" />
  </div>

  {/* Card */}
  <div className="
    w-full 
    max-w-sm 
    bg-white 
    p-6 
    rounded-xl 
    shadow-lg
  ">
       
    
    
        <h1 className='text-3xl font-bold font-sans'>Login</h1>
        <form onSubmit={handleSubmit} className='form-container flex flex-col font-mono'>

          <label htmlFor="email">Email</label>
          <input type="text" name='email' placeholder='Please Enter Email' onChange={(e) => setEmail(e.target.value)} />

          <label htmlFor="password">Password</label>
          <input type="text" name='password' placeholder='Please Enter Password' onChange={(e) => setPassword(e.target.value)} />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition duration-300">
            Submit
          </button>
          <div className="other text-xs flex flex-row justify-between cursor-pointer ">
            <div className="forgot">

              <span onClick={()=> navigate("/forgot-password")}>Forgot Password?</span>
            </div>
            <div className="signup">
              <span onClick={() => navigate("/register")} className='text-xs'>Don't Have an Account? SignUp</span>

            </div>
          </div>
        </form>
      </div>
    </div>

  )
}

export default Login

