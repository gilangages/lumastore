const mysql = require("mysql2");
require("dotenv").config();

// Gunakan fallback (||) agar jika .env kosong/tidak terbaca, sistem tetap jalan dengan default
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root", // Default ke root jika kosong
  password: process.env.DB_PASS || "", // Default password kosong
  database: process.env.DB_NAME || "lumastore_db", // Pastikan nama DB benar
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Menggunakan Promise agar bisa pakai async/await (Modern Style)
const db = pool.promise();

// Cek koneksi saat awal jalan (Optional, buat debugging aja)
pool.getConnection((err, connection) => {
  if (err) {
    console.error("❌ Database Connection Failed:", err.message);
  } else {
    console.log("✅ Database Connected Successfully!");
    connection.release();
  }
});

module.exports = db;
