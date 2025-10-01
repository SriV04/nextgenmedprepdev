import { CheckCircleIcon } from '@heroicons/react/24/solid';

interface Career {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  gradient: string;
  keyPoints: string[];
}

interface CareerCardProps {
  career: Career;
  isSelected: boolean;
  onClick: () => void;
}

export default function CareerCard({ career, isSelected, onClick }: CareerCardProps) {
  const Icon = career.icon;
  
  return (
    <div
      onClick={onClick}
      className={`relative p-6 rounded-2xl cursor-pointer transition-all duration-300 ${
        isSelected
          ? `bg-gradient-to-br ${career.gradient} text-white shadow-2xl scale-105 ring-4 ring-white/50`
          : 'bg-white hover:shadow-xl hover:scale-102 border-2 border-gray-100'
      }`}
    >
      <div className={`inline-flex p-3 rounded-xl mb-4 ${isSelected ? 'bg-white/20' : 'bg-gradient-to-br ' + career.gradient}`}>
        <Icon className={`w-8 h-8 ${isSelected ? 'text-white' : 'text-white'}`} />
      </div>
      <h3 className={`text-2xl font-bold mb-2 ${isSelected ? 'text-white' : 'text-gray-900'}`}>
        {career.title}
      </h3>
      <p className={`mb-4 ${isSelected ? 'text-white/90' : 'text-gray-600'}`}>
        {career.description}
      </p>
      <div className="space-y-2">
        {career.keyPoints.map((point, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <CheckCircleIcon className={`w-4 h-4 ${isSelected ? 'text-white/80' : 'text-green-500'}`} />
            <span className={`text-sm ${isSelected ? 'text-white/90' : 'text-gray-700'}`}>{point}</span>
          </div>
        ))}
      </div>
      {isSelected && (
        <div className="absolute -top-2 -right-2 bg-white text-indigo-600 rounded-full p-2 shadow-lg">
          <CheckCircleIcon className="w-5 h-5" />
        </div>
      )}
    </div>
  );
}