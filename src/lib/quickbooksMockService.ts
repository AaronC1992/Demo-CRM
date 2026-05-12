/**
 * QuickBooks Online Mock Service
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * DEMO MODE: This file simulates the QuickBooks Online API.
 * No real credentials, API keys, or financial data are used.
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * HOW TO CONNECT THE REAL QuickBooks ONLINE API (future integration):
 *
 * 1. Register your app at https://developer.intuit.com
 *    - Create an app under "QuickBooks Online Accounting"
 *    - Note your client_id and client_secret (store in env variables)
 *
 * 2. Implement OAuth 2.0 Authorization Flow:
 *    - Redirect user to: https://appcenter.intuit.com/connect/oauth2
 *    - Handle the callback to exchange code for access_token + refresh_token
 *    - Store tokens securely server-side (never in client-side code)
 *
 * 3. Use the intuit-oauth library or node-quickbooks:
 *    npm install intuit-oauth node-quickbooks
 *
 * 4. Real API base URLs:
 *    - Production: https://quickbooks.api.intuit.com/v3/company/{realmId}
 *    - Sandbox:    https://sandbox-quickbooks.api.intuit.com/v3/company/{realmId}
 *
 * 5. Replace the mock functions below with real API calls:
 *    - fetchQBCustomers() → GET /query?query=SELECT * FROM Customer
 *    - fetchQBInvoices()  → GET /query?query=SELECT * FROM Invoice
 *    - fetchQBPayments()  → GET /query?query=SELECT * FROM Payment
 *
 * IMPORTANT SECURITY NOTES:
 * - Never store OAuth tokens in localStorage or client-side state
 * - Always use HTTPS
 * - Rotate refresh tokens on each use
 * - This CRM only reads invoice/payment summaries — it does not write
 *   financial transactions to QuickBooks
 * ─────────────────────────────────────────────────────────────────────────────
 */

import type { Customer, Invoice, Payment } from './types';

// ─── Mock QuickBooks Data ──────────────────────────────────────────────────────
// These records simulate what would come back from the QB Online REST API.

const qbMockCustomers: Customer[] = [
  {
    id: 'cust-001',
    name: 'John Martinez',
    phone: '(555) 301-4821',
    email: 'john.martinez@email.com',
    address: '142 Oakwood Drive, Springfield, IL 62701',
    source: 'Google Ads',
    totalSpent: 3350,        // QB might show a slightly updated total
    lastJobDate: '2026-05-15',
    openBalance: 0,
    status: 'VIP',
    notes: 'QickBooks record — synced.',
    createdDate: '2024-06-12',
    qbCustomerId: 'qb-c-001',
  },
  {
    id: 'cust-002',
    name: 'Sarah Thompson',
    phone: '(555) 874-3302',
    email: 'sarah.t@gmail.com',
    address: '89 Maple Court, Springfield, IL 62702',
    source: 'Referral',
    totalSpent: 1800,
    lastJobDate: '2026-03-05',
    openBalance: 320,
    status: 'Active',
    notes: 'QuickBooks record — synced.',
    createdDate: '2024-09-28',
    qbCustomerId: 'qb-c-002',
  },
  {
    id: 'cust-003',
    name: 'Robert Wilson',
    phone: '(555) 643-0971',
    email: 'rwilson@outlook.com',
    address: '2201 Elmwood Ave, Springfield, IL 62703',
    source: 'Nextdoor',
    totalSpent: 6300,        // Updated after insulation job
    lastJobDate: '2026-04-30',
    openBalance: 0,
    status: 'VIP',
    notes: 'QuickBooks record — synced.',
    createdDate: '2023-11-15',
    qbCustomerId: 'qb-c-003',
  },
  {
    id: 'cust-007',
    name: 'Michael Davis',
    phone: '(555) 334-6601',
    email: 'mdavis@gmail.com',
    address: '1105 Cedar Blvd, Springfield, IL 62701',
    source: 'Yelp',
    totalSpent: 1400,
    lastJobDate: '2026-03-18',
    openBalance: 0,
    status: 'Active',
    notes: 'QuickBooks record — synced.',
    createdDate: '2025-07-14',
    qbCustomerId: 'qb-c-007',
  },
  {
    id: 'cust-008',
    name: 'Patricia Anderson',
    phone: '(555) 901-4423',
    email: 'p.anderson@email.com',
    address: '330 Sycamore Court, Springfield, IL 62702',
    source: 'Referral',
    totalSpent: 3800,
    lastJobDate: '2026-04-25',
    openBalance: 0,
    status: 'VIP',
    notes: 'QuickBooks record — synced.',
    createdDate: '2024-03-01',
    qbCustomerId: 'qb-c-008',
  },
];

