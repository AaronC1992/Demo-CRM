'use client';

import React, { useState } from 'react';
import { Plus, Edit2, Search, AlertCircle } from 'lucide-react';
import { useStore } from '@/lib/store';
import type { Invoice, InvoiceStatus, Customer } from '@/lib/types';
import Badge, { invoiceStatusVariant } from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';

const STATUSES: InvoiceStatus[] = ['Unpaid', 'Partially Paid', 'Paid', 'Overdue'];

function InvoiceForm({ initial, customers, onSave, onCancel }: {
  initial: Omit<Invoice, 'id'>; customers: Customer[]; onSave: (d: Omit<Invoice, 'id'>) => void; onCancel: () => void;
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Invoice #</label>
          <input value={form.invoiceNumber} onChange={e => set('invoiceNumber', e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Date</label>
          <input type="date" value={form.invoiceDate} onChange={e => set('invoiceDate', e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
          <input type="date" value={form.dueDate} onChange={e => set('dueDate', e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Amount ($)</label>
          <input type="number" value={form.amount} onChange={e => set('amount', Number(e.target.value))}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Amount Paid ($)</label>
          <input type="number" value={form.paidAmount} onChange={e => set('paidAmount', Number(e.target.value))}
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
          <select value={form.source} onChange={e => set('source', e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300">
            <option>CRM</option>
            <option>QuickBooks</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
        <textarea rows={2} value={form.notes} onChange={e => set('notes', e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none" />
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg">Cancel</button>
        <button type="submit" className="px-4 py-2 text-sm text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg">Save Invoice</button>
      </div>
    </form>
  );
}

const today = new Date().toISOString().split('T')[0];
const emptyInvoice: Omit<Invoice, 'id'> = {
  customerId: '', jobId: '', invoiceNumber: 'INV-', invoiceDate: today, dueDate: '',
  amount: 0, paidAmount: 0, status: 'Unpaid', source: 'CRM', notes: '',
};

export default function InvoicesPage() {
  const { state, dispatch, newId } = useStore();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [showAdd, setShowAdd] = useState(false);
  const [editInvoice, setEditInvoice] = useState<Invoice | null>(null);

  const customerName = (id: string) => state.customers.find(c => c.id === id)?.name ?? id;

  const filtered = state.invoices.filter(inv => {
    const name = customerName(inv.customerId).toLowerCase();
    const q = search.toLowerCase();
    const matchSearch = name.includes(q) || inv.invoiceNumber.toLowerCase().includes(q);
    const matchStatus = filterStatus === 'All' || inv.status === filterStatus;
    return matchSearch && matchStatus;
  });

  function handleAdd(data: Omit<Invoice, 'id'>) {
    dispatch({ type: 'ADD_INVOICE', payload: { ...data, id: newId('inv') } });
    setShowAdd(false);
  }

  function handleEdit(data: Omit<Invoice, 'id'>) {
    if (!editInvoice) return;
    dispatch({ type: 'UPDATE_INVOICE', payload: { ...data, id: editInvoice.id } });
    setEditInvoice(null);
  }

  const unpaid = state.invoices.filter(i => i.status === 'Unpaid' || i.status === 'Overdue');
  const unpaidTotal = unpaid.reduce((s, i) => s + (i.amount - i.paidAmount), 0);
  const paidTotal = state.invoices.filter(i => i.status === 'Paid').reduce((s, i) => s + i.amount, 0);
  const overdueCount = state.invoices.filter(i => i.status === 'Overdue').length;

  const counts = STATUSES.reduce((acc, s) => ({ ...acc, [s]: state.invoices.filter(i => i.status === s).length }), {} as Record<string, number>);

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
          <p className="text-sm text-gray-500 mt-0.5">{state.invoices.length} total invoices</p>
        </div>
        <button onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg">
          <Plus size={16} /> Add Invoice
        </button>
      </div>

      {/* Disclaimer */}
      <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
        <AlertCircle size={16} className="shrink-0 mt-0.5" />
        <span>This is for <strong>tracking only</strong> — not payment processing. No money moves through this system. To process payments, connect to QuickBooks or your payment provider.</span>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Unpaid', value: '$' + unpaidTotal.toLocaleString(), color: 'text-red-600' },
          { label: 'Total Collected', value: '$' + paidTotal.toLocaleString(), color: 'text-green-600' },
          { label: 'Overdue Invoices', value: overdueCount, color: overdueCount > 0 ? 'text-red-600' : 'text-gray-900' },
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
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search invoices..."
            className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 w-56" />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {['Invoice #', 'Customer', 'Invoice Date', 'Due Date', 'Amount', 'Paid', 'Balance', 'Status', 'Source', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr><td colSpan={10} className="px-4 py-12 text-center text-gray-400">No invoices found.</td></tr>
              ) : (
                filtered.map(inv => {
                  const balance = inv.amount - inv.paidAmount;
                  const isOverdue = inv.dueDate && inv.dueDate < today && inv.status !== 'Paid';
                  return (
                    <tr key={inv.id} className={`transition-colors ${isOverdue ? 'bg-red-50 hover:bg-red-100' : 'hover:bg-gray-50'}`}>
                      <td className="px-4 py-3 font-mono text-xs text-gray-700">{inv.invoiceNumber}</td>
                      <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{customerName(inv.customerId)}</td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{inv.invoiceDate}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={isOverdue ? 'text-red-600 font-medium' : 'text-gray-600'}>{inv.dueDate || '—'}</span>
                      </td>
                      <td className="px-4 py-3 font-semibold text-gray-900">${inv.amount.toLocaleString()}</td>
                      <td className="px-4 py-3 text-green-600">${inv.paidAmount.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <span className={balance > 0 ? 'text-red-600 font-semibold' : 'text-gray-400'}>${balance.toLocaleString()}</span>
                      </td>
                      <td className="px-4 py-3"><Badge variant={invoiceStatusVariant(inv.status)}>{inv.status}</Badge></td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${inv.source === 'QuickBooks' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                          {inv.source}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => setEditInvoice(inv)}
                          className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                          <Edit2 size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Create Invoice" size="lg">
        <InvoiceForm initial={emptyInvoice} customers={state.customers} onSave={handleAdd} onCancel={() => setShowAdd(false)} />
      </Modal>
      <Modal isOpen={!!editInvoice} onClose={() => setEditInvoice(null)} title="Edit Invoice" size="lg">
        {editInvoice && <InvoiceForm initial={editInvoice} customers={state.customers} onSave={handleEdit} onCancel={() => setEditInvoice(null)} />}
      </Modal>
    </div>
  );
}
