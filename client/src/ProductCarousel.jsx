// client/src/ProductCarousel.jsx
import React from 'react';
import Marquee from 'react-fast-marquee';
import { Link } from 'react-router-dom';

const productsTop = [
  { name: 'Regular Fit Solid Cotton Shirt', price: 1350, image: '/images/products/landing-page/regfit1.png', type: 'mens' },
  { name: 'Custom Slim Fit Mesh Polo Shirt', price: 1325, image: '/images/products/landing-page/slimfit1.png', type: 'mens' },
  { name: 'Custom Slim Fit Jersey Crewneck T-Shirt', price: 1295, image: '/images/products/landing-page/slimfit2.png', type: 'mens' },
  { name: 'Untucked Oxford Shirt', price: 1800, image: '/images/products/landing-page/oxford1.png', type: 'mens' },
  { name: 'Paris Polo Shirt Regular Fit Stretch', price: 1950, image: '/images/products/landing-page/regfit2.png', type: 'mens' },
  { name: 'Custom Slim Fit Soft Cotton Polo Shirt', price: 1950, image: '/images/products/landing-page/slimfit3.png', type: 'mens' },
  // add more products here
];

const productsBottom = [
  { name: 'Breathable Jersey Tennis Socks', price: 750, image: '/images/products/landing-page/jsocks1.png', type: 'womens' },
  { name: 'Striped Ribbed Sock', price: 450, image: '/images/products/landing-page/ribsock1.png', type: 'womens' },
  { name: 'Corgi Dog Socks Khaki', price: 450, image: '/images/products/landing-page/dogsock1.png', type: 'womens' },
  { name: 'Pug Dog Sock Green', price: 450, image: '/images/products/landing-page/dogsock2.png', type: 'womens' },
  { name: '2-Pack Sport Socks', price: 750, image: '/images/products/landing-page/sportsocks1.png', type: 'womens' },
  // add more products here
];

const CarouselRow = ({ products, direction = 'left' }) => (
  <section className="bg-custom-cream py-4 w-full">
    <div className="w-full">
      <Marquee pauseOnHover speed={40} gradient={false} direction={direction}>
        {products.map((prod, i) => {
          const slug = encodeURIComponent(prod.name.toLowerCase().replace(/\s+/g, '-'));
          const productPath = `/products/${prod.type}/${slug}`;

          return (
            <div key={i} className="flex flex-col items-center bg-white mx-4 transform transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-lg" style={{ paddingBottom: '32px', minHeight: '420px', justifyContent: 'flex-end', width: '320px' }}>

              <Link to={productPath}>
                <div className="flex items-center justify-center w-full" style={{ height: '340px' }}>
                  <img src={prod.image} alt={prod.name} className="object-contain mx-auto transition-transform duration-300 ease-in-out hover:scale-105" style={{ maxHeight: '320px', width: 'auto', maxWidth: '100%' }}/>

                </div>
              </Link>

              <Link to={productPath} className="w-full text-center mt-2">
                <div className="text-custom-dark text-sm font-nunito uppercase tracking-widest hover:underline">
                  {prod.name}
                </div>
              </Link>


              <div className="text-custom-dark text-xs font-nunito mt-1 flex items-center justify-center gap-1">
                <span style={{ fontWeight: 'bold', fontSize: '1rem' }}>₱</span>{prod.price.toLocaleString()}
              </div>
            </div>
          );
        })}
      </Marquee>
    </div>
  </section>
);

const ProductCarousel = () => (
  <>
    <CarouselRow products={productsTop} />
    <CarouselRow products={productsBottom} direction="right" />
  </>
);

export default ProductCarousel;
