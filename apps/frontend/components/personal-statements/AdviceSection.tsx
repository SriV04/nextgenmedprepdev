import React from 'react';

const AdviceSection: React.FC = () => {

  const commonMistakes = [
    {
      mistake: "Listing experiences without reflection",
      solution: "Always explain what you learned and how it shaped your understanding",
      icon: "❌"
    },
    {
      mistake: "Using clichés and generic phrases",
      solution: "Be specific and personal in your language and examples",
      icon: "⚠️"
    },
    {
      mistake: "Focusing only on academic achievements",
      solution: "Balance academic success with personal growth and character development",
      icon: "📚"
    },
    {
      mistake: "Writing what you think they want to hear",
      solution: "Be authentic and genuine about your motivations and experiences",
      icon: "🎭"
    },
    {
      mistake: "Poor time management leading to rushed writing",
      solution: "Start early and allow time for multiple drafts and feedback",
      icon: "⏰"
    },
    {
      mistake: "Ignoring the character limit",
      solution: "Be concise and make every word count",
      icon: "✂️"
    }
  ];

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">


        {/* Common Mistakes */}
        <div className="bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 rounded-3xl p-8 md:p-12 border border-orange-200">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Common Mistakes to Avoid
            </h3>
            <p className="text-lg text-gray-600">
              Learn from these frequent pitfalls and give yourself the best chance of success
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {commonMistakes.map((item, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-start mb-4">
                  <span className="text-2xl mr-3 flex-shrink-0">{item.icon}</span>
                  <div>
                    <h4 className="font-semibold text-red-600 mb-2">{item.mistake}</h4>
                    <p className="text-green-700 text-sm">
                      <span className="font-medium">Solution:</span> {item.solution}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Writing Process */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              The Writing Process
            </h3>
            <p className="text-lg text-gray-600">
              Follow this structured approach to craft your perfect personal statement
            </p>
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 md:p-12 text-white">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold">1</span>
                </div>
                <h4 className="text-xl font-bold mb-2">Plan & Brainstorm</h4>
                <p className="text-blue-100">List experiences, reflect on motivations, create an outline</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold">2</span>
                </div>
                <h4 className="text-xl font-bold mb-2">First Draft</h4>
                <p className="text-blue-100">Write freely, focus on getting ideas down, don't worry about word count</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold">3</span>
                </div>
                <h4 className="text-xl font-bold mb-2">Revise & Refine</h4>
                <p className="text-blue-100">Multiple drafts, seek feedback, focus on clarity and impact</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold">4</span>
                </div>
                <h4 className="text-xl font-bold mb-2">Final Polish</h4>
                <p className="text-blue-100">Proofread, check character count, ensure perfect presentation</p>
              </div>
            </div>

            <div className="mt-12 text-center">
              <div className="bg-white bg-opacity-10 rounded-2xl p-6 border border-white border-opacity-20">
                <h4 className="text-xl font-bold mb-2">⏱️ Timeline Recommendation</h4>
                <p className="text-blue-100">
                  Start 2-3 months before your deadline. Allow 2-3 weeks for the first draft, 
                  2-3 weeks for revisions, and 1-2 weeks for final polishing and feedback.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Character Count Guide */}
        <div className="mt-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8 md:p-12 border border-gray-200">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Making Every Character Count</h3>
            <p className="text-lg text-gray-600">4,000 characters isn't much – here's how to use them wisely</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="text-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-bold text-lg">~25%</span>
                </div>
                <h4 className="font-bold text-gray-900">Opening & Motivation</h4>
              </div>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Hook the reader immediately</li>
                <li>• Clear statement of intent</li>
                <li>• Brief overview of your journey</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="text-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <span className="text-green-600 font-bold text-lg">~60%</span>
                </div>
                <h4 className="font-bold text-gray-900">Experiences & Skills</h4>
              </div>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Work experience insights</li>
                <li>• Volunteering reflections</li>
                <li>• Academic achievements</li>
                <li>• Personal qualities</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="text-center mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <span className="text-purple-600 font-bold text-lg">~15%</span>
                </div>
                <h4 className="font-bold text-gray-900">Future & Conclusion</h4>
              </div>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Future aspirations</li>
                <li>• Why this university/course</li>
                <li>• Strong, memorable ending</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdviceSection;