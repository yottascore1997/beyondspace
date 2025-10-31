'use client';

export default function Benefits() {
  const items = [
    {
      title: 'Zero brokerage fee',
      desc:
        'Direct access to the best office spaces and property owners with transparent pricing and zero brokerage fee.',
      iconColor: 'bg-blue-400',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 1.343-3 3 0 2 3 5 3 5s3-3 3-5c0-1.657-1.343-3-3-3z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2a10 10 0 100 20 10 10 0 000-20z" />
        </svg>
      ),
    },
    {
      title: 'Quick turnaround time',
      desc:
        'Experience swift and effective solutions — from shortlisting to onboarding in record time.',
      iconColor: 'bg-purple-500',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
        </svg>
      ),
    },
    {
      title: 'Your own office consultant',
      desc:
        'One-on-one support to find the right property, finalize terms and ensure smooth onboarding.',
      iconColor: 'bg-red-500',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 10-6 0 3 3 0 006 0z" />
        </svg>
      ),
    },
    {
      title: 'Largest network',
      desc:
        'Verified office spaces across Mumbai&apos;s top micro-markets to match every need and budget.',
      iconColor: 'bg-green-500',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7l9-4 9 4-9 4-9-4z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 17l9 4 9-4" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l9 4 9-4" />
        </svg>
      ),
    },
  ];

  return (
    <section className="relative py-16 bg-gradient-to-br from-blue-50 via-blue-100 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-blue-900">
            Why Choose Us?
          </h2>
          <div className="w-16 h-1 bg-orange-500 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Side - Benefit Cards */}
          <div className="space-y-6">
            {items.map((it) => (
              <div
                key={it.title}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-16 h-16 ${it.iconColor} rounded-xl text-white flex items-center justify-center flex-shrink-0`}>
                    {it.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{it.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{it.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Side - Image */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden border-r-8 border-b-8 border-blue-400 shadow-2xl">
              <img
                src="/images/mumbai5.jpg"
                alt="Premium office space"
                className="w-full h-[600px] object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