const qbMockInvoices: Invoice[] = [
  {
    id: 'inv-001',
    invoiceNumber: 'INV-2026-0041',
    customerId: 'cust-001',
    customerName: 'John Martinez',
    invoiceDate: '2026-04-18',
    dueDate: '2026-05-18',
    amount: 3200,
    paidAmount: 3200,
    status: 'Paid',
    linkedJobId: 'job-001',
    source: 'QuickBooks',
    notes: 'Paid in full — QuickBooks verified.',
    qbInvoiceId: 'qb-inv-041',
  },
  {
    id: 'inv-002',
    invoiceNumber: 'INV-2026-0038',
    customerId: 'cust-002',
    customerName: 'Sarah Thompson',
    invoiceDate: '2026-03-05',
    dueDate: '2026-04-05',
    amount: 480,
    paidAmount: 160,
    status: 'Overdue',
    linkedJobId: 'job-002',
    source: 'QuickBooks',
    notes: 'Partial payment $160. Balance $320 overdue — QuickBooks verified.',
    qbInvoiceId: 'qb-inv-038',
  },
  {
    id: 'inv-003',
    invoiceNumber: 'INV-2026-0044',
    customerId: 'cust-003',
    customerName: 'Robert Wilson',
    invoiceDate: '2026-04-30',
    dueDate: '2026-05-30',
    amount: 250,
    paidAmount: 250,
    status: 'Paid',
    linkedJobId: 'job-003',
    source: 'QuickBooks',
    notes: 'Paid via ACH — QuickBooks verified.',
    qbInvoiceId: 'qb-inv-044',
  },
  {
    id: 'inv-004',
    invoiceNumber: 'INV-2026-0035',
    customerId: 'cust-007',
    customerName: 'Michael Davis',
    invoiceDate: '2026-03-18',
    dueDate: '2026-04-18',
    amount: 1400,
    paidAmount: 1400,
    status: 'Paid',
    linkedJobId: 'job-004',
    source: 'QuickBooks',
    notes: 'Paid by card — QuickBooks verified.',
    qbInvoiceId: 'qb-inv-035',
  },
  {
    id: 'inv-006',
    invoiceNumber: 'INV-2026-0045',
    customerId: 'cust-008',
    customerName: 'Patricia Anderson',
    invoiceDate: '2026-04-25',
    dueDate: '2026-05-25',
    amount: 3800,
    paidAmount: 3800,
    status: 'Paid',
    linkedJobId: 'job-006',
    source: 'QuickBooks',
    notes: 'Paid same day — QuickBooks verified.',
    qbInvoiceId: 'qb-inv-045',
  },
];

const qbMockPayments: Payment[] = [
  {
    id: 'pay-001',
    invoiceId: 'inv-001',
    customerId: 'cust-001',
    customerName: 'John Martinez',
    amount: 3200,
    date: '2026-04-18',
    method: 'Check',
    qbPaymentId: 'qb-pay-001',
  },
  {
    id: 'pay-002',
    invoiceId: 'inv-002',
    customerId: 'cust-002',
    customerName: 'Sarah Thompson',
    amount: 160,
    date: '2026-03-05',
    method: 'Credit Card',
    qbPaymentId: 'qb-pay-002',
  },
  {
    id: 'pay-003',
    invoiceId: 'inv-003',
    customerId: 'cust-003',
    customerName: 'Robert Wilson',
    amount: 250,
    date: '2026-04-30',
    method: 'ACH',
    qbPaymentId: 'qb-pay-003',
  },
  {
    id: 'pay-004',
    invoiceId: 'inv-004',
    customerId: 'cust-007',
    customerName: 'Michael Davis',
    amount: 1400,
    date: '2026-03-18',
    method: 'Credit Card',
    qbPaymentId: 'qb-pay-004',
  },
  {
    id: 'pay-006',
    invoiceId: 'inv-006',
    customerId: 'cust-008',
    customerName: 'Patricia Anderson',
    amount: 3800,
    date: '2026-04-25',
    method: 'Check',
    qbPaymentId: 'qb-pay-006',
  },
];

// ─── Public API ────────────────────────────────────────────────────────────────

/**
 * Simulates connecting to QuickBooks Online.
 * In production, this would trigger the OAuth 2.0 authorization flow.
 */
export async function connectToQuickBooks(): Promise<{ success: boolean; message: string; companyName?: string }> {
  // TODO: Replace with real OAuth 2.0 flow
  // 1. Generate authorization URL with client_id, redirect_uri, scope
  // 2. Redirect user to Intuit authorization page
  // 3. Handle callback with authorization code
  // 4. Exchange code for access_token + refresh_token
  await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate network delay
  return {
    success: true,
    message: 'Successfully connected to QuickBooks Online (Demo)',
    companyName: 'Pinnacle Home Services (Demo)',
  };
}

/**
 * Simulates a QuickBooks data sync.
 * In production, this would call the QBO REST API using a valid access_token.
 */
export async function syncFromQuickBooks(): Promise<{
  customers: Customer[];
  invoices: Invoice[];
  payments: Payment[];
  errorsFound: number;
  errorMessages: string[];
}> {
  // TODO: Replace with real API calls:
  // GET /v3/company/{realmId}/query?query=SELECT * FROM Customer MAXRESULTS 1000
  // GET /v3/company/{realmId}/query?query=SELECT * FROM Invoice MAXRESULTS 1000
  // GET /v3/company/{realmId}/query?query=SELECT * FROM Payment MAXRESULTS 1000
  await new Promise((resolve) => setTimeout(resolve, 2500)); // Simulate sync delay
  return {
    customers: qbMockCustomers,
    invoices: qbMockInvoices,
    payments: qbMockPayments,
    errorsFound: 0,
    errorMessages: [],
  };
}
