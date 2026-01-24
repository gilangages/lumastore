import { useState, useEffect } from "react";
import { getAllProducts } from "../../../lib/api/ProductApi";
import { Image as ImageIcon, Edit, Trash2, Search, RefreshCw } from "lucide-react";
import { alertError } from "../../../lib/alert";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true); // Tambahkan state loading

  // Gunakan useEffect standar React (Best Practice)
  useEffect(() => {
    fetchProducts();
  }, []); // [] artinya jalan sekali pas komponen muncul

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      // 1. Dapatkan response mentah
      const response = await getAllProducts();

      // 2. Parsing response ke JSON
      const res = await response.json();

      if (res.success) {
        setProducts(res.data);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("Gagal ambil produk", error);
      alertError("Gagal mengambil data produk");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProducts = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="max-w-6xl mx-auto animate-slide-up">
      <header className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#3e362e]">Daftar Produk</h1>
          <p className="text-[#8c8478]">Kelola semua stiker yang sudah diupload.</p>
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          {/* Search Bar */}
          <div className="relative flex-grow md:flex-grow-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Cari produk..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border-2 border-[#e5e0d8] rounded-lg focus:border-[#8da399] outline-none w-full md:w-64"
            />
          </div>
          {/* Tombol Refresh Manual */}
          <button
            onClick={fetchProducts}
            className="p-2 bg-[#f3f0e9] rounded-lg hover:bg-[#e5e0d8] text-[#3e362e] transition"
            title="Refresh Data">
            <RefreshCw size={20} className={isLoading ? "animate-spin" : ""} />
          </button>
        </div>
      </header>

      {/* TAMPILAN LOADING */}
      {isLoading ? (
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#3e362e]"></div>
          <p className="text-gray-400 mt-2">Memuat produk...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        /* TAMPILAN KOSONG */
        <div className="text-center py-20 bg-white border-2 border-dashed border-[#e5e0d8] rounded-xl">
          <p className="text-gray-400 italic">
            {products.length === 0 ? "Belum ada produk." : "Produk tidak ditemukan."}
          </p>
        </div>
      ) : (
        /* LIST PRODUK */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Ganti bagian mapping card di ProductList.jsx dengan ini */}
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white p-3 rounded-xl border-2 border-[#E5E0D8] shadow-sm hover:shadow-md transition-all flex flex-col h-full group">
              {/* Gambar Polaroid */}
              <div className="aspect-square bg-[#F3F0E9] rounded-lg overflow-hidden mb-3 relative border border-[#E5E0D8]">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => (e.target.src = "https://placehold.co/400?text=Error")}
                />
                {/* Badge Harga */}
                <div className="absolute top-2 right-2 bg-white/90 border border-[#3E362E] text-[#3E362E] text-xs font-bold px-2 py-1 rounded backdrop-blur-sm">
                  Rp {parseInt(product.price).toLocaleString("id-ID")}
                </div>
              </div>

              {/* Info Produk */}
              <div className="flex-grow">
                <h3 className="font-bold text-[#3E362E] text-lg leading-tight mb-1">{product.name}</h3>
                <p className="text-xs text-[#8C8478] line-clamp-2 h-8 mb-2">{product.description}</p>
              </div>

              {/* Action Buttons (Grid 2 Kolom) */}
              <div className="grid grid-cols-2 gap-2 mt-auto pt-3 border-t border-[#F3F0E9]">
                <button
                  onClick={() => console.log("Open Edit Modal", product.id)}
                  className="flex items-center justify-center gap-1 py-2 text-sm font-bold text-[#3E362E] bg-[#F3F0E9] rounded hover:bg-[#E5E0D8] transition-colors">
                  <Edit size={16} /> Edit
                </button>
                <button
                  onClick={() => confirm("Hapus produk ini?")} // Nanti diganti fungsi delete
                  className="flex items-center justify-center gap-1 py-2 text-sm font-bold text-red-600 bg-red-50 rounded hover:bg-red-100 transition-colors">
                  <Trash2 size={16} /> Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
