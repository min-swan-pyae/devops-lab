const http = require("node:http");
const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.DB_HOST || "db",
  port: Number(process.env.DB_PORT || 5432),
  database: process.env.DB_NAME || "appdb",
  user: process.env.DB_USER || "appuser",
  password: process.env.DB_PASSWORD
});

const server = http.createServer(async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  if (req.url === "/health") {
  try {
    await pool.query("SELECT 1");
    res.writeHead(200);
    return res.end(JSON.stringify({ status: "ok", database: "connected" }));
  } catch (error) {
    res.writeHead(503);
    return res.end(JSON.stringify({ status: "error", database: "unavailable" }));
  }
}

  if (req.url !== "/") {
    res.writeHead(404);
    return res.end(JSON.stringify({ error: "Not found" }));
  }

  try {
    const result = await pool.query(`
      INSERT INTO visits DEFAULT VALUES
      RETURNING id, visited_at
    `);

    const count = await pool.query(
      "SELECT COUNT(*)::int AS total FROM visits"
    );

    res.writeHead(200);
    res.end(JSON.stringify({
      message: "Visit recorded!",
      visit: result.rows[0].id,
      totalVisits: count.rows[0].total,
      visitedAt: result.rows[0].visited_at
    }));
  } catch (error) {
    console.error("Database query failed:", error.message);
    res.writeHead(500);
    res.end(JSON.stringify({ error: "Database query failed" }));
  }
});

async function start() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS visits (
      id SERIAL PRIMARY KEY,
      visited_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  server.listen(3000, "0.0.0.0", () => {
    console.log("Visit counter listening on port 3000");
  });
}

start().catch((error) => {
  console.error("Application startup failed:", error.message);
  process.exit(1);
});
