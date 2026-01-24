const db = require("../config/database");

// 1. Ganti nama jadi getAllProducts (biar cocok sama routes)
const getAllProducts = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM products ORDER BY id DESC");

    // Parsing JSON images jika ada
    const products = rows.map((product) => ({
      ...product,
      images: typeof product.images === "string" ? JSON.parse(product.images) : product.images || [product.image_url],
    }));

    res.status(200).json({
      success: true,
      message: "List Data Produk",
      data: products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    // 1. Ambil data text dari body (termasuk description)
    const { name, price, description, file_url } = req.body;

    // Validasi input wajib
    if (!name || !price) {
      return res.status(400).json({ success: false, message: "Nama dan Harga wajib diisi!" });
    }

    // 2. Logic Upload Gambar (Dari Device/Multer)
    let imageUrls = [];

    if (req.files && req.files.length > 0) {
      // Jika admin upload gambar, buat URL untuk setiap file
      const protocol = req.protocol;
      const host = req.get("host");

      imageUrls = req.files.map((file) => {
        return `${protocol}://${host}/uploads/${file.filename}`;
      });
    } else {
      // Jika tidak ada gambar diupload, pakai placeholder
      imageUrls.push("https://placehold.co/600x400");
    }

    // Gambar pertama jadi thumbnail utama
    const mainImage = imageUrls[0];

    // Simpan semua gambar (gallery) sebagai JSON string
    const imagesJson = JSON.stringify(imageUrls);

    // 3. Simpan ke Database (Kolom description TETAP DISIMPAN)
    const query =
      "INSERT INTO products (name, price, description, image_url, images, file_url) VALUES (?, ?, ?, ?, ?, ?)";

    // Perhatikan urutan parameter harus sesuai dengan urutan kolom di query
    const [result] = await db.query(query, [
      name,
      price,
      description || "", // Default string kosong jika description null
      mainImage,
      imagesJson,
      file_url || null,
    ]);

    res.status(201).json({
      success: true,
      message: "Produk berhasil ditambahkan!",
      data: {
        id: result.insertId,
        name,
        price,
        description, // Dikembalikan juga di response
        image_url: mainImage,
        images: imageUrls,
        file_url,
      },
    });
  } catch (error) {
    console.error("Error create product:", error);
    res.status(500).json({ success: false, message: "Gagal menyimpan produk", error: error.message });
  }
};

// 3. Tambahkan fungsi Delete (karena dipanggil di routes)
const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    // Cek dulu apakah produk ada (Opsional, tapi best practice)
    const [check] = await db.query("SELECT * FROM products WHERE id = ?", [id]);
    if (check.length === 0) {
      return res.status(404).json({ success: false, message: "Produk tidak ditemukan" });
    }

    // Lakukan penghapusan
    await db.query("DELETE FROM products WHERE id = ?", [id]);

    res.status(200).json({
      success: true,
      message: "Produk berhasil dihapus",
    });
  } catch (error) {
    console.error("Error delete product:", error);
    res.status(500).json({ success: false, message: "Gagal menghapus produk", error: error.message });
  }
};

// Pastikan export namanya SAMA dengan yang di atas
module.exports = { getAllProducts, createProduct, deleteProduct };
