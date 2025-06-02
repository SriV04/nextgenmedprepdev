import React from 'react';

interface Story { // Ensure this matches the type used in the page
  id: string;
  quote: string;
  author: string;
  achievement: string;
}

interface SuccessStoriesProps {
    stories: Story[];
}

const SuccessStories: React.FC<SuccessStoriesProps> = ({ stories }) => {
    return (
        <div className="relative">
          {/* Large Quote Mark (Decorative) */}
          <div className="absolute -top-16 left-0 text-[120px] leading-none text-[var(--color-accent-primary)] opacity-10 font-serif">
            "
          </div>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Success Stories</h2>
            <p className="text-lg max-w-3xl mx-auto">
                From interview preparation to medical school acceptance, our students excel at every step.
                Here are some of their inspiring journeys.
            </p>
          </div>
          
          {/* Stories Carousel */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Featured Success Story */}
            <div className="bg-[var(--color-background-secondary)] p-8 rounded-2xl shadow-xl border border-[var(--color-border-primary)] relative">
              <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4">
                <div className="w-16 h-16 rounded-full bg-[var(--color-accent-primary)] flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              
              <div className="mb-6 pb-6 border-b border-[var(--color-border-primary)]">
                <blockquote className="text-xl italic font-medium mb-4">
                  "NGMP's mock interviews were almost identical to my actual interviews. The feedback was invaluable and I felt confident walking into each one."
                </blockquote>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                    A
                  </div>
                  <div className="ml-4">
                    <p className="font-semibold text-lg">Sriharsha V.</p>
                    <p className="text-[var(--color-text-secondary)]">Accepted to Imperial College London</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="text-[var(--color-accent-primary)]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <p className="ml-3">4 Medical School Offers</p>
                </div>
                <div className="flex items-center">
                  <div className="text-[var(--color-accent-primary)]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <p className="ml-3">NGMP Mock Interview Score: 9.2/10</p>
                </div>
              </div>
            </div>
            
            {/* Success Stories List */}
            <div className="grid grid-cols-1 gap-6">
              {/* Story 1 */}
              <div className="bg-[var(--color-background-secondary)] p-6 rounded-xl shadow-lg border border-[var(--color-border-primary)] hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold">
                    S
                  </div>
                  <div className="ml-3">
                    <p className="font-semibold">Sarah M.</p>
                    <p className="text-sm text-[var(--color-text-secondary)]">University of Edinburgh</p>
                  </div>
                  <div className="ml-auto">
                    <div className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                      Medicine
                    </div>
                  </div>
                </div>
                <p className="text-sm italic">
                  "The one-on-one prep sessions helped me tackle my interview anxiety. I was calm, confident, and got my first choice!"
                </p>
              </div>

              {/* Story 2 */}
              <div className="bg-[var(--color-background-secondary)] p-6 rounded-xl shadow-lg border border-[var(--color-border-primary)] hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-400 flex items-center justify-center text-white font-bold">
                    J
                  </div>
                  <div className="ml-3">
                    <p className="font-semibold">James T.</p>
                    <p className="text-sm text-[var(--color-text-secondary)]">University of Manchester</p>
                  </div>
                  <div className="ml-auto">
                    <div className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-semibold rounded-full">
                      Dentistry
                    </div>
                  </div>
                </div>
                <p className="text-sm italic">
                  "NGMP's ultimate guides were a game-changer. They provided me with the tools I needed to excel in my interviews and secure my place at uni."
                </p>
              </div>

              {/* Story 3 */}
              <div className="bg-[var(--color-background-secondary)] p-6 rounded-xl shadow-lg border border-[var(--color-border-primary)] hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-green-400 flex items-center justify-center text-white font-bold">
                    M
                  </div>
                  <div className="ml-3">
                    <p className="font-semibold">Mia L.</p>
                    <p className="text-sm text-[var(--color-text-secondary)]">King's College London</p>
                  </div>
                  <div className="ml-auto">
                    <div className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                      Medicine
                    </div>
                  </div>
                </div>
                <p className="text-sm italic">
                  "After struggling with MMI stations, NGMP's targeted practice helped me master the format. Now I'm at my dream university!"
                </p>
              </div>
            </div>
          </div>
          
          {/* Success Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-6 bg-[var(--color-background-accent)] rounded-xl">
              <div className="text-3xl font-bold text-[var(--color-accent-primary]">94%</div>
              <p className="text-sm mt-2">of our students receive at least one offer</p>
            </div>
            <div className="p-6 bg-[var(--color-background-accent)] rounded-xl">
              <div className="text-3xl font-bold text-[var(--color-accent-primary]">78%</div>
              <p className="text-sm mt-2">get into their first-choice university</p>
            </div>
            <div className="p-6 bg-[var(--color-background-accent)] rounded-xl">
              <div className="text-3xl font-bold text-[var(--color-accent-primary]">350+</div>
              <p className="text-sm mt-2">students coached since 2018</p>
            </div>
            <div className="p-6 bg-[var(--color-background-accent)] rounded-xl">
              <div className="text-3xl font-bold text-[var(--color-accent-primary]">27</div>
              <p className="text-sm mt-2">UK medical schools with our alumni</p>
            </div>
          </div>
        </div>
    );
};

export default SuccessStories;

// Example of server-side rendering with Next.js
// Uncomment if using getServerSideProps
// export async function getServerSideProps(context) {
//   // Fetch data here
//   return { props: {} };
// }