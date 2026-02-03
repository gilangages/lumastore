import { ShoppingBag, CreditCard, MessageCircle, Download, CheckCircle } from "lucide-react";

export const HowToOrder = () => {
  const steps = [
    {
      title: "Pilih Stiker Favoritmu",
      description: "Cari koleksi stiker yang paling cocok buat jurnal atau kebutuhan kreatifmu.",
      icon: <ShoppingBag size={20} className="text-[#FDFCF8]" />,
    },
    {
      title: "Lakukan Pembayaran",
      description: (
        <div className="space-y-2">
          <p>Transfer sesuai harga produk ke rekening ini:</p>
          <div className="bg-[#F3F0E9] p-3 rounded-lg border border-[#E5E0D8] text-sm font-mono text-[#3E362E]">
            <p className="font-bold">BANK JAGO</p>
            <p className="text-lg font-black tracking-wider">5098 4594 4294</p>
            <p className="text-xs text-[#6B5E51] uppercase">a.n Gilang Abdian Anggara</p>
          </div>
        </div>
      ),
      icon: <CreditCard size={20} className="text-[#FDFCF8]" />,
    },
    {
      title: "Konfirmasi via WhatsApp",
      description: (
        <div className="space-y-1">
          <p>Klik tombol 'Bungkus' dan kirim bukti transfermu.</p>
          <div className="text-xs bg-yellow-50 text-yellow-800 px-2 py-1 rounded border border-yellow-200 inline-block">
            ⏰ Jam Kerja: Senin - Minggu (07:00 - 23:59 WIB)
          </div>
          <p className="text-xs text-[#8C8478] italic mt-1">*Konfirmasi di luar jam kerja diproses besok paginya ya.</p>
        </div>
      ),
      icon: <MessageCircle size={20} className="text-[#FDFCF8]" />,
    },
    {
      title: "Download & Happy Journaling!",
      description: "Admin akan memverifikasi dan mengirimkan link Google Drive stikermu secepat kilat! ⚡",
      icon: <Download size={20} className="text-[#FDFCF8]" />,
    },
  ];

  return (
    <section className="py-20 px-6 max-w-3xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-black text-[#3E362E] mb-2 uppercase tracking-tight">Cara Bungkus Stiker</h2>
        <div className="h-1 w-20 bg-[#8DA399] mx-auto rounded-full" />
      </div>

      <div className="relative">
        {/* Garis Vertikal Putus-putus di Tengah (atau Kiri di Mobile) */}
        <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-[#E5E0D8] border-l-2 border-dashed border-[#8DA399]/30 transform md:-translate-x-1/2" />

        <div className="space-y-12">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className={`relative flex flex-col md:flex-row gap-8 items-start ${idx % 2 === 0 ? "md:flex-row-reverse" : ""}`}>
              {/* ICON BULAT DI TENGAH */}
              <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-10 h-10 bg-[#3E362E] rounded-full flex items-center justify-center border-4 border-[#FDFCF8] shadow-lg z-10">
                {step.icon}
              </div>

              {/* KONTEN */}
              <div className="w-full md:w-1/2 pl-20 md:pl-0 md:px-10 text-left md:text-right">
                {/* Logic untuk align text mobile vs desktop */}
                <div className={idx % 2 === 0 ? "md:text-left" : "md:text-right"}>
                  <h3 className="text-xl font-bold text-[#3E362E] mb-2">{step.title}</h3>
                  <div className="text-[#6B5E51] text-sm leading-relaxed">{step.description}</div>
                </div>
              </div>

              {/* Spacer Kosong untuk sisi sebelahnya */}
              <div className="hidden md:block w-1/2" />
            </div>
          ))}
        </div>

        {/* Ending Dot */}
        <div className="absolute left-8 md:left-1/2 bottom-0 w-4 h-4 bg-[#8DA399] rounded-full border-2 border-[#FDFCF8] transform -translate-x-1/2 translate-y-2" />
      </div>
    </section>
  );
};
