import { useParams, useNavigate } from "react-router-dom"
import { useState } from "react"
import Logo from '../assets/Logo.png'
const ResetPassword = () => {
  const { token } = useParams()
  const navigate = useNavigate()
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (password !== confirm) {
      alert("Passwords do not match")
      return
    }

    // Call backend
    await fetch("http://localhost:3000/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password })
    })

    alert("Password updated successfully")
    navigate("/login")
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center ">
         <div className="mb-6">
            <img src={Logo} className="w-[40vw] md:w-[30vw] mx-auto" alt="logo" />
          </div>

      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">

        <h1 className="text-2xl font-bold mb-6 text-center">
          Reset Password
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 rounded"
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="border p-2 rounded"
          />

          <button
            type="submit"
            className="bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Update Password
          </button>

        </form>
      </div>
    </div>
  )
}

export default ResetPassword
