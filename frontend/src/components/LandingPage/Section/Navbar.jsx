export const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
            L
          </div>
          <span className="font-bold text-xl tracking-tight text-gray-900">LumaStore</span>
        </div>

        {/* Menu (Opsional) */}
        <div className="hidden md:flex gap-6 text-sm font-medium text-gray-500">
          <a href="#" className="hover:text-indigo-600 transition">
            Showcase
          </a>
          <a href="#" className="hover:text-indigo-600 transition">
            Testimonials
          </a>
          <a href="#" className="hover:text-indigo-600 transition">
            FAQ
          </a>
        </div>

        {/* CTA Button */}
        <button className="bg-black text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition">
          Lihat Koleksi
        </button>
      </div>
    </nav>
  );
};
