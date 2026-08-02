
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

const FloatingActions = () => {
  return (
    <div className="fixed bottom-5 right-5 sm:bottom-8 sm:right-8 flex flex-col gap-3.5 z-50">
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
