'use client';

import { Calendar, Mail, Phone, MapPin } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Calendar className="h-8 w-8 text-blue-500" />
              <span className="text-xl font-bold text-white">BookEasy</span>
            </Link>
            <p className="text-sm text-gray-400">
              Modern appointment booking made simple. Book your perfect service in minutes.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/booking" className="text-sm hover:text-white transition-colors">
                  Book Appointment
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="text-sm hover:text-white transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/#testimonials" className="text-sm hover:text-white transition-colors">
                  Testimonials
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-sm hover:text-white transition-colors">
                  Admin Panel
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Services</h3>
            <ul className="space-y-3">
              <li className="text-sm">Hair Styling</li>
              <li className="text-sm">Spa Treatments</li>
              <li className="text-sm">Nail Care</li>
              <li className="text-sm">Massage Therapy</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4" />
                <span>hello@bookeasy.com</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4" />
                <span>123 Main St, City, State</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-800 pt-8">
          <p className="text-center text-sm text-gray-400">
            © {new Date().getFullYear()} BookEasy. All rights reserved. Built with Next.js & Firebase.
          </p>
        </div>
      </div>
    </footer>
  );
}

