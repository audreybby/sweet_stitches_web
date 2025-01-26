// eslint-disable-next-line no-unused-vars
import React from "react";
import bgImage from "../assets/bg.jpg"; // Pastikan path ke file benar
import aboutImage from "../assets/about.jpg"; // Tambahkan jika menggunakan gambar lokal
import Footer from "../components/Footer";

const Homepage = () => {
  return (
    <div>
      {/* Hero Section */}
      <section
        id="hero"
        className="min-h-screen w-full flex justify-center items-center bg-cover bg-center relative"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        {/* Overlay putih dengan opacity */}
        <div className="absolute top-0 left-0 w-full h-full bg-pink-600 opacity-20 z-10"></div>

        {/* Efek shadow putih dari bawah ke atas */}
        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-white to-transparent z-15"></div>

        {/* Text "Sweet Stitches" */}
        <h2
          className="text-6xl sm:text-8xl md:text-9xl lg:text-9xl xl:text-[10rem] text-white z-20 text-center px-4"
           style={{ fontFamily: "'Quintessential', cursive" }}
            >
          <span className="block sm:inline">Sweet</span>{" "}
          <span className="block sm:inline">Stitches</span>
        </h2>
      </section>

      {/* Text Below Hero with Flex Layout */}
      <section className="bg-white py-16 px-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          {/* Left Side Text */}
          <div className="w-full md:w-1/2 pr-8 mb-8 md:mb-0">
            <h3 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-4">
              Every product is made of our love that brings happiness
            </h3>
            <p className="text-base sm:text-lg text-gray-600 mb-8">
              Sweet Stitches, Semarang, Jawa Tengah
            </p>
          </div>

          {/* Garis Vertikal */}
          <div className="hidden md:block w-px bg-gray-300 mx-8 min-h-[200px]"></div>

          {/* Right Side Text and Button */}
          <div className="w-full md:w-1/2 pl-8">
            <p className="text-sm sm:text-base text-gray-500 mb-4">
            Sweet Stitches adalah toko unik yang memadukan kelezatan cake handmade dengan keindahan crochet art. Kami menghadirkan kue-kue lezat dan dekoratif, serta produk rajutan berkualitas yang dibuat dengan cinta. Temukan kombinasi manis dari rasa dan kreativitas di Sweet Stitches!
            </p>
            <button className="bg-transparent text-black py-2 px-6 rounded-full mt-4 border-2 border-[#CCE2CB] hover:text-gray-500 hover:bg-[#CCE2CB] transition">
              See More
            </button>
          </div>
        </div>
      </section>

      {/* About Section with Full Left Image and Full Right Text */}
      <section className="py-0 px-0">
        <div className="flex flex-col md:flex-row">
          {/* Left Side Image */}
          <div
            className="w-full md:w-1/2 h-screen bg-cover bg-center"
            style={{ backgroundImage: `url(${aboutImage})`, backgroundPosition: "center" }}
          ></div>

          {/* Right Side Text */}
          <div className="w-full md:w-1/2 h-screen bg-[#FEAEA5] p-8 flex items-center justify-center">
            <div>
              <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-4">Welcome to Sweet Stitches</h2>
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