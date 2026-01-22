import { ProductCard } from "./ProductCard";

export const ProductShowcase = ({ products, loading, onBuy }) => {
  return (
    <main id="products" className="max-w-6xl mx-auto px-6 py-16">
      <div className="flex flex-col md:flex-row items-end justify-between mb-12 border-b-2 border-dashed border-[#E5E0D8] pb-6 gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-black text-[#3E362E] mb-2">Koleksi Terbaru ✂️</h2>
          <p className="text-[#6B5E51] font-medium">Pilih, bayar, langsung download. Gampang banget!</p>
        </div>
        <span className="bg-[#EAE7DF] text-[#3E362E] px-4 py-2 rounded-lg text-sm font-bold border border-[#E5E0D8]">
          {products.length} Varian
        </span>
      </div>

      {loading ? (
        <div className="text-center py-32 text-[#8DA399] font-medium animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-[#E5E0D8] border-t-[#8DA399] rounded-full animate-spin mb-4"></div>
          Sedang menyiapkan stiker...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.length > 0 ? (
            products.map((product) => <ProductCard key={product.id} product={product} onBuy={onBuy} />)
          ) : (
            <p className="col-span-3 text-center text-[#6B5E51]">Belum ada produk yang ditampilkan.</p>
          )}
        </div>
      )}
    </main>
  );
};
