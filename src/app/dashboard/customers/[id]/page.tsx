'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Phone, Mail, MapPin, Star, DollarSign, Pencil, X } from 'lucide-react';
import { useStore } from '@/lib/store';
import type { Customer, CustomerStatus } from '@/lib/types';
import Badge, { jobStatusVariant, quoteStatusVariant, invoiceStatusVariant } from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';

const STATUSES: CustomerStatus[] = ['Active', 'Inactive', 'VIP'];
const SOURCES = ['Website', 'Referral', 'Google', 'Facebook', 'Yelp', 'Direct', 'Other'];

function EditCustomerModal({ customer, onClose }: { customer: Customer; onClose: () => void }) {
  const { dispatch } = useStore();
  const [form, setForm] = useState({ ...customer });
  const set = (k: keyof Customer, v: string | number) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = () => {
    dispatch({ type: 'UPDATE_CUSTOMER', payload: form });
    onClose();
  };

  return (
    <Modal isOpen onClose={onClose} title="Edit Customer" size="lg">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input value={form.name} onChange={e => set('name', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input value={form.phone} onChange={e => set('phone', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input value={form.email} onChange={e => set('email', e.target.value)} type="email"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
          <input value={form.address} onChange={e => set('address', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select value={form.status} onChange={e => set('status', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
            {STATUSES.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Lead Source</label>
          <select value={form.source} onChange={e => set('source', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
            {SOURCES.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
          <textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
        </div>
      </div>
      <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
        <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 font-medium">Cancel</button>
        <button onClick={handleSave} className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg">
          Save Changes
        </button>
      </div>
    </Modal>
  );
}

export default function CustomerDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { state } = useStore();
  const [editOpen, setEditOpen] = useState(false);

  const customer = state.customers.find(c => c.id === id);
  if (!customer) {
    return (
      <div className="p-6">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 text-sm font-medium mb-4">
          <ArrowLeft size={16} /> Back to Customers
        </button>
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center text-gray-400">
          Customer not found.
        </div>
      </div>
    );
  }

  const customerJobs = state.jobs.filter(j => j.customerId === id);
  const customerQuotes = state.quotes.filter(q => q.customerId === id);
  const customerInvoices = state.invoices.filter(i => i.customerId === id);
  const customerFollowUps = state.followUps.filter(f => f.contactId === id);

  const totalPaid = customerInvoices.reduce((s, i) => s + i.paidAmount, 0);
  const totalOwed = customerInvoices.reduce((s, i) => s + (i.amount - i.paidAmount), 0);

  return (
    <div className="p-6 space-y-6">
      {editOpen && <EditCustomerModal customer={customer} onClose={() => setEditOpen(false)} />}

      {/* Header */}
      <div>
        <button onClick={() => router.back()} className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 text-sm font-medium mb-4">
          <ArrowLeft size={16} /> Back to Customers
        </button>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-purple-100 text-purple-700 font-bold text-xl flex items-center justify-center">
              {customer.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-gray-900">{customer.name}</h1>
                {customer.status === 'VIP' && <Star size={16} className="text-yellow-500 fill-yellow-400" />}
              </div>
              <p className="text-sm text-gray-500">Customer since {customer.createdDate} · via {customer.source}</p>
            </div>
          </div>
          <button onClick={() => setEditOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium">
            <Pencil size={14} /> Edit Profile
          </button>
        </div>
      </div>

      {/* Contact info + stats */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm space-y-3">
          <h2 className="font-semibold text-gray-900 border-b border-gray-50 pb-2">Contact Info</h2>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Phone size={14} className="text-gray-400" /> {customer.phone || 'No phone on file'}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Mail size={14} className="text-gray-400" /> {customer.email || 'No email on file'}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <MapPin size={14} className="text-gray-400" /> {customer.address || 'No address on file'}
          </div>
          {customer.notes && (
            <div className="pt-2 border-t border-gray-50">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Notes</p>
              <p className="text-sm text-gray-700">{customer.notes}</p>
            </div>
          )}
        </div>

        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total Spent', value: '$' + customer.totalSpent.toLocaleString(), color: 'text-green-600', icon: DollarSign },
            { label: 'Open Balance', value: '$' + totalOwed.toLocaleString(), color: totalOwed > 0 ? 'text-red-600' : 'text-gray-900', icon: DollarSign },
            { label: 'Total Jobs', value: customerJobs.length, color: 'text-gray-900', icon: null },
            { label: 'Total Quotes', value: customerQuotes.length, color: 'text-gray-900', icon: null },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm text-center">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Jobs */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Jobs ({customerJobs.length})</h2>
          <Link href="/dashboard/jobs" className="text-indigo-600 text-sm hover:text-indigo-700 font-medium">View all jobs</Link>
        </div>
        {customerJobs.length === 0 ? (
          <p className="px-5 py-8 text-center text-gray-400 text-sm">No jobs on record.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                {['Service', 'Date', 'Status', 'Value', 'Assigned To'].map(h => (
                  <th key={h} className="text-left px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {customerJobs.map(job => (
                <tr key={job.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-700">{job.serviceType}</td>
                  <td className="px-4 py-3 text-gray-600">{job.scheduledDate}</td>
                  <td className="px-4 py-3"><Badge variant={jobStatusVariant(job.status)}>{job.status}</Badge></td>
                  <td className="px-4 py-3 font-medium text-gray-900">${job.value.toLocaleString()}</td>
                  <td className="px-4 py-3 text-gray-600">{job.assignedTo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Quotes */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Quotes ({customerQuotes.length})</h2>
          <Link href="/dashboard/quotes" className="text-indigo-600 text-sm hover:text-indigo-700 font-medium">View all quotes</Link>
        </div>
        {customerQuotes.length === 0 ? (
          <p className="px-5 py-8 text-center text-gray-400 text-sm">No quotes on record.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                {['Date', 'Amount', 'Status', 'Expiration', 'Notes'].map(h => (
                  <th key={h} className="text-left px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {customerQuotes.map(quote => (
                <tr key={quote.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-600">{quote.quoteDate}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">${quote.amount.toLocaleString()}</td>
                  <td className="px-4 py-3"><Badge variant={quoteStatusVariant(quote.status)}>{quote.status}</Badge></td>
                  <td className="px-4 py-3 text-gray-600">{quote.expirationDate || '—'}</td>
                  <td className="px-4 py-3 text-gray-500 max-w-[200px] truncate">{quote.notes || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Invoices */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Invoices ({customerInvoices.length})</h2>
          <Link href="/dashboard/invoices" className="text-indigo-600 text-sm hover:text-indigo-700 font-medium">View all invoices</Link>
        </div>
        {customerInvoices.length === 0 ? (
          <p className="px-5 py-8 text-center text-gray-400 text-sm">No invoices on record.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                {['Invoice #', 'Date', 'Amount', 'Paid', 'Balance', 'Status'].map(h => (
                  <th key={h} className="text-left px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {customerInvoices.map(inv => (
                <tr key={inv.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs text-gray-700">{inv.invoiceNumber}</td>
                  <td className="px-4 py-3 text-gray-600">{inv.invoiceDate}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">${inv.amount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-green-600">${inv.paidAmount.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={(inv.amount - inv.paidAmount) > 0 ? 'text-red-600 font-semibold' : 'text-gray-500'}>
                      ${(inv.amount - inv.paidAmount).toLocaleString()}
                    </span>
                  </td>
                  <td className="px-4 py-3"><Badge variant={invoiceStatusVariant(inv.status)}>{inv.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Follow Ups */}
      {customerFollowUps.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50">
            <h2 className="font-semibold text-gray-900">Follow Ups ({customerFollowUps.length})</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {customerFollowUps.map(fu => (
              <div key={fu.id} className="flex items-center justify-between px-5 py-3.5">
                <div>
                  <p className="text-sm font-medium text-gray-900">{fu.reason}</p>
                  <p className="text-xs text-gray-500">Due: {fu.dueDate}</p>
                </div>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                  fu.status === 'Completed' ? 'bg-green-100 text-green-700' :
                  fu.status === 'Skipped' ? 'bg-gray-100 text-gray-600' :
                  'bg-yellow-100 text-yellow-700'
                }`}>{fu.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
