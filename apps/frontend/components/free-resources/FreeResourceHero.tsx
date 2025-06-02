import React from 'react';
import Image from 'next/image';

interface FreeResourceHeroProps {
  title: string;
  subtitle: string;
  imagePath: string;
  imageAlt: string;
  benefits: string[];
  onGetResource: () => void;
}

const FreeResourceHero: React.FC<FreeResourceHeroProps> = ({
  title,
  subtitle,
  imagePath,
  imageAlt,
  benefits,
  onGetResource,
}) => {
  return (
    <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                {title}
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                {subtitle}
              </p>
            </div>

            {/* Benefits List */}
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-0.5">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-gray-700 text-lg">{benefit}</p>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="pt-6">
              <button
                onClick={onGetResource}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Get Your Free Guide Now
              </button>
              <p className="text-sm text-gray-500 mt-2">No spam, unsubscribe anytime</p>
            </div>
          </div>

          {/* Right side - Image */}
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl p-8 transform rotate-2 hover:rotate-0 transition-transform duration-300">
              <Image
                src={imagePath}
                alt={imageAlt}
                width={500}
                height={700}
                className="w-full h-auto rounded-lg shadow-lg"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FreeResourceHero;
