'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Phone, Mail, MapPin, Star, ChevronDown, Menu, X, CheckCircle,
  Wrench, Zap, Droplets, ThumbsUp, Clock, Shield, ArrowRight
} from 'lucide-react';
import { useStore } from '@/lib/store';
import type { Lead, LeadSource } from '@/lib/types';

const NAV_LINKS = [
  { label: 'Services', href: '#services' },
  { label: 'About', href: '#about' },
  { label: 'Reviews', href: '#reviews' },
  { label: 'Contact', href: '#contact' },
];

const SERVICES = [
  {
    icon: <Wrench className="w-8 h-8" />,
    title: 'HVAC Services',
    color: 'bg-orange-50 text-orange-600',
    items: [
      'AC Installation & Replacement',
      'Furnace & Heat Pump Install',
      'HVAC Repairs & Tune-Ups',
      'Ductwork & Insulation',
      'Mini-Split Systems',
    ],
  },
  {
    icon: <Droplets className="w-8 h-8" />,
    title: 'Plumbing',
    color: 'bg-blue-50 text-blue-600',
    items: [
      'Water Heater Install & Repair',
      'Drain Cleaning & Unclogging',
      'Fixture Replacement',
      'Sewer Line Service',
      'Bathroom & Kitchen Remodel Plumbing',
    ],
  },
  {
    icon: <Zap className="w-8 h-8" />,
    title: 'Electrical',
    color: 'bg-yellow-50 text-yellow-600',
    items: [
      'Panel Upgrades & Replacement',
      'Whole-Home Generators',
      'Outlet & Wiring Installation',
      'EV Charger Installation',
      'Lighting & Ceiling Fans',
    ],
  },
];

const REVIEWS = [
  {
    name: 'Robert Wilson',
    rating: 5,
    date: 'April 2026',
    text: "Pinnacle replaced my furnace last winter and I couldn't be happier. The team showed up on time, explained everything, and cleaned up perfectly. Highly recommend!",
  },
  {
    name: 'Monica Patterson',
    rating: 5,
    date: 'March 2026',
    text: "Called them for an emergency AC repair on a 95-degree day. They were at my house within 2 hours and had it running again. Saved the day! Fair pricing too.",
  },
  {
    name: 'Patricia Anderson',
    rating: 5,
    date: 'April 2026',
    text: "Third time using Pinnacle and they keep getting better. Professional crew, great communication, and the new furnace is incredibly quiet.",
  },
  {
    name: 'Michael Davis',
    rating: 5,
    date: 'February 2026',
    text: "Had my electrical panel upgraded to 200 amps. Tom was fantastic — explained the whole process, pulled all the permits, and had everything done in one day.",
  },
];

const WHY_US = [
  { icon: <Shield className="w-6 h-6" />, title: 'Licensed & Insured', desc: 'Fully licensed, bonded, and insured for your peace of mind.' },
  { icon: <Clock className="w-6 h-6" />, title: 'Same-Day Service', desc: 'Emergency calls answered fast. We respect your time.' },
  { icon: <ThumbsUp className="w-6 h-6" />, title: '5-Star Rated', desc: 'Over 200 five-star reviews on Google, Yelp, and Nextdoor.' },
  { icon: <CheckCircle className="w-6 h-6" />, title: 'Upfront Pricing', desc: 'No hidden fees. You know the cost before we start.' },
];

const SERVICES_LIST = [
  'AC Installation', 'AC Repair', 'Furnace Installation', 'Furnace Repair',
  'HVAC Tune-Up / Maintenance', 'Water Heater Install', 'Plumbing Repair',
  'Drain Cleaning', 'Electrical Panel Upgrade', 'Generator Install', 'Other',
];

interface QuoteFormData {
  name: string; phone: string; email: string; address: string;
  serviceNeeded: string; message: string; estimatedBudget: string; preferredContactTime: string;
}

const emptyForm: QuoteFormData = {
  name: '', phone: '', email: '', address: '',
  serviceNeeded: '', message: '', estimatedBudget: '', preferredContactTime: '',
};

