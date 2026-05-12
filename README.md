# Pinnacle Home Services — CRM Demo

A polished full-stack demo app showcasing a **small business public website** paired with a **complete CRM dashboard** — built as a marketing demo for local home-service businesses (HVAC, Plumbing & Electrical).

## 🔗 Live Demo

**[https://portfolio-project-vert-three.vercel.app](https://portfolio-project-vert-three.vercel.app)**

> Click **"Admin Dashboard →"** on the homepage to explore the full CRM.

---

## Features

### Public Website
- Sticky navigation with smooth scroll
- Hero section with call-to-action
- Services showcase (HVAC, Plumbing, Electrical)
- Customer reviews / testimonials
- Contact & quote request form (saves directly into the CRM lead pipeline)

### CRM Dashboard
| Page | What it does |
|------|-------------|
| **Dashboard** | KPI cards, 12-month revenue bar chart, lead source pie chart, recent leads |
| **Leads** | Full CRUD table, status filters, convert lead → customer |
| **Customers** | Customer directory with detail pages showing all linked jobs, quotes & invoices |
| **Jobs** | Job management with status tracking (Scheduled → In Progress → Completed) |
| **Quotes** | Quote builder with convert-to-job workflow |
| **Invoices** | Invoice tracking with overdue highlighting |
| **Follow-Ups** | Task list with priority flags and overdue alerts |
| **Reports** | Revenue analytics, top customers, lead sources, win/loss charts |
| **QuickBooks** | Simulated OAuth2 connect/sync flow (demo only) |
| **Settings** | Business info, team members, lead sources, service categories |

---

## Tech Stack

- **Next.js 15** (App Router, TypeScript)
- **React 19** with Context + useReducer for global state
- **Tailwind CSS v4** (CSS-first config)
- **Recharts** — bar, pie, and composed charts
- **Lucide React** — icons
- **localStorage** persistence — state survives page refreshes

---

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
