'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Calendar, Clock, MapPin, Scissors, User, Mail, Phone, Loader2, PartyPopper } from 'lucide-react';
import { Branch, Service, Staff } from '@/app/types';
import Link from 'next/link';

interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  notes: string;
}

interface Step6ConfirmationProps {
  bookingCode: string;
  branch: Branch | null;
  service: Service | null;
  staff: Staff | null;
  date: string | null;
  time: string | null;
  customerInfo: CustomerInfo;
  onConfirm: () => void;
  onBack: () => void;
}

export const Step6Confirmation: React.FC<Step6ConfirmationProps> = ({
  bookingCode,
  branch,
  service,
  staff,
  date,
  time,
  customerInfo,
  onConfirm,
  onBack,
}) => {
  const [isConfirming, setIsConfirming] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(!!bookingCode);

  const handleConfirm = async () => {
    setIsConfirming(true);
    await onConfirm();
    setIsConfirming(false);
    setIsConfirmed(true);
  };

  // If already confirmed, show success screen
  if (isConfirmed && bookingCode) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-6 text-center"
      >
        <div className="flex justify-center">
          <div className="rounded-full bg-green-100 p-6">
            <CheckCircle className="h-20 w-20 text-green-600" />
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Booking Confirmed! <PartyPopper className="inline h-8 w-8 text-yellow-500" />
          </h2>
          <p className="text-gray-600">
            Your appointment has been successfully scheduled
          </p>
        </div>

        <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Your Booking Code</p>
              <div className="text-5xl font-bold text-blue-600 tracking-wider font-mono">
                {bookingCode}
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Please save this code for your records
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Appointment Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">{date}</p>
                <p className="text-sm text-gray-600">at {time}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Scissors className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">{service?.name}</p>
                <p className="text-sm text-gray-600">{service?.duration} minutes • ${service?.price}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">{staff?.name}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">{branch?.name}</p>
                <p className="text-sm text-gray-600">{branch?.address}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            <strong>Confirmation email sent to:</strong> {customerInfo.email}
          </p>
        </div>

        <div className="flex gap-3">
          <Link href="/" className="flex-1">
            <Button variant="outline" size="lg" className="w-full">
              Back to Home
            </Button>
          </Link>
          <Link href="/booking" className="flex-1">
            <Button size="lg" className="w-full">
              Book Another
            </Button>
          </Link>
        </div>
      </motion.div>
    );
  }

  // Show confirmation review screen
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Review Your Booking</h2>
        <p className="text-gray-600">Please review your appointment details before confirming</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Appointment Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Appointment Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Date & Time</p>
                <p className="font-medium text-gray-900">{date} at {time}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Scissors className="h-5 w-5 text-purple-600 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Service</p>
                <p className="font-medium text-gray-900">{service?.name}</p>
                <p className="text-sm text-gray-600">{service?.duration} min • ${service?.price}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Staff Member</p>
                <p className="font-medium text-gray-900">{staff?.name}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-orange-600 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium text-gray-900">{branch?.name}</p>
                <p className="text-sm text-gray-600">{branch?.address}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customer Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Your Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium text-gray-900">{customerInfo.name}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-gray-900">{customerInfo.email}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium text-gray-900">{customerInfo.phone}</p>
              </div>
            </div>
            {customerInfo.notes && (
              <div className="pt-3 border-t">
                <p className="text-sm text-gray-500 mb-1">Additional Notes</p>
                <p className="text-sm text-gray-700">{customerInfo.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="pt-6">
          <p className="text-sm text-yellow-900">
            <strong>Please note:</strong> You will receive a confirmation email at {customerInfo.email} with your booking details and a unique booking code.
          </p>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button onClick={onBack} variant="outline" size="lg" className="flex-1">
          Back
        </Button>
        <Button onClick={handleConfirm} size="lg" className="flex-1" disabled={isConfirming}>
          {isConfirming ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Confirming...
            </>
          ) : (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Confirm Booking
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
};

