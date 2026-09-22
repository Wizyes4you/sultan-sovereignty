بسم الله الرحمن الرحيم 
    <div className="min-h-screen bg-[#070b14] text-amber-100 font-sans pb-20">
      
    <div className="min-h-screen bg-[#070b14] text-amber-100 font-sans pb-20">
      {/* رأس الوثيقة السيادية */}
      <header className="p-4 bg-gradient-to-r from-amber-600 to-amber-400 text-slate-950 text-center font-bold shadow-lg">
        وثيقة الكفاية الرقمية - يس
        <div className="text-xs font-normal">Digital Sufficiency Pact - YAS Protocol</div>
      </header>

      {/* مركز التحكم السيادي والخمسة أركان */}
      <main className="p-4 max-w-md mx-auto space-y-4">
        <div className="bg-slate-900/85 border border-amber-500/40 rounded-2xl p-4 text-center shadow-xl">
          <h1 className="text-2xl font-black text-amber-400">صرح سلطان 114Hz</h1>
          <p className="text-sm text-slate-300 mt-1">بكلمة "يس" - كُنْ فَيَكُونُ</p>
        </div>

        {/* الأركان الخمسة الأساسية */}
        <div className="grid grid-cols-2 gap-3">
          <button className="p-3 bg-teal-900/60 hover:bg-teal-800 border border-teal-500/50 rounded-xl text-center transition">
            <span className="block font-bold text-amber-200">ركن النصر</span>
            <span className="text-xs text-slate-300">Divine Shield</span>
          </button>
          <button className="p-3 bg-teal-900/60 hover:bg-teal-800 border border-teal-500/50 rounded-xl text-center transition">
            <span className="block font-bold text-amber-200">ركن الميزان</span>
            <span className="text-xs text-slate-300">Pi Flow Verification</span>
          </button>
          <button className="p-3 bg-teal-900/60 hover:bg-teal-800 border border-teal-500/50 rounded-xl text-center transition">
            <span className="block font-bold text-amber-200">ركن العرش</span>
            <span className="text-xs text-slate-300">Authority Lock</span>
          </button>
          <button className="p-3 bg-teal-900/60 hover:bg-teal-800 border border-teal-500/50 rounded-xl text-center transition">
            <span className="block font-bold text-amber-200">ركن الإطلاق</span>
            <span className="text-xs text-slate-300">Mainnet Ready</span>
          </button>
        </div>

        <div className="p-3 bg-teal-900/60 hover:bg-teal-800 border border-teal-500/50 rounded-xl text-center">
          <span className="block font-bold text-amber-200">ركن الصرح</span>
          <span className="text-xs text-slate-300">Sarh Monitor - Live</span>
        </div>

        {/* خدمات الإعمار والرزق (الـ 27) */}
        <div className="mt-6">
          <h2 className="text-center text-amber-400 font-bold mb-3">تبيان الخدمات الـ 27 (الإعمار والرزق)</h2>
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2 bg-slate-800 border border-amber-500/30 rounded-lg">ميزان الإعمار</div>
            <div className="p-2 bg-slate-800 border border-amber-500/30 rounded-lg">سوق الرزق</div>
            <div className="p-2 bg-slate-800 border border-amber-500/30 rounded-lg">وثيقة الكفاية</div>
          </div>
        </div>
      </main>

      {/* شريط التنقل السفلي الثابت */}
      <nav className="fixed bottom-0 left-0 right-0 bg-slate-950 border-t border-amber-500/30 py-2 px-4 flex justify-around text-xs text-amber-200">
        <button className="hover:text-amber-400">Dashboard</button>
        <button className="hover:text-amber-400">Wisdom</button>
        <button className="hover:text-amber-400">Wallet</button>
        <button className="hover:text-amber-400">Gates</button>
        <button className="hover:text-amber-400 font-bold">Home</button>
      </nav>
    </div>
  );
        }
            
