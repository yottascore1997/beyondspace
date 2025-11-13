import { useEffect, useMemo, useState } from 'react';

const coworkingBrands = [
  { name: 'Connect', src: '/images/connect.png' },
  { name: 'Smartworks', src: '/images/smartworks.png' },
  { name: 'SBM Bank', src: '/images/sbmbank.png' },
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
  const brandsPerSlide = 8;
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
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="relative text-center mb-12">
          <h2 className="relative inline-block text-3xl md:text-4xl font-bold text-slate-900">
            <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
              Trusted Partners
            </span>{' '}
            <span className="text-slate-900">&amp;</span>{' '}
            <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
              Premier Brands
            </span>
          </h2>
          <span className="mt-4 block h-1 w-24 mx-auto rounded-full bg-blue-500" />
        </div>

        <div className="relative">
          {totalSlides > 1 && (
            <>
              <div className="hidden md:flex absolute -left-10 top-1/2 -translate-y-1/2 z-10">
                <button
                  type="button"
                  onClick={() =>
                    setCurrentSlide(prev => (prev - 1 + totalSlides) % totalSlides)
                  }
                  aria-label="Previous partners"
                  className="h-12 w-12 flex items-center justify-center rounded-full bg-gradient-to-br from-orange-400 via-pink-500 to-rose-500 text-white shadow-lg transition hover:scale-105"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              </div>
              <div className="hidden md:flex absolute -right-10 top-1/2 -translate-y-1/2 z-10">
                <button
                  type="button"
                  onClick={() =>
                    setCurrentSlide(prev => (prev + 1) % totalSlides)
                  }
                  aria-label="Next partners"
                  className="h-12 w-12 flex items-center justify-center rounded-full bg-gradient-to-br from-orange-400 via-pink-500 to-rose-500 text-white shadow-lg transition hover:scale-105"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  className="w-full flex-shrink-0 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 items-center justify-items-center"
                >
                  {group.map((brand) => {
                    const lowerName = brand.name.toLowerCase();
                    const isConnect = lowerName === 'connect';
                    const isSmartworks = lowerName === 'smartworks';
                    const isWorkAvenue = lowerName === 'work avenue';
                    const isWeWork = lowerName === 'wework';
                    const isSpringboard = lowerName === '91springboard';
                    const imageClasses = isConnect
                      ? 'max-h-28 md:max-h-32'
                      : isSmartworks
                        ? 'max-h-8 md:max-h-10'
                        : isWorkAvenue
                          ? 'max-h-28 md:max-h-32'
                          : isWeWork
                            ? 'max-h-32 md:max-h-36'
                            : isSpringboard
                              ? 'max-h-20 md:max-h-24'
                        : 'max-h-12';

                    return (
                    <div
                      key={brand.name}
                      className="flex h-20 w-full items-center justify-center transition-transform hover:-translate-y-1"
                    >
                      <img
                        src={brand.src}
                        alt={brand.name}
                        className={`${imageClasses} object-contain`}
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
            <div className="mt-6 flex justify-center gap-2">
              {slides.map((_, index) => (
                <button
                  key={`brand-dot-${index}`}
                  type="button"
                  onClick={() => setCurrentSlide(index)}
                  className={`h-2.5 w-2.5 rounded-full transition ${
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

