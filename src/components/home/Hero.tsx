import React from 'react';

const Hero: React.FC = () => {
  return (
    <div className="w-screen relative min-h-screen flex flex-col items-center justify-center bg-cover bg-center bg-fixed text-white" 
         style={{ 
           backgroundImage: "url('/Hero_background.jpg')",
           marginLeft: '-50vw', // Centers the background perfectly
           left: '50%' 
         }}>
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      {/* Content container */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-grow text-center px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">How Do We Help?</h1>
        <p className="text-lg md:text-xl leading-relaxed max-w-2xl">
          With expert coaching, insider knowledge, and focused practice, we prepare you to ace your
          med school interviews. Our tailored sessions cover everything from mastering tough
          questions to managing interview nerves, so you’ll walk into every interview with
          confidence. Get ready to stand out and secure your spot in med school!
        </p>
      </div>

      {/* Chevron pointing down */}
      <div className="relative z-10 pb-8">
        <svg
          className="w-10 h-10 text-white animate-bounce"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M19 9l-7 7-7-7"></path>
        </svg>
      </div>
    </div>
  );
}

export default Hero;