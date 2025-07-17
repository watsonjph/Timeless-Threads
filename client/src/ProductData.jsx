// client/src/ProductData.jsx

const productsTop = [
  {
    name: 'Regular Fit Solid Cotton Shirt',
    price: 1350,
    sku: 'REG1350M',
    stock: 3,
    type: 'mens',
    image: 'regfit1.png',
    description:
      'This shirt offers a crisp, tailored fit in breathable cotton, ideal for daily wear and semi-formal occasions.',
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
//     category: 'T-Shirts',
//     image: 'regfit1.png',
//     description: 'This shirt offers a crisp, tailored fit in breathable cotton, ideal for daily wear and semi-formal occasions.',
//     details: ['100% Cotton', 'Regular fit', 'Button-down collar', 'Machine washable'],
//     care: ['Wash at max 40°C', 'Do not bleach', 'Tumble dry low', 'Iron at medium temperature'],
  },
  {
    name: 'Custom Slim Fit Mesh Polo Shirt',
    price: 1325,
    sku: 'CSF1325M',
    stock: 5,
    type: 'mens',
    image: 'slimfit1.png',
    description:
      'A breathable mesh polo tailored for a sharp silhouette—polished enough for brunch, chill enough for weekends.',
    details: [
      'Mesh cotton blend',
      'Slim fit cut',
      'Ribbed collar and cuffs',
      'Two-button placket',
    ],
    care: ['Wash cold', 'Do not bleach', 'Line dry', 'Cool iron if needed'],
  },
  {
    name: 'Custom Slim Fit Jersey Crewneck T-Shirt',
    price: 1295,
    sku: 'CSF1295M',
    stock: 7,
    type: 'mens',
    image: 'slimfit2.png',
    description:
      'Soft jersey fabric meets a slim cut—your go-to tee for layering or flying solo.',
    details: [
      'Slim fit',
      'Crewneck',
      'Lightweight jersey',
      'Short sleeves',
    ],
//     category: 'T-Shirts',
//     image: 'slimfit2.png',
//     description: 'Made from soft jersey cotton, this slim-fit crewneck tee is perfect for layering or wearing solo.',
//     details: ['Slim fit', 'Crewneck', 'Lightweight jersey', 'Short sleeves'],
    care: ['Machine wash warm', 'Do not bleach', 'Tumble dry low'],
  },
  {
    name: 'Untucked Oxford Shirt',
    price: 1800,
    sku: 'OXF1800M',
    stock: 2,
    type: 'mens',
    image: 'oxford1.png',
    description:
      'A laid-back Oxford shirt designed to stay sharp while worn untucked—effortlessly put-together.',
//     category: 'Jackets',
//     image: 'oxford1.png',
//     description: 'A relaxed-fit Oxford shirt designed to be worn untucked, combining ease and elegance.',
    details: ['Oxford cotton', 'Rounded hem', 'Chest pocket', 'Button-down'],
    care: ['Cold wash', 'Do not bleach', 'Iron medium'],
  },
  {
    name: 'Paris Polo Shirt Regular Fit Stretch',
    price: 1950,
    sku: 'PPS1950M',
    stock: 4,
    type: 'mens',
    image: 'regfit2.png',
    description:
      'Where Parisian flair meets everyday comfort—stretch cotton in a timeless regular fit.',
    details: [
      'Stretch cotton blend',
      'Regular fit',
      'Embroidered logo',
      'Flat knit collar',
    ],
//     category: 'T-Shirts',
//     image: 'regfit2.png',
//     description: 'This Paris Polo combines timeless style with stretch fabric for extra comfort in a regular fit.',
//     details: ['Stretch cotton blend', 'Regular fit', 'Embroidered logo', 'Flat knit collar'],
    care: ['Delicate wash 30°C', 'Do not bleach', 'Dry flat'],
  },
  {
    name: 'Custom Slim Fit Soft Cotton Polo Shirt',
    price: 1950,
    sku: 'CSSC1950M',
    stock: 6,
    type: 'mens',
    image: 'slimfit3.png',
    description:
      'Made from soft-touch cotton, this polo nails the sweet spot between sleek and cozy.',
    details: [
      'Slim fit',
      'Soft cotton material',
      'Short sleeves',
      'Three-button placket',
    ],
    care: ['Gentle wash', 'No bleach', 'Cool tumble dry'],
  },

  // NEW MENSWEAR
  {
    name: 'Baggy Chino Pants',
    price: 1690,
    sku: 'BCP1690M',
    stock: 5,
    type: 'mens',
    image: 'baggychinopants.png',
    description:
      'Loose-fit chinos that move with you—big on comfort, bigger on chill.',
    details: ['Cotton blend', 'Relaxed fit', 'Zip fly', 'Side pockets'],
    care: ['Cold wash', 'Do not bleach', 'Line dry'],
  },
  {
    name: 'Cargo Shorts',
    price: 1250,
    sku: 'CS1250M',
    stock: 4,
    type: 'mens',
    image: 'cargoshort1.png',
    description:
      'Pockets for days. These cargo shorts are built for utility and laid-back days.',
    details: ['Cotton twill', '6-pocket style', 'Button fly'],
    care: ['Machine wash', 'Tumble dry low'],
  },
  {
    name: 'Jogger Shorts',
    price: 1100,
    sku: 'JS1100M',
    stock: 6,
    type: 'mens',
    image: 'joggershorts.png',
    description:
      'Stretchy, soft, and chill-approved—these jogger shorts don’t skip leg day.',
    details: ['Stretch waistband', 'Soft knit fabric', 'Side slits'],
    care: ['Wash cold', 'Avoid bleach', 'Dry flat'],
  },
  {
    name: 'Straight Jeans',
    price: 1850,
    sku: 'SJ1850M',
    stock: 3,
    type: 'mens',
    image: 'straightjeans.png',
    description:
      'Clean-cut and classic—these straight-leg jeans bring the old-school vibe with modern comfort.',
    details: ['Denim', 'Straight fit', '5-pocket design'],
    care: ['Machine wash cold', 'Hang dry'],
  },
  {
    name: 'Slim Travel Jean',
    price: 1990,
    sku: 'STJ1990M',
    stock: 4,
    type: 'mens',
    image: 'slimtraveljean.png',
    description:
      'Built for movement, styled for everywhere—these travel jeans keep up with your pace.',
    details: ['Slim fit', 'Stretch denim', 'Hidden zip pocket'],
    care: ['Gentle cycle', 'Cool dry'],
  },
];


