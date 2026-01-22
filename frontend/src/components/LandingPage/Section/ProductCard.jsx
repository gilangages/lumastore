export const ProductCard = ({ product, onBuy }) => {
  return (
    <div className="group relative bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Gambar Produk */}
      <div className="aspect-[4/3] bg-gray-100 overflow-hidden relative">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = "https://placehold.co/600x400?text=No+Image";
          }}
        />
        {/* Badge Harga (Floating) */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur text-indigo-700 font-bold px-3 py-1 rounded-full text-sm shadow-sm">
          Rp {parseInt(product.price).toLocaleString("id-ID")}
        </div>
      </div>

      {/* Info Produk */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-1 leading-tight">{product.name}</h3>
        <p className="text-gray-500 text-sm line-clamp-2 mb-4 h-10">{product.description}</p>

        {/* Tombol Beli */}
        <button
          onClick={() => onBuy(product)}
          className="w-full bg-indigo-600 text-white py-2.5 rounded-xl font-semibold hover:bg-indigo-700 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-indigo-200 shadow-lg">
          <span>⚡ Beli Sekarang</span>
        </button>
      </div>
    </div>
  );
};
