import React from 'react';
import Image from 'next/image';

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image: string; // Path to the image, e.g., /images/placeholder-founder1.jpg
}

interface TeamMemberCardProps {
  member: TeamMember;
  imageSize?: number; // Optional prop to control image size, defaults to 150
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ member, imageSize = 150 }) => {
  return (
    <div className="team-member-card"> {/* Ensure this class matches globals.css */}
      <div className="team-member-image-container">
        <Image
          src={member.image}
          alt={member.name}
          width={imageSize}
          height={imageSize}
          className="team-member-image" /* Ensure this class matches globals.css */
        />
      </div>
      <div className="team-member-info">
        <h3 className="team-member-name">{member.name}</h3>
        <p className="team-member-role">{member.role}</p>
        <p className="team-member-bio">{member.bio}</p>
      </div>
    </div>
  );
};

export default TeamMemberCard;