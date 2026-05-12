'use client';

import React, { useState } from 'react';
import { Plus, Search, Edit2, UserCheck, ChevronDown } from 'lucide-react';
import { useStore } from '@/lib/store';
import type { Lead, LeadStatus, LeadSource, Customer } from '@/lib/types';
import Badge, { leadStatusVariant } from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';

const STATUSES: LeadStatus[] = ['New', 'Contacted', 'Quoted', 'Scheduled', 'Won', 'Lost'];
const SOURCES: LeadSource[] = ['Website', 'Google Ads', 'Facebook', 'Referral', 'Yard Sign', 'Door Hanger', 'Nextdoor', 'Yelp', 'Other'];
const SERVICES = ['AC Installation', 'AC Repair', 'Furnace Installation', 'Furnace Repair', 'HVAC Tune-Up', 'Water Heater Install', 'Plumbing Repair', 'Drain Cleaning', 'Electrical Panel Upgrade', 'Generator Install', 'Other'];
const TEAM = ['Mike Rodriguez', 'Tom Baker', 'Dave Williams', 'Sarah Chen'];

const emptyLead: Omit<Lead, 'id'> = {
  name: '', phone: '', email: '', address: '', source: 'Website',
  serviceRequested: '', estimatedValue: 0, status: 'New', assignedTo: 'Mike Rodriguez',
  createdDate: new Date().toISOString().split('T')[0], followUpDate: '', notes: '',
};

