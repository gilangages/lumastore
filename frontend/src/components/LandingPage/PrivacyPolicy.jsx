// frontend/src/components/LandingPage/PrivacyPolicy.jsx
import React, { useEffect } from "react";
import { Navbar } from "./Section/Navbar";
import { Footer } from "./Section/Footer";

export default function PrivacyPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-[#FDFCF8] min-h-screen font-sans text-[#3E362E]">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 pt-32 pb-20">
        <h1 className="text-4xl font-black mb-2 text-[#3E362E]">Kebijakan Privasi</h1>
        <p className="text-[#6B5E51] mb-10">Terakhir diperbarui: {new Date().toLocaleDateString("id-ID")}</p>

        <div className="space-y-8 text-sm md:text-base leading-relaxed text-[#6B5E51]">
          <section>
            <h2 className="text-xl font-bold text-[#3E362E] mb-3">1. Keamanan Data</h2>
            <p>
              Di LumaSticker, kami <strong>tidak mengumpulkan data pribadi</strong> (seperti Nama atau Email) melalui
              website ini.
            </p>
            <p className="mt-2">
              Seluruh proses transaksi dilakukan secara langsung melalui <strong>WhatsApp</strong>. Data percakapan dan
              bukti transfer Anda dilindungi oleh kebijakan privasi WhatsApp (End-to-End Encryption).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#3E362E] mb-3">2. Penggunaan Informasi</h2>
            <p>Nomor WhatsApp yang Anda gunakan untuk menghubungi kami hanya akan digunakan untuk keperluan:</p>
            <ul className="list-disc pl-5 mt-2">
              <li>Konfirmasi pembayaran pesanan.</li>
              <li>Mengirimkan link download produk yang telah dibeli.</li>
            </ul>
            <p className="mt-2 font-bold italic">
              Kami tidak akan melakukan spam atau membagikan nomor Anda ke pihak lain.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#3E362E] mb-3">3. Hubungi Kami</h2>
            <p>
              Pertanyaan seputar privasi dapat dikirim ke:
              <span className="font-bold text-[#3E362E]"> stickerluma@gmail.com</span>
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
