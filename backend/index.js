const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { Pool } = require("pg");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const pool = new Pool({
  host: "db",
  port: 5432,
  user: "postgres",
  password: "1234",
  database: "testdb"
});

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.get("/api/videos", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM videos");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/videos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM videos WHERE id = $1", [id]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.use((err, req, res, next) => {
  console.error("Erreur serveur:", err.stack);
  res.status(500).json({ error: 'Une erreur interne est survenue sur le serveur' });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Serveur StreamNova démarré sur le port ${PORT}`);
});