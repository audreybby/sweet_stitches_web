// eslint-disable-next-line no-unused-vars
import React from 'react';
import whatsappIcon from '../assets/Whatsapp.png'; 

const FloatingWhatsApp = () => {
  const phoneNumber = '6287716272187'; 
  const message = 'Halo, Saya tertarik dengan produk Sweet Stitches!'; 
  const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappURL}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-4 right-6 bg-[#bbffb7] p-4 rounded-full border-2 border-white transition-shadow duration-300 z-50"
      aria-label="Hubungi kami di WhatsApp"
    >
      <img
        src={whatsappIcon} 
        alt="WhatsApp"
        className="w-8 h-8 opacity-90"
      />
    </a>
  );
};

export default FloatingWhatsApp;