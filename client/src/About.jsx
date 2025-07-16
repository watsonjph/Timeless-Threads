// client/src/About.jsx
import React from 'react';
import Navbar from './Navbar';

const About = () => {
  return (
    <div className="font-poppins text-custom-dark">
      <Navbar alwaysHovered={true} />
      {/* Hero Section */}
      <section className="relative h-[60vh] bg-cover bg-center flex items-center justify-center text-white"
        style={{ backgroundImage: "url('/images/about-hero.jpg')" }}>
        <div className="bg-black bg-opacity-50 p-6 rounded-lg text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-wide">More Than Just Fabric</h1>
          <p className="mt-2 text-lg">Born in the streets. Built for the bold.</p>
        </div>
      </section>

      {/* Our Story */}
      <section className="max-w-4xl mx-auto p-8">
        <h2 className="text-2xl font-bold mb-4">Our Story</h2>
        <p className="text-gray-700 leading-relaxed">
          Timeless Threads was founded with a vision — to create pieces that echo individuality, culture, and edge. 
          From humble beginnings in the heart of Cebu, our collections are crafted for those who dare to stand out while staying grounded in who they are.
        </p>
      </section>

      {/* Mission & Values */}
      <section className="bg-custom-cream py-12">
        <div className="max-w-4xl mx-auto px-8">
          <h2 className="text-2xl font-bold mb-4 text-center">What We Stand For</h2>
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <li className="bg-white p-6 rounded-xl shadow-sm text-center">
              <h3 className="font-bold text-lg mb-2">Authenticity</h3>
              <p className="text-sm text-gray-600">No cap. Every piece we drop reflects raw, unfiltered identity.</p>
            </li>
            <li className="bg-white p-6 rounded-xl shadow-sm text-center">
              <h3 className="font-bold text-lg mb-2">Sustainability</h3>
              <p className="text-sm text-gray-600">We use ethical materials and mindful practices. Fashion without compromise.</p>
            </li>
            <li className="bg-white p-6 rounded-xl shadow-sm text-center">
              <h3 className="font-bold text-lg mb-2">Community</h3>
              <p className="text-sm text-gray-600">Built for and by the local scene. You're not just a buyer — you're part of the movement.</p>
            </li>
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Join the Movement</h2>
        <p className="mb-6 text-gray-600">Explore our latest collections and wear your identity with pride.</p>
        <a href="/products/mens" className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-all">
          Shop Now
        </a>
      </section>
    </div>
  );
};

export default About;
