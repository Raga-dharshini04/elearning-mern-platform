const User = require("../Models/User");
const bcrypt = require("bcryptjs");

exports.addUser = async (req, res) => {
  try {
    const { name, email, password, role, dob, gender } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      dob,
      gender
    });

    res.status(201).json({ message: "User created successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};