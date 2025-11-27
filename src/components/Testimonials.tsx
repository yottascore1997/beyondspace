'use client';

import { useRef } from 'react';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  text: string;
  rating: number;
  avatar: string;
}

const testimonials: Testimonial[] = [
  {
    id: 't1',
    name: 'Ameet Zaverii',
    role: 'Co-Founder & CEO',
    company: 'Get Set Learn',
    text:
      'Finding meeting rooms for our team meetings was becoming a challenge. Beyond Space made it simple and quick to get exactly what we needed.',
    rating: 5,
    avatar: '/images/1.jpeg',
  },
  {
    id: 't2',
    name: 'Ritesh Singh',
    role: 'Admin Manager',
    company: 'Kennect Technologies',
    text:
      'They provided multiple location suggestions and helped us shortlist the perfect office based on our needs. Smooth experience end-to-end.',
    rating: 5,
    avatar: '/images/2.jpeg',
  },
  {
    id: 't3',
    name: 'Abhinav Jain',
    role: 'Founder',
    company: 'Shop101',
    text:
      'We were in urgent need of flex space and they delivered the perfect option very quickly. Great communication and support.',
    rating: 5,
    avatar: '/images/3.jpeg',
  },
  {
    id: 't4',
    name: 'Priya Mehta',
    role: 'Operations Head',
    company: 'Northbay',
    text:
      'Loved the curated options and transparent process. Saved us time and got a better deal than expected.',
    rating: 5,
    avatar: '/images/4.jpeg',
  },
  {
    id: 't5',
    name: 'Rohit Shah',
    role: 'VP, Growth',
    company: 'Credence',
    text:
      'Professional, fast and reliable. Highly recommend for managed and coworking needs across Mumbai.',
    rating: 5,
    avatar: '/images/5.jpeg',
  },
  {
    id: 't6',
    name: 'Nikita Rao',
    role: 'People Lead',
    company: 'PixelSense',
    text:
      'The team understood our requirements and found a flexible solution within budget. Great experience.',
    rating: 5,
    avatar: '/images/6.jpeg',
  },
  {
    id: 't7',
    name: 'Kunal Verma',
    role: 'Director',
    company: 'Finlite',
    text:
      'Excellent support and a premium set of spaces to choose from. Would work with them again.',
    rating: 5,
    avatar: '/images/7.jpeg',
  },
  {
    id: 't8',
    name: 'Ananya Gupta',
    role: 'Founder',
    company: 'Studio Eight',
    text:
      'From shortlist to closure, the process was seamless. The new space is perfect for our team.',
    rating: 5,
    avatar: '/images/8.jpeg',
  },
];

export default function Testimonials() {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-[1600px] mx-auto px-4 xl:px-8 2xl:px-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
            Our Clients <span className="bg-gradient-to-r from-orange-400 via-pink-400 to-orange-500 bg-clip-text text-transparent">Speak</span> for Us
          </h2>
        </div>

        <div className="relative">
          <button
            aria-label="Previous"
            onClick={() => scrollRef.current?.scrollBy({ left: -520, behavior: 'smooth' })}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg border border-gray-200 w-10 h-10 rounded-full flex items-center justify-center hover:scale-105 transition"
          >
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            aria-label="Next"
            onClick={() => scrollRef.current?.scrollBy({ left: 520, behavior: 'smooth' })}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg border border-gray-200 w-10 h-10 rounded-full flex items-center justify-center hover:scale-105 transition"
          >
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div ref={scrollRef} className="flex gap-8 overflow-x-auto px-12 pb-2 snap-x snap-mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {testimonials.map((t) => (
              <div key={t.id} className="group snap-start min-w-[480px] w-[480px] min-h-[320px] bg-white rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-gray-100 p-8 transform transition-all duration-300 hover:scale-105 hover:shadow-[0_16px_40px_rgba(0,0,0,0.12)]">
                <div className="flex items-center gap-6 mb-6">
                  <img src={t.avatar} alt={t.name} className="w-24 h-24 rounded-full object-cover border-2 border-white shadow group-hover:scale-105 transition-transform" />
                  <div>
                    <div className="font-extrabold text-gray-900 text-2xl">{t.name}</div>
                    <div className="text-black text-base">{t.role}</div>
                    <div className="text-orange-500 text-sm font-semibold">{t.company}</div>
                  </div>
                </div>
                <div className="flex items-center text-yellow-400 mb-5">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <svg key={i} className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-black leading-relaxed text-lg">{t.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


