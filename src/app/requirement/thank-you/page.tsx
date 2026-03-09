 'use client';
 
 import { useEffect } from 'react';
 import Link from 'next/link';
 import Header from '@/components/Header';
 import Footer from '@/components/Footer';
 
 declare global {
   interface Window {
     gtag?: (...args: unknown[]) => void;
   }
 }
 
 export default function RequirementThankYouPage() {
   // Google Ads conversion event (thank you page only)
   useEffect(() => {
     if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
     window.gtag('event', 'conversion', {
       send_to: 'AW-17856538861/3qh7CNPglYQcEO3R1MJC',
       value: 1.0,
       currency: 'INR',
     });
   }, []);
 
   return (
     <div className="min-h-screen bg-gray-50">
       <Header />
       <div className="h-16 sm:h-20 md:h-24"></div>
       <div className="container mx-auto px-4 py-16">
         <div className="max-w-2xl mx-auto text-center">
           <div className="bg-white rounded-2xl shadow-lg p-12">
             <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
               <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
               </svg>
             </div>
             <h2 className="text-3xl font-bold text-gray-900 mb-4">Thank You!</h2>
             <p className="text-lg text-gray-600 mb-8">
               Your requirement has been submitted successfully. Our workspace experts will reach out to you at the earliest.
             </p>
             <Link
               href="/"
               className="inline-flex items-center px-6 py-3 bg-orange-400 text-white rounded-lg font-semibold hover:bg-blue-900 transition-colors"
             >
               Back to Home
             </Link>
           </div>
         </div>
       </div>
       <Footer />
     </div>
   );
 }
