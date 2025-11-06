'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Service } from '@/app/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, DollarSign, CheckCircle } from 'lucide-react';
import { useServices } from '@/app/hooks/useBookingData';

interface Step2ServiceSelectionProps {
  branchId: string | null;
  onSelect: (service: Service) => void;
  selectedService: Service | null;
  onNext: () => void;
  onBack: () => void;
}

export const Step2ServiceSelection: React.FC<Step2ServiceSelectionProps> = ({
  branchId,
  onSelect,
  selectedService,
  onNext,
  onBack,
}) => {
  const { services, loading, error } = useServices(branchId);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 w-full bg-gray-200 animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="bg-red-50 border-red-200">
        <CardContent className="pt-6">
          <p className="font-medium text-red-700">Error loading services</p>
          <p className="text-sm text-red-600">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-3xl font-black text-gray-900 mb-2">Select a Service</h2>
        <p className="text-lg text-gray-700 font-medium">Choose the service you'd like to book</p>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2">
        {services.map((service, index) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <motion.div
              className={`cursor-pointer transition-all rounded-xl overflow-hidden border-2 ${
                selectedService?.id === service.id
                  ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 shadow-xl shadow-blue-200'
                  : 'border-gray-200 hover:border-blue-300 bg-white hover:shadow-lg'
              }`}
              onClick={() => onSelect(service)}
              whileHover={{ y: -6 }}
              whileTap={{ scale: 0.98 }}
            >
              {service.image && (
                <div className="h-40 w-full overflow-hidden bg-gray-200">
                  <motion.img
                    src={service.image}
                    alt={service.name}
                    className="h-full w-full object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              )}
              <CardContent className="pt-4">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-lg text-gray-900">{service.name}</h3>
                  {selectedService?.id === service.id && (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    >
                      <CheckCircle className="h-6 w-6 text-blue-600 flex-shrink-0 ml-2" />
                    </motion.div>
                  )}
                </div>
                <p className="text-sm text-gray-700 mb-4">{service.description}</p>
                <div className="flex gap-3">
                  <Badge className="flex items-center gap-1 bg-blue-100 text-blue-700 border border-blue-300">
                    <Clock className="h-3 w-3" />
                    {service.duration} min
                  </Badge>
                  <Badge className="flex items-center gap-1 bg-green-100 text-green-700 border border-green-300">
                    <DollarSign className="h-3 w-3" />
                    {service.price}
                  </Badge>
                </div>
              </CardContent>
            </motion.div>
          </motion.div>
        ))}
      </div>

      <div className="flex gap-3 pt-4">
        <motion.div
          className="flex-1"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button onClick={onBack} variant="outline" size="lg" className="w-full border-gray-300 text-gray-900 hover:bg-gray-50 font-semibold">
            Back
          </Button>
        </motion.div>
        <motion.div
          className="flex-1"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            onClick={onNext}
            disabled={!selectedService}
            size="lg"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold shadow-lg hover:shadow-xl transition-all"
          >
            Continue to Staff
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

