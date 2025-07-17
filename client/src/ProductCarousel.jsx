// client/src/ProductCarousel.jsx
import React from 'react';
import Marquee from 'react-fast-marquee';
import { Link } from 'react-router-dom';
import { productsTop, productsBottom } from './ProductData';

const topMessages = [
  "Limited stocks — grab yours before it’s gone!",
  "Style doesn’t have to break the bank.",
  "Quality that lasts, prices that don’t hurt.",
  "Fast shipping, timeless fashion.",
  "Easy returns, no questions asked.",
  "Trusted by hundreds of happy customers.",
  "Add to cart — future you will thank you.",
];

const bottomMessages = [
  "New drops every week — stay ahead of the curve.",
  "Minimalist. Timeless. Effortless.",
  "Socks or shirts, we don’t miss.",
  "Wear what makes you feel unstoppable.",
  "Smart fits, smarter prices.",
  "No logos. No noise. Just you.",
];

const CarouselRow = ({ products, direction = 'left' }) => (
  <section className="bg-custom-cream py-4 w-full">
    <div className="w-full">
      <Marquee pauseOnHover speed={40} gradient={false} direction={direction}>
        {products.map((prod, i) => {
          const slug = encodeURIComponent(prod.name.toLowerCase().replace(/\s+/g, '-'));
          const productPath = `/products/${prod.type}/${slug}`;
          const imagePath = `/images/products/${prod.type === 'mens' ? 'Mens' : 'Womens'}/${prod.image}`;

          return (
            <div
              key={i}
              className="flex flex-col items-center bg-white mx-4 transform transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-lg"
              style={{
                paddingBottom: '32px',
                minHeight: '420px',
                justifyContent: 'flex-end',
                width: '320px',
              }}
            >
              <Link to={productPath}>
                <div className="flex items-center justify-center w-full" style={{ height: '340px' }}>
                  <img
                    src={imagePath}
                    alt={prod.name}
                    className="object-contain mx-auto transition-transform duration-300 ease-in-out hover:scale-105"
                    style={{ maxHeight: '320px', width: 'auto', maxWidth: '100%' }}
                  />
                </div>
              </Link>

              <Link to={productPath} className="w-full text-center mt-2">
                <div className="text-custom-dark text-sm font-nunito uppercase tracking-widest hover:underline">
                  {prod.name}
                </div>
              </Link>

              <div className="text-custom-dark text-xs font-nunito mt-1 flex items-center justify-center gap-1">
                <span style={{ fontWeight: 'bold', fontSize: '1rem' }}>₱</span>
                {prod.price.toLocaleString()}
              </div>
            </div>
          );
        })}
      </Marquee>
    </div>
  </section>
);

const MessageCarousel = ({ messages, direction = 'left', extraClass = '' }) => (
  <div className={`bg-black py-2 text-white text-sm font-semibold uppercase tracking-widest ${extraClass}`}>
    <Marquee speed={50} gradient={false} direction={direction}>
      {messages.map((msg, idx) => (
        <span key={idx} className="mx-8 whitespace-nowrap">{msg}</span>
      ))}
    </Marquee>
  </div>
);

const ProductCarousel = () => (
  <>
    <MessageCarousel messages={topMessages} direction="right" extraClass="mt-10" />
    <CarouselRow products={productsTop} />
    <MessageCarousel messages={bottomMessages} direction="left" />
    <CarouselRow products={productsBottom} direction="right" />
  </>
);

export default ProductCarousel;
