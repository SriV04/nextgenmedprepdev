interface Stage {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface StageSelectorProps {
  stages: Stage[];
  selectedStage: string | null;
  onSelect: (stageId: string) => void;
}

export default function StageSelector({ stages, selectedStage, onSelect }: StageSelectorProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stages.map((stage) => {
        const Icon = stage.icon;
        const isSelected = selectedStage === stage.id;
        return (
          <div
            key={stage.id}
            onClick={() => onSelect(stage.id)}
            className={`p-5 rounded-xl cursor-pointer transition-all duration-300 text-center ${
              isSelected
                ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-xl scale-105'
                : 'bg-white hover:shadow-lg border-2 border-gray-100'
            }`}
          >
            <Icon className={`w-10 h-10 mx-auto mb-3 ${isSelected ? 'text-white' : 'text-indigo-600'}`} />
            <h4 className={`font-bold mb-1 text-sm ${isSelected ? 'text-white' : 'text-gray-900'}`}>
              {stage.title}
            </h4>
            <p className={`text-xs ${isSelected ? 'text-white/80' : 'text-gray-600'}`}>
              {stage.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}