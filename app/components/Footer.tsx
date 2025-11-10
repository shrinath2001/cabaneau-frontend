import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className="bg-[#212121] text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-8">
          {/* Column 1: Logo and text */}
          <div className="col-span-1">
            <Image src="/assets/Group 1.png" alt="Cabaneau Logo" width={150} height={50} />
            <p className="mt-4 text-sm font-heading font-normal">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </div>

          {/* Column 2: Our Cabins */}
          <div>
            <h3 className="font-bold">Our Cabins</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/cabins/1">Cabin 1</Link></li>
              <li><Link href="/cabins/2">Cabin 2</Link></li>
              <li><Link href="/cabins/3">Cabin 3</Link></li>
            </ul>
          </div>

          {/* Column 3: Region & Services */}
          <div>
            <h3 className="font-bold">Region & Services</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/services/food">Food</Link></li>
              <li><Link href="/services/activities">Activities</Link></li>
              <li><Link href="/services/massage">Massage</Link></li>
              <li><Link href="/services/restaurants">Restaurants</Link></li>
            </ul>
          </div>

          {/* Column 4: SEO links */}
          <div>
            <h3 className="font-bold">SEO links</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/seo/food">Food</Link></li>
              <li><Link href="/seo/services">Services</Link></li>
            </ul>
          </div>

          {/* Column 5: Contact us */}
          <div>
            <h3 className="font-bold">Contact us</h3>
            <ul className="mt-4 space-y-2">
              <li><a href="tel:+1234567890">+1 234 567 890</a></li>
              <li><a href="mailto:info@cabaneau.com">info@cabaneau.com</a></li>
              <li>123 Street, City, Country</li>
            </ul>
          </div>

          {/* Column 6: Buttons */}
          <div className="flex flex-col space-y-4">
            <Link href="/book-now" className="bg-customgreen text-white px-4 py-2 text-center">BOOK NOW</Link>
            <Link href="/gift-voucher" className="bg-button1 text-white px-4 py-2 text-center">GIFT VOUCHER</Link>
          </div>
        </div>

        {/* Section 2: Copyright and Social Media */}
        <div className="mt-16 pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          <p className="text-sm order-3 md:order-1 w-full md:w-auto">&copy; 2025 Cabaneau. All rights reserved.</p>
          <div className="flex items-center space-x-4 justify-center order-2 w-full md:w-auto mt-4 md:mt-0">
            <Link href="/terms-conditions">Terms & Conditions</Link>
            <Link href="/privacy-policy">Privacy Policy</Link>
          </div>
          <div className="flex items-center space-x-4 justify-center md:justify-end order-1 md:order-3 w-full md:w-auto mt-4 md:mt-0">
            <a href="#" aria-label="Facebook">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
              </svg>
            </a>
            <a href="#" aria-label="Instagram">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.584-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.011-3.584.069-4.85c.149-3.225 1.664-4.771 4.919-4.919C8.416 2.175 8.796 2.163 12 2.163zm0 1.8a.96.96 0 100-1.92.96.96 0 000 1.92zm-2.407 7.5a2.407 2.407 0 114.814 0 2.407 2.407 0 01-4.814 0zm4.814 0a2.407 2.407 0 11-4.814 0 2.407 2.407 0 014.814 0z" clipRule="evenodd" />
              </svg>
            </a>
            <a href="#" aria-label="YouTube">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0C.897 3.43.25 4.945.25 8.437v7.126c0 3.492.647 5.007 4.135 5.253 3.6.245 11.626.246 15.23 0 3.488-.246 4.135-1.76 4.135-5.253V8.437c0-3.492-.647-5.007-4.135-5.253zM9.75 15.02V6.98l6.5 4.02-6.5 4.02z" clipRule="evenodd" />
              </svg>
            </a>
            <a href="#" aria-label="LinkedIn">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;