import { Outlet, Link } from "react-router-dom";

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <header className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
                BC
              </div>
              <span className="text-lg font-semibold tracking-tight text-white group-hover:text-violet-400 transition-colors">
                ChainCoder
              </span>
            </Link>
            <nav className="flex items-center gap-4">
              <Link
                to="/"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Challenges
              </Link>
              <a
                href="https://docs.soliditylang.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Solidity Docs
              </a>
            </nav>
          </div>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
