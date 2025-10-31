const coworkingBrands = [
  { name: 'WeWork', src: '/images/wework.png', width: 220 },
  { name: 'Awfis', src: '/images/awfis.png', width: 120 },
  { name: 'Innov8', src: '/images/innov8.png', width: 120 },
  { name: '91springboard', src: '/images/91springboard.png', width: 160 },
  { name: 'InstaOffice', src: '/images/instaoffice.png', width: 140 },
  { name: 'IndiQube', src: '/images/indiqube.png', width: 150 },
  { name: 'BHIVE', src: '/images/Bhive.png', width: 140 },
];

export default function FeaturedCoworking() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="relative text-center mb-12">
          <span className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow-300/60 blur-xl" />
          <h2 className="relative inline-block text-3xl md:text-4xl font-bold text-slate-900">
            Featured Coworking
          </h2>
          <span className="mt-4 block h-1 w-24 mx-auto rounded-full bg-blue-500" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-8 md:gap-10 items-center justify-items-center">
          {coworkingBrands.map((brand) => (
            <div
              key={brand.name}
              className="flex h-16 w-full items-center justify-center rounded-xl bg-white shadow-sm shadow-slate-200/60 ring-1 ring-slate-100/60 transition-transform hover:-translate-y-1 hover:shadow-md"
            >
              <img
                src={brand.src}
                alt={brand.name}
                className="max-h-12 object-contain"
                style={{ maxWidth: brand.width }}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

