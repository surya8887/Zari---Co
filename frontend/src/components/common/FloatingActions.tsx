
import { MessageSquare, Phone } from 'lucide-react';

const FloatingActions = () => {
  return (
    <div className="fixed bottom-8 right-8 flex flex-col gap-4 z-50">
      {/* WhatsApp Link Icon */}
      <a 
        href="#" 
        className="w-12 h-12 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300"
        title="WhatsApp Us"
      >
        <Phone className="w-6 h-6 fill-current" />
      </a>

      {/* Chat Icon */}
      <button 
        className="w-12 h-12 bg-[#00A884] text-white rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300"
        title="Live Chat"
      >
        <MessageSquare className="w-6 h-6 fill-current" />
      </button>
    </div>
  );
};

export default FloatingActions;
