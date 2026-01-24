import { Edit, Trash2, Maximize2, Check } from "lucide-react";

export default function AdminProductCard({
  product,
  onEdit,
  onDelete,
  onViewImage,
  isSelected,
  onSelect,
  isSelectionMode, // Pastikan prop ini diterima
}) {
  const formattedPrice = parseInt(product.price).toLocaleString("id-ID");

  return (
    <div
      className={`bg-white p-3 rounded-xl border-2 transition-all flex flex-col h-full group relative ${
        isSelected
          ? "border-[#8da399] shadow-md ring-2 ring-[#8da399]/20"
          : "border-[#E5E0D8] shadow-sm hover:shadow-md"
      }`}>
      {/* 1. KONDISI RENDER: Checkbox hanya muncul jika isSelectionMode AKTIF */}
      {isSelectionMode && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
          className={`absolute top-4 left-4 z-20 w-7 h-7 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all shadow-md ${
            isSelected
              ? "bg-[#8da399] border-[#8da399] text-white"
              : "bg-white/90 border-[#3e362e]/20 hover:border-[#3e362e]"
          }`}>
          {isSelected && <Check size={16} strokeWidth={4} />}
        </div>
      )}

      {/* AREA GAMBAR */}
      <div className="relative aspect-square bg-[#F3F0E9] rounded-lg overflow-hidden mb-3 border border-[#E5E0D8] group/image">
        <img
          src={product.image_url}
          alt={product.name}
          // Tambahkan efek opacity jika sedang dipilih
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
            isSelected ? "opacity-75" : "opacity-100"
          }`}
          onError={(e) => (e.target.src = "https://placehold.co/400?text=No+Image")}
        />

        {/* 2. PROTEKSI: Tombol Maximize hanya muncul jika TIDAK sedang dalam mode pilihan */}
        {!isSelectionMode && (
          <div
            onClick={() => onViewImage(product)}
            className="absolute inset-0 bg-black/20 opacity-0 group-hover/image:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
            <button className="bg-white/90 text-[#3e362e] p-2 rounded-full shadow-lg hover:scale-110 transition">
              <Maximize2 size={20} />
            </button>
          </div>
        )}

        <div className="absolute top-2 right-2 bg-white/90 border border-[#3E362E] text-[#3E362E] text-xs font-bold px-2 py-1 rounded backdrop-blur-sm shadow-sm">
          Rp {formattedPrice}
        </div>
      </div>

      {/* INFO PRODUK */}
      <div className="flex-grow">
        <h3 className="font-bold text-[#3E362E] text-lg leading-tight mb-1 line-clamp-1" title={product.name}>
          {product.name}
        </h3>
        <p className="text-xs text-[#8C8478] line-clamp-2 mb-3 h-8">{product.description}</p>
      </div>

      {/* 3. PROTEKSI: Action Buttons dibuat transparan/tidak bisa diklik saat mode pilihan aktif */}
      <div
        className={`grid grid-cols-2 gap-2 mt-auto pt-3 border-t border-[#F3F0E9] transition-opacity ${
          isSelectionMode ? "opacity-20 pointer-events-none" : "opacity-100"
        }`}>
        <button
          onClick={() => onEdit(product)}
          className="flex items-center justify-center gap-1 py-2 text-sm font-bold text-[#3E362E] bg-[#F3F0E9] rounded hover:bg-[#E5E0D8] transition-colors">
          <Edit size={16} /> Edit
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(product.id);
          }}
          className="flex items-center justify-center gap-1 py-2 text-sm font-bold text-red-600 bg-red-50 rounded hover:bg-red-100 transition-colors">
          <Trash2 size={16} /> Hapus
        </button>
      </div>
    </div>
  );
}
