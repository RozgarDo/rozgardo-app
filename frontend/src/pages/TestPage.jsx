import React from 'react';
import { Rocket } from 'lucide-react';

const TestPage = () => {
  return (
    <div className="relative h-[80vh] flex flex-col items-center justify-center px-4 text-center page-enter">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute top-[60%] -right-[10%] w-[35%] h-[40%] bg-indigo-200/20 rounded-full blur-3xl opacity-50"></div>
      </div>

      <div className="max-w-4xl w-full relative z-10 flex flex-col items-center gap-6">
        
        {/* Main Heading */}
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-800 leading-tight drop-shadow-sm">
          RozgarDo is <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B6B] to-[#FF8E53]">Launching Soon 🚀</span>
        </h1>

        {/* Subtitle */}
        <p className="text-2xl md:text-3xl text-slate-600 font-medium max-w-3xl leading-snug">
          🤝 Connecting workers with <span className="text-primary font-bold">real jobs</span> across India 🇮🇳
        </p>

        {/* Tagline / Badge */}
        <div className="mt-8 relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-[#4facfe] to-[#00f2fe] rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
          <span className="relative inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-slate-800 font-bold text-lg md:text-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100">
            <span className="text-2xl">🛠️</span> A Job Platform for Blue-Collar Workers
          </span>
        </div>

      </div>
    </div>
  );
};

export default TestPage;
