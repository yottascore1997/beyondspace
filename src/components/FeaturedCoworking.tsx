const coworkingBrands = [
  { name: 'WeWork', src: '/images/wework.png', width: 320 },
  { name: 'Awfis', src: '/images/awfis.png', width: 220 },
  { name: 'Innov8', src: '/images/innov8.png', width: 220 },
  { name: '91springboard', src: '/images/91springboard.png', width: 260 },
  { name: 'Smartworks', src: '/images/smartworks.png', width: 240 },
  { name: 'Tablespace', src: '/images/tablespace.png', width: 240 },
  { name: 'Cowrks', src: '/images/cowrks.png', width: 240 },
  { name: 'BHIVE', src: '/images/Bhive.png', width: 240 },
];

export default function FeaturedCoworking() {
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

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-10 items-center justify-items-center">
          {coworkingBrands.map((brand) => (
            <div
              key={brand.name}
              className="flex h-16 w-full items-center justify-center rounded-2xl bg-white shadow-md shadow-slate-200/70 ring-1 ring-slate-100/60 transition-transform hover:-translate-y-1 hover:shadow-lg"
            >
              <img
                src={brand.src}
                alt={brand.name}
                className={brand.name === 'WeWork' ? 'max-h-40 object-contain' : brand.name === 'Tablespace' ? 'max-h-24 object-contain' : 'max-h-16 object-contain'}
                style={{ maxWidth: brand.name === 'Awfis' ? brand.width * 0.6 : brand.name === 'WeWork' ? brand.width * 2.5 : brand.name === 'Tablespace' ? brand.width * 1.5 : brand.width * 0.9 }}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

