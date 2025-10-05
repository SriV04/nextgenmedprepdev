'use client'

import { CheckIcon, StarIcon } from '@heroicons/react/24/solid';

interface PaymentPackage {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  currency: string;
  description: string;
  features: string[];
  popular?: boolean;
  turnaroundTime?: string;
  included?: string[];
}

interface PaymentCardProps {
  package: PaymentPackage;
  selected: boolean;
  onSelect: (pkg: PaymentPackage) => void;
}

export default function PaymentCard({ package: pkg, selected, onSelect }: PaymentCardProps) {
  return (
    <div
      className={`relative border-2 rounded-xl p-6 cursor-pointer transition-all duration-300 ${
        selected
          ? 'border-blue-500 bg-blue-50 shadow-lg'
          : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
      }`}
      onClick={() => onSelect(pkg)}
    >
      {pkg.popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
            <StarIcon className="w-4 h-4" />
            Most Popular
          </span>
        </div>
      )}
      
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-gray-900">{pkg.name}</h3>
        <div className="text-right">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900">
              £{pkg.price}
            </span>
            {pkg.originalPrice && (
              <span className="text-lg text-gray-400 line-through">
                £{pkg.originalPrice}
              </span>
            )}
          </div>
          {pkg.turnaroundTime && (
            <div className="text-sm text-gray-500 mt-1">{pkg.turnaroundTime}</div>
          )}
        </div>
      </div>
      
      <p className="text-gray-600 mb-6">{pkg.description}</p>
      
      <div className="space-y-3 mb-6">
        {pkg.features.map((feature, index) => (
          <div key={index} className="flex items-start gap-3">
            <CheckIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span className="text-gray-700 text-sm">{feature}</span>
          </div>
        ))}
      </div>
      
      {pkg.included && pkg.included.length > 0 && (
        <div className="border-t pt-4 mt-4">
          <h4 className="font-semibold text-gray-900 mb-2">What's included:</h4>
          <ul className="space-y-1">
            {pkg.included.map((item, index) => (
              <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0"></span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <div className={`mt-6 p-3 rounded-lg text-center font-medium transition-all duration-300 ${
        selected 
          ? 'bg-blue-600 text-white' 
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}>
        {selected ? 'Selected' : 'Select Package'}
      </div>
    </div>
  );
}