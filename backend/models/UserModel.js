import { Sequelize } from "sequelize";
import db from "../config/Database.js";

// Membuat tabel "user"
const User = db.define(
  "user", // Nama Tabel
  {
    name: Sequelize.STRING,
    email: Sequelize.STRING,
    password: Sequelize.STRING
  }
);

User.createAdminUser = async () => {
  const [user, created] = await User.findOrCreate({
    where: { email: "admin@upn.com" },
    defaults: {
      name: "admin",
      email: "admin@upn.com",
      password: "password" // Store plain text password
    }
  });
  if (created) {
    console.log("Admin user created.");
  } else {
    console.log("Admin user already exists.");
  }
};

db.sync().then(() => console.log("Database synced"));

export default User;
