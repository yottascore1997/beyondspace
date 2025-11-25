import { useEffect, useMemo, useState } from 'react';

const coworkingBrands = [
  { name: 'Connect', src: '/images/connect.png' },
  { name: 'Smartworks', src: '/images/smartworks.png' },
  { name: 'Work Avenue', src: '/images/workavenue.png' },
  { name: 'Corporate Edge', src: '/images/corporateedge.png' },
  { name: 'WeWork', src: '/images/wework.png' },
  { name: 'Awfis', src: '/images/awfis.png' },
  { name: 'Innov8', src: '/images/innov8.png' },
  { name: '91springboard', src: '/images/91springboard.png' },
  { name: 'Table Space', src: '/images/tablespace.png' },
  { name: 'Cowrks', src: '/images/cowrks.png' },
  { name: 'BHIVE', src: '/images/Bhive.png' },
];

export default function FeaturedCoworking() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const brandsPerSlide = 10;
  const slides = useMemo(() => {
    const chunks: typeof coworkingBrands[] = [];
    for (let i = 0; i < coworkingBrands.length; i += brandsPerSlide) {
      chunks.push(coworkingBrands.slice(i, i + brandsPerSlide));
    }
    return chunks;
  }, []);
  const totalSlides = slides.length;

  useEffect(() => {
    if (currentSlide >= totalSlides) {
      setCurrentSlide(0);
    }
  }, [currentSlide, totalSlides]);

  return (
    <section className="py-8 md:py-10 bg-white overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="relative text-center mb-6 md:mb-8">
          <h2 className="relative inline-block text-2xl md:text-3xl font-bold text-slate-900">
            <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
              Trusted Partners
            </span>{' '}
            <span className="text-slate-900">&amp;</span>{' '}
            <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
              Premier Brands
            </span>
          </h2>
          <span className="mt-2 md:mt-3 block h-0.5 md:h-1 w-16 md:w-20 mx-auto rounded-full bg-blue-500" />
        </div>

        <div className="relative px-6 md:px-10 lg:px-12">
          {totalSlides > 1 && (
            <>
              <div className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10">
                <button
                  type="button"
                  onClick={() =>
                    setCurrentSlide(prev => (prev - 1 + totalSlides) % totalSlides)
                  }
                  aria-label="Previous partners"
                  className="h-10 w-10 md:h-12 md:w-12 flex items-center justify-center rounded-full bg-gradient-to-br from-orange-400 via-pink-500 to-rose-500 text-white shadow-lg transition hover:scale-105"
                >
                  <svg className="h-5 w-5 md:h-6 md:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              </div>
              <div className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10">
                <button
                  type="button"
                  onClick={() =>
                    setCurrentSlide(prev => (prev + 1) % totalSlides)
                  }
                  aria-label="Next partners"
                  className="h-10 w-10 md:h-12 md:w-12 flex items-center justify-center rounded-full bg-gradient-to-br from-orange-400 via-pink-500 to-rose-500 text-white shadow-lg transition hover:scale-105"
                >
                  <svg className="h-5 w-5 md:h-6 md:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </>
          )}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {slides.map((group, slideIndex) => (
                <div
                  key={`brand-slide-${slideIndex}`}
                  className="w-full flex-shrink-0 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 md:grid-rows-2 gap-4 md:gap-5 items-center justify-items-center"
                >
                  {group.map((brand) => {
                    const lowerName = brand.name.toLowerCase();
                    const isConnect = lowerName === 'connect';
                    const isSmartworks = lowerName === 'smartworks';
                    const isWorkAvenue = lowerName === 'work avenue';
                    const isWeWork = lowerName === 'wework';
                    const isSpringboard = lowerName === '91springboard';
                    const imageClasses = isConnect
                      ? 'max-h-12 md:max-h-16'
                      : isSmartworks
                        ? 'max-h-6 md:max-h-8'
                        : isWorkAvenue
                          ? 'max-h-20 md:max-h-24'
                          : isWeWork
                            ? 'max-h-24 md:max-h-28'
                            : isSpringboard
                              ? 'max-h-16 md:max-h-20'
                        : 'max-h-10';

                    return (
                      <div
                        key={brand.name}
                        className="flex h-16 md:h-20 w-full max-w-[160px] md:max-w-[180px] items-center justify-center rounded-xl md:rounded-2xl border border-slate-200 bg-white/90 px-2 md:px-3 py-3 md:py-4 shadow-sm transition-transform hover:-translate-y-1 overflow-hidden"
                      >
                        <img
                          src={brand.src}
                          alt={brand.name}
                          className={`${imageClasses} max-w-full max-h-full object-contain`}
                          loading="lazy"
                        />
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
          {totalSlides > 1 && (
            <div className="mt-4 md:mt-5 flex justify-center gap-2">
              {slides.map((_, index) => (
                <button
                  key={`brand-dot-${index}`}
                  type="button"
                  onClick={() => setCurrentSlide(index)}
                  className={`h-2 w-2 md:h-2.5 md:w-2.5 rounded-full transition ${
                    currentSlide === index ? 'bg-blue-500' : 'bg-blue-200'
                  }`}
                  aria-label={`Go to brand slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

