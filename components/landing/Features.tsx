'use client';

import { ModernCard } from '@/components/ui/ModernCard';
import { MapPin, Scissors, Users, Calendar, User, CheckCircle } from 'lucide-react';

const features = [
  {
    icon: MapPin,
    title: 'Choose Your Branch',
    description: 'Select from multiple convenient locations near you.',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  {
    icon: Scissors,
    title: 'Pick Your Service',
    description: 'Browse our wide range of professional services.',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
  {
    icon: Users,
    title: 'Select Your Staff',
    description: 'Choose your preferred expert or let us assign one.',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  {
    icon: Calendar,
    title: 'Book Date & Time',
    description: 'Real-time availability with flexible scheduling.',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
  },
  {
    icon: User,
    title: 'Enter Your Details',
    description: 'Quick and secure personal information form.',
    color: 'text-pink-600',
    bgColor: 'bg-pink-100',
  },
  {
    icon: CheckCircle,
    title: 'Instant Confirmation',
    description: 'Get your booking code and confirmation immediately.',
    color: 'text-teal-600',
    bgColor: 'bg-teal-100',
  },
];

export function Features() {
  return (
    <section id="how-it-works" className="py-24 sm:py-32 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-600">How It Works</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Simple 6-Step Booking Process
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Our streamlined booking wizard makes scheduling appointments effortless and intuitive.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-7xl">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <ModernCard key={index} className="relative overflow-hidden border-2 border-gray-200 hover:border-blue-300 hover:shadow-2xl transition-all duration-300">
                  <div className="p-6">
                    <div className={`inline-flex rounded-lg p-3 ${feature.bgColor} w-fit mb-4`}>
                      <Icon className={`h-6 w-6 ${feature.color}`} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      <span className="text-blue-600 font-bold mr-2">Step {index + 1}:</span>
                      {feature.title}
                    </h3>
                    <p className="text-base text-gray-700 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </ModernCard>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

