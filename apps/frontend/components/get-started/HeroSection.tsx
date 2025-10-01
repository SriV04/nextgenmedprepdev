export default function HeroSection() {
  return (
    <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white py-20 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-black/10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
      <div className="relative max-w-6xl mx-auto text-center">
        <div className="inline-block mb-6 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold">
          ✨ Discover Your Healthcare Journey
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/90">
          Find Your Path in Healthcare
        </h1>
        <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-95 font-light">
          From career exploration to university admission—we'll guide you every step of the way
        </p>
      </div>
    </div>
  );
}