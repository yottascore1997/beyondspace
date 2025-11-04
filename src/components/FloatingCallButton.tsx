'use client';

import { useState } from 'react';
import ShareRequirementsModal from './ShareRequirementsModal';

export default function FloatingCallButton() {
  const [isShareModalOpen, setShareModalOpen] = useState(false);

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(30px) scale(0.92);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
        `
      }} />
      <div className="fixed bottom-6 right-6 z-50 group">
        <style jsx>{`
          /* 20s cycle: starting at each cycle shake for ~6s then stay still */
          @keyframes shake20s {
            0%, 100% { transform: translateX(0); }
            1% { transform: translateX(-3px); }
            2% { transform: translateX(3px); }
            3% { transform: translateX(-3px); }
            4% { transform: translateX(3px); }
            5% { transform: translateX(-2px); }
            6% { transform: translateX(2px); }
            7% { transform: translateX(-1px); }
            8% { transform: translateX(1px); }
            9% { transform: translateX(-3px); }
            10% { transform: translateX(3px); }
            11% { transform: translateX(-3px); }
            12% { transform: translateX(3px); }
            13% { transform: translateX(-2px); }
            14% { transform: translateX(2px); }
            15% { transform: translateX(-1px); }
            16% { transform: translateX(1px); }
            17% { transform: translateX(-1px); }
            18% { transform: translateX(1px); }
            19% { transform: translateX(0); }
            /* Idle remainder (~6s burst then rest of cycle) */
          }
          .shake-animation {
            animation: shake20s 20s ease-in-out infinite;
          }
        `}</style>
        
        {/* Glowing effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full blur-lg opacity-75 group-hover:opacity-100 animate-pulse"></div>
        
        {/* Main button */}
        <button
          onClick={() => setShareModalOpen(true)}
          className="relative w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-2xl shadow-blue-500/50 group-hover:scale-110 transition-all duration-300 border-2 border-blue-300/50 shake-animation cursor-pointer"
        >
          <svg className="w-8 h-8 text-white group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
          </svg>
        </button>
        
        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
          Share Your Requirement
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
        </div>
      </div>

      <ShareRequirementsModal 
        isOpen={isShareModalOpen} 
        onClose={() => setShareModalOpen(false)} 
      />
    </>
  );
}
