'use client';

import React, { useState, useEffect } from 'react';
import { Save, CheckCircle } from 'lucide-react';
import { useStore } from '@/lib/store';
import type { BusinessSettings } from '@/lib/types';

export default function SettingsPage() {
  const { state, dispatch } = useStore();
  const [form, setForm] = useState<BusinessSettings>(state.settings);
  const [saved, setSaved] = useState(false);

  useEffect(() => { setForm(state.settings); }, [state.settings]);

  function set(k: keyof BusinessSettings, v: string) {
    setForm(p => ({ ...p, [k]: v }));
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    dispatch({ type: 'UPDATE_SETTINGS', payload: form });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  const LEAD_SOURCES = form.leadSources.join('\n');
  const TEAM_MEMBERS = form.teamMembers.join('\n');
  const SERVICE_CATS = form.serviceCategories.join('\n');

  return (
    <div className="p-6 space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-0.5">Business profile and CRM configuration</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Business Info */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm space-y-4">
          <h2 className="font-semibold text-gray-900 border-b border-gray-50 pb-2">Business Information</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
              <input value={form.businessName} onChange={e => set('businessName', e.target.value)}
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
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input value={form.address} onChange={e => set('address', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
              <input value={form.website} onChange={e => set('website', e.target.value)} placeholder="https://..."
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">License Number</label>
              <input value={form.licenseNumber} onChange={e => set('licenseNumber', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
            </div>
          </div>

          {/* Logo placeholder */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Business Logo</label>
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center text-gray-400 text-sm bg-gray-50">
              <p className="font-medium">Upload logo (demo placeholder)</p>
              <p className="text-xs mt-1">In production: connect to file upload service (S3, Cloudinary, etc.)</p>
              <button type="button" className="mt-3 px-4 py-1.5 text-xs text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50">
                Choose File
              </button>
            </div>
          </div>
        </div>

        {/* Team Members */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm space-y-3">
          <h2 className="font-semibold text-gray-900 border-b border-gray-50 pb-2">Team Members</h2>
          <p className="text-xs text-gray-500">One name per line. Used in job/lead assignment dropdowns.</p>
          <textarea
            rows={5}
            value={TEAM_MEMBERS}
            onChange={e => setForm(p => ({ ...p, teamMembers: e.target.value.split('\n').filter(Boolean) }))}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 font-mono"
          />
          <p className="text-xs text-gray-400">Current team: {form.teamMembers.length} members</p>
        </div>

        {/* Lead Sources */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm space-y-3">
          <h2 className="font-semibold text-gray-900 border-b border-gray-50 pb-2">Lead Sources</h2>
          <p className="text-xs text-gray-500">One per line. Appears in lead source dropdowns.</p>
          <textarea
            rows={5}
            value={LEAD_SOURCES}
            onChange={e => setForm(p => ({ ...p, leadSources: e.target.value.split('\n').filter(Boolean) as import('@/lib/types').LeadSource[] }))}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 font-mono"
          />
        </div>

        {/* Service Categories */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm space-y-3">
          <h2 className="font-semibold text-gray-900 border-b border-gray-50 pb-2">Service Categories</h2>
          <p className="text-xs text-gray-500">One per line. Appears in service type dropdowns.</p>
          <textarea
            rows={6}
            value={SERVICE_CATS}
            onChange={e => setForm(p => ({ ...p, serviceCategories: e.target.value.split('\n').filter(Boolean) }))}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 font-mono"
          />
        </div>

        {/* Save */}
        <div className="flex items-center justify-between">
          {saved ? (
            <div className="flex items-center gap-2 text-green-700 text-sm font-medium">
              <CheckCircle size={16} /> Settings saved successfully!
            </div>
          ) : <div />}
          <button type="submit"
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors">
            <Save size={16} /> Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}
