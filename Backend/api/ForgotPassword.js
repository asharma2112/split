const crypto = require("crypto")
const nodemailer = require("nodemailer")
const bcrypt = require("bcrypt")
const User = require("../model/UserScheme")

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

    // Generate raw token
    const rawToken = crypto.randomBytes(32).toString("hex")

    // Hash token before saving (security best practice)
    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex")

    user.resetToken = hashedToken
    user.resetTokenExpiry = Date.now() + 60 * 60 * 1000 // 1 hour

    await user.save()

    const resetLink = `http://localhost:5173/reset-password/${rawToken}`

    await sendEmail(user.email, resetLink)

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

    // Hash incoming token to compare with DB
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

    // Hash new password
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


/*
========================================
EMAIL SENDER FUNCTION
========================================
*/

const sendEmail = async (to, link) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS,
    },
  });

  const info = await transporter.sendMail({
    from: `"SplitMate Support" <${process.env.EMAIL}>`,
    to,
    subject: "Password Reset - SplitMate",
    html: `
      <h2>Password Reset</h2>
      <p>Click below to reset your password:</p>
      <a href="${link}">${link}</a>
    `,
  });

  console.log("Email sent:", info.response);
};



module.exports = {
  forgotPassword,
  resetPassword,
}
