'use client';

import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
  image: string;
}

const faqData: FAQItem[] = [
  {
    question: 'What is a coworking space?',
    answer: 'A coworking space is a shared workspace where professionals, freelancers, entrepreneurs, and startups can work in a collaborative and flexible environment. It offers amenities like dedicated desks, private cabins of 2, 4, 8, 10 to 30+ Seaters. Open desks, Meeting rooms for client meetings, high-speed internet, 24/7 access, and more.',
    image: '/images/co1.jpeg'
  },
  {
    question: 'What is a Managed Office space?',
    answer: `A managed office space is a fully equipped, ready-to-use workspace where the service provider handles all operations including IT support, maintenance, cleaning, security, and utilities. This turn-key solution offers a flexible, private, and brand-aligned environment, allowing companies to move in immediately and scale as needed. Ideal for startups, growing businesses, and companies wanting a professional setup without large capital expenditure.`,
    image: '/images/FaqManage.png'
  },
  {
    question: 'What is a Private-Cabin space?',
    answer: `A private cabin is a dedicated, lockable workspace that offers the confidentiality and security of a standalone office while still providing the amenities of a coworking environment. Cabin sizes range from 2, 4, 8, 10 to 30+ seats configurations, allowing businesses of any scale to select a layout that matches their team size and workflow.`,
    image: '/images/Faqcabin.jpg'
  },
  {
    question: 'What is a Dedicated desk?',
    answer: `A dedicated desk is a permanently assigned workstation exclusively reserved for you in a coworking space, providing a consistent and personalized workspace unlike shared hot desks. This setup includes a lockable storage cabinet for your valuables, documents, and personal items, ensuring security and convenience. Ideal for freelancers, solopreneurs, remote workers, and professionals who require a reliable, stable workspace with consistent access, allowing you to maintain your work setup exactly as you prefer without daily setup and teardown.`,
    image: '/images/FaqDedicate.jfif'
  },
  {
    question: 'What is Virtual Office?',
    answer: 'A virtual office provides businesses with a professional presence like a Business address, company registration, GST registration, mailing address, phone answering and office services (meeting rooms access, admin support) without the cost of a physical lease.',
    image: '/images/co5.jpeg'
  },
  {
    question: 'What is Meeting Rooms?',
    answer: 'In a coworking space, meet rooms (meeting rooms) are private, reservable rooms equipped for professional discussions, client presentations, brainstorming, and video calls, offering a distraction-free, tech-ready environment with amenities like Wi-Fi, screens, and whiteboards, providing flexibility and cost-savings compared to setting up your own office space.',
    image: '/images/FaqMeeting.jpg'
  },
  {
    question: 'What is Day Pass?',
    answer: 'A coworking day pass is a flexible, single-day access option to a shared office space, allowing freelancers, remote workers, or travelers to use professional amenities like high-speed Wi-Fi, ergonomic seating, printers, and coffee without a long-term lease or monthly commitment.',
    image: '/images/co1.jpeg'
  },
  {
    question: 'What is Enterprise office?',
    answer: `An enterprise office is a large, customized, and managed private workspace. The service provider handles all day‑to‑day operations, offering businesses a flexible, private, and brand‑aligned solution that eliminates the complexities of a traditional office setup. Designed specifically for big companies needing scalability, branding, and premium amenities without the hassle of traditional leases, offering private areas, tailored tech. It's Include services encompass, IT support, electricity, maintenance, cleaning, security, and high‑speed internet, basically day-to-day operations.`,
    image: '/images/co4.jpeg'
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const currentImage = openIndex !== null ? faqData[openIndex].image : faqData[0].image;

  return (
    <section className="bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50 py-16 md:py-20 lg:py-24">
      <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: '1920px', width: '100%' }}>
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            FAQ
          </h2>
          <p className="text-lg md:text-xl text-gray-600 font-medium">
            Got questions? We've got answers.
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left Side - FAQ Questions */}
            <div className="space-y-4">
              {faqData.map((faq, index) => (
                <div
                  key={index}
                  className={`bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border-2 overflow-hidden ${
                    openIndex === index ? 'border-blue-400 shadow-lg' : 'border-gray-200'
                  }`}
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full px-6 py-5 md:px-8 md:py-6 flex items-center justify-between text-left focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 rounded-xl"
                    aria-expanded={openIndex === index}
                  >
                    <span className="text-base md:text-lg font-semibold text-gray-900 pr-4 flex-1">
                      {index + 1}) {faq.question}
                    </span>
                    <svg
                      className={`w-5 h-5 md:w-6 md:h-6 text-blue-600 flex-shrink-0 transition-transform duration-300 ${
                        openIndex === index ? 'transform rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      openIndex === index ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="px-6 md:px-8 pb-5 md:pb-6 pt-0">
                      <div className="text-gray-700 leading-relaxed whitespace-pre-line text-sm md:text-base">
                        {faq.answer}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Side - Images */}
            <div className="sticky top-24 h-fit">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-gray-200">
                <div className="relative w-full h-[500px] md:h-[600px] lg:h-[700px]">
                  <img
                    src={currentImage}
                    alt={openIndex !== null ? faqData[openIndex].question : faqData[0].question}
                    className="w-full h-full object-cover transition-opacity duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
                    <h3 className="text-white text-xl md:text-2xl font-bold mb-2">
                      {openIndex !== null ? faqData[openIndex].question : faqData[0].question}
                    </h3>
                    <p className="text-white/90 text-sm md:text-base">
                      {openIndex !== null ? `Question ${openIndex + 1} of ${faqData.length}` : `Question 1 of ${faqData.length}`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

