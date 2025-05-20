import React from 'react';
import TeamMemberCard, { TeamMember } from '@/components/TeamMemberCard';
import '@/styles/globals.css'; 

const founders: TeamMember[] = [
  {
    name: "Daniel",
    role: "Co-Founder",
    bio: "Daniel is a  2nd Year medical student, who provides personalised coaching and expert guidance to support aspiring medical professionals in acing their interviews.",
    image: "/images/placeholder-founder1.jpg", // Replace with actual image path
  },
  {
    name: "Isaac Butler-King",
    role: "Co-Founder",
    bio: "Isaac is 2nd year medical student, who offers practical insights and hands-on advice to help future doctors excel in their medical school interviews.",
    image: "/images/placeholder-founder2.jpg", // Replace with actual image path
  },
];

const tutors: TeamMember[] = [
  {
    name: "Rebecca Lane",
    role: "Senior Tutor - MMI Specialist",
    bio: "Rebecca is a skilled tutor for NextGen MedPrep, helping students master medical school interviews through personalised coaching and expert guidance.",
    image: "/images/placeholder-tutor1.jpg", // Replace with actual image path
  },
  {
    name: "Jack Powell",
    role: "Tutor - Traditional Interview Coach",
    bio: "Jack, a former medical student, uses his firsthand experience to guide and mentor aspiring medical students, helping them excel in interviews with tailored strategies and advice.",
    image: "/images/placeholder-tutor2.jpg", // Replace with actual image path
  },
  {
    name: "Kiera Jolly",
    role: "Tutor - CASPer & Altus Suite Prep",
    bio: "Keira, an engineering student, brings her analytical skills and academic experience to help students prepare effectively for medical school interviews with a fresh, unique perspective.",
    image: "/images/placeholder-tutor3.jpg", // Replace with actual image path
  },
];

const AboutUsPage = () => {
  return (
    <div className="page-container"> {/* Use class from globals.css */}
      <section className="our-team-section"> {/* Use class from globals.css */}
        <h2 className="section-title">Our Team</h2> {/* Use class from globals.css */}
        <p>
          At NextGen MedPrep, our team is dedicated to guiding you through every step of your medical school interview journey. Comprising current medical students and experienced mentors, our team brings firsthand insights and a wealth of knowledge to the table. With diverse backgrounds and a shared passion for education, each member is committed to helping you develop the skills and confidence needed to excel.
        </p>
      </section>

      <section>
        <h2 className="section-title">Meet Our Founders</h2>
        <div className="team-grid"> {/* Use class from globals.css */}
          {founders.map((founder) => (
            <TeamMemberCard key={founder.name} member={founder} imageSize={180} />
          ))}
        </div>
      </section>

      <section style={{ marginTop: '3rem' }}>
        <h2 className="section-title">Our Expert Tutors</h2>
        <div className="team-grid">
          {tutors.map((tutor) => (
            <TeamMemberCard key={tutor.name} member={tutor} imageSize={150}/>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AboutUsPage;
