import { useState } from "react";
import { createPortal } from "react-dom";
import { Save, X, UploadCloud } from "lucide-react";
import { productUpdate } from "../../../lib/api/ProductApi";
import { alertSuccess, alertError } from "../../../lib/alert";
import { useLocalStorage } from "react-use";
import TextAreaAutosize from "react-textarea-autosize";

export default function EditProductModal({ product, isOpen, onClose, onSuccess }) {
  const [token] = useLocalStorage("token", "");
  const [isLoading, setIsLoading] = useState(false);

  // --- STATE UNTUK PREVIEW FULL GAMBAR ---
  const [previewUrl, setPreviewUrl] = useState(null);

  // --- STATE DATA PRODUK ---
  const [name, setName] = useState(product?.name || "");
  const [price, setPrice] = useState(product?.price || "");
  const [description, setDescription] = useState(product?.description || "");

  // --- STATE GAMBAR ---
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

  // --- HELPER UNTUK HITUNG TOTAL GAMBAR ---
  const totalImages = existingImages.length + newImages.length;

  // --- HANDLER ---
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      setNewImages((prev) => [...prev, ...filesArray]);
    }
  };

  const removeExistingImage = (imgUrl) => {
    if (totalImages <= 1) {
      alertError("Minimal harus menyisakan 1 gambar produk!");
      return;
    }
    setDeletedImages((prev) => [...prev, imgUrl]);
    setExistingImages((prev) => prev.filter((img) => img !== imgUrl));
  };

  const removeNewImage = (index) => {
    if (totalImages <= 1) {
      alertError("Minimal harus menyisakan 1 gambar produk!");
      return;
    }
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (totalImages === 0) {
      alertError("Produk wajib memiliki minimal 1 gambar!");
      return;
    }

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

      if (deletedImages.length > 0) {
        formData.append("deleted_images", JSON.stringify(deletedImages));
      }

      const response = await productUpdate(token, product.id, formData);
      const responseBody = await response.json();

      setIsLoading(false);

      if (response.ok) {
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

  if (!isOpen) return null;

  return (
    <>
      {createPortal(
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

                  {/* Harga Full Width agar simetris dengan Nama Produk */}
                  <div className="md:col-span-2">
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
                    <TextAreaAutosize
                      minRows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full border-2 border-[#e5e0d8] rounded-lg p-3 resize-none focus:border-[#8da399] outline-none transition"
                      required
                    />
                  </div>
                </div>

                {/* Area Gambar */}
                <div>
                  <label className="block text-sm font-bold text-[#3e362e] mb-3">Galeri Produk</label>

                  {/* SECTION: FOTO LAMA */}
                  {existingImages.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-2">Foto Tersimpan (Klik untuk memperbesar):</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {existingImages.map((imgUrl, idx) => (
                          <div
                            key={idx}
                            className="relative aspect-square rounded-xl overflow-hidden border border-[#e5e0d8] shadow-sm group">
                            <img
                              src={imgUrl}
                              alt={`Product ${idx}`}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 cursor-zoom-in"
                              onClick={() => setPreviewUrl(imgUrl)}
                            />
                            <button
                              type="button"
                              onClick={() => removeExistingImage(imgUrl)}
                              className="absolute top-1.5 right-1.5 bg-white/80 backdrop-blur-md text-[#d68c76] hover:bg-[#d68c76] hover:text-white p-1.5 rounded-full shadow-sm border border-[#f1f0eb] transition-all duration-300">
                              <X size={14} strokeWidth={3} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* SECTION: FOTO BARU */}
                  {newImages.length > 0 && (
                    <div className="mb-4 animate-fade-in">
                      <p className="text-xs text-[#8da399] font-bold mb-2 flex items-center gap-1">
                        <UploadCloud size={12} /> Akan Diupload ({newImages.length}):
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {newImages.map((file, idx) => {
                          const url = URL.createObjectURL(file);
                          return (
                            <div
                              key={idx}
                              className="relative aspect-square rounded-xl overflow-hidden border-2 border-[#8da399] shadow-md group">
                              <img
                                src={url}
                                alt="New Preview"
                                className="w-full h-full object-cover cursor-zoom-in"
                                onClick={() => setPreviewUrl(url)}
                              />
                              <button
                                type="button"
                                onClick={() => removeNewImage(idx)}
                                className="absolute top-1.5 right-1.5 bg-[#3e362e]/80 backdrop-blur text-white p-1.5 rounded-full hover:bg-red-500 transition-colors shadow-sm">
                                <X size={14} />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* UPLOAD BOX */}
                  <div className="bg-[#fdfcf8] p-4 rounded-xl border-2 border-dashed border-[#dcdcdc] hover:border-[#8da399] hover:bg-[#f4fcf7] transition-all duration-300 text-center group cursor-pointer">
                    <label className="cursor-pointer flex flex-col items-center justify-center gap-2 w-full h-full">
                      <div className="bg-[#e8f5e9] p-3 rounded-full text-[#2e7d32] group-hover:scale-110 transition-transform duration-300 shadow-sm">
                        <UploadCloud size={24} />
                      </div>
                      <div>
                        <span className="font-bold text-[#3e362e] text-sm group-hover:text-[#2e7d32] transition-colors">
                          Tambah Foto Lain
                        </span>
                        <p className="text-[10px] text-gray-400">Format: JPG, PNG (Max 2MB)</p>
                      </div>
                      <input type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" />
                    </label>
                  </div>
                </div>
              </form>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-[#f1f0eb] bg-[#fdfcf8] rounded-b-2xl grid grid-cols-2 md:flex md:justify-end gap-3">
              <button
                onClick={onClose}
                className="w-full md:w-auto px-5 py-2.5 rounded-lg border border-[#e5e0d8] text-[#3e362e] font-bold hover:bg-gray-50 transition text-center">
                Batal
              </button>
              <button
                type="submit"
                form="editForm"
                disabled={isLoading}
                className="w-full md:w-auto px-6 py-2.5 rounded-lg bg-[#3e362e] text-white font-bold hover:bg-[#5a4e44] transition flex items-center justify-center gap-2 disabled:opacity-50">
                {isLoading ? <span className="animate-spin text-sm">⏳</span> : <Save size={18} className="shrink-0" />}
                <span className="whitespace-nowrap text-sm md:text-base">Simpan Perubahan</span>
              </button>
            </div>
          </div>
        </div>,
        document.body,
      )}

      {/* MODAL PREVIEW IMAGE (LIGHTBOX) */}
      {previewUrl &&
        createPortal(
          <div
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-md animate-fade-in p-4 cursor-zoom-out"
            onClick={() => setPreviewUrl(null)}>
            <button className="absolute top-6 right-6 text-white bg-white/10 p-3 rounded-full hover:bg-white/20 transition">
              <X size={32} />
            </button>
            <img
              src={previewUrl}
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl animate-slide-up"
              alt="Full Preview"
            />
          </div>,
          document.body,
        )}
    </>
  );
}
