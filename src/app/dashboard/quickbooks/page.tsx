'use client';

import React, { useState } from 'react';
import { RefreshCw, Link2, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useStore } from '@/lib/store';
import { connectToQuickBooks, syncFromQuickBooks } from '@/lib/quickbooksMockService';

export default function QuickBooksPage() {
  const { state, dispatch } = useStore();
  const [connecting, setConnecting] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncLog, setSyncLog] = useState<string[]>([]);

  const qb = state.quickBooksSync;

  async function handleConnect() {
    setConnecting(true);
    setSyncLog([]);
    try {
      const result = await connectToQuickBooks();
      dispatch({
        type: 'UPDATE_QB_SYNC',
        payload: {
          ...qb,
          connected: result.success,
          companyName: result.companyName ?? qb.companyName,
          lastSyncDate: '',
          status: result.success ? 'idle' : 'error',
          errors: result.success ? [] : ['Connection failed — check your QuickBooks credentials.'],
        },
      });
      setSyncLog([result.success ? '✅ Connected to QuickBooks successfully (simulated).' : '❌ Connection failed.']);
    } finally {
      setConnecting(false);
    }
  }

  async function handleSync() {
    if (!qb.connected) return;
    setSyncing(true);
    setSyncLog(['⏳ Fetching data from QuickBooks...']);
    dispatch({ type: 'UPDATE_QB_SYNC', payload: { ...qb, status: 'syncing' } });
    try {
      const result = await syncFromQuickBooks();
      const now = new Date().toISOString().split('T')[0];
      dispatch({
        type: 'SYNC_FROM_QB',
        payload: {
          customers: result.customers,
          invoices: result.invoices,
          payments: result.payments,
          syncDate: now,
        },
      });
      dispatch({
        type: 'UPDATE_QB_SYNC',
        payload: {
          ...qb,
          connected: true,
          status: 'success',
          lastSyncDate: now,
          customersCount: result.customers.length,
          invoicesCount: result.invoices.length,
          paymentsCount: result.payments.length,
          errors: [],
        },
      });
      setSyncLog([
        `✅ Sync complete — ${now}`,
        `📋 Customers fetched: ${result.customers.length}`,
        `🧾 Invoices fetched: ${result.invoices.length}`,
        `💰 Payments fetched: ${result.payments.length}`,
        '⚠️ This is simulated data only. No real QuickBooks connection is active.',
      ]);
    } catch {
      dispatch({ type: 'UPDATE_QB_SYNC', payload: { ...qb, status: 'error', errors: ['Sync failed — please try again.'] } });
      setSyncLog(['❌ Sync failed. Please try again.']);
    } finally {
      setSyncing(false);
    }
  }

  function handleDisconnect() {
    dispatch({
      type: 'UPDATE_QB_SYNC',
      payload: { ...qb, connected: false, status: 'idle', companyName: '', errors: [] },
    });
    setSyncLog(['🔌 Disconnected from QuickBooks (simulated).']);
  }

  return (
    <div className="p-6 space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">QuickBooks Sync</h1>
        <p className="text-sm text-gray-500 mt-0.5">Connect to QuickBooks Online to keep invoices and payments in sync</p>
      </div>

      {/* Demo disclaimer */}
      <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-800">
        <Info size={16} className="shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold mb-1">Demo / Simulated Integration</p>
          <p>This page demonstrates how QuickBooks Online integration would work. No real API connection is active.
            In production, this would use the <strong>Intuit OAuth 2.0</strong> flow via{' '}
            <code className="bg-blue-100 px-1 rounded">developer.intuit.com</code> with the{' '}
            <code className="bg-blue-100 px-1 rounded">intuit-oauth</code> Node.js library.
            See <code className="bg-blue-100 px-1 rounded">src/lib/quickbooksMockService.ts</code> for implementation notes.
          </p>
        </div>
      </div>

      {/* Status panel */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${qb.connected ? 'bg-green-100' : 'bg-gray-100'}`}>
              <Link2 size={20} className={qb.connected ? 'text-green-600' : 'text-gray-400'} />
            </div>
            <div>
              <p className="font-semibold text-gray-900">
                {qb.connected ? `Connected${qb.companyName ? ` — ${qb.companyName}` : ''}` : 'Not Connected'}
              </p>
              <p className="text-xs text-gray-500">
                {qb.connected ? `Last sync: ${qb.lastSyncDate || 'never'}` : 'Connect to begin syncing'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {qb.connected ? (
              <>
                <button onClick={handleSync} disabled={syncing}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors ${syncing ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
                  <RefreshCw size={15} className={syncing ? 'animate-spin' : ''} />
                  {syncing ? 'Syncing...' : 'Sync Now'}
                </button>
                <button onClick={handleDisconnect}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors">
                  Disconnect
                </button>
              </>
            ) : (
              <button onClick={handleConnect} disabled={connecting}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold text-white transition-colors ${connecting ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}>
                <Link2 size={15} />
                {connecting ? 'Connecting...' : 'Connect to QuickBooks'}
              </button>
            )}
          </div>
        </div>

        {/* Sync stats */}
        {qb.connected && (
          <div className="grid grid-cols-3 gap-4 pt-2 border-t border-gray-50">
            {[
              { label: 'Customers synced', value: qb.customersCount },
              { label: 'Invoices synced', value: qb.invoicesCount },
              { label: 'Payments synced', value: qb.paymentsCount },
            ].map(s => (
              <div key={s.label} className="text-center">
                <p className="text-2xl font-bold text-indigo-600">{s.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Errors */}
        {(qb.errors ?? []).length > 0 && (
          <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <ul className="space-y-1">{(qb.errors ?? []).map((e, i) => <li key={i}>{e}</li>)}</ul>
          </div>
        )}

        {/* Status indicator */}
        {qb.status === 'success' && (
          <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
            <CheckCircle size={15} /> Last sync completed successfully on {qb.lastSyncDate}.
          </div>
        )}
      </div>

      {/* Sync log */}
      {syncLog.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-3">Sync Log</h2>
          <div className="font-mono text-xs space-y-1.5 bg-gray-50 rounded-lg p-4 border border-gray-100">
            {syncLog.map((line, i) => <p key={i} className="text-gray-700">{line}</p>)}
          </div>
        </div>
      )}

      {/* How it works */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
        <h2 className="font-semibold text-gray-900 mb-3">How Real Integration Works</h2>
        <ol className="space-y-3 text-sm text-gray-600 list-none">
          {[
            ['Register app at developer.intuit.com', 'Get Client ID + Client Secret from the Intuit Developer Console.'],
            ['OAuth 2.0 Authorization', 'Redirect user to Intuit\'s auth URL. User approves access. Receive authorization code.'],
            ['Token Exchange', 'Exchange auth code for access_token + refresh_token using the intuit-oauth library.'],
            ['API Calls', 'Use access_token in Bearer header to call QuickBooks API: /v3/company/{realmId}/query, /invoice, /customer, etc.'],
            ['Token Refresh', 'Refresh the access_token using refresh_token before it expires (1 hour).'],
            ['Webhook Sync', 'Register webhooks at developer.intuit.com to receive real-time change notifications.'],
          ].map(([title, desc], i) => (
            <li key={i} className="flex gap-3">
              <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                {i + 1}
              </span>
              <div>
                <p className="font-medium text-gray-800">{title}</p>
                <p className="text-gray-500">{desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
