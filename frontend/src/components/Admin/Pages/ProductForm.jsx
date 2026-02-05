import { useState } from "react";
import { Plus, Save, X, UploadCloud } from "lucide-react";
import { createProduct } from "../../../lib/api/ProductApi";
import { useLocalStorage } from "react-use";
import { alertError, alertSuccess } from "../../../lib/alert";
import { useNavigate } from "react-router";
import { createPortal } from "react-dom"; // Tambahkan untuk Lightbox
import TextAreaAutosize from "react-textarea-autosize";

export default function ProductForm() {
  const [token] = useLocalStorage("token", "");
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // State untuk Preview Full Gambar (Lightbox)
  const [previewUrl, setPreviewUrl] = useState(null);
  //label img
  const [imageLabels, setImageLabels] = useState({});

  const moveImage = (index, direction) => {
    const newFiles = [...files];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newFiles.length) return;

    [newFiles[index], newFiles[targetIndex]] = [newFiles[targetIndex], newFiles[index]];
    setFiles(newFiles);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }
    e.target.value = "";
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  async function handleSubmit(e) {
    e.preventDefault();

    // Validasi minimal 1 gambar
    if (files.length === 0) {
      alertError("Minimal pilih 1 gambar produk!");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("description", description);

      const labelsArray = files.map((_, idx) => imageLabels[idx] || "");
      formData.append("image_labels", JSON.stringify(labelsArray));

      for (let i = 0; i < files.length; i++) {
        formData.append("images", files[i]);
      }

      const response = await createProduct(token, formData);
      const responseBody = await response.json();

      if (response.ok) {
        await alertSuccess("Produk berhasil dibuat!");
        navigate("/admin/products");
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
    <div className="max-w-3xl mx-auto animate-slide-up pb-10">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-[#3e362e]">Upload Produk Baru</h1>
        <p className="text-[#8c8478]">Tambahkan aset stiker digital ke database.</p>
      </header>

      <div className="bg-white border-2 border-[#e5e0d8] rounded-2xl p-6 md:p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {/* Nama Produk */}
            <div>
              <label className="text-sm font-bold text-[#3e362e]">Nama Produk</label>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border-2 border-[#e5e0d8] rounded-lg p-3 mt-1 focus:border-[#8da399] outline-none transition-all"
                placeholder="Contoh: Stiker Kucing Lucu Pack 1"
              />
            </div>

            {/* Harga - Full Width agar konsisten */}
            <div>
              <label className="text-sm font-bold text-[#3e362e]">Harga (Rp)</label>
              <input
                required
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full border-2 border-[#e5e0d8] rounded-lg p-3 mt-1 focus:border-[#8da399] outline-none transition-all"
                placeholder="15000"
              />
            </div>

            {/* Deskripsi */}
            <div>
              <label className="text-sm font-bold text-[#3e362e]">Deskripsi</label>
              <TextAreaAutosize
                minRows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border-2 border-[#e5e0d8] rounded-lg p-3 mt-1 focus:border-[#8da399] outline-none resize-none transition-all"
                placeholder="Jelaskan detail stiker..."
              />
            </div>
          </div>

          {/* Upload Area */}
          <div>
            <label className="text-sm font-bold text-[#3e362e] mb-3 block">Galeri Foto Produk</label>

            {/* Preview List Gambar */}
            {files.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 animate-fade-in">
                {files.map((file, idx) => {
                  const url = URL.createObjectURL(file);
                  return (
                    <div
                      key={idx}
                      className="relative aspect-square rounded-xl overflow-hidden border-2 border-[#8da399] shadow-sm group">
                      <img
                        src={url}
                        alt="preview"
                        className="w-full h-full object-cover cursor-zoom-in hover:scale-105 transition duration-500"
                        onClick={() => setPreviewUrl(url)}
                      />

                      <input
                        placeholder="Nama Foto (Contoh: Sisi Kiri)"
                        className="w-full text-xs mt-2 border p-1 rounded"
                        onChange={(e) => setImageLabels({ ...imageLabels, [idx]: e.target.value })}
                      />
                      <div className="flex gap-1 mt-1 justify-center">
                        <button
                          type="button"
                          onClick={() => moveImage(idx, "up")}
                          className="p-1 bg-gray-100 rounded text-[10px]">
                          ⬆️
                        </button>
                        <button
                          type="button"
                          onClick={() => moveImage(idx, "down")}
                          className="p-1 bg-gray-100 rounded text-[10px]">
                          ⬇️
                        </button>
                      </div>
                      {/* Tombol Hapus - Style disamakan (Selalu muncul di HP) */}
                      <button
                        type="button"
                        onClick={() => removeFile(idx)}
                        className="absolute top-1.5 right-1.5 bg-[#3e362e]/80 backdrop-blur text-white p-1.5 rounded-full shadow-md hover:bg-red-500 transition-colors">
                        <X size={14} />
                      </button>
                      <div className="absolute bottom-0 w-full bg-black/40 backdrop-blur-[2px] py-1 px-2">
                        <p className="text-[10px] text-white truncate">{file.name}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Area Input (Upload Box) */}
            <div className="relative">
              <input
                id="fileInput"
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="border-2 border-dashed border-[#dcdcdc] rounded-xl p-8 text-center hover:border-[#8da399] hover:bg-[#f4fcf7] transition-all duration-300 group">
                <div className="flex flex-col items-center gap-2">
                  <div className="bg-[#e8f5e9] p-3 rounded-full text-[#2e7d32] group-hover:scale-110 transition-transform shadow-sm">
                    <UploadCloud size={28} />
                  </div>
                  <p className="text-sm font-bold text-[#3e362e]">Klik untuk pilih gambar</p>
                  <p className="text-xs text-gray-400">Bisa pilih banyak file sekaligus</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tombol Simpan */}
          <div className="flex justify-end pt-4">
            <button
              disabled={isLoading}
              type="submit"
              className="w-full md:w-auto justify-center bg-[#3e362e] text-white font-bold py-3 px-10 rounded-xl hover:bg-[#5a4e44] transition-all flex items-center gap-2 disabled:opacity-50 shadow-md active:scale-95">
              {isLoading ? (
                <span className="flex items-center gap-2 justify-center">
                  <span className="animate-spin text-lg">⏳</span> Menyimpan...
                </span>
              ) : (
                <>
                  <Save size={18} /> Publish Produk
                </>
              )}
            </button>
          </div>
        </form>
      </div>

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
    </div>
  );
}
