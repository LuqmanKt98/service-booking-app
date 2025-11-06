'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookingsManager } from '@/components/admin/BookingsManager';
import { BranchesManager } from '@/components/admin/BranchesManager';
import { ServicesManager } from '@/components/admin/ServicesManager';
import { StaffManager } from '@/components/admin/StaffManager';
import { SchedulesManager } from '@/components/admin/SchedulesManager';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/components/auth/AuthProvider';
import { signOut } from 'firebase/auth';
import { auth } from '@/app/lib/firebase';
import { ModernButton } from '@/components/ui/ModernButton';
import { LayoutDashboard, Calendar, MapPin, Scissors, Users, Clock, LogOut } from 'lucide-react';

export default function AdminPage() {
  const { user } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <LayoutDashboard className="h-8 w-8 text-blue-600" />
                Admin Dashboard
              </h1>
              <p className="mt-2 text-gray-600">
                Manage your bookings, branches, services, staff, and schedules
              </p>
              {user && (
                <p className="mt-1 text-sm text-gray-500">
                  Signed in as: {user.email}
                </p>
              )}
            </div>
            <ModernButton
              onClick={handleSignOut}
              variant="outline"
              size="sm"
              icon={<LogOut className="h-4 w-4" />}
            >
              Sign Out
            </ModernButton>
          </div>

        <Tabs defaultValue="bookings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 h-auto">
            <TabsTrigger value="bookings" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Bookings</span>
            </TabsTrigger>
            <TabsTrigger value="branches" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span className="hidden sm:inline">Branches</span>
            </TabsTrigger>
            <TabsTrigger value="services" className="flex items-center gap-2">
              <Scissors className="h-4 w-4" />
              <span className="hidden sm:inline">Services</span>
            </TabsTrigger>
            <TabsTrigger value="staff" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Staff</span>
            </TabsTrigger>
            <TabsTrigger value="schedules" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span className="hidden sm:inline">Schedules</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>Bookings Management</CardTitle>
                <CardDescription>
                  View and manage all customer bookings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BookingsManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="branches">
            <Card>
              <CardHeader>
                <CardTitle>Branches Management</CardTitle>
                <CardDescription>
                  Add, edit, or remove branch locations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BranchesManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services">
            <Card>
              <CardHeader>
                <CardTitle>Services Management</CardTitle>
                <CardDescription>
                  Manage your service offerings and pricing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ServicesManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="staff">
            <Card>
              <CardHeader>
                <CardTitle>Staff Management</CardTitle>
                <CardDescription>
                  Manage staff members and their assigned services
                </CardDescription>
              </CardHeader>
              <CardContent>
                <StaffManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedules">
            <Card>
              <CardHeader>
                <CardTitle>Schedules Management</CardTitle>
                <CardDescription>
                  Set working hours and blocked times for staff
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SchedulesManager />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
    </ProtectedRoute>
  );
}