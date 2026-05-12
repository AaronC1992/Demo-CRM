'use client';

import React, { useState } from 'react';
import { Plus, Edit2, ArrowRight, Search } from 'lucide-react';
import { useStore } from '@/lib/store';
import type { Quote, QuoteStatus, Customer, Job } from '@/lib/types';
import Badge, { quoteStatusVariant } from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';

const STATUSES: QuoteStatus[] = ['Draft', 'Sent', 'Accepted', 'Declined', 'Expired'];
const TEAM = ['Mike Rodriguez', 'Tom Baker', 'Dave Williams', 'Sarah Chen'];
const SERVICES = ['AC Installation', 'AC Repair', 'Furnace Installation', 'Furnace Repair', 'HVAC Tune-Up', 'Water Heater Install', 'Plumbing Repair', 'Drain Cleaning', 'Electrical Panel Upgrade', 'Generator Install', 'Other'];

function QuoteForm({ initial, customers, onSave, onCancel }: {
  initial: Omit<Quote, 'id'>; customers: Customer[]; onSave: (d: Omit<Quote, 'id'>) => void; onCancel: () => void;
}) {
  const [form, setForm] = useState(initial);
  function set(k: string, v: string | number) { setForm(p => ({ ...p, [k]: v })); }
  return (
    <form onSubmit={e => { e.preventDefault(); onSave(form); }} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Customer *</label>
          <select required value={form.customerId} onChange={e => set('customerId', e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300">
            <option value="">Select customer...</option>
            {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Service</label>
          <select value={form.serviceDescription} onChange={e => set('serviceDescription', e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300">
            <option value="">Select...</option>
            {SERVICES.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Quote Date</label>
          <input type="date" value={form.quoteDate} onChange={e => set('quoteDate', e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Expiration Date</label>
          <input type="date" value={form.expirationDate} onChange={e => set('expirationDate', e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
          <input type="number" value={form.amount} onChange={e => set('amount', Number(e.target.value))}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select value={form.status} onChange={e => set('status', e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300">
            {STATUSES.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Created By</label>
          <select value={form.createdBy} onChange={e => set('createdBy', e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300">
            {TEAM.map(t => <option key={t}>{t}</option>)}
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
        <button type="submit" className="px-4 py-2 text-sm text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg">Save Quote</button>
      </div>
    </form>
  );
}

const today = new Date().toISOString().split('T')[0];
const emptyQuote: Omit<Quote, 'id'> = {
  customerId: '', serviceDescription: '', quoteDate: today, expirationDate: '',
  amount: 0, status: 'Draft', notes: '', createdBy: 'Mike Rodriguez', jobId: '',
};

export default function QuotesPage() {
  const { state, dispatch, newId } = useStore();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [showAdd, setShowAdd] = useState(false);
  const [editQuote, setEditQuote] = useState<Quote | null>(null);
  const [convertQuote, setConvertQuote] = useState<Quote | null>(null);

  const customerName = (id: string) => state.customers.find(c => c.id === id)?.name ?? id;

  const filtered = state.quotes.filter(q => {
    const name = customerName(q.customerId).toLowerCase();
    const search_ = search.toLowerCase();
    const matchSearch = name.includes(search_) || (q.serviceDescription ?? '').toLowerCase().includes(search_);
    const matchStatus = filterStatus === 'All' || q.status === filterStatus;
    return matchSearch && matchStatus;
  });

  function handleAdd(data: Omit<Quote, 'id'>) {
    dispatch({ type: 'ADD_QUOTE', payload: { ...data, id: newId('qte') } });
    setShowAdd(false);
  }

  function handleEdit(data: Omit<Quote, 'id'>) {
    if (!editQuote) return;
    dispatch({ type: 'UPDATE_QUOTE', payload: { ...data, id: editQuote.id } });
    setEditQuote(null);
  }

  function handleConvertToJob(quote: Quote) {
    const job: Job = {
      id: newId('job'),
      customerId: quote.customerId,
      serviceType: quote.serviceDescription ?? '',
      scheduledDate: today,
      completedDate: '',
      status: 'Scheduled',
      value: quote.amount,
      assignedTo: 'Mike Rodriguez',
      notes: quote.notes,
      quoteId: quote.id,
    };
    dispatch({ type: 'CONVERT_QUOTE_TO_JOB', payload: { quoteId: quote.id, job } });
    setConvertQuote(null);
  }

  const counts = STATUSES.reduce((acc, s) => ({ ...acc, [s]: state.quotes.filter(q => q.status === s).length }), {} as Record<string, number>);
  const totalValue = state.quotes.filter(q => q.status === 'Accepted').reduce((s, q) => s + q.amount, 0);
  const acceptanceRate = (counts['Sent'] + counts['Accepted'] + counts['Declined'] + counts['Expired']) > 0
    ? Math.round(counts['Accepted'] / (counts['Accepted'] + counts['Declined'] + counts['Expired']) * 100)
    : 0;

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quotes</h1>
          <p className="text-sm text-gray-500 mt-0.5">{state.quotes.length} total quotes</p>
        </div>
        <button onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg">
          <Plus size={16} /> Add Quote
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Accepted Quotes Value', value: '$' + totalValue.toLocaleString(), color: 'text-green-600' },
          { label: 'Open (Draft + Sent)', value: (counts['Draft'] ?? 0) + (counts['Sent'] ?? 0), color: 'text-blue-600' },
          { label: 'Acceptance Rate', value: `${acceptanceRate}%`, color: 'text-indigo-600' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex gap-2 flex-wrap">
          {['All', ...STATUSES].map(s => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${filterStatus === s ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {s}{s !== 'All' ? ` (${counts[s] ?? 0})` : ''}
            </button>
          ))}
        </div>
        <div className="relative ml-auto">
          <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search quotes..."
            className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 w-56" />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {['Customer', 'Service', 'Date', 'Expiration', 'Amount', 'Status', 'Created By', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="px-4 py-12 text-center text-gray-400">No quotes found.</td></tr>
              ) : (
                filtered.map(quote => (
                  <tr key={quote.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{customerName(quote.customerId)}</td>
                    <td className="px-4 py-3 text-gray-600 max-w-[140px] truncate">{quote.serviceDescription}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{quote.quoteDate}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                      {quote.expirationDate ? (
                        <span className={quote.expirationDate < today ? 'text-red-600' : ''}>{quote.expirationDate}</span>
                      ) : '—'}
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-900">${quote.amount.toLocaleString()}</td>
                    <td className="px-4 py-3"><Badge variant={quoteStatusVariant(quote.status)}>{quote.status}</Badge></td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{quote.createdBy}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => setEditQuote(quote)}
                          className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                          <Edit2 size={14} />
                        </button>
                        {quote.status === 'Accepted' && !quote.jobId && (
                          <button onClick={() => setConvertQuote(quote)}
                            className="flex items-center gap-1 px-2 py-1 text-xs text-green-700 bg-green-50 hover:bg-green-100 rounded-lg transition-colors font-medium">
                            <ArrowRight size={12} /> To Job
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Create Quote" size="lg">
        <QuoteForm initial={emptyQuote} customers={state.customers} onSave={handleAdd} onCancel={() => setShowAdd(false)} />
      </Modal>
      <Modal isOpen={!!editQuote} onClose={() => setEditQuote(null)} title="Edit Quote" size="lg">
        {editQuote && <QuoteForm initial={editQuote} customers={state.customers} onSave={handleEdit} onCancel={() => setEditQuote(null)} />}
      </Modal>
      <Modal isOpen={!!convertQuote} onClose={() => setConvertQuote(null)} title="Convert Quote to Job" size="sm">
        {convertQuote && (
          <div className="space-y-4">
            <p className="text-gray-700">
              Create a new <strong>Scheduled</strong> job from this accepted quote for <strong>${convertQuote.amount.toLocaleString()}</strong>?
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setConvertQuote(null)} className="px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg">Cancel</button>
              <button onClick={() => handleConvertToJob(convertQuote)} className="px-4 py-2 text-sm text-white bg-green-600 hover:bg-green-700 rounded-lg">Create Job</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
