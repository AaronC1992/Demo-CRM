'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { AppState, AppAction, Lead, Customer, Job, Quote, Invoice, Payment, FollowUpTask } from './types';
import { initialAppState } from './mockData';

// ─── Reducer ───────────────────────────────────────────────────────────────────

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'LOAD_FROM_STORAGE':
      return action.payload;

    // Leads
    case 'ADD_LEAD':
      return { ...state, leads: [action.payload, ...state.leads] };
    case 'UPDATE_LEAD':
      return { ...state, leads: state.leads.map(l => l.id === action.payload.id ? action.payload : l) };
    case 'DELETE_LEAD':
      return { ...state, leads: state.leads.filter(l => l.id !== action.payload) };
    case 'CONVERT_LEAD_TO_CUSTOMER':
      return {
        ...state,
        leads: state.leads.map(l => l.id === action.payload.leadId ? { ...l, status: 'Won' } : l),
        customers: [action.payload.customer, ...state.customers],
      };

    // Customers
    case 'ADD_CUSTOMER':
      return { ...state, customers: [action.payload, ...state.customers] };
    case 'UPDATE_CUSTOMER':
      return { ...state, customers: state.customers.map(c => c.id === action.payload.id ? action.payload : c) };

    // Jobs
    case 'ADD_JOB':
      return { ...state, jobs: [action.payload, ...state.jobs] };
    case 'UPDATE_JOB':
      return { ...state, jobs: state.jobs.map(j => j.id === action.payload.id ? action.payload : j) };

    // Quotes
    case 'ADD_QUOTE':
      return { ...state, quotes: [action.payload, ...state.quotes] };
    case 'UPDATE_QUOTE':
      return { ...state, quotes: state.quotes.map(q => q.id === action.payload.id ? action.payload : q) };
    case 'CONVERT_QUOTE_TO_JOB':
      return {
        ...state,
        quotes: state.quotes.map(q => q.id === action.payload.quoteId ? { ...q, status: 'Accepted' } : q),
        jobs: [action.payload.job, ...state.jobs],
      };

    // Invoices
    case 'ADD_INVOICE':
      return { ...state, invoices: [action.payload, ...state.invoices] };
    case 'UPDATE_INVOICE':
      return { ...state, invoices: state.invoices.map(i => i.id === action.payload.id ? action.payload : i) };

    // Payments
    case 'ADD_PAYMENT':
      return { ...state, payments: [action.payload, ...state.payments] };

    // Follow Ups
    case 'ADD_FOLLOWUP':
      return { ...state, followUps: [action.payload, ...state.followUps] };
    case 'UPDATE_FOLLOWUP':
      return { ...state, followUps: state.followUps.map(f => f.id === action.payload.id ? action.payload : f) };

    // QB Sync
    case 'UPDATE_QB_SYNC':
      return { ...state, quickBooksSync: { ...state.quickBooksSync, ...action.payload } };

    case 'SYNC_FROM_QB': {
      // Merge QB customers into CRM customers (QB is source of truth for financial fields)
      const updatedCustomers = state.customers.map(crmCustomer => {
        const qbCustomer = action.payload.customers.find(c => c.id === crmCustomer.id || c.qbCustomerId === crmCustomer.qbCustomerId);
        if (qbCustomer) {
          return {
            ...crmCustomer,
            totalSpent: qbCustomer.totalSpent,
            openBalance: qbCustomer.openBalance,
            lastJobDate: qbCustomer.lastJobDate,
            qbCustomerId: qbCustomer.qbCustomerId,
          };
        }
        return crmCustomer;
      });
      // Merge QB invoices (add new ones, update existing)
      const existingInvoiceIds = new Set(state.invoices.map(i => i.qbInvoiceId).filter(Boolean));
      const newQBInvoices = action.payload.invoices.filter(i => i.qbInvoiceId && !existingInvoiceIds.has(i.qbInvoiceId));
      const updatedInvoices = state.invoices.map(inv => {
        const qbInv = action.payload.invoices.find(i => i.qbInvoiceId === inv.qbInvoiceId);
        return qbInv ? { ...inv, ...qbInv } : inv;
      });
      // Merge QB payments
      const existingPaymentIds = new Set(state.payments.map(p => p.qbPaymentId).filter(Boolean));
      const newQBPayments = action.payload.payments.filter(p => p.qbPaymentId && !existingPaymentIds.has(p.qbPaymentId));
      return {
        ...state,
        customers: updatedCustomers,
        invoices: [...updatedInvoices, ...newQBInvoices],
        payments: [...state.payments, ...newQBPayments],
        quickBooksSync: action.payload.syncDate
          ? { ...state.quickBooksSync, lastSyncDate: action.payload.syncDate }
          : state.quickBooksSync,
      };
    }

    // Settings
    case 'UPDATE_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.payload } };

    default:
      return state;
  }
}

// ─── Context ───────────────────────────────────────────────────────────────────

interface StoreContextValue {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  // Helpers
  newId: (prefix?: string) => string;
}

const StoreContext = createContext<StoreContextValue | null>(null);

const STORAGE_KEY = 'pinnacle_crm_state';

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialAppState);
  const initialized = React.useRef(false);

  // Load persisted state on mount
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: AppState = JSON.parse(stored);
        dispatch({ type: 'LOAD_FROM_STORAGE', payload: parsed });
      }
    } catch {
      // Corrupt storage — start fresh
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  // Persist on every state change
  useEffect(() => {
    if (!initialized.current) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Storage full — ignore
    }
  }, [state]);

  function newId(prefix = 'item'): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  }

  return (
    <StoreContext.Provider value={{ state, dispatch, newId }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}

// ─── Typed hook aliases (convenience) ─────────────────────────────────────────

export function useLeads(): Lead[] {
  return useStore().state.leads;
}
export function useCustomers(): Customer[] {
  return useStore().state.customers;
}
export function useJobs(): Job[] {
  return useStore().state.jobs;
}
export function useQuotes(): Quote[] {
  return useStore().state.quotes;
}
export function useInvoices(): Invoice[] {
  return useStore().state.invoices;
}
export function usePayments(): Payment[] {
  return useStore().state.payments;
}
export function useFollowUps(): FollowUpTask[] {
  return useStore().state.followUps;
}