const productsBottom = [
  // NEW WOMENSWEAR
  {
    name: 'Drawstring Jean',
    price: 1490,
    sku: 'DJ1490W',
    stock: 6,
    type: 'womens',
    image: 'drawstringjean.png',
    description:
      'Comfy meets casual—these soft drawstring jeans are made for off-duty days.',
    details: ['Elastic waistband', 'Tapered leg'],
    care: ['Machine wash cold'],
  },
  {
    name: 'Tura Pants',
    price: 1590,
    sku: 'TP1590W',
    stock: 5,
    type: 'womens',
    image: 'turapants.png',
    description:
      'Wide-leg, flowy, and full of freedom—your new dance-in-the-breeze pants.',
    details: ['Flowy fabric', 'Wide-leg'],
    care: ['Cold gentle wash'],
  },
  {
    name: 'Lou Pants',
    price: 1550,
    sku: 'LP1550W',
    stock: 4,
    type: 'womens',
    image: 'loupants.png',
    description:
      'Clean lines and chill energy—these minimalist pants flex with any fit.',
    details: ['Relaxed fit', 'Straight cut'],
    care: ['Wash with similar colors'],
  },
  {
    name: 'Veron Skirt',
    price: 1300,
    sku: 'VS1300W',
    stock: 5,
    type: 'womens',
    image: 'veronskirt.png',
    description:
      'Twirl-ready A-line skirt with just enough pleat for that extra flair.',
    details: ['A-line silhouette', 'Zipper closure'],
    care: ['Do not bleach'],
  },
  {
    name: 'Cable Knit Sweater',
    price: 1700,
    sku: 'CKS1700W',
    stock: 3,
    type: 'womens',
    image: 'cableknitsweater.png',
    description:
      'Soft pastels and chunky texture—this cable knit’s got main character energy.',
    details: ['Knit cotton', 'Crew neck'],
    care: ['Cold wash'],
  },
  {
    name: 'Cotton Shirt',
    price: 1250,
    sku: 'CS1250W',
    stock: 5,
    type: 'womens',
    image: 'cottonshirt.png',
    description:
      'Lightweight, breathable, and always in season—this cotton shirt’s a layering legend.',
    details: ['Breathable', 'Button-up'],
    care: ['Iron low heat'],
  },
  {
    name: 'Rib Vest',
    price: 950,
    sku: 'RV950W',
    stock: 6,
    type: 'womens',
    image: 'ribvest.png',
    description:
      'Fitted, ribbed, and sleeveless—your layering game just leveled up.',
    details: ['Slim fit', 'Sleeveless'],
    care: ['Wash inside out'],
  },
  {
    name: 'Rib Short Sleeve',
    price: 990,
    sku: 'RSS990W',
    stock: 6,
    type: 'womens',
    image: 'ribshortsleeve.png',
    description:
      'Cropped and ribbed with a stretch that hugs just right—this top eats every time.',
    details: ['Stretch fabric', 'Cropped fit'],
    care: ['Do not dry clean'],
  },
];


