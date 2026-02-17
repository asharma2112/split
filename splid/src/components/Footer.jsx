import React from "react";

const Footer = () => {
  return (
    <footer className="w-full mt-16 border-t border-gray-700 py-6 text-center bg-gradient-to-r from-[#0f172a] to-[#111827]">
      
      <p className="text-gray-400 text-sm tracking-wide">
        Created with ❤️ by 
        <span className="text-orange-500 font-semibold ml-1">
          Amit Sharma
        </span>
      </p>

      <p className="text-gray-500 text-xs mt-2">
        © {new Date().getFullYear()} SplitMate. All rights reserved.
      </p>

    </footer>
  );
};

export default Footer;
