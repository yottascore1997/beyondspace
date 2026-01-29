'use client';

import { useRef, useEffect, useState } from 'react';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  text: string;
  rating: number;
  avatar: string;
}

export default function Testimonials() {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/testimonials?activeOnly=true');
      if (response.ok) {
        const data = await response.json();
        setTestimonials(data.testimonials || []);
      } else {
        console.error('Failed to fetch testimonials');
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

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

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#a08efe]"></div>
            </div>
          ) : testimonials.length > 0 ? (
            <div ref={scrollRef} className="flex gap-8 overflow-x-auto px-12 pb-2 snap-x snap-mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {testimonials.map((t) => (
                <div key={t.id} className="group snap-start min-w-[480px] w-[480px] min-h-[320px] bg-white rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-gray-100 p-8 transform transition-all duration-300 hover:scale-105 hover:shadow-[0_16px_40px_rgba(0,0,0,0.12)]">
                  <div className="flex items-center gap-6 mb-6">
                    <img 
                      src={t.avatar} 
                      alt={t.name} 
                      className="w-24 h-24 rounded-full object-cover border-2 border-white shadow group-hover:scale-105 transition-transform"
                      onError={(e) => {
                        console.error('Testimonial image load error:', t.avatar, t.name);
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                      onLoad={() => {
                        console.log('Testimonial image loaded:', t.avatar);
                      }}
                    />
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
          ) : (
            <div className="text-center py-20 text-gray-500">
              No testimonials available at the moment.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}


