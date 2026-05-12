'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Plus, Search, Edit2 } from 'lucide-react';
import { useStore } from '@/lib/store';
import type { Customer, CustomerStatus, LeadSource } from '@/lib/types';
import Badge, { customerStatusVariant } from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';

const STATUSES: CustomerStatus[] = ['Active', 'Inactive', 'VIP'];
const SOURCES: LeadSource[] = ['Website', 'Google Ads', 'Facebook', 'Referral', 'Yard Sign', 'Nextdoor', 'Yelp', 'Other'];

function CustomerForm({ initial, onSave, onCancel }: {
  initial: Omit<Customer, 'id'>; onSave: (d: Omit<Customer, 'id'>) => void; onCancel: () => void;
}) {
  const [form, setForm] = useState(initial);
  function set(k: string, v: string | number) { setForm(p => ({ ...p, [k]: v })); }
  return (
    <form onSubmit={e => { e.preventDefault(); onSave(form); }} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
          <input required value={form.name} onChange={e => set('name', e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input value={form.phone} onChange={e => set('phone', e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select value={form.status} onChange={e => set('status', e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300">
            {STATUSES.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
          <input value={form.address} onChange={e => set('address', e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Lead Source</label>
          <select value={form.source} onChange={e => set('source', e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300">
            {SOURCES.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
        <textarea rows={3} value={form.notes} onChange={e => set('notes', e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none" />
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg">Cancel</button>
        <button type="submit" className="px-4 py-2 text-sm text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg">Save Customer</button>
      </div>
    </form>
  );
}

const emptyCustomer: Omit<Customer, 'id'> = {
  name: '', phone: '', email: '', address: '', source: 'Website', totalSpent: 0,
  lastJobDate: '', openBalance: 0, status: 'Active', notes: '', createdDate: new Date().toISOString().split('T')[0],
};

export default function CustomersPage() {
  const { state, dispatch, newId } = useStore();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [showAdd, setShowAdd] = useState(false);
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null);

  const topSpendThreshold = state.customers.length
    ? [...state.customers].sort((a, b) => b.totalSpent - a.totalSpent)
        .slice(0, Math.max(1, Math.ceil(state.customers.length * 0.25)))
        .at(-1)?.totalSpent ?? 0
    : 0;

  const filtered = state.customers.filter(c => {
    const q = search.toLowerCase();
    const matchSearch = c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.phone.includes(q);
    let matchFilter = true;
    if (filterStatus === 'Top Spend') matchFilter = c.totalSpent >= topSpendThreshold;
    else if (filterStatus === 'Open Balance') matchFilter = c.openBalance > 0;
    else if (filterStatus !== 'All') matchFilter = c.status === filterStatus;
    return matchSearch && matchFilter;
  });

  function handleAdd(data: Omit<Customer, 'id'>) {
    dispatch({ type: 'ADD_CUSTOMER', payload: { ...data, id: newId('cust') } });
    setShowAdd(false);
  }

  function handleEdit(data: Omit<Customer, 'id'>) {
    if (!editCustomer) return;
    dispatch({ type: 'UPDATE_CUSTOMER', payload: { ...data, id: editCustomer.id } });
    setEditCustomer(null);
  }

  const totalRevenue = state.customers.reduce((s, c) => s + c.totalSpent, 0);
  const totalOpenBalance = state.customers.reduce((s, c) => s + c.openBalance, 0);
  const vipCount = state.customers.filter(c => c.status === 'VIP').length;

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          <p className="text-sm text-gray-500 mt-0.5">{state.customers.length} total customers</p>
        </div>
        <button onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg">
          <Plus size={16} /> Add Customer
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Revenue', value: '$' + totalRevenue.toLocaleString() },
          { label: 'Open Balances', value: '$' + totalOpenBalance.toLocaleString() },
          { label: 'VIP Customers', value: vipCount },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm text-center">
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex flex-wrap gap-2">
          {['All', ...STATUSES, 'Top Spend', 'Open Balance'].map(s => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                filterStatus === s ? 'bg-indigo-600 text-white' :
                s === 'Top Spend' ? 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200' :
                s === 'Open Balance' ? 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200' :
                'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}>
              {s}
            </button>
          ))}
        </div>
        <div className="relative ml-auto">
          <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search customers..."
            className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 w-60" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {['Name', 'Phone / Email', 'Address', 'Total Spent', 'Open Balance', 'Last Job', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="px-4 py-12 text-center text-gray-400">No customers found.</td></tr>
              ) : (
                filtered.map(customer => (
                  <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-700 font-bold text-xs flex items-center justify-center shrink-0">
                          {customer.name.charAt(0)}
                        </div>
                        <Link href={`/dashboard/customers/${customer.id}`} className="font-medium text-indigo-600 hover:text-indigo-800">
                          {customer.name}
                        </Link>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-gray-700">{customer.phone}</p>
                      <p className="text-gray-400 text-xs">{customer.email}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600 max-w-[160px] truncate">{customer.address}</td>
                    <td className="px-4 py-3 font-semibold text-gray-900">${customer.totalSpent.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={customer.openBalance > 0 ? 'text-red-600 font-semibold' : 'text-gray-500'}>
                        ${customer.openBalance.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{customer.lastJobDate || '—'}</td>
                    <td className="px-4 py-3">
                      <Badge variant={customerStatusVariant(customer.status)}>{customer.status}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <Link href={`/dashboard/customers/${customer.id}`}
                          className="px-2 py-1 text-xs text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors font-medium">
                          View
                        </Link>
                        <button onClick={() => setEditCustomer(customer)}
                          className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                          <Edit2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Add Customer" size="lg">
        <CustomerForm initial={emptyCustomer} onSave={handleAdd} onCancel={() => setShowAdd(false)} />
      </Modal>
      <Modal isOpen={!!editCustomer} onClose={() => setEditCustomer(null)} title="Edit Customer" size="lg">
        {editCustomer && <CustomerForm initial={editCustomer} onSave={handleEdit} onCancel={() => setEditCustomer(null)} />}
      </Modal>
    </div>
  );
}
