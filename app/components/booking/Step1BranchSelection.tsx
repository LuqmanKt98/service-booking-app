'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Branch } from '@/app/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, CheckCircle } from 'lucide-react';
import { useBranches } from '@/app/hooks/useBookingData';

interface Step1BranchSelectionProps {
  onSelect: (branch: Branch) => void;
  selectedBranch: Branch | null;
  onNext: () => void;
}

export const Step1BranchSelection: React.FC<Step1BranchSelectionProps> = ({
  onSelect,
  selectedBranch,
  onNext,
}) => {
  const { branches, loading, error } = useBranches();

  if (loading) {
    return (
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="h-24 w-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg animate-shimmer"
            initial={{ opacity: 0.6 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.1 }}
          />
        ))}
      </motion.div>
    );
  }

  if (error) {
    return (
      <Card className="bg-red-50 border-red-200">
        <CardContent className="pt-6">
          <p className="font-medium text-red-700">Error loading branches</p>
          <p className="text-sm text-red-600">{error}</p>
        </CardContent>
      </Card>
    );
  }

  // If no branches available
  if (branches.length === 0 && !loading) {
    return (
      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="pt-6">
          <p className="font-medium text-yellow-700">No branches available</p>
          <p className="text-sm text-yellow-600">Please contact support or try again later.</p>
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
        <h2 className="text-3xl font-black text-gray-900 mb-2">Select a Branch</h2>
        <p className="text-lg text-gray-700 font-medium">Choose the branch where you'd like to book your service</p>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2">
        {branches.map((branch, index) => (
          <motion.div
            key={branch.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <motion.div
              className={`cursor-pointer transition-all rounded-xl border-2 ${
                selectedBranch?.id === branch.id
                  ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 shadow-xl shadow-blue-200'
                  : 'border-gray-200 hover:border-blue-300 bg-white hover:shadow-lg'
              }`}
              onClick={() => onSelect(branch)}
              whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(59, 130, 246, 0.15)' }}
              whileTap={{ scale: 0.98 }}
            >
              <Card className="border-0 bg-transparent shadow-none">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-xl text-gray-900 mb-3">{branch.name}</h3>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3 text-sm">
                          <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0 text-blue-600" />
                          <span className="text-gray-700">{branch.address}</span>
                        </div>
                        {branch.phone && (
                          <div className="flex items-center gap-3 text-sm">
                            <Phone className="h-5 w-5 flex-shrink-0 text-blue-600" />
                            <span className="text-gray-700">{branch.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <motion.div
                      className="ml-4"
                      animate={selectedBranch?.id === branch.id ? { scale: 1.2 } : { scale: 1 }}
                    >
                      {selectedBranch?.id === branch.id ? (
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                        >
                          <CheckCircle className="h-7 w-7 text-blue-600" />
                        </motion.div>
                      ) : (
                        <div className="h-7 w-7 rounded-full border-2 border-gray-300" />
                      )}
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            onClick={onNext}
            disabled={!selectedBranch}
            size="lg"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-lg py-6 shadow-lg hover:shadow-xl transition-all"
          >
            Continue to Services
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

