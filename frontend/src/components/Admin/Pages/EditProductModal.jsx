import { useState } from "react"; // Hapus useEffect
import { createPortal } from "react-dom";
import { Save, X, UploadCloud, Image as ImageIcon } from "lucide-react"; // Hapus Trash2 jika tidak dipakai di import, tapi dipakai di kode bawah
import { productUpdate } from "../../../lib/api/ProductApi";
import { alertSuccess, alertError } from "../../../lib/alert";
import { useLocalStorage } from "react-use";

export default function EditProductModal({ product, isOpen, onClose, onSuccess }) {
  const [token] = useLocalStorage("token", "");
  const [isLoading, setIsLoading] = useState(false);

  // --- STATE DATA PRODUK (Inisialisasi Langsung) ---
  // Karena kita pakai 'key' di parent, useState ini akan otomatis
  // mengambil nilai baru setiap kali produk berubah. Tidak butuh useEffect.
  const [name, setName] = useState(product?.name || "");
  const [price, setPrice] = useState(product?.price || "");
  const [description, setDescription] = useState(product?.description || "");

  // --- STATE GAMBAR (Lazy Init) ---
  const [existingImages, setExistingImages] = useState(() => {
    if (!product) return [];
    if (product.images && Array.isArray(product.images)) {
      return product.images;
    }
    if (product.image_url) {
      return [product.image_url];
    }
    return [];
  });

  const [newImages, setNewImages] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);

  // --- HANDLER ---
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      setNewImages((prev) => [...prev, ...filesArray]);
    }
  };

  const removeExistingImage = (imgUrl) => {
    setDeletedImages((prev) => [...prev, imgUrl]);
    setExistingImages((prev) => prev.filter((img) => img !== imgUrl));
  };

  const removeNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("description", description);

      if (newImages.length > 0) {
        newImages.forEach((file) => {
          formData.append("images", file);
        });
      }

      // Kirim list gambar yg dihapus (jika backend support)
      if (deletedImages.length > 0) {
        formData.append("deleted_images", JSON.stringify(deletedImages));
      }

      const response = await productUpdate(token, product.id, formData);
      const responseBody = await response.json();

      setIsLoading(false);

      if (response.status === 200) {
        onClose();
        onSuccess();
        await alertSuccess("Produk berhasil diupdate!");
      } else {
        alertError(responseBody.message || "Gagal update produk");
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      alertError("Terjadi kesalahan koneksi");
    }
  };

  // Render
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-[#e5e0d8] flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-[#f1f0eb] flex justify-between items-center bg-[#fdfcf8] rounded-t-2xl">
          <div>
            <h2 className="text-xl font-bold text-[#3e362e]">Edit Produk</h2>
            <p className="text-sm text-[#8c8478]">Update foto & detail produk.</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-red-500 transition">
            <X size={24} />
          </button>
        </div>

        {/* Body Form */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form id="editForm" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-[#3e362e] mb-1">Nama Produk</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border-2 border-[#e5e0d8] rounded-lg p-3 focus:border-[#8da399] outline-none transition"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#3e362e] mb-1">Harga (Rp)</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full border-2 border-[#e5e0d8] rounded-lg p-3 focus:border-[#8da399] outline-none transition"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-[#3e362e] mb-1">Deskripsi</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border-2 border-[#e5e0d8] rounded-lg p-3 h-24 resize-none focus:border-[#8da399] outline-none transition"
                  required
                />
              </div>
            </div>

            {/* Area Gambar (Sama seperti sebelumnya) */}
            <div>
              <label className="block text-sm font-bold text-[#3e362e] mb-3">Galeri Produk</label>

              {existingImages.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-2">Foto Saat Ini:</p>
                  <div className="grid grid-cols-4 gap-3">
                    {existingImages.map((imgUrl, idx) => (
                      <div
                        key={idx}
                        className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group">
                        <img src={imgUrl} alt="Old" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(imgUrl)}
                          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {newImages.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs text-[#8da399] font-bold mb-2">Akan Diupload ({newImages.length}):</p>
                  <div className="grid grid-cols-4 gap-3">
                    {newImages.map((file, idx) => (
                      <div
                        key={idx}
                        className="relative aspect-square rounded-lg overflow-hidden border-2 border-[#8da399] group">
                        <img src={URL.createObjectURL(file)} alt="New" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeNewImage(idx)}
                          className="absolute top-1 right-1 bg-gray-600 text-white p-1 rounded-full shadow-sm hover:bg-red-500 transition-colors">
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-[#f9f8f6] p-4 rounded-xl border-2 border-dashed border-[#dcdcdc] hover:border-[#8da399] hover:bg-white transition text-center">
                <label className="cursor-pointer flex flex-col items-center justify-center gap-2">
                  <div className="bg-[#e8f5e9] p-3 rounded-full text-[#2e7d32]">
                    <UploadCloud size={24} />
                  </div>
                  <div>
                    <span className="font-bold text-[#3e362e]">Klik untuk tambah foto</span>
                    <p className="text-xs text-gray-400">Bisa pilih banyak sekaligus</p>
                  </div>
                  <input type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[#f1f0eb] bg-[#fdfcf8] rounded-b-2xl flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg border border-[#e5e0d8] text-[#3e362e] font-bold hover:bg-gray-50 transition">
            Batal
          </button>
          <button
            type="submit"
            form="editForm"
            disabled={isLoading}
            className="px-6 py-2.5 rounded-lg bg-[#3e362e] text-white font-bold hover:bg-[#5a4e44] transition flex items-center gap-2 disabled:opacity-50">
            {isLoading ? <span className="animate-spin">⏳</span> : <Save size={18} />}
            Simpan Perubahan
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
