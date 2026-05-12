'use client';

import React, { useState } from 'react';
import { Plus, Edit2, CheckCircle, Search } from 'lucide-react';
import { useStore } from '@/lib/store';
import type { FollowUpTask, FollowUpStatus, FollowUpPriority } from '@/lib/types';
import Badge, { followUpStatusVariant, followUpPriorityVariant } from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';

const STATUSES: FollowUpStatus[] = ['Pending', 'Completed', 'Skipped'];
const PRIORITIES: FollowUpPriority[] = ['High', 'Medium', 'Low'];
const TEAM = ['Mike Rodriguez', 'Tom Baker', 'Dave Williams', 'Sarah Chen'];
const REASONS = ['Follow up on quote', 'Schedule service', 'Check on satisfaction', 'Offer maintenance plan', 'Collect payment', 'Discuss renewal', 'Other'];

function FollowUpForm({ initial, contacts, onSave, onCancel }: {
  initial: Omit<FollowUpTask, 'id'>; contacts: { id: string; name: string }[];
  onSave: (d: Omit<FollowUpTask, 'id'>) => void; onCancel: () => void;
}) {
  const [form, setForm] = useState(initial);
  function set(k: string, v: string) { setForm(p => ({ ...p, [k]: v })); }
  return (
    <form onSubmit={e => { e.preventDefault(); onSave(form); }} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Contact *</label>
          <select required value={form.contactId} onChange={e => set('contactId', e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300">
            <option value="">Select...</option>
            {contacts.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
          <select value={form.reason} onChange={e => set('reason', e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300">
            {REASONS.map(r => <option key={r}>{r}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
          <input type="date" value={form.dueDate} onChange={e => set('dueDate', e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
          <select value={form.priority} onChange={e => set('priority', e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300">
            {PRIORITIES.map(p => <option key={p}>{p}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select value={form.status} onChange={e => set('status', e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300">
            {STATUSES.map(s => <option key={s}>{s}</option>)}
          </select>
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
        <button type="submit" className="px-4 py-2 text-sm text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg">Save</button>
      </div>
    </form>
  );
}

const today = new Date().toISOString().split('T')[0];
const emptyFollowUp: Omit<FollowUpTask, 'id'> = {
  contactId: '', contactName: '', reason: 'Follow up on quote', dueDate: today,
  priority: 'Medium', status: 'Pending', assignedTo: 'Mike Rodriguez', notes: '', completedDate: '',
};

export default function FollowUpsPage() {
  const { state, dispatch, newId } = useStore();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('Pending');
  const [showAdd, setShowAdd] = useState(false);
  const [editTask, setEditTask] = useState<FollowUpTask | null>(null);

  const contacts = [
    ...state.customers.map(c => ({ id: c.id, name: c.name })),
    ...state.leads.map(l => ({ id: l.id, name: l.name + ' (Lead)' })),
  ];

  const filtered = state.followUps.filter(f => {
    const q = search.toLowerCase();
    const matchSearch = f.contactName.toLowerCase().includes(q) || f.reason.toLowerCase().includes(q);
    const matchStatus = filterStatus === 'All' || f.status === filterStatus;
    return matchSearch && matchStatus;
  }).sort((a, b) => {
    // Overdue first, then by date
    if (a.status === 'Pending' && b.status === 'Pending') return a.dueDate.localeCompare(b.dueDate);
    return 0;
  });

  function handleAdd(data: Omit<FollowUpTask, 'id'>) {
    const contact = contacts.find(c => c.id === data.contactId);
    dispatch({ type: 'ADD_FOLLOWUP', payload: { ...data, id: newId('fu'), contactName: contact?.name ?? '' } });
    setShowAdd(false);
  }

  function handleEdit(data: Omit<FollowUpTask, 'id'>) {
    if (!editTask) return;
    dispatch({ type: 'UPDATE_FOLLOWUP', payload: { ...data, id: editTask.id } });
    setEditTask(null);
  }

  function markComplete(task: FollowUpTask) {
    dispatch({ type: 'UPDATE_FOLLOWUP', payload: { ...task, status: 'Completed', completedDate: today } });
  }

  const pending = state.followUps.filter(f => f.status === 'Pending');
  const overdue = pending.filter(f => f.dueDate < today);
  const dueToday = pending.filter(f => f.dueDate === today);

  const counts = STATUSES.reduce((acc, s) => ({ ...acc, [s]: state.followUps.filter(f => f.status === s).length }), {} as Record<string, number>);

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Follow Ups</h1>
          <p className="text-sm text-gray-500 mt-0.5">{pending.length} pending tasks</p>
        </div>
        <button onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg">
          <Plus size={16} /> Add Follow Up
        </button>
      </div>

      {/* Overdue alert */}
      {overdue.length > 0 && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800 font-medium">
          ⚠️ {overdue.length} overdue follow-up{overdue.length > 1 ? 's' : ''} — action needed.
        </div>
      )}

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Overdue', value: overdue.length, color: overdue.length > 0 ? 'text-red-600' : 'text-gray-900' },
          { label: 'Due Today', value: dueToday.length, color: dueToday.length > 0 ? 'text-orange-600' : 'text-gray-900' },
          { label: 'Completed', value: counts['Completed'] ?? 0, color: 'text-green-600' },
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
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..."
            className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 w-56" />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {['Contact', 'Reason', 'Due Date', 'Priority', 'Status', 'Assigned To', 'Notes', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="px-4 py-12 text-center text-gray-400">No follow-ups found.</td></tr>
              ) : (
                filtered.map(task => {
                  const isOverdue = task.status === 'Pending' && task.dueDate < today;
                  return (
                    <tr key={task.id} className={`transition-colors ${isOverdue ? 'bg-red-50 hover:bg-red-100' : 'hover:bg-gray-50'}`}>
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">{task.contactName}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{task.reason}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={isOverdue ? 'text-red-600 font-semibold' : task.dueDate === today ? 'text-orange-600 font-medium' : 'text-gray-600'}>
                          {task.dueDate}
                        </span>
                        {isOverdue && <span className="ml-1 text-xs text-red-500">(overdue)</span>}
                      </td>
                      <td className="px-4 py-3"><Badge variant={followUpPriorityVariant(task.priority)}>{task.priority}</Badge></td>
                      <td className="px-4 py-3"><Badge variant={followUpStatusVariant(task.status)}>{task.status}</Badge></td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{task.assignedTo}</td>
                      <td className="px-4 py-3 text-gray-400 max-w-[160px] truncate">{task.notes || '—'}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => setEditTask(task)}
                            className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                            <Edit2 size={14} />
                          </button>
                          {task.status === 'Pending' && (
                            <button onClick={() => markComplete(task)}
                              className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Mark Complete">
                              <CheckCircle size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Add Follow Up" size="lg">
        <FollowUpForm initial={emptyFollowUp} contacts={contacts} onSave={handleAdd} onCancel={() => setShowAdd(false)} />
      </Modal>
      <Modal isOpen={!!editTask} onClose={() => setEditTask(null)} title="Edit Follow Up" size="lg">
        {editTask && <FollowUpForm initial={editTask} contacts={contacts} onSave={handleEdit} onCancel={() => setEditTask(null)} />}
      </Modal>
    </div>
  );
}
