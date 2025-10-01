import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

interface Service {
  name: string;
  description: string;
  path: string;
  badge: string;
  color: 'blue' | 'cyan' | 'purple' | 'green' | 'indigo';
}

interface ServiceCardProps {
  service: Service;
}

const badgeColors = {
  blue: 'bg-blue-100 text-blue-700',
  cyan: 'bg-cyan-100 text-cyan-700',
  purple: 'bg-purple-100 text-purple-700',
  green: 'bg-green-100 text-green-700',
  indigo: 'bg-indigo-100 text-indigo-700'
};

export default function ServiceCard({ service }: ServiceCardProps) {
  return (
    <Link href={service.path} className="block">
      <div className="group bg-white rounded-xl p-6 border-2 border-gray-100 hover:border-indigo-300 hover:shadow-xl transition-all duration-300">
        <div className="flex items-start justify-between mb-3">
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${badgeColors[service.color]}`}>
            {service.badge}
          </span>
          <ArrowRightIcon className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
        </div>
        <h4 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
          {service.name}
        </h4>
        <p className="text-gray-600 text-sm mb-4">{service.description}</p>
        <div className="text-indigo-600 font-semibold text-sm flex items-center gap-2 group-hover:gap-3 transition-all">
          Learn more
          <ArrowRightIcon className="w-4 h-4" />
        </div>
      </div>
    </Link>
  );
}