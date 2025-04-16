import express from "express";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getUserById,
  login,
  logout
} from "../controllers/UserController.js";

const router = express.Router();

router.get("/api/users", getUsers); // Ensure all routes are prefixed with /api
router.get("/api/users/:id", getUserById);
router.post("/api/add-user", createUser);
router.put("/api/edit-user/:id", updateUser);
router.delete("/api/delete-user/:id", deleteUser);
router.post("/login", login); // Remove redundant /api prefix
router.post("/logout", logout); // Remove redundant /api prefix

export default router;