/**
 * v0 by Vercel.
 * @see https://v0.dev/t/T9EguR8m6Jv
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import React from 'react';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-[#1A202C] to-[#6B46C1]">
      <div className="container flex items-center justify-between px-4 md:px-6 py-4">
        <a href="#" className="flex items-center gap-2 font-bold">
          <OrbitIcon className="h-6 w-6 text-white" />
          <span className="text-lg text-white">OrbiFusion</span>
        </a>
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex items-center gap-6">
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
            href="https://calendly.com/your-calendly-link"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center justify-center px-6 py-2 border border-transparent text-sm font-medium rounded-full text-[#6B46C1] bg-white hover:bg-[#f0f0f0] transition-colors duration-300 ease-in-out shadow-md hover:shadow-lg"
          >
            Book a Call
          </a>
          <button className="md:hidden bg-white text-[#6B46C1] p-2 rounded-md hover:bg-[#f0f0f0] transition-colors duration-300 ease-in-out">
            <MenuIcon className="h-6 w-6" />
            <span className="sr-only">Toggle navigation menu</span>
          </button>
        </div>
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