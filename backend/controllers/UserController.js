import User from "../models/UserModel.js";
import bcrypt from "bcrypt";

// GET
async function getUsers(req, res) {
  try {
    const response = await User.findAll();
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: error.message });
  }
}

// GET BY ID
async function getUserById(req, res) {
  try {
    const response = await User.findOne({ where: { id: req.params.id } });
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: error.message });
  }
}

// CREATE
async function createUser(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
    await User.create({ name, email, password: hashedPassword });
    res.status(201).json({ msg: "User Created" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: error.message });
  }
}

// UPDATE
async function updateUser(req, res) {
  try {
    const inputResult = req.body;
    await User.update(inputResult, {
      where: { id: req.params.id },
    });
    res.status(200).json({ msg: "User Updated" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: error.message });
  }
}

// DELETE
async function deleteUser(req, res) {
  try {
    await User.destroy({ where: { id: req.params.id } });
    res.status(200).json({ msg: "User Deleted" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: error.message });
  }
}

// LOGIN
async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Email and password are required" });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (user.password !== password) { // Directly compare plain text passwords
      return res.status(401).json({ msg: "Invalid password" });
    }

    // Set session data
    req.session.userId = user.id;

    res.status(200).json({
      msg: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: error.message });
  }
}

// LOGOUT
async function logout(req, res) {
  req.session.destroy((err) => {
    if (err) {
      console.error("Failed to destroy session:", err);
      return res.status(500).json({ msg: "Unable to logout" });
    }
    res.clearCookie("connect.sid", { path: "/" }); // Clear the session cookie
    res.status(200).json({ msg: "Logout successful" }); // Ensure JSON response
  });
}

export { getUsers, getUserById, createUser, updateUser, deleteUser, login, logout };
