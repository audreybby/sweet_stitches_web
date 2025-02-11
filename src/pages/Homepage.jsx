// eslint-disable-next-line no-unused-vars
import React from "react";
import bgImage from "../assets/bg.jpg"; 
import aboutImage from "../assets/about.jpg"; 
import Iconsig from "../assets/Instagram.png"
import Footer from "../components/Footer";

const Homepage = () => {
  return (
    <div>
      <section
        id="hero"
        className="min-h-screen w-full flex justify-center items-center bg-cover bg-center relative"
        style={{ backgroundImage: `url(${bgImage})` }}
      >

        <div className="absolute top-0 left-0 w-full h-full bg-pink-500 opacity-20 z-10"></div>

        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-white to-transparent z-15"></div>

        <h2
          className="text-6xl sm:text-8xl md:text-9xl lg:text-9xl xl:text-[10rem] text-white z-20 text-center px-4"
           style={{ fontFamily: "'Quintessential', cursive" }}
            >
          <span className="block sm:inline">Sweet</span>{" "}
          <span className="block sm:inline">Stitches</span>
        </h2>
      </section>

      <section className="bg-white py-16 px-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">

          <div className="w-full md:w-1/2 pr-8 mb-8 md:mb-0">
            <h3 
              className="text-4xl font-bold mb-4 text-[#c87878]"
            style={{ fontFamily: "'Quintessential', cursive" }}
            >
              Every product is made of our love that brings happiness
            </h3>
            <p className="text-base sm:text-lg text-gray-600 mb-8">
              Sweet Stitches, Semarang, Jawa Tengah
            </p>
          </div>

          <div className="hidden md:block w-px bg-gray-300 mx-8 min-h-[200px]"></div>

          <div className="w-full md:w-1/2 pl-8">
            <p className="text-sm sm:text-base text-gray-500 mb-4">
            Sweet Stitches adalah toko unik yang memadukan kelezatan cake handmade dengan keindahan crochet art. Kami menghadirkan kue-kue lezat dan dekoratif, serta produk rajutan berkualitas yang dibuat dengan cinta. Temukan kombinasi manis dari rasa dan kreativitas di Sweet Stitches!
            </p>
           <button className="bg-transparent text-black py-2 px-6 rounded-full mt-4 border-2 border-[#CCE2CB] hover:text-gray-500 hover:bg-[#CCE2CB] transition flex items-center gap-2">
            <a
              href="https://www.instagram.com/bekalin.kamu?igsh=eDc1dTA2dXFpYW0x"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
            <img src={Iconsig} alt="Instagram" className="w-5 h-5" />
              See More
            </a>
            </button>
          </div>
        </div>
      </section>

      <section className="py-0 px-0">
        <div className="flex flex-col md:flex-row">
          <div
            className="w-full md:w-1/2 h-screen bg-cover bg-center"
            style={{ backgroundImage: `url(${aboutImage})`, backgroundPosition: "center" }}
          ></div>

          <div className="w-full md:w-1/2 h-screen bg-[#FEAEA5] p-8 flex items-center justify-center">
            <div>
              <h2 className="text-4xl font-bold mb-4 text-[#873930]"
            style={{ fontFamily: "'Quintessential', cursive" }}
            >
              Welcome to Sweet Stitches</h2>
              <p className="text-sm sm:text-lg text-gray-700">
                Welcome to this creative space where you can learn how to crochet or enhance your skills. This website is packed with tutorials, tips, and inspiration for all skill levels.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer/>
    </div>
  );
};

export default Homepage;
