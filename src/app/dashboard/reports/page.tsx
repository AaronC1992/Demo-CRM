'use client';

import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { useStore } from '@/lib/store';
import { monthlyRevenue } from '@/lib/mockData';

const COLORS = ['#4f46e5', '#0891b2', '#16a34a', '#d97706', '#dc2626', '#7c3aed'];

export default function ReportsPage() {
  const { state } = useStore();
  const { leads, customers, jobs, quotes, invoices } = state;

  // Top 5 customers by spend
  const topCustomers = [...customers]
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, 5)
    .map(c => ({ name: c.name.split(' ')[0], value: c.totalSpent }));

  // Won vs Lost
  const wonLost = [
    { name: 'Won', value: leads.filter(l => l.status === 'Won').length },
    { name: 'Lost', value: leads.filter(l => l.status === 'Lost').length },
    { name: 'Active', value: leads.filter(l => !['Won', 'Lost'].includes(l.status)).length },
  ];

  // Lead sources
  const sourceMap: Record<string, number> = {};
  leads.forEach(l => { sourceMap[l.source] = (sourceMap[l.source] ?? 0) + 1; });
  const leadSources = Object.entries(sourceMap).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);

  // Quote acceptance
  const totalDecided = quotes.filter(q => ['Accepted', 'Declined', 'Expired'].includes(q.status)).length;
  const accepted = quotes.filter(q => q.status === 'Accepted').length;
  const acceptanceRate = totalDecided > 0 ? Math.round((accepted / totalDecided) * 100) : 0;

  // Revenue summary
  const allRevenue = monthlyRevenue.reduce((s, m) => s + m.revenue, 0);
  const avgJobValue = jobs.filter(j => j.value > 0).length > 0
    ? Math.round(jobs.filter(j => j.value > 0).reduce((s, j) => s + j.value, 0) / jobs.filter(j => j.value > 0).length)
    : 0;
  const openInvoiceTotal = invoices.filter(i => i.status !== 'Paid').reduce((s, i) => s + (i.amount - i.paidAmount), 0);
  const conversionRate = leads.filter(l => ['Won', 'Lost'].includes(l.status)).length > 0
    ? Math.round((leads.filter(l => l.status === 'Won').length / leads.filter(l => ['Won', 'Lost'].includes(l.status)).length) * 100)
    : 0;

  function SummaryCard({ label, value, sub, color = 'text-gray-900' }: { label: string; value: string | number; sub?: string; color?: string }) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
        <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
        <p className={`text-2xl font-bold ${color}`}>{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        <p className="text-sm text-gray-500 mt-0.5">Demo data — all figures are sample values</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard label="Total Revenue (12 mo)" value={'$' + allRevenue.toLocaleString()} color="text-green-600" />
        <SummaryCard label="Average Job Value" value={'$' + avgJobValue.toLocaleString()} sub="jobs with value > $0" />
        <SummaryCard label="Lead Conversion Rate" value={`${conversionRate}%`} sub="won / closed leads" color={conversionRate > 50 ? 'text-green-600' : 'text-orange-600'} />
        <SummaryCard label="Open Invoice Total" value={'$' + openInvoiceTotal.toLocaleString()} color={openInvoiceTotal > 0 ? 'text-red-600' : 'text-gray-900'} sub="unpaid + overdue" />
        <SummaryCard label="Quote Acceptance Rate" value={`${acceptanceRate}%`} sub={`${accepted} of ${totalDecided} decided`} />
        <SummaryCard label="Total Customers" value={customers.length} sub={`${customers.filter(c => c.status === 'VIP').length} VIP`} />
        <SummaryCard label="Total Jobs" value={jobs.length} sub={`${jobs.filter(j => j.status === 'Completed').length} completed`} />
        <SummaryCard label="Total Leads" value={leads.length} sub={`${leads.filter(l => l.status === 'New').length} new`} />
      </div>

      {/* Revenue bar chart */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
        <h2 className="font-semibold text-gray-900 mb-4">Monthly Revenue</h2>
        <ResponsiveContainer width="100%" height={240}>
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

      {/* Two-column section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Customers */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-4">Top Customers by Revenue</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={topCustomers} layout="vertical" margin={{ top: 0, right: 10, bottom: 0, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} width={60} />
              <Tooltip formatter={(v) => ['$' + Number(v).toLocaleString(), 'Spent']}
                contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }} />
              <Bar dataKey="value" fill="#0891b2" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Lead sources pie */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-4">Lead Sources</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={leadSources} cx="50%" cy="45%" outerRadius={70} dataKey="value" label={false}>
                {leadSources.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Won vs Lost */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-4">Lead Outcomes</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={wonLost} margin={{ top: 4, right: 10, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {wonLost.map((entry, i) => (
                  <Cell key={i} fill={entry.name === 'Won' ? '#16a34a' : entry.name === 'Lost' ? '#dc2626' : '#6366f1'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Quote status breakdown */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-4">Quote Status Breakdown</h2>
          <div className="space-y-3 mt-2">
            {['Draft', 'Sent', 'Accepted', 'Declined', 'Expired'].map(s => {
              const count = quotes.filter(q => q.status === s).length;
              const pct = quotes.length > 0 ? Math.round((count / quotes.length) * 100) : 0;
              const colors: Record<string, string> = { Draft: 'bg-gray-400', Sent: 'bg-blue-500', Accepted: 'bg-green-500', Declined: 'bg-red-500', Expired: 'bg-yellow-400' };
              return (
                <div key={s}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{s}</span>
                    <span className="text-gray-900 font-medium">{count} ({pct}%)</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${colors[s]} rounded-full`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
