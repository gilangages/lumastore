// frontend/src/components/LandingPage/TermsAndConditions.jsx
import React, { useEffect } from "react";
import { Navbar } from "./Section/Navbar";
import { Footer } from "./Section/Footer";

export default function TermsAndConditions() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-[#FDFCF8] min-h-screen font-sans text-[#3E362E]">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 pt-32 pb-20">
        <h1 className="text-4xl font-black mb-2 text-[#3E362E]">Syarat & Ketentuan</h1>
        <p className="text-[#6B5E51] mb-10">Terakhir diperbarui: {new Date().toLocaleDateString("id-ID")}</p>

        <div className="space-y-8 text-sm md:text-base leading-relaxed text-[#6B5E51]">
          {/* 1. Definisi Produk */}
          <section>
            <h2 className="text-xl font-bold text-[#3E362E] mb-3">1. Produk Digital</h2>
            <p>
              Produk yang dijual di LumaSticker adalah <strong>aset digital (softcopy)</strong>.
              <strong>Tidak ada produk fisik</strong> yang dikirim ke rumah. File dikirim via Email atau WhatsApp.
            </p>
          </section>

          {/* 2. Pemesanan & Pembayaran (REVISI: WHATSAPP) */}
          <section>
            <h2 className="text-xl font-bold text-[#3E362E] mb-3">2. Pemesanan & Pembayaran</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                Pemesanan dilakukan melalui website, namun{" "}
                <strong>penyelesaian pembayaran dilakukan via WhatsApp</strong> resmi LumaSticker.
              </li>
              <li>
                Setelah mengisi data, Anda akan diarahkan ke WhatsApp untuk mengirim format order dan melakukan transfer
                manual (Bank/E-Wallet).
              </li>
              <li>
                Harap gunakan <strong>data asli</strong> agar kami mudah menghubungi Anda jika terjadi kendala.
              </li>
            </ul>
          </section>

          {/* 3. Pengiriman File (REVISI: MANUAL KIRIM) */}
          <section>
            <h2 className="text-xl font-bold text-[#3E362E] mb-3">3. Pengiriman File</h2>
            <p>
              File stiker akan dikirimkan oleh Admin ke <strong>Email atau WhatsApp</strong> Anda segera setelah bukti
              transfer diverifikasi.
            </p>
            <p className="mt-2 text-xs italic">
              *Proses verifikasi biasanya instan, namun bisa memakan waktu hingga 1x24 jam jika trafik sedang padat.
            </p>
          </section>

          {/* 4. Kebijakan Refund */}
          <section className="bg-[#F3F0E9] p-6 rounded-xl border border-[#E5E0D8]">
            <h2 className="text-xl font-bold text-[#3E362E] mb-3">4. Kebijakan Pengembalian Dana (Refund)</h2>
            <p className="mb-3">Karena sifat produk digital:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Final:</strong> Tidak ada refund jika file sudah dikirimkan ke Anda.
              </li>
              <li>
                <strong>Garansi:</strong> Jika file yang diterima rusak (corrupt) atau tidak bisa dibuka, kami akan
                mengirimkan link pengganti yang baru.
              </li>
            </ul>
          </section>

          {/* 5. Kontak */}
          <section>
            <h2 className="text-xl font-bold text-[#3E362E] mb-3">5. Bantuan</h2>
            <p>Ada kendala saat download? Hubungi kami di WhatsApp atau Email:</p>
            <p className="font-bold mt-2 text-[#3E362E]">stickerluma@gmail.com</p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
