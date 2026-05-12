'use client';

import React from 'react';
import Link from 'next/link';
import {
  UserPlus, Users, Wrench, DollarSign, Receipt, Bell, TrendingUp, FileText
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { useStore } from '@/lib/store';
import { monthlyRevenue, leadSourceData } from '@/lib/mockData';

const PIE_COLORS = ['#4f46e5', '#0891b2', '#16a34a', '#d97706', '#dc2626', '#7c3aed'];

function fmt(n: number) {
  return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 0 });
}

function StatCard({
  label, value, sub, icon: Icon, color, href,
}: {
  label: string; value: string | number; sub?: string; icon: React.ElementType; color: string; href?: string;
}) {
  const inner = (
    <div className={`bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow`}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color}`}>
          <Icon size={18} className="text-white" />
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
    </div>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}

export default function DashboardPage() {
  const { state } = useStore();
  const { leads, customers, jobs, invoices, followUps, quotes } = state;

  const today = new Date().toISOString().split('T')[0];
  const thisMonth = today.slice(0, 7);

  const newLeadsThisMonth = leads.filter(l => l.createdDate.startsWith(thisMonth)).length;
  const openQuotes = quotes.filter(q => q.status === 'Sent' || q.status === 'Draft').length;
  const scheduledJobs = jobs.filter(j => j.status === 'Scheduled').length;
  const unpaidInvoices = invoices.filter(i => i.status === 'Unpaid' || i.status === 'Overdue');
  const unpaidTotal = unpaidInvoices.reduce((s, i) => s + (i.amount - i.paidAmount), 0);
  const followUpsDue = followUps.filter(f => f.status === 'Pending' && f.dueDate <= today).length;
  const totalCustomers = customers.length;
  const wonLeads = leads.filter(l => l.status === 'Won').length;
  const closedLeads = leads.filter(l => l.status === 'Won' || l.status === 'Lost').length;
  const conversionRate = closedLeads > 0 ? Math.round((wonLeads / closedLeads) * 100) : 0;
  const monthlyRev = monthlyRevenue[monthlyRevenue.length - 2]?.revenue ?? 0;

  // Quote status breakdown for pie chart
  const quoteCounts = ['Draft', 'Sent', 'Accepted', 'Declined', 'Expired'].map(s => ({
    name: s,
    value: quotes.filter(q => q.status === s).length,
  })).filter(d => d.value > 0);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-0.5">Welcome back, Mike. Here&apos;s what&apos;s happening.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="New Leads This Month" value={newLeadsThisMonth} icon={UserPlus} color="bg-blue-500" href="/dashboard/leads" sub="from all sources" />
        <StatCard label="Open Quotes" value={openQuotes} icon={FileText} color="bg-purple-500" href="/dashboard/quotes" sub="awaiting response" />
        <StatCard label="Scheduled Jobs" value={scheduledJobs} icon={Wrench} color="bg-orange-500" href="/dashboard/jobs" sub="upcoming" />
        <StatCard label="Monthly Revenue" value={fmt(monthlyRev)} icon={DollarSign} color="bg-green-500" href="/dashboard/reports" sub="last full month" />
        <StatCard label="Unpaid Invoices" value={fmt(unpaidTotal)} icon={Receipt} color="bg-red-500" href="/dashboard/invoices" sub={`${unpaidInvoices.length} invoices`} />
        <StatCard label="Total Customers" value={totalCustomers} icon={Users} color="bg-indigo-500" href="/dashboard/customers" sub="active accounts" />
        <StatCard label="Follow Ups Due" value={followUpsDue} icon={Bell} color={followUpsDue > 0 ? 'bg-yellow-500' : 'bg-gray-400'} href="/dashboard/follow-ups" sub="overdue or today" />
        <StatCard label="Lead Conversion" value={`${conversionRate}%`} icon={TrendingUp} color="bg-teal-500" href="/dashboard/reports" sub="won vs closed" />
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue bar chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-4">Revenue by Month (Last 12 Months)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyRevenue} margin={{ top: 4, right: 10, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v) => ['$' + Number(v).toLocaleString(), 'Revenue']}
                contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }} />
              <Bar dataKey="revenue" fill="#4f46e5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Lead sources pie */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-4">Leads by Source</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={leadSourceData} cx="50%" cy="45%" outerRadius={70} dataKey="value" label={false}>
                {leadSourceData.map((_, index) => (
                  <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => [`${v}%`, 'Share']}
                contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quote status + Recent leads */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quote status breakdown */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Quote Status</h2>
            <Link href="/dashboard/quotes" className="text-indigo-600 text-sm font-medium hover:text-indigo-700">View all</Link>
          </div>
          <div className="space-y-3">
            {[
              { label: 'Draft', color: 'bg-gray-400' },
              { label: 'Sent', color: 'bg-blue-500' },
              { label: 'Accepted', color: 'bg-green-500' },
              { label: 'Declined', color: 'bg-red-500' },
              { label: 'Expired', color: 'bg-yellow-400' },
            ].map(({ label, color }) => {
              const count = quotes.filter(q => q.status === label).length;
              const pct = quotes.length > 0 ? (count / quotes.length) * 100 : 0;
              return (
                <div key={label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{label}</span>
                    <span className="font-medium text-gray-900">{count}</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent leads */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <h2 className="font-semibold text-gray-900">Recent Leads</h2>
            <Link href="/dashboard/leads" className="text-indigo-600 text-sm font-medium hover:text-indigo-700">View all</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {leads.slice(0, 5).map(lead => (
              <div key={lead.id} className="flex items-center justify-between px-5 py-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0">
                    {lead.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{lead.name}</p>
                    <p className="text-xs text-gray-500">{lead.serviceRequested}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400 hidden sm:block">{lead.source}</span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    lead.status === 'New' ? 'bg-blue-100 text-blue-800' :
                    lead.status === 'Won' ? 'bg-green-100 text-green-800' :
                    lead.status === 'Lost' ? 'bg-red-100 text-red-800' :
                    lead.status === 'Quoted' ? 'bg-purple-100 text-purple-800' :
                    lead.status === 'Scheduled' ? 'bg-orange-100 text-orange-800' :
                    'bg-teal-100 text-teal-800'
                  }`}>
                    {lead.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