const footwearProducts = [
  {
    name: 'Armani Sneakers',
    price: 3150,
    sku: 'AS3150U',
    stock: 4,
    type: 'footwear',
    image: 'armanisneakers.png',
    description:
      'Premium low-top sneakers with a sleek profile and designer edge—Armani’s take on casual luxury.',
    details: ['Faux leather upper', 'Rubber sole', 'Lace-up front'],
    care: ['Wipe with damp cloth', 'Do not machine wash'],
  },
  {
    name: 'City MK Sneakers',
    price: 2990,
    sku: 'CMK2990U',
    stock: 3,
    type: 'footwear',
    image: 'citymksneakers.png',
    description:
      'Urban-ready sneakers with a bold sole and statement branding—built for city pace.',
    details: ['Chunky outsole', 'Mesh panels', 'Contrast accents'],
    care: ['Spot clean only', 'Air dry'],
  },
  {
    name: 'Evo Leather Sneakers',
    price: 2890,
    sku: 'ELS2890U',
    stock: 5,
    type: 'footwear',
    image: 'evoleathersneakers.png',
    description:
      'Clean, modern, and versatile—these leather sneakers evolve your fit with minimal effort.',
    details: ['PU leather upper', 'Cushioned insole', 'Tonal stitching'],
    care: ['Wipe clean', 'Avoid soaking'],
  },
  {
    name: '2-Pack Sport Socks',
    price: 750,
    sku: '2PSS750W',
    stock: 1,
    type: 'footwear',
    image: 'sportsocks1.png',
    description:
      'A 2-pack of breathable performance socks—built for motion, made for comfort.',
    details: ['Moisture-wicking', 'Ankle length', 'Reinforced heel & toe'],
    care: ['Machine wash cold', 'Do not bleach', 'Tumble dry low'],
//     category: 'T-Shirts',
//     image: 'slimfit3.png',
//     description: 'Designed in a soft-touch cotton fabric, this slim polo brings both class and comfort.',
//     details: ['Slim fit', 'Soft cotton material', 'Short sleeves', 'Three-button placket'],
//     care: ['Gentle wash', 'No bleach', 'Cool tumble dry'],
//   },
// ];

// const productsBottom = [
//   {
//     name: 'Breathable Jersey Tennis Socks',
//     price: 750,
//     sku: 'BJT750W',
//     stock: 8,
//     type: 'womens',
//     category: 'Footwear',
//     image: 'jsocks1.png',
//     description: 'Stay cool and dry during play with these lightweight and breathable tennis socks.',
//     details: ['Breathable cotton', 'Low-cut athletic design', 'Elastic arch support'],
//     care: ['Wash with like colors', 'Avoid fabric softener', 'Air dry'],
  },
  {
    name: 'Striped Ribbed Sock',
    price: 450,
    sku: 'SRS450W',
    stock: 5,
    type: 'footwear',
    image: 'ribsock1.png',
    description:
      'Classic striped rib socks with a retro twist—perfect for low-key flexing.',
    details: ['Ribbed cotton blend', 'Mid-calf', 'Striped design'],
    care: ['Wash with like colors', 'Do not iron print'],
//     type: 'womens',
//     category: 'Accessories',
//     image: 'ribsock1.png',
//     description: 'A colorful striped sock with ribbed texture for a snug and fashionable fit.',
//     details: ['Ribbed knit cotton blend', 'Stripe pattern', 'Reinforced toe and heel'],
//     care: ['Wash inside out', 'Do not bleach', 'Hang dry'],
  },
  {
    name: 'Corgi Dog Socks Khaki',
    price: 450,
    sku: 'CDSK450W',
    stock: 3,
    type: 'footwear',
    image: 'dogsock1.png',
    description:
      'Woof-level cozy—these khaki socks feature a charming corgi design that’s all bark and style.',
    details: ['Cotton blend', 'Fun print', 'Elastic cuff'],
    care: ['Cold wash', 'Do not bleach', 'Air dry'],
//     type: 'womens',
//     category: 'Accessories',
//     image: 'dogsock1.png',
//     description: 'Fun and cute corgi pattern socks in khaki for the dog lover in your life.',
//     details: ['Khaki base', 'Corgi print', 'Elastic top band'],
//     care: ['Delicate cycle only', 'No bleach', 'Line dry only'],
  },
  {
    name: 'Pug Dog Sock Green',
    price: 450,
    sku: 'PDSG450W',
    stock: 4,
    type: 'footwear',
    image: 'dogsock2.png',
    description:
      'Keep it cute with these pug-themed socks—your feet just found their spirit animal.',
    details: ['Soft knit', 'Playful pattern', 'Stretchy fit'],
    care: ['Gentle wash', 'Do not iron', 'Dry flat'],
  },
  {
    name: 'Breathable Jersey Tennis Socks',
    price: 750,
    sku: 'BJT750W',
    stock: 8,
    type: 'footwear',
    image: 'jsocks1.png',
    description:
      'Engineered for comfort and airflow—these tennis socks serve both form and function.',
    details: ['Jersey knit fabric', 'Breathable mesh zones', 'Arch support'],
    care: ['Machine wash cold', 'Avoid fabric softener', 'Tumble dry low'],
  },
];


