import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// ✅ NO dotenv.config() here needed — your main index.js already does it.

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // ✅ ALWAYS read process.env.JWT_SECRET here, NOT top-level.
    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    console.log("Generated JWT Token:", token);

    res.status(201).json({
      user: { name: newUser.name, email: newUser.email },
      token,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    console.log("✅ Login JWT Token:", token);

    res.status(200).json({
      user: { name: user.name, email: user.email },
      token,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

