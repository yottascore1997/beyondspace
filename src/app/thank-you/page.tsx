 'use client';
 
 import Link from 'next/link';
 import Header from '@/components/Header';
 import Footer from '@/components/Footer';
 
 export default function ThankYouPage() {
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
               Your details have been submitted successfully. Our team will contact you soon.
             </p>
             <div className="flex items-center justify-center gap-3">
               <Link
                 href="/"
                 className="inline-flex items-center px-6 py-3 bg-orange-400 text-white rounded-lg font-semibold hover:bg-blue-900 transition-colors"
               >
                 Back to Home
               </Link>
               <Link
                 href="/property"
                 className="inline-flex items-center px-6 py-3 bg-white text-gray-900 rounded-lg font-semibold border border-gray-200 hover:bg-gray-50 transition-colors"
               >
                 Browse Properties
               </Link>
             </div>
           </div>
         </div>
       </div>
       <Footer />
     </div>
   );
 }
