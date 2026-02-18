import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Logo from "../assets/Logo.png"

const ForgotPassword = () => {
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
  e.preventDefault()

  try {
    const res = await fetch("http://localhost:3000/api/auth/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email })
    })

    const data = await res.json()

    if (res.ok) {
      setSent(true)
    } else {
      alert(data.message)
    }

  } catch (error) {
    console.error("Error:", error)
    alert("Something went wrong")
  }
}


  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 ">

      <div className="mb-6">
        <img src={Logo} className="w-36 md:w-44 mx-auto" alt="logo" />
      </div>

      <div className="w-full max-w-sm bg-white p-6 rounded-xl shadow-lg">

        <h1 className="text-3xl font-bold text-center mb-6">
          Forgot Password
        </h1>

        {sent ? (
          <p className="text-green-600 text-center">
            Reset link sent to your email.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            <input
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border p-2 rounded"
              required
            />

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition"
            >
              Send Reset Link
            </button>

          </form>
        )}

        <div className="text-center mt-4">
          <span
            onClick={() => navigate("/login")}
            className="text-sm cursor-pointer hover:text-blue-600"
          >
            Back to Login
          </span>
        </div>

      </div>

    </div>
  )
}

export default ForgotPassword
