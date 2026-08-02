
import { Phone } from 'lucide-react';

const InstagramIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const FacebookIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    fill="currentColor"
  >
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const FloatingActions = () => {
  return (
    <div className="fixed bottom-5 right-5 sm:bottom-8 sm:right-8 flex flex-col gap-3.5 z-50">
      {/* Facebook Official Page Button */}
      <a 
        href="https://www.facebook.com/share/18ZHtiKtag/"
        target="_blank"
        rel="noopener noreferrer" 
        className="w-11 h-11 sm:w-12 sm:h-12 bg-[#1877F2] text-white rounded-full flex items-center justify-center shadow-xl transform hover:scale-110 active:scale-95 transition-all duration-300"
        title="Follow Znira & Co on Facebook"
      >
        <FacebookIcon className="w-5 h-5 sm:w-6 sm:h-6" />
      </a>

      {/* Instagram Official Profile Button */}
      <a 
        href="https://www.instagram.com/znira.co?igsh=MTBwMGQzdWZ6bzFzYg=="
        target="_blank"
        rel="noopener noreferrer" 
        className="w-11 h-11 sm:w-12 sm:h-12 bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white rounded-full flex items-center justify-center shadow-xl transform hover:scale-110 active:scale-95 transition-all duration-300"
        title="Follow Znira & Co on Instagram"
      >
        <InstagramIcon className="w-5 h-5 sm:w-6 sm:h-6" />
      </a>

      {/* WhatsApp Link Icon */}
      <a 
        href="https://wa.me/918178028397?text=Hello%20Znira%20%26%20Co!" 
        target="_blank"
        rel="noopener noreferrer"
        className="w-11 h-11 sm:w-12 sm:h-12 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-xl transform hover:scale-110 active:scale-95 transition-all duration-300"
        title="WhatsApp Us (+91 8178028397)"
      >
        <Phone className="w-5 h-5 sm:w-6 sm:h-6 fill-current" />
      </a>

      {/* Call Direct Action */}
      <a
        href="tel:+918178028397"
        className="w-11 h-11 sm:w-12 sm:h-12 bg-[#8b7355] text-white rounded-full flex items-center justify-center shadow-xl transform hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer"
        title="Call +91 8178028397"
      >
        <Phone className="w-5 h-5 sm:w-6 sm:h-6" />
      </a>
    </div>
  );
};

export default FloatingActions;
