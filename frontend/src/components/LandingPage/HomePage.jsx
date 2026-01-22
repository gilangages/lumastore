import { useEffect, useState } from "react";
import { purchaseProduct } from "../../lib/api/PaymentApi";
import { Navbar } from "./Section/Navbar";
import { ProductCard } from "./Section/ProductCard";
import { getProducts } from "./../../lib/api/ProductApi";

export function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Load Snap Script
  useEffect(() => {
    const clientKey = "Mid-client-9k6P5r8pEQkQaEan"; // Ganti Client Key Asli!
    const script = document.createElement("script");
    script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
    script.setAttribute("data-client-key", clientKey);
    script.async = true;
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  // 2. Fetch Data
  useEffect(() => {
    getProducts()
      .then((res) => res.json())
      .then((json) => setProducts(json.data || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // 3. Logic Beli
  const handleBuy = async (product) => {
    // Nanti bisa diganti Modal Input yang lebih cantik, sementara prompt dulu gpp
    const name = prompt("Nama Kamu:");
    const email = prompt("Email Kamu:");
    if (!name || !email) return;

    try {
      const res = await purchaseProduct({
        product_id: product.id,
        customer_name: name,
        customer_email: email,
      });
      const data = await res.json();

      if (data.token && window.snap) {
        window.snap.pay(data.token, {
          onSuccess: () => alert("Pembayaran Berhasil! Cek email kamu."),
          onPending: () => alert("Menunggu pembayaran..."),
          onError: () => alert("Pembayaran gagal."),
        });
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 selection:bg-indigo-100">
      <Navbar />

      {/* HERO SECTION */}
      <section className="pt-32 pb-20 px-4 text-center max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
          Aset Digital Premium untuk <span className="text-indigo-600">Kreator.</span>
        </h1>
        <p className="text-xl text-gray-500 mb-8 max-w-2xl mx-auto">
          Tingkatkan kualitas karyamu dengan koleksi aset pilihan. Download instan, harga terjangkau, kualitas terbaik.
        </p>
      </section>

      {/* PRODUCTS GRID */}
      <main className="max-w-6xl mx-auto px-4 pb-24">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Koleksi Terbaru</h2>
          <span className="text-sm text-gray-500">{products.length} Items</span>
        </div>

        {loading ? (
          <div className="text-center py-20 animate-pulse text-gray-400">Loading produk keren...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} onBuy={handleBuy} />
            ))}
          </div>
        )}
      </main>

      {/* FOOTER SIMPLE */}
      <footer className="bg-white border-t border-gray-100 py-10 text-center text-gray-400 text-sm">
        &copy; 2024 Luma Store. All rights reserved.
      </footer>
    </div>
  );
}
