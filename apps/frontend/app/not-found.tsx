import Link from "next/link";
import BackButton from "../components/BackButton";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Static Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Construction Elements - Static positions for SSR */}
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="absolute opacity-10"
            style={{
              left: `${(i * 23) % 100}%`,
              top: `${(i * 37) % 100}%`,
              transform: `rotate(${i * 43}deg)`
            }}
          >
            {i % 3 === 0 && (
              <svg className="w-8 h-8 text-yellow-400 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            )}
            {i % 3 === 1 && (
              <svg className="w-6 h-6 text-orange-400 animate-bounce" fill="currentColor" viewBox="0 0 20 20" style={{ animationDelay: `${i * 0.2}s` }}>
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
              </svg>
            )}
            {i % 3 === 2 && (
              <svg className="w-7 h-7 text-blue-400 animate-spin" fill="currentColor" viewBox="0 0 20 20" style={{ animationDuration: `${3 + i}s` }}>
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
            )}
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        {/* Construction Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            {/* Pulsing Background */}
            <div className="absolute inset-0 bg-yellow-400/20 rounded-full animate-pulse" />
            
            {/* Construction Helmet */}
            <div className="relative w-32 h-32 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-2xl">
              <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              
              {/* Sparkles */}
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full animate-ping"
                  style={{
                    top: `${20 + Math.cos((i * 60) * Math.PI / 180) * 60}px`,
                    left: `${64 + Math.sin((i * 60) * Math.PI / 180) * 60}px`,
                    animationDelay: `${i * 0.2}s`
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Error Code */}
        <div className="mb-6">
          <h1 className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent mb-4">
            404
          </h1>
        </div>

        {/* Main Message */}
        <div className="mb-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Page Under Construction
          </h2>
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="animate-spin">
              <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-xl text-blue-100">
              We're building something amazing for you!
            </p>
          </div>
        </div>

        {/* Description */}
        <div className="mb-10">
          <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            This page is currently under construction as we work to bring you the best medical school preparation resources. 
            Our team is hard at work creating an exceptional experience for future doctors like you.
          </p>
        </div>

        {/* Action Buttons */}
                {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <BackButton className="px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 hover:scale-105 transition-all border border-slate-600">
            Go Back
          </BackButton>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 hover:scale-105 transition-all shadow-lg hover:shadow-xl"
          >
            Return Home
          </Link>
        </div>

        {/* Progress Indicator */}
        <div className="mt-12">
          <div className="bg-white/10 rounded-full p-4 max-w-md mx-auto backdrop-blur-sm border border-white/20">
            <div className="flex items-center gap-3 mb-2">
              <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium text-white">Construction Progress</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full w-[78%] transition-all duration-1000" />
            </div>
            <p className="text-xs text-slate-300 mt-2">Expected completion: Coming Soon</p>
          </div>
        </div>

        {/* Footer Message */}
        <div className="mt-8">
          <p className="text-sm text-slate-400">
            Need immediate help? Contact us at{" "}
            <a href="mailto:contact@nextgenmedprep.com" className="text-blue-400 hover:text-blue-300 underline">
              contact@nextgenmedprep.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}