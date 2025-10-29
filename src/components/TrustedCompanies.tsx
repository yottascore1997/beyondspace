'use client';

export default function TrustedCompanies() {
  // Dummy company logos data
  const companies = [
    { name: 'TechCorp', logo: 'https://img.icons8.com/color/96/domain.png' },
    { name: 'InnovateLab', logo: 'https://img.icons8.com/color/96/innovation.png' },
    { name: 'StartupHub', logo: 'https://img.icons8.com/color/96/startup.png' },
    { name: 'DigitalWorks', logo: 'https://img.icons8.com/color/96/digital-nomad.png' },
    { name: 'CloudTech', logo: 'https://img.icons8.com/color/96/cloud.png' },
    { name: 'DataFlow', logo: 'https://img.icons8.com/color/96/data.png' },
    { name: 'WebStudio', logo: 'https://img.icons8.com/color/96/web-design.png' },
    { name: 'AppCraft', logo: 'https://img.icons8.com/color/96/mobile-app.png' },
    { name: 'CodeForge', logo: 'https://img.icons8.com/color/96/code.png' },
    { name: 'PixelWorks', logo: 'https://img.icons8.com/color/96/pixel-star.png' }
  ];

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
                className="flex-shrink-0 mx-8 flex items-center justify-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 group"
              >
                <img
                  src={company.logo}
                  alt={`${company.name} logo`}
                  className="max-h-16 w-auto object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                />
                <span className="ml-3 text-gray-600 font-medium group-hover:text-gray-900 transition-colors">
                  {company.name}
                </span>
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
