
import { Heart, Github, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold text-blue-600 mb-2">Campus Mart</h3>
            <p className="text-gray-600 text-sm">
              Connecting students within campus communities for easy buying and selling.
            </p>
          </div>
          
          {/* Quick Links */}
          <div className="text-center">
            <h4 className="font-semibold text-gray-800 mb-3">Quick Links</h4>
            <div className="space-y-2">
              <p className="text-gray-600 text-sm hover:text-blue-600 cursor-pointer">How it Works</p>
              <p className="text-gray-600 text-sm hover:text-blue-600 cursor-pointer">Safety Tips</p>
              <p className="text-gray-600 text-sm hover:text-blue-600 cursor-pointer">Support</p>
            </div>
          </div>
          
          {/* Contact */}
          <div className="text-center md:text-right">
            <h4 className="font-semibold text-gray-800 mb-3">Connect</h4>
            <div className="flex justify-center md:justify-end space-x-4">
              <Mail className="h-5 w-5 text-gray-600 hover:text-blue-600 cursor-pointer" />
              <Github className="h-5 w-5 text-gray-600 hover:text-blue-600 cursor-pointer" />
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-gray-200 mt-8 pt-6 text-center">
          <p className="text-gray-500 text-sm flex items-center justify-center">
            Made with <Heart className="h-4 w-4 text-red-500 mx-1" /> for students
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
