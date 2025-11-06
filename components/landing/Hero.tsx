'use client';

import { Calendar, Clock, Users, CheckCircle, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function Hero() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const stats = [
    { icon: Users, label: 'Expert Staff', value: '50+', color: 'blue' },
    { icon: Calendar, label: 'Bookings', value: '10K+', color: 'purple' },
    { icon: Clock, label: 'Availability', value: '24/7', color: 'green' },
    { icon: CheckCircle, label: 'Satisfaction', value: '98%', color: 'orange' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20 sm:py-32">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />

      {/* Floating gradient orbs */}
      <motion.div
        className="absolute top-20 right-10 w-72 h-72 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -z-10"
        animate={{ y: [0, 30, 0], x: [0, 20, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-20 left-10 w-72 h-72 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -z-10"
        animate={{ y: [0, -30, 0], x: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity, delay: 1 }}
      />

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? 'visible' : 'hidden'}
        >
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 border-2 border-blue-200 mb-8 shadow-lg"
            variants={itemVariants}
          >
            <Sparkles className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-bold text-blue-700">Welcome to BookEasy</span>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            className="text-5xl sm:text-7xl font-black tracking-tight text-gray-900 mb-6 leading-tight"
            variants={itemVariants}
          >
            Book Your Perfect
            <motion.span
              className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 block"
              animate={{ backgroundPosition: ['0%', '100%', '0%'] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              Service
            </motion.span>
            in Minutes
          </motion.h1>

          {/* Description */}
          <motion.p
            className="mt-8 text-xl leading-8 text-gray-700 font-medium"
            variants={itemVariants}
          >
            Experience seamless appointment booking with our modern platform. Choose your branch, service, and preferred staff member - all in just a few clicks.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="mt-12 flex items-center justify-center gap-x-6 flex-wrap"
            variants={itemVariants}
          >
            <Link href="/booking">
              <motion.button
                className="px-10 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 flex items-center gap-2 text-lg"
                whileHover={{ scale: 1.08, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Calendar className="w-5 h-5" />
                Book Now
              </motion.button>
            </Link>
            <Link href="#how-it-works">
              <motion.button
                className="px-10 py-4 border-2 border-blue-600 text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-all duration-300 text-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Learn More
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="mx-auto mt-20 max-w-5xl"
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? 'visible' : 'hidden'}
        >
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              const gradients = {
                blue: 'from-blue-500 to-blue-600',
                purple: 'from-purple-500 to-purple-600',
                green: 'from-green-500 to-green-600',
                orange: 'from-orange-500 to-orange-600',
              };

              return (
                <motion.div
                  key={stat.label}
                  className="flex flex-col items-center group cursor-pointer p-6 rounded-2xl bg-white border-2 border-gray-100 hover:border-blue-300 shadow-lg hover:shadow-2xl transition-all duration-300"
                  variants={itemVariants}
                  whileHover={{ y: -8, scale: 1.05 }}
                >
                  <motion.div
                    className={`rounded-full bg-gradient-to-br ${gradients[stat.color as keyof typeof gradients]} p-4 mb-4 text-white shadow-lg`}
                    whileHover={{ scale: 1.15, rotate: 10 }}
                  >
                    <Icon className="h-7 w-7" />
                  </motion.div>
                  <motion.div
                    className="text-4xl font-black text-gray-900"
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-sm font-bold text-gray-700 mt-2">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

