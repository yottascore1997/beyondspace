'use client';

export default function TrustedCompanies() {
  // Company logos from trusted folder
  const companyLogos = [
    'c1.png',
    'c2.png',
    'c3.png',
    'c4.jpeg',
    'c5.png',
    'c6.png',
    'c7.png',
    'c8.png',
    'c9.png',
    'c10.png',
    'c11.png',
    'c12.png',
    'c13.png',
    'c14.png',
    'sbmbank.png'
  ];

  const companies = companyLogos.map((fileName, index) => ({
    name: `Company ${index + 1}`,
    logo: `/images/trusted/${fileName}`
  }));

  // Duplicate the array for seamless loop
  const duplicatedCompanies = [...companies, ...companies];

  return (
    <section className="py-16 bg-gradient-to-r from-gray-50 via-white to-gray-50">
      <div className="max-w-[1600px] mx-auto px-4 xl:px-8 2xl:px-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Trusted by{' '}
            <span className="bg-gradient-to-r from-orange-400 via-pink-400 to-orange-500 bg-clip-text text-transparent">
              Leading Companies
            </span>
          </h2>
        </div>

        {/* Marquee Container */}
        <div className="relative overflow-hidden">
          <div className="flex animate-marquee">
            {duplicatedCompanies.map((company, index) => {
              const isLargeLogo = ['c1', 'c6', 'c8'].some((code) => company.logo.includes(code));
              const wrapperClasses = isLargeLogo
                ? 'w-44 h-32 md:w-64 md:h-36 scale-125'
                : 'w-32 h-20 md:w-40 md:h-24';

              return (
                <div
                  key={index}
                  className="flex-shrink-0 mx-8 flex items-center justify-center group"
                >
                  <div className={`${wrapperClasses} flex items-center justify-center`}>
                    <img
                      src={company.logo}
                      alt={`${company.name} logo`}
                      className="max-w-full max-h-full w-full h-full object-contain transition-all duration-300 group-hover:scale-110"
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
      
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