const accessoriesProducts = [
  {
    name: 'Ferrari Sunglasses',
    price: 1490,
    sku: 'FS1490A',
    stock: 5,
    type: 'accessories',
    image: 'ferrariglasses.png',
    description:
      'Sporty, sharp, and race-day ready—these Ferrari sunnies bring F1 vibes to your fit.',
    details: ['UV protection lenses', 'Lightweight frame', 'Bold red accents'],
    care: ['Wipe with microfiber cloth', 'Store in case when not in use'],
  },
  {
    name: 'Gold Sunglasses',
    price: 1490,
    sku: 'GS1490A',
    stock: 4,
    type: 'accessories',
    image: 'goldsunglasses.png',
    description:
      'Drip without trying—these gold-framed sunglasses add instant luxe energy.',
    details: ['Tinted lenses', 'Metallic gold finish', 'Slim bridge design'],
    care: ['Clean with lens-safe solution', 'Avoid scratching surfaces'],
  },
  {
    name: 'LA Dodgers Cap',
    price: 850,
    sku: 'LADC850A',
    stock: 5,
    type: 'accessories',
    image: 'ladodgerscap.png',
    description:
      'Rep LA in this officially fresh Dodgers cap—streetwear staple with classic edge.',
    details: ['Adjustable strap', 'Embroidered logo', 'Curved brim'],
    care: ['Hand wash only', 'Air dry', 'Do not bleach'],
  },
  {
    name: 'NY Yankees Cap',
    price: 850,
    sku: 'NYYC850A',
    stock: 5,
    type: 'accessories',
    image: 'newyorkyankeecap.png',
    description:
      'Iconic and undefeated—this Yankees cap adds instant cred to any outfit.',
    details: ['Structured crown', 'Team embroidery', 'Snapback closure'],
    care: ['Spot clean with damp cloth', 'Avoid wringing'],
  },
];


const allProducts = [
  ...productsTop,
  ...productsBottom,
  ...footwearProducts,
  ...accessoriesProducts,
];

export { productsTop, productsBottom, footwearProducts, accessoriesProducts, allProducts };
//     type: 'womens',
//     category: 'Accessories',
//     image: 'dogsock2.png',
//     description: 'Green socks with charming pug prints, adding personality and fun to any look.',
//     details: ['Pug pattern', 'Soft and stretchy', 'Green base'],
//     care: ['Do not bleach', 'Do not tumble dry', 'Iron on low heat'],
//   },
//   {
//     name: '2-Pack Sport Socks',
//     price: 750,
//     sku: '2PSS750W',
//     stock: 1,
//     type: 'womens',
//     category: 'Footwear',
//     image: 'sportsocks1.png',
//     description: 'These Sport Socks are made from organic cotton jersey and feature an ankle-length design.',
//     details: [
//       'Organic cotton jersey',
//       'Ankle length',
//       'Embroidered crocodile on side',
//       'Material: Cotton (90%), Polyamide (9%), Elastane (1%)',
//     ],
//     care: [
//       'Normal Process T Max 30',
//       'Do Not Bleach',
//       'Do Not Tumble Dry',
//       'Iron Max Sole-Plate T 150',
//       'Do Not Dry-Clean',
//       'Line Dry',
//     ],
//   },
// ];

// const allProducts = [...productsTop, ...productsBottom];

// export { productsTop, productsBottom, allProducts };
