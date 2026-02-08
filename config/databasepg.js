const { Pool } = require("pg");
require("dotenv").config({ quiet: true });

const pool = new Pool({
  host: process.env.PG_HOST,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  port: process.env.PG_PORT,
});

// Optional: log unexpected pool errors
pool.on("error", (err) => {
  console.error("Unexpected PG error", err);
  process.exit(1);
});

module.exports = pool;
