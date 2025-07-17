// client/src/About.jsx
import React from 'react';
import Navbar from './Navbar';

const About = () => {
  return (
    <div className="font-poppins text-custom-dark">
      <Navbar alwaysHovered={true} />

      {/* Hero Section */}
      <section
        className="relative h-[60vh] bg-cover bg-center flex items-center justify-center text-white"
        style={{ backgroundImage: "url('/images/about-hero.jpg')" }}
      >
        <div className="bg-black bg-opacity-50 p-6 rounded-lg text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-wide">More Than Just Fabric</h1>
          <p className="mt-2 text-lg">Born in the streets. Built for the bold.</p>
        </div>
      </section>

      {/* Our Story */}
      <section className="max-w-4xl mx-auto p-8">
        <h2 className="text-2xl font-bold mb-4">Our Story</h2>
        <p className="text-gray-700 leading-relaxed">
          Timeless Threads started out as an Instagram storefront — a side hustle turned passion project. But the clunky DMs,
          manual tracking, and order chaos? We said nah. So we built our own platform.
        </p>
        <p className="text-gray-700 mt-4 leading-relaxed">
          From Cebu’s streetwear pulse to your screen, we bring curated drops, seamless shopping, and style that actually says something.
        </p>
      </section>

      {/* Mission & Vision */}
      <section className="bg-custom-cream py-12">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <h2 className="text-2xl font-bold mb-6">Mission & Vision</h2>
          <div className="grid md:grid-cols-2 gap-10 text-left">
            <div>
              <h3 className="font-semibold text-lg mb-2">Our Mission</h3>
              <p className="text-gray-700">
                To create a digital fashion hub where bold design, smart tech, and authentic expression collide.
                We’re here to make shopping smoother, stories louder, and the scene stronger.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Our Vision</h3>
              <p className="text-gray-700">
                A future where style moves fast but meaning lasts. Where every fit is frictionless, and every piece tells a story —
                yours.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="bg-white py-12">
        <div className="max-w-4xl mx-auto px-8">
          <h2 className="text-2xl font-bold mb-4 text-center">What We Stand For</h2>
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <li className="bg-custom-cream p-6 rounded-xl shadow-sm text-center">
              <h3 className="font-bold text-lg mb-2">Authenticity</h3>
              <p className="text-sm text-gray-600">
                No cap. Every drop reflects raw, unfiltered identity.
              </p>
            </li>
            <li className="bg-custom-cream p-6 rounded-xl shadow-sm text-center">
              <h3 className="font-bold text-lg mb-2">Sustainability</h3>
              <p className="text-sm text-gray-600">
                Ethical materials. Mindful practices. Fashion with a conscience.
              </p>
            </li>
            <li className="bg-custom-cream p-6 rounded-xl shadow-sm text-center">
              <h3 className="font-bold text-lg mb-2">Community</h3>
              <p className="text-sm text-gray-600">
                We don’t just sell — we connect. Timeless Threads is powered by people.
              </p>
            </li>
          </ul>
        </div>
      </section>

      {/* Meet the Team */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <h2 className="text-2xl font-bold mb-6">Meet the Team</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-4 bg-custom-cream rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold">Joseph</h3>
              <p className="text-sm text-gray-600">Backend & Infrastructure</p>
              <p className="text-xs mt-1">Architect of logic and database spells 🧙‍♂️</p>
            </div>
            <div className="p-4 bg-custom-cream rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold">Paul</h3>
              <p className="text-sm text-gray-600">Frontend & Design</p>
              <p className="text-xs mt-1">Pixels, polish, and performance 🎨💻</p>
            </div>
            <div className="p-4 bg-custom-cream rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold">Alex</h3>
              <p className="text-sm text-gray-600">Frontend & Backend</p>
              <p className="text-xs mt-1">Full-stack multitasker and system wizard 🧠⚙️</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Join the Movement</h2>
        <p className="mb-6 text-gray-600">Explore our latest collections and wear your identity with pride.</p>
        <a
          href="/products"
          className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-all"
        >
          Shop Now
        </a>
      </section>
    </div>
  );
};

export default About;
