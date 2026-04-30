import React from 'react';

export const GlitchOverlay: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden opacity-[0.03]">
      {/* Scanlines */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
      
      {/* Moving noise */}
      <div className="absolute inset-0 animate-pulse bg-repeat" style={{ backgroundImage: 'url(https://grainy-gradients.vercel.app/noise.svg)' }} />
      
      {/* Horizontal glitch lines */}
      <div className="absolute top-0 left-0 w-full h-px bg-white/20 animate-scan-line" />
      
      <style>{`
        @keyframes scan-line {
          from { transform: translateY(-100%); }
          to { transform: translateY(100vh); }
        }
        .animate-scan-line {
          animation: scan-line 8s linear infinite;
        }
      `}</style>
    </div>
  );
};
