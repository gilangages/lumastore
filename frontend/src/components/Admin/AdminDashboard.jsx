import { useState, useEffect } from "react";
import { Plus, Save, Image as ImageIcon } from "lucide-react";
import { createProduct, getAllProducts } from "../../lib/api/ProductApi"; // Pastikan import ini benar
import { useLocalStorage } from "react-use";
import { alertError, alertSuccess } from "../../lib/alert";

export default function AdminDashboard() {
  const [token, _] = useLocalStorage("token", "");

  // State Form
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]); // Ganti images string jadi files object
  const [isLoading, setIsLoading] = useState(false);

  // State List Produk
  const [products, setProducts] = useState([]);

  // Fetch data produk saat load
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await getAllProducts();
      if (res.success) setProducts(res.data);
    } catch (error) {
      console.error("Gagal ambil produk", error);
    }
  };

  const handleFileChange = (e) => {
    // Simpan file yang dipilih ke state
    setFiles(e.target.files);
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 1. Gunakan FormData untuk kirim File + Text
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("description", description);

      // 2. Masukkan semua file gambar ke key "images"
      // (Harus loop manual karena FileList bukan array biasa)
      for (let i = 0; i < files.length; i++) {
        formData.append("images", files[i]);
      }

      // 3. Panggil API
      const response = await createProduct(token, formData);
      const responseBody = await response.json();

      if (response.status === 201) {
        await alertSuccess("Produk berhasil dibuat!");
        // Reset Form
        setName("");
        setPrice("");
        setDescription("");
        setFiles([]);
        document.getElementById("fileInput").value = ""; // Reset input file HTML
        fetchProducts(); // Refresh list kanan
      } else {
        await alertError(responseBody.message || "Gagal upload");
      }
    } catch (error) {
      console.error(error);
      await alertError("Terjadi kesalahan sistem");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-[#3e362e]">Dashboard Produk</h1>
        <p className="text-[#8c8478]">Kelola koleksi stiker LumaStore</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* FORM INPUT (Kiri) */}
        <div className="lg:col-span-1">
          <div className="bg-white border-2 border-[#e5e0d8] rounded-xl p-6 sticky top-6 shadow-sm">
            <h2 className="font-bold text-xl mb-4 flex items-center gap-2 text-[#8da399]">
              <Plus size={20} /> Tambah Produk
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nama */}
              <div>
                <label className="text-sm font-bold text-[#3e362e]">Nama Produk</label>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border-2 border-[#e5e0d8] rounded-lg p-2 mt-1 focus:border-[#8da399] outline-none"
                  placeholder="Contoh: Stiker Kucing"
                />
              </div>

              {/* Harga */}
              <div>
                <label className="text-sm font-bold text-[#3e362e]">Harga (Rp)</label>
                <input
                  required
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full border-2 border-[#e5e0d8] rounded-lg p-2 mt-1 focus:border-[#8da399] outline-none"
                  placeholder="15000"
                />
              </div>

              {/* Deskripsi */}
              <div>
                <label className="text-sm font-bold text-[#3e362e]">Deskripsi</label>
                <textarea
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border-2 border-[#e5e0d8] rounded-lg p-2 mt-1 focus:border-[#8da399] outline-none h-24 resize-none"
                  placeholder="Deskripsi singkat..."
                />
              </div>

              {/* Upload Gambar (Penting: Type File) */}
              <div>
                <label className="text-sm font-bold text-[#3e362e] mb-1 block">Foto Produk (Wajib)</label>
                <div className="border-2 border-dashed border-[#e5e0d8] rounded-lg p-4 text-center hover:border-[#8da399] transition-colors">
                  <input
                    id="fileInput"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    required
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-[#3e362e] file:text-white hover:file:bg-[#5a4e44]"
                  />
                  <p className="text-xs text-gray-400 mt-2">
                    {files.length > 0 ? `${files.length} file dipilih` : "Pilih satu atau banyak gambar"}
                  </p>
                </div>
              </div>

              {/* Tombol Simpan */}
              <button
                disabled={isLoading}
                type="submit"
                className="w-full bg-[#3e362e] text-white font-bold py-3 rounded-lg hover:bg-[#5a4e44] transition-all flex justify-center items-center gap-2 disabled:opacity-50">
                {isLoading ? (
                  "Menyimpan..."
                ) : (
                  <>
                    <Save size={18} /> Simpan Produk
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* LIST PRODUK (Kanan) */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="font-bold text-xl text-[#3e362e]">Daftar Produk ({products.length})</h2>

          {products.length === 0 && <p className="text-gray-400 italic">Belum ada produk.</p>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white border border-[#e5e0d8] rounded-lg p-3 flex gap-4 hover:shadow-md transition-shadow items-center">
                <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                  <img
                    src={product.image_url || "https://placehold.co/100"}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => (e.target.src = "https://placehold.co/100?text=Error")}
                  />
                </div>
                <div className="flex-grow">
                  <h3 className="font-bold text-[#3e362e] line-clamp-1">{product.name}</h3>
                  <p className="text-[#8da399] font-bold text-sm">
                    Rp {parseInt(product.price).toLocaleString("id-ID")}
                  </p>
                  <p className="text-xs text-gray-400 mt-1 line-clamp-2">{product.description}</p>
                </div>
                {/* Indikator jumlah foto */}
                {product.images && product.images.length > 1 && (
                  <span className="text-xs bg-[#f3f0e9] px-2 py-1 rounded text-[#8c8478] flex items-center gap-1">
                    <ImageIcon size={10} /> +{product.images.length - 1}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
