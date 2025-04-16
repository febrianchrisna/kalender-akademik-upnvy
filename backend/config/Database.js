import { Sequelize } from "sequelize";

// Nyambungin db ke BE
const db = new Sequelize("tcc-uts", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

export default db;