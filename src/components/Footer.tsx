import Link from 'next/link';

export default function Footer() {
  const socialLinks = [
    {
      href: 'https://www.linkedin.com/company/beyondspace',
      label: 'LinkedIn',
      iconSrc: 'https://cdn-icons-png.flaticon.com/512/174/174857.png'
    },
    {
      href: 'https://www.instagram.com',
      label: 'Instagram',
      iconSrc: 'https://cdn-icons-png.flaticon.com/512/2111/2111463.png'
    },
    {
      href: 'https://www.facebook.com',
      label: 'Facebook',
      iconSrc: 'https://cdn-icons-png.flaticon.com/512/733/733547.png'
    }
  ];

  return (
    <footer className="relative overflow-hidden text-white">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[#0b1026]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(107,114,255,0.25),_transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(45,212,191,0.25),_transparent_55%)]" />
        <div className="absolute inset-0 opacity-[0.15] bg-[linear-gradient(135deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0)_35%,rgba(255,255,255,0)_100%)]" />
      </div>

      <div className="relative container mx-auto px-4 py-12">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-sm">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 blur-md opacity-75 group-hover:opacity-100 transition-opacity" />
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-white/20 shadow-lg shadow-blue-500/30 group-hover:scale-105 group-hover:rotate-2 transition-all duration-500">
                  <img
                    src="/images/logo.jpeg"
                    alt="Beyond Space Logo"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-400 via-orange-500 to-pink-500 bg-clip-text text-transparent">
                Beyond Space
              </span>
            </Link>
            <p className="text-sm text-slate-200/85 leading-relaxed">
              Premium commercial real estate advisors helping enterprises discover, evaluate and close Grade-A office spaces across Mumbai’s prime business districts.
            </p>
            <div className="mt-5 flex flex-wrap gap-3 text-xs text-slate-200/70">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 backdrop-blur-sm">
                <svg className="w-4 h-4 text-cyan-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                Mumbai, India
              </span>
              <a href="tel:+919820744251" className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 backdrop-blur-sm hover:bg-white/10 transition-colors">
                <svg className="w-4 h-4 text-purple-300" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                +91 98207 44251
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 md:gap-10 text-sm">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/50 mb-3">Explore</p>
              <ul className="space-y-2 text-slate-200/80">
                <li><Link href="/" className="hover:text-[#70f3d1] transition-colors">Home</Link></li>
                <li><Link href="/list-your-space" className="hover:text-[#70f3d1] transition-colors">List Your Space</Link></li>
                <li><Link href="/requirement" className="hover:text-[#70f3d1] transition-colors">Share Requirement</Link></li>
              </ul>
        </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/50 mb-3">Solutions</p>
              <ul className="space-y-2 text-slate-200/80">
                <li><Link href="/category/coworking-space" className="hover:text-[#70f3d1] transition-colors">Coworking</Link></li>
                <li><Link href="/category/managed-office" className="hover:text-[#70f3d1] transition-colors">Managed Offices</Link></li>
                <li><Link href="/category/enterprise-solutions" className="hover:text-[#70f3d1] transition-colors">Enterprise Solutions</Link></li>
              </ul>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/50 mb-3">Contact</p>
              <ul className="space-y-2 text-slate-200/80">
                <li>
                  <a href="mailto:contact@beyondspacework.com" className="hover:text-[#70f3d1] transition-colors">
                    contact@beyondspacework.com
                  </a>
                </li>
              </ul>
              <div className="mt-4 flex items-center gap-2">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full border border-white/15 bg-white flex items-center justify-center hover:border-[#70f3d1] hover:shadow-lg transition-all"
                  >
                    <span className="sr-only">{social.label}</span>
                    <img src={social.iconSrc} alt={social.label} className="w-4 h-4 object-contain" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="w-full max-w-xs rounded-2xl bg-white/10 backdrop-blur-xl p-6 shadow-lg shadow-black/25">
            <p className="text-sm font-semibold text-white">Let&apos;s curate your next workspace</p>
            <p className="mt-2 text-xs text-slate-200/80 leading-relaxed">
              Tell us about your ideal location and team size. Our consultants respond within 24 hours.
            </p>
            <Link
              href="/requirement"
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#8f70ff] via-[#5ea6ff] to-[#4ff1d2] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#8f70ff]/30 hover:shadow-[#4ff1d2]/40 transition-shadow"
            >
              Share Requirements
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-slate-200/70 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Beyond Space. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-[#70f3d1] transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-[#70f3d1] transition-colors">Terms of Use</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

