// eslint-disable-next-line no-unused-vars
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#CCE2CB] text-gray-500 py-8">
      <div className="overflow-visible mx-auto px-6">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div className="text-left sm:text-left mb-4 sm:mb-0 pl-0 sm:pl-8">
            <h1 className="text-4xl font-bold mb-4 text-gray-500"
            style={{ fontFamily: "'Quintessential', cursive" }}
            >
              Welcome</h1>
            <p className="text-sm sm:text-buase mt-2">Welcome to this creative space where you can learn how to crochet or enhance your skills. This website is packed full of hints, tips, tutorials and inspiration for all skilll evels.</p>
          </div>

          <div className="flex space-x-6">
          </div>
        </div>
      </div>

      {/* Full-Width Divider with Spacing */}
      <div className="border-t border-gray-400 w-full mt-6"></div>

      {/* Bottom Section without Additional Links */}
      <div className="mt-6 max-w-7xl mx-auto px-6 text-center text-sm sm:text-base">
        <p>© {new Date().getFullYear()} Sweet Stitches. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
