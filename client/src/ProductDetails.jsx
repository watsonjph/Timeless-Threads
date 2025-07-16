import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const mockProductData = {
  'regular-fit-solid-cotton-shirt': {
    name: 'Regular Fit Solid Cotton Shirt',
    price: 1350,
    sku: 'REG1350M',
    stock: 3,
    type: 'mens',
    description: 'This shirt offers a crisp, tailored fit in breathable cotton, ideal for daily wear and semi-formal occasions.',
    details: [
      '100% Cotton',
      'Regular fit',
      'Button-down collar',
      'Machine washable',
    ],
    care: [
      'Wash at max 40°C',
      'Do not bleach',
      'Tumble dry low',
      'Iron at medium temperature',
    ],
    image: '/images/products/landing-page/regfit1.png',
  },
  'custom-slim-fit-mesh-polo-shirt': {
    name: 'Custom Slim Fit Mesh Polo Shirt',
    price: 1325,
    sku: 'CSF1325M',
    stock: 5,
    type: 'mens',
    description: 'A modern slim-fit polo made with breathable mesh fabric and a ribbed collar for all-day style.',
    details: [
      'Mesh cotton blend',
      'Slim fit cut',
      'Ribbed collar and cuffs',
      'Two-button placket',
    ],
    care: [
      'Wash cold',
      'Do not bleach',
      'Line dry',
      'Cool iron if needed',
    ],
    image: '/images/products/landing-page/slimfit1.png',
  },
  'custom-slim-fit-jersey-crewneck-t-shirt': {
    name: 'Custom Slim Fit Jersey Crewneck T-Shirt',
    price: 1295,
    sku: 'CSF1295M',
    stock: 7,
    type: 'mens',
    description: 'Made from soft jersey cotton, this slim-fit crewneck tee is perfect for layering or wearing solo.',
    details: [
      'Slim fit',
      'Crewneck',
      'Lightweight jersey',
      'Short sleeves',
    ],
    care: [
      'Machine wash warm',
      'Do not bleach',
      'Tumble dry low',
    ],
    image: '/images/products/landing-page/slimfit2.png',
  },
  'untucked-oxford-shirt': {
    name: 'Untucked Oxford Shirt',
    price: 1800,
    sku: 'OXF1800M',
    stock: 2,
    type: 'mens',
    description: 'A relaxed-fit Oxford shirt designed to be worn untucked, combining ease and elegance.',
    details: [
      'Oxford cotton',
      'Rounded hem',
      'Chest pocket',
      'Button-down',
    ],
    care: [
      'Cold wash',
      'Do not bleach',
      'Iron medium',
    ],
    image: '/images/products/landing-page/oxford1.png',
  },
  'paris-polo-shirt-regular-fit-stretch': {
    name: 'Paris Polo Shirt Regular Fit Stretch',
    price: 1950,
    sku: 'PPS1950M',
    stock: 4,
    type: 'mens',
    description: 'This Paris Polo combines timeless style with stretch fabric for extra comfort in a regular fit.',
    details: [
      'Stretch cotton blend',
      'Regular fit',
      'Embroidered logo',
      'Flat knit collar',
    ],
    care: [
      'Delicate wash 30°C',
      'Do not bleach',
      'Dry flat',
    ],
    image: '/images/products/landing-page/regfit2.png',
  },
  'custom-slim-fit-soft-cotton-polo-shirt': {
    name: 'Custom Slim Fit Soft Cotton Polo Shirt',
    price: 1950,
    sku: 'CSSC1950M',
    stock: 6,
    type: 'mens',
    description: 'Designed in a soft-touch cotton fabric, this slim polo brings both class and comfort.',
    details: [
      'Slim fit',
      'Soft cotton material',
      'Short sleeves',
      'Three-button placket',
    ],
    care: [
      'Gentle wash',
      'No bleach',
      'Cool tumble dry',
    ],
    image: '/images/products/landing-page/slimfit3.png',
  },
  'breathable-jersey-tennis-socks': {
    name: 'Breathable Jersey Tennis Socks',
    price: 750,
    sku: 'BJT750W',
    stock: 8,
    type: 'womens',
    description: 'Stay cool and dry during play with these lightweight and breathable tennis socks.',
    details: [
      'Breathable cotton',
      'Low-cut athletic design',
      'Elastic arch support',
    ],
    care: [
      'Wash with like colors',
      'Avoid fabric softener',
      'Air dry',
    ],
    image: '/images/products/landing-page/jsocks1.png',
  },
  'striped-ribbed-sock': {
    name: 'Striped Ribbed Sock',
    price: 450,
    sku: 'SRS450W',
    stock: 5,
    type: 'womens',
    description: 'A colorful striped sock with ribbed texture for a snug and fashionable fit.',
    details: [
      'Ribbed knit cotton blend',
      'Stripe pattern',
      'Reinforced toe and heel',
    ],
    care: [
      'Wash inside out',
      'Do not bleach',
      'Hang dry',
    ],
    image: '/images/products/landing-page/ribsock1.png',
  },
  'corgi-dog-socks-khaki': {
    name: 'Corgi Dog Socks Khaki',
    price: 450,
    sku: 'CDSK450W',
    stock: 3,
    type: 'womens',
    description: 'Fun and cute corgi pattern socks in khaki for the dog lover in your life.',
    details: [
      'Khaki base',
      'Corgi print',
      'Elastic top band',
    ],
    care: [
      'Delicate cycle only',
      'No bleach',
      'Line dry only',
    ],
    image: '/images/products/landing-page/dogsock1.png',
  },
  'pug-dog-sock-green': {
    name: 'Pug Dog Sock Green',
    price: 450,
    sku: 'PDSG450W',
    stock: 4,
    type: 'womens',
    description: 'Green socks with charming pug prints, adding personality and fun to any look.',
    details: [
      'Pug pattern',
      'Soft and stretchy',
      'Green base',
    ],
    care: [
      'Do not bleach',
      'Do not tumble dry',
      'Iron on low heat',
    ],
    image: '/images/products/landing-page/dogsock2.png',
  },
  '2-pack-sport-socks': {
    name: '2-Pack Sport Socks',
    price: 750,
    sku: '2PSS750W',
    stock: 1,
    type: 'womens',
    description: 'These Sport Socks are made from organic cotton jersey and feature an ankle-length design.',
    details: [
      'Organic cotton jersey',
      'Ankle length',
      'Embroidered crocodile on side',
      'Material: Cotton (90%), Polyamide (9%), Elastane (1%)'
    ],
    care: [
      'Normal Process T Max 30',
      'Do Not Bleach',
      'Do Not Tumble Dry',
      'Iron Max Sole-Plate T 150',
      'Do Not Dry-Clean',
      'Line Dry'
    ],
    image: '/images/products/landing-page/sportsocks1.png'
  }
};

