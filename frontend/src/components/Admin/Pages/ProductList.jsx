import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { getAllProducts, productDelete } from "../../../lib/api/ProductApi";
import { Search, RefreshCw, X, ChevronLeft, ChevronRight } from "lucide-react";
import { alertConfirm, alertError, alertSuccess } from "../../../lib/alert";
import AdminProductCard from "../Card/AdminProductCard";
import { useLocalStorage } from "react-use";
import EditProductModal from "./EditProductModal";

export default function ProductList() {
  const [token, _] = useLocalStorage("token", "");
  const [products, setProducts] = useState([]);
  const [search, _setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // --- LOGIC MODAL & CAROUSEL ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImages, setCurrentImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // --- LOGIC SWIPE (Touch) ---
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [reload, setReload] = useState(false);

  //Edit
  const [editingProduct, setEditingProduct] = useState(null);

  // Jarak minimum swipe (biar ga sensitif banget kesentuh dikit)
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    // Swipe ke Kiri (Next Image)
    if (isLeftSwipe) {
      handleNextImage();
    }
    // Swipe ke Kanan (Prev Image)
    if (isRightSwipe) {
      handlePrevImage();
    }
  };

  const fetchProducts = async () => {
    // ... (Kode fetch sama seperti sebelumnya) ...
    setIsLoading(true);
    try {
      const response = await getAllProducts();
      const res = await response.json();

      if (res.success) setProducts(res.data);
      else setProducts([]);
    } catch (error) {
      console.error("Gagal ambil produk", error);
      alertError("Gagal mengambil data produk");
    } finally {
      setIsLoading(false);
    }
  };

  // 2. BUAT FUNGSI BARU KHUSUS TOMBOL REFRESH
  const handleRefresh = async () => {
    setIsLoading(true); // Mulai muter

    // Trik UX: Kasih jeda 500ms biar kelihatan muter (User senang melihat feedback visual)
    await new Promise((resolve) => setTimeout(resolve, 500));

    await fetchProducts(); // Ambil data asli

    // (Opsional) Munculkan notifikasi kecil kalau mau
    await alertSuccess("Data berhasil diperbarui!");

    setIsLoading(false); // Berhenti muter
  };

  const handleViewImage = (product) => {
    let images = [];
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
      images = product.images;
    } else {
      images = [product.image_url];
    }
    setCurrentImages(images);
    setCurrentIndex(0);
    setIsModalOpen(true);
  };

  // Kita ubah jadi function biasa biar bisa dipanggil touch handler
  const handleNextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % currentImages.length);
  };

  const handlePrevImage = () => {
    setCurrentIndex((prev) => (prev === 0 ? currentImages.length - 1 : prev - 1));
  };

  // Handler event click tombol (perlu stopPropagation)
  const onNextClick = (e) => {
    e.stopPropagation();
    handleNextImage();
  };
  const onPrevClick = (e) => {
    e.stopPropagation();
    handlePrevImage();
  };

  // ... (handleEdit, handleDelete, filteredProducts sama) ...
  const handleEdit = (product) => {
    setEditingProduct(product);
  };

  const handleEditSuccess = () => {
    setReload(!reload);
  };

  async function handleDelete(id) {
    if (!(await alertConfirm("Apakah kamu yakin mau menghapus produk ini?"))) {
      return;
    }

    const response = await productDelete(token, id);
    const responseBody = await response.json();
    console.log(responseBody);

    if (response.status === 200) {
      await alertSuccess("Produk berhasil dihapus!");
      setReload(!reload);
    } else {
      alertError(responseBody.message);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, [reload]);

  const filteredProducts = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="max-w-6xl mx-auto animate-slide-up relative">
      {/* ... (Header & Grid Card sama persis) ... */}
      <header className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Copy paste header code yg lama */}
        <div>
          <h1 className="text-3xl font-bold text-[#3e362e]">Daftar Produk</h1>
          <p className="text-[#8c8478]">Kelola semua stiker yang sudah diupload.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button onClick={handleRefresh} className="p-2 bg-[#f3f0e9] rounded-lg hover:bg-[#e5e0d8] ml-auto">
            <RefreshCw size={20} className={isLoading ? "animate-spin" : ""} />
          </button>
        </div>
      </header>

      {/* Grid Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <AdminProductCard
            key={product.id}
            product={product}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onViewImage={handleViewImage}
          />
        ))}
      </div>

      {/* --- MODAL LIGHTBOX UPDATE --- */}
      {isModalOpen &&
        createPortal(
          <div
            // UPDATE CSS: p-0 (Full di HP) md:p-4 (Ada padding di laptop)
            className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center p-0 md:p-4 backdrop-blur-sm animate-fade-in touch-none"
            onClick={() => setIsModalOpen(false)}>
            <div
              className="relative max-w-5xl w-full h-full flex flex-col items-center justify-center pointer-events-none"
              // Tambahkan Touch Event Listener di container utama gambar
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}>
              <div className="relative pointer-events-auto w-full flex justify-center">
                {/* Tombol Close */}
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute -top-16 right-4 md:-right-12 text-white/80 hover:text-white transition p-2 z-50 bg-black/20 rounded-full md:bg-transparent">
                  <X size={32} />
                </button>

                {/* Main Image */}
                <img
                  src={currentImages[currentIndex]}
                  alt={`Preview ${currentIndex}`}
                  // UPDATE: object-contain agar gambar pas di layar tanpa terpotong
                  className="max-h-[85vh] w-full md:w-auto object-contain md:rounded-lg shadow-2xl transition-all duration-300"
                  onClick={(e) => e.stopPropagation()}
                />

                {/* Navigation Buttons (Hanya muncul jika gambar > 1) */}
                {currentImages.length > 1 && (
                  <>
                    {/* BUTTON PREV (Desktop) */}
                    <button
                      onClick={onPrevClick}
                      // UPDATE STYLE:
                      // 1. fixed left-4/8: Agar posisi konsisten relatif layar/container (Stabil)
                      // 2. p-3: Padding lebih besar biar enak di-klik
                      // 3. hover:scale-110: Efek interaktif
                      className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white border border-white/20 p-3 rounded-full transition-all duration-200 hover:scale-110 backdrop-blur-sm group"
                      title="Sebelumnya">
                      <ChevronLeft size={28} className="group-hover:-translate-x-1 transition-transform" />
                    </button>

                    {/* BUTTON NEXT (Desktop) */}
                    <button
                      onClick={onNextClick}
                      className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white border border-white/20 p-3 rounded-full transition-all duration-200 hover:scale-110 backdrop-blur-sm group"
                      title="Selanjutnya">
                      <ChevronRight size={28} className="group-hover:translate-x-1 transition-transform" />
                    </button>

                    {/* Indikator Titik (Dots) - Tetap muncul di HP biar tau ada gambar lain */}
                    <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex gap-2">
                      {currentImages.map((_, idx) => (
                        <div
                          key={idx}
                          className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex ? "bg-white w-4" : "bg-white/40"}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Hint Text di HP */}
              <p className="text-white/40 mt-12 text-xs md:text-sm pointer-events-auto absolute bottom-8 md:static">
                {currentImages.length > 1 ? "Geser untuk melihat foto lain" : ""}
              </p>
            </div>
          </div>,
          document.body,
        )}

      {/* 5. Render Modal Edit */}
      {editingProduct && (
        <EditProductModal
          key={editingProduct.id} // Aman, karena baris ini cuma jalan kalau editingProduct TIDAK null
          isOpen={true}
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  );
}
