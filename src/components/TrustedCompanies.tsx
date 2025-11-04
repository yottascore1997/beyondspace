'use client';

export default function TrustedCompanies() {
  // Company logos from trusted folder
  const companies = Array.from({ length: 15 }, (_, i) => ({
    name: `Company ${i + 1}`,
    logo: `/images/trusted/c${i + 1}.jpeg`
  }));

  // Duplicate the array for seamless loop
  const duplicatedCompanies = [...companies, ...companies];

  return (
    <section className="py-16 bg-gradient-to-r from-gray-50 via-white to-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Trusted by{' '}
            <span className="text-orange-400">
              Leading Companies
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Over 500+ companies trust Beyond Estates for their office space
          </p>
        </div>

        {/* Marquee Container */}
        <div className="relative overflow-hidden">
          <div className="flex animate-marquee">
            {duplicatedCompanies.map((company, index) => (
              <div
                key={index}
                className="flex-shrink-0 mx-8 flex items-center justify-center group"
              >
                <div className="w-32 h-20 md:w-40 md:h-24 flex items-center justify-center">
                  <img
                    src={company.logo}
                    alt={`${company.name} logo`}
                    className="max-w-full max-h-full w-full h-full object-contain transition-all duration-300 opacity-80 group-hover:opacity-100 group-hover:scale-110"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              </div>
            ))}
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
