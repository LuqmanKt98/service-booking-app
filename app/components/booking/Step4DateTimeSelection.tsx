'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Staff, Service, Branch } from '@/app/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Scissors, User, Loader2 } from 'lucide-react';
import {
  getNext14Days,
  formatDate,
  formatDateDisplay,
  isToday,
  getDayOfWeek,
  formatTimeDisplay,
} from '@/app/utils/dateTime';

interface Step4DateTimeSelectionProps {
  staff: Staff | null;
  service: Service | null;
  branch: Branch | null;
  selectedDate: string | null;
  selectedTime: string | null;
  onDateSelect: (date: string) => void;
  onTimeSelect: (time: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export const Step4DateTimeSelection: React.FC<Step4DateTimeSelectionProps> = ({
  staff,
  service,
  branch,
  selectedDate,
  selectedTime,
  onDateSelect,
  onTimeSelect,
  onNext,
  onBack,
}) => {
  const [selectedDateObj, setSelectedDateObj] = useState<Date | null>(null);
  const [timeSlots, setTimeSlots] = useState<Array<{ time: string; iso: string; value: string }>>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const dates = useMemo(() => getNext14Days(), []);

  const handleDateSelect = async (date: Date) => {
    setSelectedDateObj(date);
    const dateStr = formatDate(date);
    onDateSelect(dateStr);
    onTimeSelect(''); // Reset time when date changes

    // Fetch available time slots from API
    if (staff && service && branch) {
      setLoadingSlots(true);
      try {
        const response = await fetch('/api/availability', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            staffId: staff.id,
            serviceId: service.id,
            branchId: branch.id,
            date: dateStr,
          }),
        });

        const data = await response.json();
        setTimeSlots(data.slots || []);
      } catch (error) {
        console.error('Error fetching availability:', error);
        setTimeSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Date & Time</h2>
        <p className="text-gray-600">Choose when you'd like your appointment</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Date Selection */}
        <div className="md:col-span-2">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Select a Date
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-96 overflow-y-auto pr-2">
            {dates.map((date) => {
              const dateStr = formatDate(date);
              const isSelected = selectedDate === dateStr;
              return (
                <Card
                  key={dateStr}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    isSelected
                      ? 'border-blue-600 border-2 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                  onClick={() => handleDateSelect(date)}
                >
                  <CardContent className="p-3 text-center">
                    <div className="text-sm font-medium text-gray-900">
                      {formatDateDisplay(date)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {isToday(date) ? (
                        <Badge variant="secondary" className="text-xs">Today</Badge>
                      ) : (
                        getDayOfWeek(date)
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Time Selection */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Select a Time
          </h3>
          {selectedDate ? (
            loadingSlots ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2 max-h-96 overflow-y-auto pr-2">
                {timeSlots.length > 0 ? (
                  timeSlots.map((slot) => {
                    const isSelected = selectedTime === slot.value;
                    return (
                      <Card
                        key={slot.iso}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          isSelected
                            ? 'border-blue-600 border-2 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                        onClick={() => onTimeSelect(slot.value)}
                      >
                        <CardContent className="p-2 text-center">
                          <div className="text-sm font-medium text-gray-900">{slot.time}</div>
                        </CardContent>
                      </Card>
                    );
                  })
                ) : (
                  <Card className="bg-yellow-50 border-yellow-200">
                    <CardContent className="p-4 text-center">
                      <p className="text-sm text-yellow-900">No available slots for this date</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )
          ) : (
            <Card className="bg-gray-50">
              <CardContent className="p-8 text-center">
                <p className="text-sm text-gray-500">Select a date first</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Booking Summary */}
      {selectedDate && selectedTime && (
        <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-lg">Booking Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <Scissors className="h-5 w-5 text-purple-600 mt-0.5" />
              <div>
                <p className="text-sm text-gray-600">Service</p>
                <p className="font-medium text-gray-900">{service?.name}</p>
                <p className="text-sm text-gray-600">{service?.duration} min • ${service?.price}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="text-sm text-gray-600">Staff Member</p>
                <p className="font-medium text-gray-900">{staff?.name}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm text-gray-600">Date & Time</p>
                <p className="font-medium text-gray-900">
                  {formatDateDisplay(selectedDateObj!)} at {selectedTime ? formatTimeDisplay(selectedTime) : ''}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-orange-600 mt-0.5" />
              <div>
                <p className="text-sm text-gray-600">Location</p>
                <p className="font-medium text-gray-900">{branch?.name}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex gap-3">
        <Button onClick={onBack} variant="outline" size="lg" className="flex-1">
          Back
        </Button>
        <Button
          onClick={onNext}
          disabled={!selectedDate || !selectedTime}
          size="lg"
          className="flex-1"
        >
          Continue to Your Info
        </Button>
      </div>
    </motion.div>
  );
};

