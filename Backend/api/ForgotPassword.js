const crypto = require("crypto")
const bcrypt = require("bcrypt")
const { Resend } = require("resend")
const User = require("../model/UserScheme")

const resend = new Resend(process.env.RESEND_API_KEY)

/*
========================================
FORGOT PASSWORD CONTROLLER
========================================
*/

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ message: "Email is required" })
    }

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    const rawToken = crypto.randomBytes(32).toString("hex")

    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex")

    user.resetToken = hashedToken
    user.resetTokenExpiry = Date.now() + 60 * 60 * 1000

    await user.save()

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${rawToken}`

    await resend.emails.send({
      from: "SplitMate <onboarding@resend.dev>",
      to: user.email,
      subject: "Reset Your Password",
      html: `
        <h2>Password Reset</h2>
        <p>Click below to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
      `,
    })

    res.json({ message: "Reset link sent to your email" })

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Something went wrong" })
  }
}

/*
========================================
RESET PASSWORD CONTROLLER
========================================
*/

const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body

    if (!token || !password) {
      return res.status(400).json({ message: "Invalid request" })
    }

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex")

    const user = await User.findOne({
      resetToken: hashedToken,
      resetTokenExpiry: { $gt: Date.now() }
    })

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    user.password = hashedPassword
    user.resetToken = undefined
    user.resetTokenExpiry = undefined

    await user.save()

    res.json({ message: "Password updated successfully" })

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Something went wrong" })
  }
}

module.exports = {
  forgotPassword,
  resetPassword,
}
