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
    // 1. Ambil data text dari body
    const { name, price, description, file_url } = req.body;

    // --- VALIDASI KETAT ---
    // Cek apakah file gambar ada?
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Minimal upload 1 gambar produk!",
      });
    }

    // Cek apakah field text lengkap?
    if (!name || !price || !description) {
      return res.status(400).json({
        success: false,
        message: "Nama, Harga, dan Deskripsi wajib diisi!",
      });
    }

    // 2. Logic Upload Gambar
    const protocol = req.protocol;
    const host = req.get("host");

    const imageUrls = req.files.map((file) => {
      return `${protocol}://${host}/uploads/${file.filename}`;
    });

    const mainImage = imageUrls[0];
    const imagesJson = JSON.stringify(imageUrls);

    // 3. Simpan ke Database
    const query =
      "INSERT INTO products (name, price, description, image_url, images, file_url) VALUES (?, ?, ?, ?, ?, ?)";

    const [result] = await db.query(query, [name, price, description, mainImage, imagesJson, file_url || null]);

    res.status(201).json({
      success: true,
      message: "Produk berhasil ditambahkan!",
      data: {
        id: result.insertId,
        name,
        price,
        description,
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

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price, description, deleted_images } = req.body;

  try {
    // 1. Cek apakah produk ada?
    const [existing] = await db.query("SELECT * FROM products WHERE id = ?", [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: "Produk tidak ditemukan" });
    }

    const oldData = existing[0];

    // 2. Logic Penggabungan Gambar
    // Ambil gambar lama dari DB (parse JSON jika string, atau array kosong)
    let currentImages = [];
    if (oldData.images) {
      currentImages = typeof oldData.images === "string" ? JSON.parse(oldData.images) : oldData.images;
    } else if (oldData.image_url) {
      currentImages = [oldData.image_url];
    }

    // A. Hapus gambar yang diminta user (FILTERING)
    if (deleted_images) {
      const deletedList = JSON.parse(deleted_images); // Parse string array dari frontend
      currentImages = currentImages.filter((img) => !deletedList.includes(img));
    }

    // B. Tambah gambar baru jika ada (APPENDING)
    if (req.files && req.files.length > 0) {
      const protocol = req.protocol;
      const host = req.get("host");

      const newImageUrls = req.files.map((file) => {
        return `${protocol}://${host}/uploads/${file.filename}`;
      });

      currentImages = [...currentImages, ...newImageUrls];
    }

    // C. Tentukan Main Image (Thumbnail)
    // Ambil gambar pertama dari array hasil gabungan, jika kosong set null
    const finalMainImage = currentImages.length > 0 ? currentImages[0] : null;
    const finalImagesJson = JSON.stringify(currentImages);

    // 3. Update Database
    const query = `
      UPDATE products
      SET name = ?, price = ?, description = ?, image_url = ?, images = ?
      WHERE id = ?
    `;

    await db.query(query, [name, price, description, finalMainImage, finalImagesJson, id]);

    res.status(200).json({
      success: true,
      message: "Produk berhasil diupdate!",
      data: {
        images: currentImages,
      },
    });
  } catch (error) {
    console.error("Error update product:", error);
    res.status(500).json({ success: false, message: "Gagal update produk", error: error.message });
  }
};
// Pastikan export namanya SAMA dengan yang di atas
module.exports = { getAllProducts, createProduct, deleteProduct, updateProduct };
