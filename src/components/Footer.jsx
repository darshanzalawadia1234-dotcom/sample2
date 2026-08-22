import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-[var(--runway-navy)] text-[var(--warm-paper)] pt-20 pb-10 border-t border-[var(--warm-paper)]/10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-20">
          <div>
            <h5 className="font-mono text-xs text-[var(--compass-brass)] tracking-widest uppercase mb-6">Product</h5>
            <ul className="space-y-4 text-sm text-[var(--warm-paper)]/60">
              <li><a href="#" className="hover:text-[var(--coral)] transition-colors">Trip Planner</a></li>
              <li><a href="#" className="hover:text-[var(--coral)] transition-colors">Destinations</a></li>
              <li><a href="#" className="hover:text-[var(--coral)] transition-colors">Flight Tracker</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-mono text-xs text-[var(--compass-brass)] tracking-widest uppercase mb-6">Company</h5>
            <ul className="space-y-4 text-sm text-[var(--warm-paper)]/60">
              <li><a href="#" className="hover:text-[var(--coral)] transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-[var(--coral)] transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-[var(--coral)] transition-colors">Press</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-mono text-xs text-[var(--compass-brass)] tracking-widest uppercase mb-6">Support</h5>
            <ul className="space-y-4 text-sm text-[var(--warm-paper)]/60">
              <li><a href="#" className="hover:text-[var(--coral)] transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-[var(--coral)] transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-[var(--coral)] transition-colors">Privacy</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-mono text-xs text-[var(--compass-brass)] tracking-widest uppercase mb-6">Social</h5>
            <ul className="space-y-4 text-sm text-[var(--warm-paper)]/60">
              <li><a href="#" className="hover:text-[var(--coral)] transition-colors">Twitter</a></li>
              <li><a href="#" className="hover:text-[var(--coral)] transition-colors">Instagram</a></li>
              <li><a href="#" className="hover:text-[var(--coral)] transition-colors">GitHub</a></li>
            </ul>
          </div>
        </div>

        <div className="text-center w-full relative">
          <h2 className="font-serif font-black text-[15vw] leading-none text-stroke-coral select-none transition-colors duration-500 hover:text-[var(--coral)] cursor-default">
            GLOBETROTTER
          </h2>
          <div className="mt-8 flex flex-col md:flex-row justify-between items-center text-xs font-mono text-[var(--warm-paper)]/30 tracking-widest uppercase border-t border-[var(--warm-paper)]/10 pt-6">
            <span>© {new Date().getFullYear()} GlobeTrotter Inc.</span>
            <span className="mt-4 md:mt-0">All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