// 💾 Hardcoded reviews mapped by SKU (pls modify for database fetching)
const hardcodedReviews = {
  REG1350M: [
    { name: "Miguel", comment: "Clean look, feels premium. Pang semi-formal flex." },
    { name: "Issa", comment: "Breathable kahit mainit, 10/10 would wear again." }
  ],
  CSF1325M: [
    { name: "Anna", comment: "This polo is 🔥🔥🔥. Looks classy even in jeans." },
    { name: "Ben", comment: "Quality is top-tier, pero sana may more colors." }
  ],
  CSF1295M: [
    { name: "Gio", comment: "Perfect fit, kahit medyo chonky ako 😅" },
    { name: "Cheska", comment: "Soft fabric, doesn’t shrink. Solid for everyday wear." }
  ],
  OXF1800M: [
    { name: "Martin", comment: "Looks better untucked than most shirts I own." },
    { name: "Cathy", comment: "Love this on my bf. Chill but polished vibes." }
  ],
  PPS1950M: [
    { name: "Tina", comment: "Paris polo? Instant ✨main character energy✨" },
    { name: "EJ", comment: "Stretchy and comfy even for long days." }
  ],
  CSSC1950M: [
    { name: "Ramon", comment: "Material is soft AF. I could nap in this." },
    { name: "Aya", comment: "Slim fit that actually flatters my arms. Rare." }
  ],
  BJT750W: [
    { name: "Denise", comment: "Best for tennis. Breathes better than my ex." },
    { name: "Faye", comment: "No sweaty toes? I’m in love." }
  ],
  SRS450W: [
    { name: "Ella", comment: "Cute colors, nice snug fit." },
    { name: "Kurt", comment: "Socks that don’t slide off = W." }
  ],
  CDSK450W: [
    { name: "Jill", comment: "Corgi supremacy. That’s it." },
    { name: "Pat", comment: "Wore these and my dog judged me 🐶" }
  ],
  PDSG450W: [
    { name: "Mika", comment: "Super cute socks 😭 my dog barked at me tho." },
    { name: "Lance", comment: "Warm and comfy! Feels like I’m walking on a cloud." }
  ],
  '2PSS750W': [
    { name: "Kai", comment: "Great value, solid quality." },
    { name: "Rhea", comment: "Both pairs are soft and breathable. Love the little croc!" }
  ]
  // Add more reviews keyed by SKU if needed
};


