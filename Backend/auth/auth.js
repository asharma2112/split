const User = require('../model/UserScheme')
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
    console.log("REGISTER HIT", req.body);
    try {
        const { name, email, phone, password } = req.body;
        if (!name || !email || !phone || !password) {
            return res.status(400).json({ message: "All fields are required." });
        }
        const userExist = await User.findOne({ email });
        if (userExist) {
            return res.status(400).json({ message: "User Already Exist." })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name, email, phone, password: hashedPassword,
        })
        res.status(201).json({ message: "User Registered Successfully." })
    }
    catch (error) {
        console.log(error)
        res.status(501).json({ message: "Server Error" })
    }
}

const login = async (req, res) => {

    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required." });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid Email or Password" })
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {

            return res.status(400).json({ message: "Invalid Email or Password" })
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        if (res.status === 401) {
            localStorage.removeItem("token");
            navigate("/login");
            return;
        }

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    }
    catch (error) {
        console.log(error)
        res.status(501).json({ message: "Server Error" })
    }
}

module.exports = { login, register };