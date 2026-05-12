// ─── Status & Category Types ──────────────────────────────────────────────────

export type LeadStatus = 'New' | 'Contacted' | 'Quoted' | 'Scheduled' | 'Won' | 'Lost';
export type JobStatus = 'Scheduled' | 'In Progress' | 'Completed' | 'Canceled';
export type QuoteStatus = 'Draft' | 'Sent' | 'Accepted' | 'Declined' | 'Expired';
export type InvoiceStatus = 'Paid' | 'Unpaid' | 'Partially Paid' | 'Overdue';
export type FollowUpStatus = 'Pending' | 'Completed' | 'Skipped';
export type FollowUpPriority = 'Low' | 'Medium' | 'High';
export type CustomerStatus = 'Active' | 'Inactive' | 'VIP';
export type JobPaidStatus = 'Paid' | 'Unpaid' | 'Partial';

export type LeadSource =
  | 'Website'
  | 'Google Ads'
  | 'Facebook'
  | 'Referral'
  | 'Yard Sign'
  | 'Door Hanger'
  | 'Nextdoor'
  | 'Yelp'
  | 'Phone Book'
  | 'Other';

// ─── Core Entities ─────────────────────────────────────────────────────────────

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  source: LeadSource;
  serviceRequested: string;
  estimatedValue: number;
  status: LeadStatus;
  assignedTo: string;
  createdDate: string;
  followUpDate: string;
  notes: string;
  estimatedBudget?: string;
  preferredContactTime?: string;
  message?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  source: LeadSource;
  totalSpent: number;
  lastJobDate: string;
  openBalance: number;
  status: CustomerStatus;
  notes: string;
  createdDate: string;
  leadId?: string;
  qbCustomerId?: string;
}

export interface Job {
  id: string;
  customerId: string;
  customerName?: string;
  serviceType: string;
  scheduledDate: string;
  completedDate?: string;
  status: JobStatus;
  value: number;
  paidStatus?: JobPaidStatus;
  assignedTo: string;
  notes: string;
  quoteId?: string;
}

export interface Quote {
  id: string;
  customerId: string;
  customerName?: string;
  serviceDescription?: string;
  quoteDate: string;
  amount: number;
  status: QuoteStatus;
  expirationDate: string;
  services?: string[];
  notes: string;
  createdBy?: string;
  jobId?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName?: string;
  invoiceDate: string;
  dueDate: string;
  amount: number;
  paidAmount: number;
  status: InvoiceStatus;
  linkedJobId?: string;
  jobId?: string;
  source: 'CRM' | 'QuickBooks';
  notes: string;
  qbInvoiceId?: string;
}

export interface Payment {
  id: string;
  invoiceId: string;
  customerId: string;
  customerName: string;
  amount: number;
  date: string;
  method: string;
  qbPaymentId?: string;
}

export interface FollowUpTask {
  id: string;
  customerId?: string;
  leadId?: string;
  contactId?: string;
  contactName: string;
  reason: string;
  dueDate: string;
  priority: FollowUpPriority;
  status: FollowUpStatus;
  assignedTo?: string;
  completedDate?: string;
  notes: string;
}

// ─── System / Config ───────────────────────────────────────────────────────────

export interface QuickBooksSyncStatus {
  connected: boolean;
  lastSyncDate: string | null;
  status: 'idle' | 'syncing' | 'success' | 'error';
  customersLastSynced: number;
  invoicesLastSynced: number;
  paymentsLastSynced: number;
  errorsFound: number;
  errorMessages: string[];
  companyName?: string;
  customersCount?: number;
  invoicesCount?: number;
  paymentsCount?: number;
  errors?: string[];
}

export interface BusinessSettings {
  businessName: string;
  phone: string;
  email: string;
  address: string;
  website: string;
  logo: string;
  licenseNumber?: string;
  teamMembers: string[];
  leadSources: LeadSource[];
  serviceCategories: string[];
}

// ─── App State ─────────────────────────────────────────────────────────────────

export interface AppState {
  leads: Lead[];
  customers: Customer[];
  jobs: Job[];
  quotes: Quote[];
  invoices: Invoice[];
  payments: Payment[];
  followUps: FollowUpTask[];
  quickBooksSync: QuickBooksSyncStatus;
  settings: BusinessSettings;
}

// ─── Store Actions ─────────────────────────────────────────────────────────────

export type AppAction =
  | { type: 'ADD_LEAD'; payload: Lead }
  | { type: 'UPDATE_LEAD'; payload: Lead }
  | { type: 'DELETE_LEAD'; payload: string }
  | { type: 'CONVERT_LEAD_TO_CUSTOMER'; payload: { leadId: string; customer: Customer } }
  | { type: 'ADD_CUSTOMER'; payload: Customer }
  | { type: 'UPDATE_CUSTOMER'; payload: Customer }
  | { type: 'ADD_JOB'; payload: Job }
  | { type: 'UPDATE_JOB'; payload: Job }
  | { type: 'ADD_QUOTE'; payload: Quote }
  | { type: 'UPDATE_QUOTE'; payload: Quote }
  | { type: 'CONVERT_QUOTE_TO_JOB'; payload: { quoteId: string; job: Job } }
  | { type: 'ADD_INVOICE'; payload: Invoice }
  | { type: 'UPDATE_INVOICE'; payload: Invoice }
  | { type: 'ADD_PAYMENT'; payload: Payment }
  | { type: 'ADD_FOLLOWUP'; payload: FollowUpTask }
  | { type: 'UPDATE_FOLLOWUP'; payload: FollowUpTask }
  | { type: 'UPDATE_QB_SYNC'; payload: Partial<QuickBooksSyncStatus> }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<BusinessSettings> }
  | { type: 'SYNC_FROM_QB'; payload: { customers: Customer[]; invoices: Invoice[]; payments: Payment[]; syncDate?: string } }
  | { type: 'LOAD_FROM_STORAGE'; payload: AppState };