const ProductDetails = () => {
  const { category, slug } = useParams();
  const navigate = useNavigate();
  const product = mockProductData[slug];

  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    if (product?.sku) {
      setReviews(hardcodedReviews[product.sku] || []);
    }
  }, [product?.sku]);

  const addToCart = () => {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const existingIndex = cart.findIndex(item => item.sku === product.sku);

  if (existingIndex !== -1) {
    if (cart[existingIndex].quantity < product.stock) {
      cart[existingIndex].quantity += 1;
    }
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  alert(`${product.name} added to cart.`);
  };


  if (!product) {
    return <div className="p-8 text-center text-red-500">Product not found</div>;
  }

  return (
    <div className="font-poppins min-h-screen bg-custom-cream">
      <Navbar alwaysHovered={true} />
      <div className="p-8 max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-custom-dark text-white rounded-full hover:bg-gray-800 transition-all duration-300 ease-in-out transform hover:-translate-x-1 hover:shadow-lg"
        >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <img src={product.image} alt={product.name} className="w-full object-cover rounded-lg" />
        <div>
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <p className="text-xl mt-2 text-custom-dark">₱{product.price.toLocaleString()}</p>
          <p className="mt-1 text-sm text-gray-500">SKU: {product.sku}</p>
          <p className="text-green-600 font-semibold mt-1">Only {product.stock} unit{product.stock > 1 ? 's' : ''} left</p>

          <div className="mt-6 space-x-3">
            <button onClick={addToCart} className="bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800 hover:shadow-md transition-all duration-300 ease-in-out transform hover:-translate-y-1">
                Add to Cart
                </button>
          </div>


          <div className="mt-6">
            <h2 className="font-bold mb-2">EDITOR'S NOTE</h2>
            <p>{product.description}</p>

            <h2 className="font-bold mt-4 mb-2">THE DETAILS</h2>
            <ul className="list-disc pl-5">
              {product.details.map((item, i) => <li key={i}>{item}</li>)}
            </ul>

            <h2 className="font-bold mt-4 mb-2">CARE INSTRUCTIONS</h2>
            <ul className="list-disc pl-5">
              {product.care.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="font-bold text-xl mb-2">Reviews:</h2>
        {reviews.length > 0 ? (
          <ul className="space-y-4">
            {reviews.map((review, i) => (
              <li key={i} className="border border-gray-200 p-4 rounded-lg shadow-sm">
                <p className="font-semibold text-custom-dark">{review.name}</p>
                <p className="text-sm text-gray-700 mt-1">{review.comment}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="italic text-gray-600">No reviews yet.</p>
        )}
      </div>
      </div>
    </div>
  );
};

export default ProductDetails;
