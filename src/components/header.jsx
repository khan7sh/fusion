/**
 * v0 by Vercel.
 * @see https://v0.dev/t/T9EguR8m6Jv
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import React, { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-[#1A202C] to-[#6B46C1]">
      <div className="container flex items-center justify-between px-4 md:px-6 py-4">
        <a href="#" className="flex items-center gap-2 font-bold">
          <OrbitIcon className="h-6 w-6 text-white" />
          <span className="text-lg text-white">OrbiFusion</span>
        </a>
        <div className="flex items-center gap-6">
          <nav className={`md:flex items-center gap-6 hidden`}>
            {[
              { name: 'Home', href: '#home' },
              { name: 'Services', href: '#services' },
              { name: 'Process', href: '#process' },
              { name: 'About Us', href: '#about' },
              { name: 'Contact Us', href: '#contact' }
            ].map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-sm font-medium transition-colors text-white hover:text-[#f0f0f0]"
                data-text={item.name}
              >
                {item.name}
              </a>
            ))}
          </nav>
          <a
            href="https://calendly.com/azam-orbifusion/ai-consultation"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center justify-center px-6 py-2 border border-transparent text-sm font-medium rounded-full text-[#6B46C1] bg-white hover:bg-[#f0f0f0] transition-colors duration-300 ease-in-out shadow-md hover:shadow-lg"
          >
            Book a Call
          </a>
          <button 
            className="md:hidden bg-white text-[#6B46C1] p-2 rounded-md hover:bg-[#f0f0f0] transition-colors duration-300 ease-in-out"
            onClick={toggleMenu}
          >
            <MenuIcon className="h-6 w-6" />
            <span className="sr-only">Toggle navigation menu</span>
          </button>
        </div>
      </div>
      {/* Mobile menu */}
      <div className={`fixed top-0 right-0 bottom-0 w-64 bg-[#1A202C] transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out md:hidden`}>
        <div className="flex justify-end p-4">
          <button onClick={toggleMenu} className="text-white">
            <CloseIcon className="h-6 w-6" />
          </button>
        </div>
        <nav className="flex flex-col items-center gap-6 mt-8">
          {[
            { name: 'Home', href: '#home' },
            { name: 'Services', href: '#services' },
            { name: 'Process', href: '#process' },
            { name: 'About Us', href: '#about' },
            { name: 'Contact Us', href: '#contact' }
          ].map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-sm font-medium transition-colors text-white hover:text-[#f0f0f0]"
              data-text={item.name}
              onClick={toggleMenu}
            >
              {item.name}
            </a>
          ))}
          <a
            href="https://calendly.com/azam-orbifusion/ai-consultation"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center justify-center px-6 py-2 border border-transparent text-sm font-medium rounded-full text-[#6B46C1] bg-white hover:bg-[#f0f0f0] transition-colors duration-300 ease-in-out shadow-md hover:shadow-lg"
            onClick={toggleMenu}
          >
            Book a Call
          </a>
        </nav>
      </div>
    </header>
  )
}

function MenuIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  )
}

function OrbitIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="3" />
      <circle cx="19" cy="5" r="2" />
      <circle cx="5" cy="19" r="2" />
      <path d="M10.4 21.9a10 10 0 0 0 9.941-15.416" />
      <path d="M13.5 2.1a10 10 0 0 0-9.841 15.416" />
    </svg>
  )
}

function CloseIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}