'use client';

import { ModernCard } from '@/components/ui/ModernCard';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Regular Customer',
    content: 'The booking process is incredibly smooth! I love being able to choose my preferred stylist and see real-time availability.',
    rating: 5,
    image: '👩‍💼',
  },
  {
    name: 'Michael Chen',
    role: 'Business Professional',
    content: 'Finally, a booking system that actually works! No more phone calls or waiting. Everything is instant and confirmed.',
    rating: 5,
    image: '👨‍💻',
  },
  {
    name: 'Emily Rodriguez',
    role: 'Busy Mom',
    content: 'As a mom of three, I appreciate how quick and easy it is to book appointments. The reminders are super helpful too!',
    rating: 5,
    image: '👩‍🦰',
  },
];

export function Testimonials() {
  return (
    <section className="py-24 sm:py-32 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-600">Testimonials</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Loved by Thousands of Customers
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            See what our customers have to say about their booking experience.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <ModernCard key={index} className="bg-white border-2 border-gray-200 hover:border-blue-300 hover:shadow-2xl transition-all duration-300">
              <div className="p-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-800 mb-6 leading-relaxed font-medium text-base">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="text-4xl">{testimonial.image}</div>
                  <div>
                    <div className="font-bold text-gray-900 text-base">{testimonial.name}</div>
                    <div className="text-sm text-gray-600 font-medium">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            </ModernCard>
          ))}
        </div>
      </div>
    </section>
  );
}

