"use client";

import { useEffect, useMemo, useState } from "react";
import { db } from "@/app/lib/firebase";
import { collection, getDocs, onSnapshot, query } from "firebase/firestore";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, TrendingUp, CalendarDays, CheckCircle2, Clock, XCircle } from "lucide-react";

interface BookingDoc {
  id: string;
  status: string;
  date?: string;
  branchName?: string;
  serviceName?: string;
  price?: number;
  createdAt?: any;
}

export default function DashboardStats() {
  const [bookings, setBookings] = useState<BookingDoc[] | null>(null);

  useEffect(() => {
    const q = query(collection(db, "bookings"));
    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as BookingDoc[];
      setBookings(list);
    }, async () => {
      // fallback once if real-time fails
      const snapOnce = await getDocs(q);
      setBookings(snapOnce.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as BookingDoc[]);
    });
    return () => unsub();
  }, []);

  const stats = useMemo(() => {
    const total = bookings?.length ?? 0;
    const byStatus = { confirmed: 0, completed: 0, cancelled: 0, pending: 0 } as Record<string, number>;
    const byBranch = new Map<string, number>();

    const last7: { label: string; value: number }[] = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const label = `${d.getMonth() + 1}/${d.getDate()}`;
      last7.push({ label, value: 0 });
    }

    bookings?.forEach((b) => {
      byStatus[b.status] = (byStatus[b.status] ?? 0) + 1;
      const branch = b.branchName ?? "Unknown";
      byBranch.set(branch, (byBranch.get(branch) ?? 0) + 1);
      // naive day bucket by createdAt if exists else by date string
      const created = b.createdAt?.toDate?.() ?? (b.date ? new Date(b.date) : null);
      if (created) {
        const label = `${created.getMonth() + 1}/${created.getDate()}`;
        const item = last7.find((x) => x.label === label);
        if (item) item.value += 1;
      }
    });

    return { total, byStatus, byBranch, last7 };
  }, [bookings]);

  if (!bookings) {
    return (
      <div className="py-6 text-gray-600 flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" />Loading stats…</div>
    );
  }

  const maxLast7 = Math.max(1, ...stats.last7.map((d) => d.value));
  const topBranches = Array.from(stats.byBranch.entries()).sort((a,b)=>b[1]-a[1]).slice(0,4);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* KPI cards */}
      <Card className="bg-white border-2 border-gray-200 shadow-lg">
        <CardContent className="p-5">
          <div className="text-sm text-gray-600">Total Bookings</div>
          <div className="mt-1 text-3xl font-black text-gray-900 flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-blue-600" /> {stats.total}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge className="bg-blue-100 text-blue-700 border border-blue-300">Confirmed {stats.byStatus.confirmed ?? 0}</Badge>
            <Badge className="bg-green-100 text-green-700 border border-green-300">Completed {stats.byStatus.completed ?? 0}</Badge>
            <Badge className="bg-yellow-100 text-yellow-700 border border-yellow-300">Pending {stats.byStatus.pending ?? 0}</Badge>
            <Badge className="bg-red-100 text-red-700 border border-red-300">Cancelled {stats.byStatus.cancelled ?? 0}</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Last 7 days mini bar chart */}
      <Card className="bg-white border-2 border-gray-200 shadow-lg">
        <CardContent className="p-5">
          <div className="text-sm text-gray-600 flex items-center gap-2"><CalendarDays className="h-4 w-4 text-purple-600" /> Last 7 days</div>
          <div className="mt-3 h-24 flex items-end gap-2">
            {stats.last7.map((d, i) => (
              <div key={i} className="flex-1">
                <div
                  className="w-full rounded-t-md bg-gradient-to-t from-blue-300 to-purple-400"
                  style={{ height: `${(d.value / maxLast7) * 100}%` }}
                  title={`${d.label}: ${d.value}`}
                />
                <div className="mt-1 text-[10px] text-gray-600 text-center">{d.label}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top branches */}
      <Card className="bg-white border-2 border-gray-200 shadow-lg">
        <CardContent className="p-5">
          <div className="text-sm text-gray-600">Top Branches</div>
          <div className="mt-3 space-y-2">
            {topBranches.length === 0 && (
              <div className="text-gray-500 text-sm">No data</div>
            )}
            {topBranches.map(([name, count]) => (
              <div key={name} className="flex items-center justify-between">
                <div className="text-gray-900 font-medium">{name}</div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-24 rounded-full bg-gray-100">
                    <div className="h-2 rounded-full bg-blue-500" style={{ width: `${Math.min(100, (count / (stats.total || 1)) * 100)}%` }} />
                  </div>
                  <span className="text-gray-700 text-sm">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Status breakdown */}
      <Card className="bg-white border-2 border-gray-200 shadow-lg">
        <CardContent className="p-5">
          <div className="text-sm text-gray-600">Status Breakdown</div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 text-gray-900"><CheckCircle2 className="h-4 w-4 text-green-600" /> Completed <span className="ml-auto font-bold">{stats.byStatus.completed ?? 0}</span></div>
            <div className="flex items-center gap-2 text-gray-900"><Clock className="h-4 w-4 text-yellow-600" /> Pending <span className="ml-auto font-bold">{stats.byStatus.pending ?? 0}</span></div>
            <div className="flex items-center gap-2 text-gray-900"><CalendarDays className="h-4 w-4 text-blue-600" /> Confirmed <span className="ml-auto font-bold">{stats.byStatus.confirmed ?? 0}</span></div>
            <div className="flex items-center gap-2 text-gray-900"><XCircle className="h-4 w-4 text-red-600" /> Cancelled <span className="ml-auto font-bold">{stats.byStatus.cancelled ?? 0}</span></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

