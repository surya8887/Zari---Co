
import { Phone } from 'lucide-react';



const FloatingActions = () => {
  return (
    <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 flex flex-col gap-2.5 z-50">
      {/* WhatsApp Quick Chat */}
      <a 
        href="https://wa.me/918178028397?text=Hello%20Znira%20%26%20Co!" 
        target="_blank"
        rel="noopener noreferrer"
        className="w-10 h-10 sm:w-11 sm:h-11 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-2xl transform hover:scale-110 active:scale-95 transition-all duration-300 group"
        title="WhatsApp Us (+91 8178028397)"
      >
        <Phone className="w-5 h-5 fill-current group-hover:rotate-12 transition-transform" />
      </a>

      {/* Direct Helpline Call */}
      <a
        href="tel:+918178028397"
        className="w-10 h-10 sm:w-11 sm:h-11 bg-[#8b7355] text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-2xl transform hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer group"
        title="Call Helpline: +91 8178028397"
      >
        <Phone className="w-4 h-4 group-hover:rotate-12 transition-transform" />
      </a>
    </div>
  );
};

export default FloatingActions;
