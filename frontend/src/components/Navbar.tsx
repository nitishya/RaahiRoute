import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="glass-nav sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl leading-none">R</span>
            </div>
            <Link href="/" className="text-xl font-bold tracking-tight text-slate-900 font-display">
              Raahi<span className="text-indigo-600">Route</span>
            </Link>
          </div>
          
          <div className="hidden sm:flex items-center space-x-6">
            <Link 
              href="/" 
              className="text-slate-600 hover:text-indigo-600 transition-colors text-sm font-medium"
            >
              My Trips
            </Link>
            <Link 
              href="/explore" 
              className="text-slate-600 hover:text-indigo-600 transition-colors text-sm font-medium"
            >
              Explore
            </Link>
            <button className="bg-slate-900 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
              New Trip
            </button>
          </div>

          <div className="sm:hidden">
             {/* Mobile menu button could go here */}
             <button className="text-slate-600 p-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
             </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