export default function HomePage() {
  const { dispatch, newId } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState<QuoteFormData>(emptyForm);
  const [submitted, setSubmitted] = useState(false);
  const [activeSection, setActiveSection] = useState<'quote' | 'contact'>('quote');

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const lead: Lead = {
      id: newId('lead'),
      name: formData.name, phone: formData.phone, email: formData.email, address: formData.address,
      source: 'Website' as LeadSource, serviceRequested: formData.serviceNeeded, estimatedValue: 0,
      status: 'New', assignedTo: 'Mike Rodriguez',
      createdDate: new Date().toISOString().split('T')[0],
      followUpDate: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
      notes: formData.message, estimatedBudget: formData.estimatedBudget,
      preferredContactTime: formData.preferredContactTime, message: formData.message,
    };
    dispatch({ type: 'ADD_LEAD', payload: lead });
    setSubmitted(true);
    setFormData(emptyForm);
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center">
                <Wrench className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-gray-900 text-lg">Pinnacle Home Services</span>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map(link => (
                <a key={link.href} href={link.href} className="text-gray-600 hover:text-orange-600 font-medium text-sm transition-colors">
                  {link.label}
                </a>
              ))}
            </nav>
            <div className="hidden md:flex items-center gap-3">
              <a href="tel:5554007890" className="flex items-center gap-2 text-gray-700 font-medium text-sm hover:text-orange-600 transition-colors">
                <Phone className="w-4 h-4" /> (555) 400-7890
              </a>
              <a href="#contact" className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
                Get a Free Quote
              </a>
              <Link href="/dashboard" className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
                CRM Dashboard
              </Link>
            </div>
            <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-3">
            {NAV_LINKS.map(link => (
              <a key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)}
                className="block text-gray-700 font-medium py-2">{link.label}</a>
            ))}
            <a href="tel:5554007890" className="flex items-center gap-2 text-orange-600 font-semibold py-2">
              <Phone className="w-4 h-4" /> (555) 400-7890
            </a>
            <Link href="/dashboard" className="block bg-indigo-600 text-white text-center py-2 rounded-lg font-semibold">
              CRM Dashboard
            </Link>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-orange-50 via-white to-blue-50 pt-20 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 text-sm font-medium px-3 py-1 rounded-full mb-6">
              <Star className="w-3.5 h-3.5 fill-orange-500 text-orange-500" /> 5-Star Rated · Springfield, IL
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
              Springfield&apos;s Most Trusted<span className="text-orange-500"> Home Service</span> Experts
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              HVAC, Plumbing & Electrical — licensed, insured, and ready to help.
              Same-day appointments available. Upfront pricing. No surprises.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="tel:5554007890"
                className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3.5 rounded-xl text-lg transition-colors shadow-lg shadow-orange-200">
                <Phone className="w-5 h-5" /> Call Now: (555) 400-7890
              </a>
              <a href="#contact"
                className="flex items-center gap-2 bg-white border-2 border-gray-200 hover:border-orange-300 text-gray-700 font-bold px-6 py-3.5 rounded-xl text-lg transition-colors">
                Request a Quote <ArrowRight className="w-5 h-5" />
              </a>
            </div>
            <div className="flex flex-wrap gap-6 mt-10 text-sm text-gray-600">
              {['Licensed & Insured', '15+ Years Experience', '200+ 5-Star Reviews', 'Same-Day Service'].map(f => (
                <span key={f} className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-green-500" /> {f}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Us bar */}
      <section className="bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {WHY_US.map(item => (
              <div key={item.title} className="flex items-start gap-3 text-white">
                <div className="mt-0.5 text-orange-400 shrink-0">{item.icon}</div>
                <div>
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-gray-400 text-sm mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">Our Services</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From emergency repairs to full system replacements — we handle it all under one roof.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {SERVICES.map(service => (
              <div key={service.title} className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className={`inline-flex p-3 rounded-xl mb-5 ${service.color}`}>{service.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{service.title}</h3>
                <ul className="space-y-2.5">
                  {service.items.map(item => (
                    <li key={item} className="flex items-center gap-2 text-gray-600 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500 shrink-0" /> {item}
                    </li>
                  ))}
                </ul>
                <a href="#contact" className="mt-6 inline-flex items-center gap-1 text-orange-600 font-semibold text-sm hover:text-orange-700">
                  Get a Quote <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-6">
                Springfield&apos;s Home Service Team Since 2009
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Pinnacle Home Services was founded by Mike Rodriguez with a simple mission: treat every
                customer&apos;s home like our own. After 15+ years and thousands of completed jobs,
                we&apos;re still the company neighbors call first.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                Our team of licensed technicians specializes in residential and light commercial HVAC,
                plumbing, and electrical work. We&apos;re proud to be the top-rated service company in the
                Springfield metro area.
              </p>
              <div className="grid grid-cols-3 gap-6 text-center">
                {[{ value: '15+', label: 'Years in Business' }, { value: '2,400+', label: 'Jobs Completed' }, { value: '200+', label: '5-Star Reviews' }].map(stat => (
                  <div key={stat.label} className="bg-white rounded-xl p-4 shadow-sm">
                    <p className="text-2xl font-extrabold text-orange-500">{stat.value}</p>
                    <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl p-10 text-white">
              <h3 className="text-2xl font-bold mb-6">Our Team</h3>
              {[
                { name: 'Mike Rodriguez', role: 'Owner & Master Technician', exp: '15 yrs' },
                { name: 'Tom Baker', role: 'Senior HVAC Tech & Electrician', exp: '11 yrs' },
                { name: 'Dave Williams', role: 'Plumbing Lead', exp: '8 yrs' },
                { name: 'Sarah Chen', role: 'Office Manager & Scheduling', exp: '6 yrs' },
              ].map(member => (
                <div key={member.name} className="flex items-center justify-between py-3 border-b border-orange-400 last:border-0">
                  <div>
                    <p className="font-semibold">{member.name}</p>
                    <p className="text-orange-100 text-sm">{member.role}</p>
                  </div>
                  <span className="text-orange-100 text-sm">{member.exp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section id="reviews" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">What Our Customers Say</h2>
            <div className="flex items-center justify-center gap-2 text-gray-600">
              <div className="flex">{[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />)}</div>
              <span className="font-semibold text-gray-900">5.0</span>
              <span>· 200+ reviews</span>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {REVIEWS.map(review => (
              <div key={review.name} className="bg-gray-50 rounded-2xl p-7 border border-gray-100">
                <div className="flex mb-3">
                  {[...Array(review.rating)].map((_, i) => <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                </div>
                <p className="text-gray-700 leading-relaxed mb-4">&ldquo;{review.text}&rdquo;</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm">
                      {review.name.charAt(0)}
                    </div>
                    <span className="font-semibold text-gray-900 text-sm">{review.name}</span>
                  </div>
                  <span className="text-gray-400 text-xs">{review.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact / Quote Form */}
      <section id="contact" className="py-20 bg-gradient-to-br from-indigo-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">Get a Free Quote</h2>
              <p className="text-gray-600">Fill out the form and we&apos;ll get back to you within a few hours.</p>
            </div>
            <div className="flex bg-white rounded-xl p-1.5 shadow-sm border border-gray-100 mb-8">
              {(['quote', 'contact'] as const).map(tab => (
                <button key={tab} onClick={() => setActiveSection(tab)}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-colors capitalize ${activeSection === tab ? 'bg-orange-500 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>
                  {tab === 'quote' ? 'Request a Quote' : 'Contact Us'}
                </button>
              ))}
            </div>
            {submitted ? (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-10 text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Request Received!</h3>
                <p className="text-gray-600 mb-6">We&apos;ll reach out within 2 business hours. For urgent issues, call us directly.</p>
                <a href="tel:5554007890" className="inline-flex items-center gap-2 bg-orange-500 text-white font-bold px-6 py-3 rounded-xl hover:bg-orange-600">
                  <Phone className="w-4 h-4" /> (555) 400-7890
                </a>
                <button onClick={() => setSubmitted(false)} className="block mx-auto mt-4 text-sm text-gray-500 hover:text-gray-700">
                  Submit another request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
                    <input type="text" name="name" required value={formData.name} onChange={handleChange} placeholder="Jane Smith"
                      className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number *</label>
                    <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} placeholder="(555) 000-0000"
                      className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address *</label>
                  <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="you@email.com"
                    className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Service Address *</label>
                  <input type="text" name="address" required value={formData.address} onChange={handleChange} placeholder="123 Main St, Springfield, IL"
                    className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Service Needed *</label>
                  <div className="relative">
                    <select name="serviceNeeded" required value={formData.serviceNeeded} onChange={handleChange}
                      className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-300 appearance-none">
                      <option value="">Select a service...</option>
                      {SERVICES_LIST.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                {activeSection === 'quote' && (
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Estimated Budget</label>
                      <input type="text" name="estimatedBudget" value={formData.estimatedBudget} onChange={handleChange} placeholder="e.g. $1,000–$2,000"
                        className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Preferred Contact Time</label>
                      <input type="text" name="preferredContactTime" value={formData.preferredContactTime} onChange={handleChange} placeholder="e.g. Mornings, after 5pm"
                        className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
                    </div>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Message</label>
                  <textarea name="message" rows={4} value={formData.message} onChange={handleChange} placeholder="Describe the issue or what you're looking for..."
                    className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 resize-none" />
                </div>
                <button type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl text-base transition-colors shadow-md shadow-orange-100">
                  Submit Request — It&apos;s Free
                </button>
                <p className="text-xs text-center text-gray-400">We&apos;ll respond within 2 business hours. No spam, ever.</p>
              </form>
            )}
            <div className="mt-8 grid sm:grid-cols-3 gap-4 text-center">
              {[
                { icon: <Phone className="w-5 h-5" />, label: 'Call Us', value: '(555) 400-7890', href: 'tel:5554007890' },
                { icon: <Mail className="w-5 h-5" />, label: 'Email Us', value: 'info@pinnacle.com', href: 'mailto:info@pinnacle.com' },
                { icon: <MapPin className="w-5 h-5" />, label: 'Location', value: 'Springfield, IL', href: '#' },
              ].map(item => (
                <a key={item.label} href={item.href}
                  className="flex flex-col items-center gap-2 bg-white rounded-xl p-4 border border-gray-100 text-gray-600 hover:text-orange-600 hover:border-orange-200 transition-colors">
                  <span className="text-orange-500">{item.icon}</span>
                  <span className="text-xs text-gray-400">{item.label}</span>
                  <span className="font-medium text-sm">{item.value}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-orange-500 flex items-center justify-center">
                  <Wrench className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-white font-bold">Pinnacle Home Services</span>
              </div>
              <p className="text-sm leading-relaxed">Springfield&apos;s most trusted HVAC, Plumbing &amp; Electrical company since 2009.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Services</h4>
              <ul className="text-sm space-y-2">
                {['HVAC Install & Repair', 'Plumbing Services', 'Electrical Work', 'Generators', 'Insulation'].map(s => (
                  <li key={s}><a href="#services" className="hover:text-white transition-colors">{s}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Contact</h4>
              <div className="text-sm space-y-2">
                <p className="flex items-center gap-2"><Phone className="w-4 h-4" /> (555) 400-7890</p>
                <p className="flex items-center gap-2"><Mail className="w-4 h-4" /> info@pinnacle.com</p>
                <p className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Springfield, IL 62701</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs">
            <p>© 2026 Pinnacle Home Services. All rights reserved.</p>
            <Link href="/dashboard" className="text-indigo-400 hover:text-indigo-300 transition-colors">Staff Portal →</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

