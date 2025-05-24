import React from 'react';

const PersonalStatementPage = () => {
  // Placeholder data for shop items
  const shopItems = [
    {
      id: 1,
      name: 'Comprehensive Personal Statement Guide',
      description: 'Our in-depth guide to writing a compelling personal statement.',
      price: '£25',
      imageUrl: '/guide-placeholder.jpg', // Replace with actual image path
    },
    {
      id: 2,
      name: 'Personal Statement Review Session',
      description: 'Book a one-on-one session with our experts for personalized feedback.',
      price: '£75/hour',
      imageUrl: '/session-placeholder.jpg', // Replace with actual image path
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">Crafting Your Perfect Personal Statement</h1>
        <p className="text-lg text-gray-700">
          Your personal statement is a crucial part of your application. It's your opportunity to showcase your motivations, experiences, and suitability for your chosen course.
        </p>
      </header>

      {/* General Advice Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">What is a Personal Statement?</h2>
        <div className="space-y-4 text-gray-700">
          <p>
            A personal statement is a short reflective essay you write about why you’re the perfect candidate for the undergraduate degree course(s) you’re applying to. It's your chance to stand out from other applicants and show universities why they should want you as a student.
          </p>
          <p>
            It should be unique, authentic, and well-structured. Focus on your passion for the subject, relevant skills, and any experiences that have shaped your decision to apply.
          </p>
        </div>
      </section>

      {/* Medicine Personal Statement Section */}
      <section className="mb-12 p-6 bg-blue-50 rounded-lg shadow-md">
        <h2 className="text-3xl font-semibold text-blue-700 mb-6">The Medicine Personal Statement</h2>
        <div className="space-y-4 text-gray-700">
          <p>
            For medicine, your personal statement needs to demonstrate a realistic understanding of the profession, commitment, and the core values of a doctor, such as empathy and integrity.
          </p>
          <p>
            Key things to include:
          </p>
          <ul className="list-disc list-inside pl-4 space-y-2">
            <li>Motivation to study medicine: What drives you towards this challenging career?</li>
            <li>Work experience: Reflect on what you learned from clinical and non-clinical settings.</li>
            <li>Volunteering: Show your commitment to helping others.</li>
            <li>Skills and qualities: Highlight teamwork, leadership, communication, and problem-solving skills.</li>
            <li>Understanding of the NHS constitution and values (if applying in the UK).</li>
            <li>Extracurricular activities: How have they contributed to your development?</li>
          </ul>
          <p>
            Be specific and provide examples. Reflect deeply on your experiences rather than just listing them.
          </p>
        </div>
      </section>

      {/* Dentistry Personal Statement Section */}
      <section className="mb-12 p-6 bg-green-50 rounded-lg shadow-md">
        <h2 className="text-3xl font-semibold text-green-700 mb-6">The Dentistry Personal Statement</h2>
        <div className="space-y-4 text-gray-700">
          <p>
            A dentistry personal statement should highlight your manual dexterity, scientific aptitude, and genuine interest in oral healthcare. You need to show you understand the demands and rewards of a dental career.
          </p>
          <p>
            Key aspects to cover:
          </p>
          <ul className="list-disc list-inside pl-4 space-y-2">
            <li>Motivation for dentistry: Why this specific field?</li>
            <li>Work experience: Dental shadowing is crucial. Discuss what you observed and learned.</li>
            <li>Manual dexterity: Mention hobbies or activities that demonstrate fine motor skills (e.g., playing an instrument, model making).</li>
            <li>Scientific understanding: Link your academic studies to dentistry.</li>
            <li>Communication skills: Essential for patient interaction.</li>
            <li>Teamwork: Dentists often work as part of a larger team.</li>
            <li>Ethical awareness: Understanding of patient confidentiality and consent.</li>
          </ul>
          <p>
            Showcase your commitment and provide evidence for your claims.
          </p>
        </div>
      </section>

      {/* Shop Carousel Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-center">Get Expert Help</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {shopItems.map((item) => (
            <div key={item.id} className="border rounded-lg shadow-lg overflow-hidden">
              <img src={item.imageUrl} alt={item.name} className="w-full h-48 object-cover"/>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.name}</h3>
                <p className="text-gray-600 mb-4">{item.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-blue-600">{item.price}</span>
                  <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded">
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-center mt-8 text-gray-600">
          Note: This is a simplified shop display. A real implementation would involve a proper carousel component and e-commerce functionality.
        </p>
      </section>

      <footer className="text-center text-gray-600 mt-12">
        <p>&copy; {new Date().getFullYear()} NextGenMedPrep. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default PersonalStatementPage;
