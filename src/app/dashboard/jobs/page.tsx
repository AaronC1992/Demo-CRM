'use client';

import React, { useState } from 'react';
import { Plus, Edit2, Search } from 'lucide-react';
import { useStore } from '@/lib/store';
import type { Job, JobStatus, Customer } from '@/lib/types';
import Badge, { jobStatusVariant } from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';

const STATUSES: JobStatus[] = ['Scheduled', 'In Progress', 'Completed', 'Canceled'];
const SERVICES = ['AC Installation', 'AC Repair', 'Furnace Installation', 'Furnace Repair', 'HVAC Tune-Up', 'Water Heater Install', 'Plumbing Repair', 'Drain Cleaning', 'Electrical Panel Upgrade', 'Generator Install', 'Other'];
const TEAM = ['Mike Rodriguez', 'Tom Baker', 'Dave Williams', 'Sarah Chen'];

function JobForm({ initial, customers, onSave, onCancel }: {
  initial: Omit<Job, 'id'>; customers: Customer[]; onSave: (d: Omit<Job, 'id'>) => void; onCancel: () => void;
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Service Type</label>
          <select value={form.serviceType} onChange={e => set('serviceType', e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300">
            <option value="">Select...</option>
            {SERVICES.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Scheduled Date</label>
          <input type="date" value={form.scheduledDate} onChange={e => set('scheduledDate', e.target.value)}
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Value ($)</label>
          <input type="number" value={form.value} onChange={e => set('value', Number(e.target.value))}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
          <select value={form.assignedTo} onChange={e => set('assignedTo', e.target.value)}
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
        <button type="submit" className="px-4 py-2 text-sm text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg">Save Job</button>
      </div>
    </form>
  );
}

const emptyJob: Omit<Job, 'id'> = {
  customerId: '', serviceType: '', scheduledDate: '', completedDate: '',
  status: 'Scheduled', value: 0, paidStatus: 'Unpaid', assignedTo: 'Mike Rodriguez', notes: '', quoteId: '',
};

export default function JobsPage() {
  const { state, dispatch, newId } = useStore();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [showAdd, setShowAdd] = useState(false);
  const [editJob, setEditJob] = useState<Job | null>(null);

  const customerName = (id: string) => state.customers.find(c => c.id === id)?.name ?? id;

  const filtered = state.jobs.filter(j => {
    const name = customerName(j.customerId).toLowerCase();
    const q = search.toLowerCase();
    const matchSearch = name.includes(q) || j.serviceType.toLowerCase().includes(q) || j.assignedTo.toLowerCase().includes(q);
    const matchStatus = filterStatus === 'All' || j.status === filterStatus;
    return matchSearch && matchStatus;
  });

  function handleAdd(data: Omit<Job, 'id'>) {
    dispatch({ type: 'ADD_JOB', payload: { ...data, id: newId('job') } });
    setShowAdd(false);
  }

  function handleEdit(data: Omit<Job, 'id'>) {
    if (!editJob) return;
    dispatch({ type: 'UPDATE_JOB', payload: { ...data, id: editJob.id } });
    setEditJob(null);
  }

  const counts = STATUSES.reduce((acc, s) => ({ ...acc, [s]: state.jobs.filter(j => j.status === s).length }), {} as Record<string, number>);
  const totalValue = state.jobs.filter(j => j.status === 'Completed').reduce((s, j) => s + j.value, 0);

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Jobs</h1>
          <p className="text-sm text-gray-500 mt-0.5">{state.jobs.length} total jobs</p>
        </div>
        <button onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg">
          <Plus size={16} /> Add Job
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Scheduled', value: counts['Scheduled'] ?? 0, color: 'text-blue-600' },
          { label: 'In Progress', value: counts['In Progress'] ?? 0, color: 'text-orange-600' },
          { label: 'Completed', value: counts['Completed'] ?? 0, color: 'text-green-600' },
          { label: 'Revenue (done)', value: '$' + totalValue.toLocaleString(), color: 'text-indigo-600' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex gap-2">
          {['All', ...STATUSES].map(s => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${filterStatus === s ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {s}{s !== 'All' ? ` (${counts[s] ?? 0})` : ''}
            </button>
          ))}
        </div>
        <div className="relative ml-auto">
          <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search jobs..."
            className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 w-56" />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {['Customer', 'Service', 'Scheduled', 'Status', 'Value', 'Assigned To', 'Notes', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="px-4 py-12 text-center text-gray-400">No jobs found.</td></tr>
              ) : (
                filtered.map(job => (
                  <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{customerName(job.customerId)}</td>
                    <td className="px-4 py-3 text-gray-600 max-w-[140px] truncate">{job.serviceType}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{job.scheduledDate || '—'}</td>
                    <td className="px-4 py-3"><Badge variant={jobStatusVariant(job.status)}>{job.status}</Badge></td>
                    <td className="px-4 py-3 font-medium text-gray-900">${job.value.toLocaleString()}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{job.assignedTo}</td>
                    <td className="px-4 py-3 text-gray-400 max-w-[140px] truncate">{job.notes || '—'}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => setEditJob(job)}
                          className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                          <Edit2 size={14} />
                        </button>
                        {STATUSES.filter(s => s !== job.status).slice(0, 1).map(nextStatus => (
                          <button key={nextStatus}
                            onClick={() => dispatch({ type: 'UPDATE_JOB', payload: { ...job, status: nextStatus } })}
                            className="px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded-lg transition-colors whitespace-nowrap">
                            → {nextStatus}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Add Job" size="lg">
        <JobForm initial={emptyJob} customers={state.customers} onSave={handleAdd} onCancel={() => setShowAdd(false)} />
      </Modal>
      <Modal isOpen={!!editJob} onClose={() => setEditJob(null)} title="Edit Job" size="lg">
        {editJob && <JobForm initial={editJob} customers={state.customers} onSave={handleEdit} onCancel={() => setEditJob(null)} />}
      </Modal>
    </div>
  );
}
