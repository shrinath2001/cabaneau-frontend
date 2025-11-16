import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className="bg-[#2B2B2B] text-white m-2 md:m-5">
      <div className="max-w-[1920px] mx-auto px-4 md:px-8 lg:px-20 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-8 lg:gap-6">
          {/* Column 1: Brand */}
          <div className="md:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Image src="/assets/Group 1.png" alt="Cabanéau Logo" width={205} height={35} className="w-auto h-auto max-w-full" />
            </div>
            <p className="text-sm font-raleway leading-relaxed text-gray-300 max-w-[354px]">
              Luxury Cabines with private wellness.<br />
              Eat, sleep & relax above the trees in<br />
              Eupen, Belgium.
            </p>
          </div>

          {/* Column 2: Our Cabins */}
          <div>
            <h3 className="font-jost font-medium text-base mb-4 text-[#F0E8C6]">Our Cabins</h3>
            <ul className="space-y-2 font-raleway text-sm text-gray-300">
              <li><Link href="/cabins/1" className="hover:text-white transition">Cabin 1</Link></li>
              <li><Link href="/cabins/2" className="hover:text-white transition">Cabin 2</Link></li>
              <li><Link href="/cabins/3" className="hover:text-white transition">Cabin 3</Link></li>
              <li><Link href="/cabins/4" className="hover:text-white transition">Cabin 4</Link></li>
              <li><Link href="/cabins/5" className="hover:text-white transition">Cabin 5</Link></li>
              <li><Link href="/cabins/6" className="hover:text-white transition">Cabin 6</Link></li>
            </ul>
          </div>

          {/* Column 3: Region & Services */}
          <div>
            <h3 className="font-jost font-medium text-base mb-4 text-[#F0E8C6]">Region & Services</h3>
            <ul className="space-y-2 font-raleway text-sm text-gray-300">
              <li><Link href="/services/food" className="hover:text-white transition">Food & Drink Service</Link></li>
              <li><Link href="/activities" className="hover:text-white transition">Activities</Link></li>
              <li><Link href="/services/massage" className="hover:text-white transition">Massage</Link></li>
              <li><Link href="/services/restaurants" className="hover:text-white transition">Restaurants</Link></li>
            </ul>
          </div>

          {/* Column 4: SEO Links */}
          <div>
            <h3 className="font-jost font-medium text-base mb-4 text-[#F0E8C6]">SEO Links</h3>
            <ul className="space-y-2 font-raleway text-sm text-gray-300">
              <li><Link href="/food-drinks" className="hover:text-white transition">Food & Drinks</Link></li>
              <li><Link href="/massage" className="hover:text-white transition">Massage</Link></li>
              <li><Link href="/hiking" className="hover:text-white transition">Hiking</Link></li>
            </ul>
          </div>

          {/* Column 5: Contact Us */}
          <div>
            <h3 className="font-jost font-medium text-base mb-4 text-[#F0E8C6]">Contact Us</h3>
            <ul className="space-y-3 font-raleway text-sm text-gray-300">
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <a href="tel:+32497556009" className="hover:text-white transition">(+32)497-556-009</a>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <a href="mailto:hello@cabaneau.com" className="hover:text-white transition">hello@cabaneau.com</a>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span>Bettendijkstraat 19A, 4700<br />Eupen - Belgium</span>
              </li>
            </ul>
          </div>

          {/* Column 6: Buttons */}
          <div className="flex flex-col gap-3 md:col-span-2 lg:col-span-1">
            <Link href="/book" className="bg-[#495D4D] text-white w-full md:w-[134px] h-[43px] flex items-center justify-center text-sm font-medium tracking-wider hover:bg-[#3d5a3d] transition whitespace-nowrap">
              BOOK NOW
            </Link>
            <Link href="/gift-voucher" className="bg-[#939D92] text-white w-full md:w-[134px] h-[43px] flex items-center justify-center text-sm font-medium tracking-wider hover:bg-[#7d8d7d] transition whitespace-nowrap">
              GIFT VOUCHER
            </Link>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 md:mt-12 pt-6 border-t border-gray-600 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm font-raleway text-gray-300 text-center md:text-left">Copyright 2025</p>

          <div className="flex items-center gap-4 md:gap-6 flex-wrap justify-center">
            <Link href="/terms" className="text-sm font-raleway text-gray-300 hover:text-white transition">
              Terms & Conditions
            </Link>
            <Link href="/privacy" className="text-sm font-raleway text-gray-300 hover:text-white transition">
              Privacy Policy
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <a href="#" aria-label="Facebook" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-gray-200 transition">
              <svg className="w-4 h-4 text-gray-800" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a href="#" aria-label="Instagram" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-gray-200 transition">
              <svg className="w-4 h-4 text-gray-800" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a href="#" aria-label="YouTube" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-gray-200 transition">
              <svg className="w-4 h-4 text-gray-800" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
            <a href="#" aria-label="TikTok" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-gray-200 transition">
              <svg className="w-4 h-4 text-gray-800" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
