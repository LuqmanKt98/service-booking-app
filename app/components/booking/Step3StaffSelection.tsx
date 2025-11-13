'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Staff } from '@/app/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CheckCircle, Mail } from 'lucide-react';
import { useStaff } from '@/app/hooks/useBookingData';

interface Step3StaffSelectionProps {
  serviceId: string | null;
  branchId: string | null;
  onSelect: (staff: Staff) => void;
  selectedStaff: Staff | null;
  onNext: () => void;
  onBack: () => void;
}

export const Step3StaffSelection: React.FC<Step3StaffSelectionProps> = ({
  serviceId,
  branchId,
  onSelect,
  selectedStaff,
  onNext,
  onBack,
}) => {
  const { staff, loading, error } = useStaff(serviceId, branchId);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 w-full bg-gray-200 animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="bg-red-50 border-red-200">
        <CardContent className="pt-6">
          <p className="font-medium text-red-700">Error loading staff</p>
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
        <h2 className="text-3xl font-black text-gray-900 mb-2">Select a Staff Member</h2>
        <p className="text-lg text-gray-700 font-medium">Choose who will provide your service</p>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {staff.map((member, index) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <motion.div
              className={`cursor-pointer transition-all rounded-xl border-2 ${
                selectedStaff?.id === member.id
                  ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 shadow-xl shadow-blue-200'
                  : 'border-gray-200 hover:border-blue-300 bg-white hover:shadow-lg'
              }`}
              onClick={() => onSelect(member)}
              whileHover={{ y: -6 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card className="border-0 bg-transparent shadow-none">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    >
                      <Avatar className="h-24 w-24 mb-4 border-2 border-blue-200">
                        <AvatarImage src={member.profilePhoto} alt={member.name} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white text-3xl font-bold">
                          {member.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </motion.div>
                    <h3 className="font-bold text-lg text-gray-900">{member.name}</h3>

                    {member.email && (
                      <div className="flex items-center gap-1 text-xs text-gray-600 mt-3">
                        <Mail className="h-3 w-3" />
                        <span>{member.email}</span>
                      </div>
                    )}
                    <div className="mt-5">
                      {selectedStaff?.id === member.id ? (
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                        >
                          <CheckCircle className="h-7 w-7 text-blue-600 mx-auto" />
                        </motion.div>
                      ) : (
                        <div className="h-7 w-7 rounded-full border-2 border-gray-300 mx-auto" />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
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
          <Button onClick={onBack} variant="outline" size="lg" className="w-full border-blue-500/50 text-blue-100 hover:bg-blue-900/50 hover:text-blue-50 font-semibold">
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
            disabled={!selectedStaff}
            size="lg"
            className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold shadow-lg hover:shadow-2xl hover:shadow-purple-500/50 transition-all"
          >
            Continue to Date & Time
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

