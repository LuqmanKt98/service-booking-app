'use client';

import { useEffect, useState } from 'react';
import { db } from '@/app/lib/firebase';
import { collection, getDocs, addDoc, updateDoc, doc, query, where } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Save } from 'lucide-react';

interface Staff {
  id: string;
  name: string;
}

interface Schedule {
  id?: string;
  staffId: string;
  monday: { start: string; end: string };
  tuesday: { start: string; end: string };
  wednesday: { start: string; end: string };
  thursday: { start: string; end: string };
  friday: { start: string; end: string };
  saturday: { start: string; end: string };
  sunday: { start: string; end: string };
}

const defaultHours = { start: '09:00', end: '17:00' };
const offDay = { start: '', end: '' };

export function SchedulesManager() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [selectedStaffId, setSelectedStaffId] = useState('');
  const [schedule, setSchedule] = useState<Schedule>({
    staffId: '',
    monday: defaultHours,
    tuesday: defaultHours,
    wednesday: defaultHours,
    thursday: defaultHours,
    friday: defaultHours,
    saturday: defaultHours,
    sunday: offDay,
  });
  const [scheduleId, setScheduleId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchStaff();
  }, []);

  useEffect(() => {
    if (selectedStaffId) {
      fetchSchedule(selectedStaffId);
    }
  }, [selectedStaffId]);

  const fetchStaff = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'staff'));
      const staffData = snapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
      })) as Staff[];
      setStaff(staffData);
      if (staffData.length > 0) {
        setSelectedStaffId(staffData[0].id);
      }
    } catch (error) {
      console.error('Error fetching staff:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSchedule = async (staffId: string) => {
    try {
      const q = query(collection(db, 'schedules'), where('staffId', '==', staffId));
      const snapshot = await getDocs(q);
      
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        setScheduleId(doc.id);
        setSchedule(doc.data() as Schedule);
      } else {
        setScheduleId(null);
        setSchedule({
          staffId,
          monday: defaultHours,
          tuesday: defaultHours,
          wednesday: defaultHours,
          thursday: defaultHours,
          friday: defaultHours,
          saturday: defaultHours,
          sunday: offDay,
        });
      }
    } catch (error) {
      console.error('Error fetching schedule:', error);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const scheduleData = { ...schedule, staffId: selectedStaffId };
      
      if (scheduleId) {
        await updateDoc(doc(db, 'schedules', scheduleId), scheduleData);
      } else {
        const docRef = await addDoc(collection(db, 'schedules'), scheduleData);
        setScheduleId(docRef.id);
      }
      
      alert('Schedule saved successfully!');
    } catch (error) {
      console.error('Error saving schedule:', error);
      alert('Failed to save schedule');
    } finally {
      setSaving(false);
    }
  };

  const updateDay = (day: keyof Omit<Schedule, 'id' | 'staffId'>, field: 'start' | 'end', value: string) => {
    setSchedule({
      ...schedule,
      [day]: {
        ...schedule[day],
        [field]: value,
      },
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const days: Array<keyof Omit<Schedule, 'id' | 'staffId'>> = [
    'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="staff">Select Staff Member</Label>
        <select
          id="staff"
          className="w-full rounded-lg border-2 border-gray-200 bg-white px-3 py-2 shadow-sm"
          value={selectedStaffId}
          onChange={(e) => setSelectedStaffId(e.target.value)}
        >
          {staff.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      <Card className="bg-white border-2 border-gray-200 shadow-lg">
        <CardHeader className="border-b border-gray-200">
          <CardTitle className="text-gray-900">Weekly Schedule</CardTitle>
          <CardDescription className="text-gray-700">
            Set working hours for each day. Leave empty for days off.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {days.map((day) => (
              <div key={day} className="grid grid-cols-3 gap-4 items-center">
                <Label className="capitalize">{day}</Label>
                <div className="space-y-1">
                  <Label htmlFor={`${day}-start`} className="text-xs text-gray-500">Start Time</Label>
                  <Input
                    id={`${day}-start`}
                    type="time"
                    value={schedule[day].start}
                    onChange={(e) => updateDay(day, 'start', e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor={`${day}-end`} className="text-xs text-gray-500">End Time</Label>
                  <Input
                    id={`${day}-end`}
                    type="time"
                    value={schedule[day].end}
                    onChange={(e) => updateDay(day, 'end', e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 flex justify-end">
            <Button onClick={handleSave} disabled={saving} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg">
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Schedule
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

