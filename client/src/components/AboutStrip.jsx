import React from 'react';
import { Link } from 'react-router-dom';

const AboutStrip = () => {
  return (
    <div className="w-full bg-black text-white text-xs font-medium text-center py-2 z-40">
      <Link to="/about" className="hover:underline tracking-widest uppercase">
        Learn more about Timeless Threads →
      </Link>
    </div>
  );
};

export default AboutStrip;
