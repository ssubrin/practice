const { Pool } = require("pg");

const db = new Pool({
    user: "postgres",
    password: "ssubrin",
    database: "budgetapp",
    port: "5432",
    host: "localhost",
});

module.exports = db;
