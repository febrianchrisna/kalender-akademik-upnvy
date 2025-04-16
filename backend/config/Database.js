import { Sequelize } from "sequelize";

// Nyambungin db ke BE
const db = new Sequelize("tcc-uts", "root", "febrian123", {
  host: "34.44.61.23",
  dialect: "mysql",
});

export default db;