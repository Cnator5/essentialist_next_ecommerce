// components/Footer.js
'use client'

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaFacebook, FaInstagram, FaTiktok, FaYoutube, FaWhatsapp } from 'react-icons/fa';
import mtnlogo from '/public/assets/mtnlogo.png';
import orange from '/public/assets/orange.png';
import stripe from '/public/assets/stipe.png';
import google_play from '/public/assets/google_play.png';
import app_store from '/public/assets/app_store.jpeg';
import Globe from './Globe';
import { motion } from 'framer-motion';

// Local copy of FloatingPaths (JS) for footer background
function FloatingPaths({ position }) {
  const paths = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${380 - i * 5 * position} -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${152 - i * 5 * position} ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${684 - i * 5 * position} ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    width: 0.5 + i * 0.03,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none opacity-60">
      <svg className="w-full h-full text-slate-950/70 dark:text-white/70" viewBox="0 0 696 316" fill="none">
        <title>Footer Background Paths</title>
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width}
            strokeOpacity={0.08 + path.id * 0.015}
            initial={{ pathLength: 0.3, opacity: 0.5 }}
            animate={{
              pathLength: 1,
              opacity: [0.25, 0.5, 0.25],
              pathOffset: [0, 1, 0],
            }}
            transition={{
              duration: 22 + Math.random() * 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'linear',
            }}
          />
        ))}
      </svg>
    </div>
  );
}

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="relative bg-white text-black font-bold md:font-normal mt-10 overflow-hidden">
      {/* Animated background (behind everything) */}
      <div className="absolute inset-0 -z-10">
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />
      </div>

      {/* Big Globe absolutely at the bottom of the footer */}
      <div
        className="pointer-events-none absolute left-1/2 -translate-x-1/2 w-full flex justify-center z-0"
        style={{ minHeight: 320, bottom: 0 }}
      >
        <div className="relative w-full max-w-[900px] aspect-square opacity-60">
          <Globe className="!static w-full h-full" />
        </div>
      </div>

      <div className="bg-black border-b border-gray-800 relative z-10">
        <div
          className="flex flex-wrap justify-between px-2 sm:px-4 md:px-8"
          style={{ minHeight: 0 }}
        >
          <div className="flex items-center flex-shrink-0 space-x-2 sm:space-x-3 mb-2 sm:mb-0 min-w-[160px] w-[49%] sm:w-auto">
            <div className="min-w-8 sm:min-w-14">
              <svg className="w-8 h-8 sm:w-14 sm:h-14" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 20H45M15 20C15 22.7614 12.7614 25 10 25C7.23858 25 5 22.7614 5 20C5 17.2386 7.23858 15 10 15C12.7614 15 15 17.2386 15 20ZM35 35H10M35 35C35 37.7614 37.2386 40 40 40C42.7614 40 45 37.7614 45 35C45 32.2386 42.7614 30 40 30C37.2386 30 35 32.2386 35 35Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="flex flex-col">
              <h3 className="text-white font-bold text-xs sm:text-base uppercase leading-tight">NATIONWIDE</h3>
              <h3 className="text-white font-bold text-xs sm:text-base uppercase leading-tight">SHIPPING</h3>
              <p className="text-white text-xs sm:text-sm leading-tight">Fast and Reliable</p>
            </div>
          </div>
          <div className="flex items-center flex-shrink-0 space-x-2 sm:space-x-3 mb-2 sm:mb-0 min-w-[160px] w-[49%] sm:w-auto">
            <div className="min-w-8 sm:min-w-14">
              <svg className="w-8 h-8 sm:w-14 sm:h-14" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="10" y="15" width="36" height="26" rx="2" stroke="white" strokeWidth="2"/>
                <path d="M10 25H46" stroke="white" strokeWidth="2"/>
                <path d="M16 32H24" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="flex flex-col">
              <h3 className="text-white font-bold text-xs sm:text-base uppercase leading-tight">ONLINE PAYMENT</h3>
              <p className="text-white text-xs sm:text-sm leading-tight">One hundred percent Secure</p>
            </div>
          </div>
          <div className="flex items-center flex-shrink-0 space-x-2 sm:space-x-3 mb-2 sm:mb-0 min-w-[160px] w-[49%] sm:w-auto">
            <div className="min-w-8 sm:min-w-14">
              <svg className="w-8 h-8 sm:w-14 sm:h-14" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="28" cy="20" r="8" stroke="white" strokeWidth="2"/>
                <path d="M14 40V38C14 31.373 20.373 26 28 26C35.627 26 42 31.373 42 38V40" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="flex flex-col">
              <h3 className="text-white font-bold text-xs sm:text-base uppercase leading-tight">CUSTOMER SUPPORT</h3>
              <p className="text-white text-xs sm:text-sm leading-tight">Friendly and Courteous</p>
            </div>
          </div>
          <div className="flex items-center flex-shrink-0 space-x-2 sm:space-x-3 min-w-[160px] w-[49%] sm:w-auto">
            <div className="min-w-8 sm:min-w-14">
              <svg className="w-8 h-8 sm:w-14 sm:h-14" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="28" cy="28" r="16" stroke="white" strokeWidth="2"/>
                <path d="M28 18V28L35 32" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="flex flex-col">
              <h3 className="text-white font-bold text-xs sm:text-base uppercase leading-tight">GREAT PRICES</h3>
              <p className="text-white text-xs sm:text-sm leading-tight">Value For Money</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-2 sm:px-4 md:px-8 py-6 sm:py-10 md:py-12 text-black relative z-10">
        <div className="flex flex-wrap md:grid md:grid-cols-4 gap-4 sm:gap-6 md:gap-10">
          <div className="flex-[1_1_220px] min-w-[180px] max-w-full mb-4 md:mb-0">
            <h2 className="text-black uppercase font-bold mb-4 sm:mb-6 relative after:content-[''] after:absolute after:left-0 after:-bottom-3 after:h-0.5 after:w-10 sm:after:w-12 after:bg-gray-700 text-base sm:text-lg">ABOUT US</h2>
            <p className="text-black font-bold md:font-normal mb-4 sm:mb-6 text-xs sm:text-base leading-snug">
              EssentialistMakeupStore is an online retailer that provides one-stop shopping for women&apos;s day-to-day essentials. Established in 2025, we are the best and only niche skincare, makeup, and lifestyle store in Cameroon wholly targeted at providing an unmatched range of products for women.
            </p>
            <div className="space-y-2 font-bold text-xs sm:text-sm">
              <div className="flex items-center text-black">
                <span className="inline-block mr-2">✉</span>
                <Link href="mailto:esssmakeup@gmail.com" className="hover:text-pink-500 transition duration-300 text-black">esssmakeup@gmail.com</Link>
              </div>
              <div className="flex items-center text-black">
                <span className="inline-block mr-2">📱</span>
                <span>Phone: +237 655 22 55 69</span>
              </div>
              <div className="flex items-center text-black">
                <span className="inline-block mr-2">🏢</span>
                <span>Office opening hours - Monday to Friday 9am - 5:30pm</span>
              </div>
            </div>
          </div>

          <div className="flex-[1_1_180px] min-w-[150px] max-w-full mb-4 md:mb-0">
            <h2 className="text-black uppercase font-bold mb-4 sm:mb-6 relative after:content-[''] after:absolute after:left-0 after:-bottom-3 after:h-0.5 after:w-10 sm:after:w-12 after:bg-gray-700 text-base sm:text-lg">QUICK NAVIGATION</h2>
            <ul className="block space-y-2 sm:space-y-3 mb-3 sm:mb-5 text-xs sm:text-base">
              <li><Link href="#" className="text-black font-bold md:font-normal hover:text-pink-500 transition duration-300">How To Shop</Link></li>
              <li><Link href="/cart" className="text-black font-bold md:font-normal hover:text-pink-500 transition duration-300">Payments</Link></li>
              <li><Link href="#" className="text-black font-bold md:font-normal hover:text-pink-500 transition duration-300">Shipping</Link></li>
              <li><Link href="#" className="text-black font-bold md:font-normal hover:text-pink-500 transition duration-300">Returns Policy</Link></li>
              <li><Link href="#" className="text-black font-bold md:font-normal hover:text-pink-500 transition duration-300">Terms and Conditions</Link></li>
              <li><Link href="#" className="text-black font-bold md:font-normal hover:text-pink-500 transition duration-300">Frequently Asked Questions</Link></li>
            </ul>
            <div>
              <h3 className="text-black font-bold mb-2 sm:mb-3 text-xs sm:text-base">Payment Methods:</h3>
              <div className="flex flex-row items-center flex-wrap gap-2">
                <Image src={orange} alt="Orange logo" className="w-8 sm:w-12 md:w-16 h-6 sm:h-10 object-contain" width={48} height={28} priority />
                <Image src={mtnlogo} alt="MTN logo" className="w-8 sm:w-12 md:w-16 h-6 sm:h-10 object-contain" width={48} height={28} priority />
                <Image src={stripe} alt="Stripe logo" className="w-10 sm:w-14 md:w-20 h-6 sm:h-10 object-contain" width={56} height={28} priority />
              </div>
            </div>
          </div>

          <div className="flex-[1_1_180px] min-w-[150px] max-w-full mb-4 md:mb-0">
            <h2 className="text-black uppercase font-bold mb-4 sm:mb-6 relative after:content-[''] after:absolute after:left-0 after:-bottom-3 after:h-0.5 after:w-10 sm:after:w-12 after:bg-gray-700 text-base sm:text-lg">USEFUL LINKS</h2>
            <ul className="block space-y-2 sm:space-y-3 mb-3 sm:mb-5 text-xs sm:text-base">
              <li><Link href="#" className="text-black font-bold md:font-normal hover:text-pink-500 transition duration-300">Profile</Link></li>
              <li><Link href="#" className="text-black font-bold md:font-normal hover:text-pink-500 transition duration-300">Cart</Link></li>
              <li><Link href="#" className="text-black font-bold md:font-normal hover:text-pink-500 transition duration-300">My Basket</Link></li>
              <li><Link href="#" className="text-black font-bold md:font-normal hover:text-pink-500 transition duration-300">Returns Policy</Link></li>
              <li><Link href="#" className="text-black font-bold md:font-normal hover:text-pink-500 transition duration-300">Register</Link></li>
              <li><Link href="#" className="text-black font-bold md:font-normal hover:text-pink-500 transition duration-300">Blog</Link></li>
            </ul>
            <div>
              <h3 className="text-black font-bold mb-2 sm:mb-3 text-xs sm:text-base">Stay Connected:</h3>
              <div className="flex flex-row items-center flex-wrap gap-2">
                <Link href="https://www.facebook.com/Essentialistmakeupstore" target="_blank" rel="noopener noreferrer" className="bg-blue-600 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center hover:opacity-90 transition duration-300">
                  <FaFacebook size={18} color="white" />
                </Link>
                <Link href="https://www.instagram.com/Essentialistmakeupstore" target="_blank" rel="noopener noreferrer" className="bg-black w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center hover:opacity-90 transition duration-300 border border-white">
                  <FaInstagram size={18} color="white" />
                </Link>
                <Link href="https://www.youtube.com/Essentialistmakeupstore" target="_blank" rel="noopener noreferrer" className="bg-rose-600 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center hover:opacity-90 transition duration-300">
                  <FaYoutube size={18} color="white" />
                </Link>
                {/* <Link href="https://www.whatsapp.com/Essentialistmakeupstore" target="_blank" rel="noopener noreferrer" className="bg-green-600 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center hover:opacity-90 transition duration-300">
                  <FaWhatsapp size={18} color="white" />
                </Link> */}
                <Link href="https://www.tiktok.com/@essentialistmakeupstore" target="_blank" rel="noopener noreferrer" className="bg-black w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center hover:opacity-90 transition duration-300">
                  <FaTiktok size={18} color="white" />
                </Link>
              </div>
            </div>
          </div>

          <div className="flex-[1_1_200px] min-w-[170px] max-w-full">
            <h2 className="text-black uppercase font-bold mb-3 sm:mb-4 relative after:content-[''] after:absolute after:left-0 after:-bottom-3 after:h-0.5 after:w-10 sm:after:w-12 after:bg-gray-700 text-base sm:text-lg">DOWNLOAD OUR APP</h2>
            <p className="text-black mb-2 sm:mb-4 font-bold md:font-normal text-xs sm:text-base">Download our app for the best shopping experience.</p>
            <div className="flex flex-row items-center flex-wrap gap-2 sm:gap-4 mb-4 sm:mb-6">
              <Link href="https://play.google.com" target="_blank" rel="noopener noreferrer" className="flex-1 min-w-[90px] max-w-[140px]">
                <Image
                  src={google_play}
                  alt="Google Play"
                  className="w-full h-10 sm:h-16 md:h-20 object-contain rounded-lg shadow-lg transition-transform duration-200 hover:scale-105"
                  width={120}
                  height={60}
                  priority
                />
              </Link>
              <Link href="https://apple.com/app-store" target="_blank" rel="noopener noreferrer" className="flex-1 min-w-[90px] max-w-[140px]">
                <Image
                  src={app_store}
                  alt="App Store"
                  className="w-full h-10 sm:h-16 md:h-20 object-contain rounded-lg shadow-lg transition-transform duration-200 hover:scale-105"
                  width={120}
                  height={60}
                  priority
                />
              </Link>
            </div>
            <h2 className="text-black uppercase font-bold mb-2 sm:mb-4 text-xs sm:text-base">JOIN NEWSLETTER!</h2>
            <div className="flex mb-2 sm:mb-4">
              <input
                type="email"
                placeholder="Your email address"
                className="py-1.5 sm:py-2.5 px-2 sm:px-4 w-full rounded-l bg-white text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 transition duration-300 text-xs sm:text-base"
              />
              <button className="bg-pink-400 flex text-white w-auto px-3 sm:px-5 py-1 sm:py-1.5 rounded-r font-bold border border-white hover:bg-gray-900 transition duration-300 text-xs sm:text-base">
                Sign Up
              </button>
            </div>
            <p className="text-black text-xs sm:text-sm font-bold md:font-normal">
              Is there a product you cannot find on our website? Do tell us <Link href="/contact" className="text-pink-500 hover:underline">here!</Link>
            </p>
          </div>
        </div>

        <div className="mt-6 sm:mt-10 text-center text-xs sm:text-sm text-gray-700">
          &copy; {currentYear} EssentialistMakeupStore. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;