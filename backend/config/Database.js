import { Sequelize } from "sequelize";

// Nyambungin db ke BE
const db = new Sequelize("tcc-uts", "root", "triomacan", {
  host: "34.134.215.121",
  dialect: "mysql",
});

export default db;