function LeadForm({ initial, onSave, onCancel }: {
  initial: Omit<Lead, 'id'>; onSave: (data: Omit<Lead, 'id'>) => void; onCancel: () => void;
}) {
  const [form, setForm] = useState(initial);
  function set(k: string, v: string | number) { setForm(p => ({ ...p, [k]: v })); }
  return (
    <form onSubmit={e => { e.preventDefault(); onSave(form); }} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
          <input required value={form.name} onChange={e => set('name', e.target.value)} placeholder="Jane Smith"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="(555) 000-0000"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="email@example.com"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
          <select value={form.source} onChange={e => set('source', e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300">
            {SOURCES.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
          <input value={form.address} onChange={e => set('address', e.target.value)} placeholder="123 Main St, Springfield, IL"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Service Requested</label>
          <select value={form.serviceRequested} onChange={e => set('serviceRequested', e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300">
            <option value="">Select...</option>
            {SERVICES.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Value ($)</label>
          <input type="number" value={form.estimatedValue} onChange={e => set('estimatedValue', Number(e.target.value))} placeholder="0"
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
          <select value={form.assignedTo} onChange={e => set('assignedTo', e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300">
            {TEAM.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Follow-Up Date</label>
          <input type="date" value={form.followUpDate} onChange={e => set('followUpDate', e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
        <textarea rows={3} value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Any notes about this lead..."
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none" />
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
          Cancel
        </button>
        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors">
          Save Lead
        </button>
      </div>
    </form>
  );
}

export default function LeadsPage() {
  const { state, dispatch, newId } = useStore();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [showAdd, setShowAdd] = useState(false);
  const [editLead, setEditLead] = useState<Lead | null>(null);
  const [convertLead, setConvertLead] = useState<Lead | null>(null);

  const filtered = state.leads.filter(l => {
    const q = search.toLowerCase();
    const matchSearch = l.name.toLowerCase().includes(q) || l.email.toLowerCase().includes(q) || l.phone.includes(q) || l.serviceRequested.toLowerCase().includes(q);
    const matchStatus = filterStatus === 'All' || l.status === filterStatus;
    return matchSearch && matchStatus;
  });

  function handleAdd(data: Omit<Lead, 'id'>) {
    dispatch({ type: 'ADD_LEAD', payload: { ...data, id: newId('lead') } });
    setShowAdd(false);
  }

  function handleEdit(data: Omit<Lead, 'id'>) {
    if (!editLead) return;
    dispatch({ type: 'UPDATE_LEAD', payload: { ...data, id: editLead.id } });
    setEditLead(null);
  }

  function handleConvert(lead: Lead) {
    const customer: Customer = {
      id: newId('cust'),
      name: lead.name, phone: lead.phone, email: lead.email, address: lead.address,
      source: lead.source, totalSpent: 0, lastJobDate: '', openBalance: 0,
      status: 'Active', notes: lead.notes, createdDate: new Date().toISOString().split('T')[0],
      leadId: lead.id,
    };
    dispatch({ type: 'CONVERT_LEAD_TO_CUSTOMER', payload: { leadId: lead.id, customer } });
    setConvertLead(null);
  }

  const counts = STATUSES.reduce((acc, s) => {
    acc[s] = state.leads.filter(l => l.status === s).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
          <p className="text-sm text-gray-500 mt-0.5">{state.leads.length} total leads</p>
        </div>
        <button onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
          <Plus size={16} /> Add Lead
        </button>
      </div>

      {/* Status filter pills */}
      <div className="flex flex-wrap gap-2">
        {['All', ...STATUSES].map(s => (
          <button key={s} onClick={() => setFilterStatus(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              filterStatus === s ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}>
            {s}{s !== 'All' && ` (${counts[s] ?? 0})`}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search leads..."
          className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {['Name', 'Phone / Email', 'Source', 'Service', 'Est. Value', 'Status', 'Assigned To', 'Follow Up', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr><td colSpan={9} className="px-4 py-12 text-center text-gray-400">No leads found.</td></tr>
              ) : (
                filtered.map(lead => (
                  <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0">
                          {lead.name.charAt(0)}
                        </div>
                        <span className="font-medium text-gray-900">{lead.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-gray-700">{lead.phone}</p>
                      <p className="text-gray-400 text-xs">{lead.email}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{lead.source}</td>
                    <td className="px-4 py-3 text-gray-600 max-w-[140px] truncate">{lead.serviceRequested}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {lead.estimatedValue > 0 ? `$${lead.estimatedValue.toLocaleString()}` : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={leadStatusVariant(lead.status)}>{lead.status}</Badge>
                    </td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{lead.assignedTo}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                      {lead.followUpDate || '—'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => setEditLead(lead)}
                          className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Edit">
                          <Edit2 size={14} />
                        </button>
                        {lead.status !== 'Won' && (
                          <button onClick={() => setConvertLead(lead)}
                            className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Convert to Customer">
                            <UserCheck size={14} />
                          </button>
                        )}
                        <div className="relative group">
                          <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                            <ChevronDown size={14} />
                          </button>
                          <div className="absolute right-0 top-full mt-1 bg-white border border-gray-100 rounded-lg shadow-lg z-10 hidden group-hover:block min-w-[130px]">
                            {STATUSES.filter(s => s !== lead.status).map(s => (
                              <button key={s} onClick={() => dispatch({ type: 'UPDATE_LEAD', payload: { ...lead, status: s } })}
                                className="block w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg">
                                Mark as {s}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Add New Lead" size="lg">
        <LeadForm initial={emptyLead} onSave={handleAdd} onCancel={() => setShowAdd(false)} />
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={!!editLead} onClose={() => setEditLead(null)} title="Edit Lead" size="lg">
        {editLead && (
          <LeadForm initial={editLead} onSave={handleEdit} onCancel={() => setEditLead(null)} />
        )}
      </Modal>

      {/* Convert Modal */}
      <Modal isOpen={!!convertLead} onClose={() => setConvertLead(null)} title="Convert Lead to Customer" size="sm">
        {convertLead && (
          <div className="space-y-4">
            <p className="text-gray-700">
              Convert <span className="font-semibold">{convertLead.name}</span> to a customer?
              This will create a new customer record and mark this lead as <strong>Won</strong>.
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setConvertLead(null)} className="px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg">Cancel</button>
              <button onClick={() => handleConvert(convertLead)} className="px-4 py-2 text-sm text-white bg-green-600 hover:bg-green-700 rounded-lg">Convert</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
