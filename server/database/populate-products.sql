-- Populate database with sample product data

-- Insert categories
INSERT INTO categories (name, description) VALUES
('Mens', 'Men\'s clothing and accessories'),
('Womens', 'Women\'s clothing and accessories'),
('Footwear', 'Shoes and socks'),
('Accessories', 'Hats, glasses, and other accessories');

-- Insert suppliers
INSERT INTO suppliers (name, contact_person, contact_email, contact_phone) VALUES
('Timeless Threads Supplier', 'John Doe', 'supplier@timeless.com', '+63 1234567890');

-- Insert products
INSERT INTO products (name, description, category_id, price, supplier_id) VALUES
-- Mens Products (productsTop)
('Regular Fit Solid Cotton Shirt', 'This shirt offers a crisp, tailored fit in breathable cotton, ideal for daily wear and semi-formal occasions.', 1, 1350.00, 1),
('Custom Slim Fit Mesh Polo Shirt', 'A breathable mesh polo tailored for a sharp silhouette—polished enough for brunch, chill enough for weekends.', 1, 1325.00, 1),
('Custom Slim Fit Jersey Crewneck T-Shirt', 'Soft jersey fabric meets a slim cut—your go-to tee for layering or flying solo.', 1, 1295.00, 1),
('Untucked Oxford Shirt', 'A laid-back Oxford shirt designed to stay sharp while worn untucked—effortlessly put-together.', 1, 1800.00, 1),
('Paris Polo Shirt Regular Fit Stretch', 'Where Parisian flair meets everyday comfort—stretch cotton in a timeless regular fit.', 1, 1950.00, 1),
('Custom Slim Fit Soft Cotton Polo Shirt', 'Made from soft-touch cotton, this polo nails the sweet spot between sleek and cozy.', 1, 1950.00, 1),
('Baggy Chino Pants', 'Loose-fit chinos that move with you—big on comfort, bigger on chill.', 1, 1690.00, 1),
('Cargo Shorts', 'Pockets for days. These cargo shorts are built for utility and laid-back days.', 1, 1250.00, 1),
('Jogger Shorts', 'Stretchy, soft, and chill-approved—these jogger shorts don\'t skip leg day.', 1, 1100.00, 1),
('Straight Jeans', 'Clean-cut and classic—these straight-leg jeans bring the old-school vibe with modern comfort.', 1, 1850.00, 1),
('Slim Travel Jean', 'Built for movement, styled for everywhere—these travel jeans keep up with your pace.', 1, 1990.00, 1),

-- Womens Products (productsBottom)
('Drawstring Jean', 'Comfy meets casual—these soft drawstring jeans are made for off-duty days.', 2, 1490.00, 1),
('Tura Pants', 'Wide-leg, flowy, and full of freedom—your new dance-in-the-breeze pants.', 2, 1590.00, 1),
('Lou Pants', 'Clean lines and chill energy—these minimalist pants flex with any fit.', 2, 1550.00, 1),
('Veron Skirt', 'Twirl-ready A-line skirt with just enough pleat for that extra flair.', 2, 1300.00, 1),
('Cable Knit Sweater', 'Soft pastels and chunky texture—this cable knit\'s got main character energy.', 2, 1700.00, 1),
('Cotton Shirt', 'Lightweight, breathable, and always in season—this cotton shirt\'s a layering legend.', 2, 1250.00, 1),
('Rib Vest', 'Fitted, ribbed, and sleeveless—your layering game just leveled up.', 2, 950.00, 1),
('Rib Short Sleeve', 'Cropped and ribbed with a stretch that hugs just right—this top eats every time.', 2, 990.00, 1),

-- Footwear Products
('Armani Sneakers', 'Premium low-top sneakers with a sleek profile and designer edge—Armani\'s take on casual luxury.', 3, 3150.00, 1),
('City MK Sneakers', 'Urban-ready sneakers with a bold sole and statement branding—built for city pace.', 3, 2990.00, 1),
('Evo Leather Sneakers', 'Clean, modern, and versatile—these leather sneakers evolve your fit with minimal effort.', 3, 2890.00, 1),
('2-Pack Sport Socks', 'A 2-pack of breathable performance socks—built for motion, made for comfort.', 3, 750.00, 1),
('Striped Ribbed Sock', 'Classic striped rib socks with a retro twist—perfect for low-key flexing.', 3, 450.00, 1),
('Corgi Dog Socks Khaki', 'Woof-level cozy—these khaki socks feature a charming corgi design that\'s all bark and style.', 3, 450.00, 1),
('Pug Dog Sock Green', 'Keep it cute with these pug-themed socks—your feet just found their spirit animal.', 3, 450.00, 1),
('Breathable Jersey Tennis Socks', 'Engineered for comfort and airflow—these tennis socks serve both form and function.', 3, 750.00, 1),

-- Accessories Products
('Ferrari Sunglasses', 'Sporty, sharp, and race-day ready—these Ferrari sunnies bring F1 vibes to your fit.', 4, 1490.00, 1),
('Gold Sunglasses', 'Drip without trying—these gold-framed sunglasses add instant luxe energy.', 4, 1490.00, 1),
('LA Dodgers Cap', 'Rep LA in this officially fresh Dodgers cap—streetwear staple with classic edge.', 4, 850.00, 1),
('NY Yankees Cap', 'Iconic and undefeated—this Yankees cap adds instant cred to any outfit.', 4, 850.00, 1);

-- Insert product variants
INSERT INTO product_variants (product_id, size, color, sku) VALUES
-- Mens Products (productsTop) - 11 products
(1, 'M', 'White', 'REG1350M'),      -- Regular Fit Solid Cotton Shirt
(2, 'M', 'White', 'CSF1325M'),      -- Custom Slim Fit Mesh Polo Shirt
(3, 'M', 'Black', 'CSF1295M'),      -- Custom Slim Fit Jersey Crewneck T-Shirt
(4, 'M', 'White', 'OXF1800M'),      -- Untucked Oxford Shirt
(5, 'M', 'Blue', 'PPS1950M'),       -- Paris Polo Shirt Regular Fit Stretch
(6, 'M', 'Navy', 'CSSC1950M'),      -- Custom Slim Fit Soft Cotton Polo Shirt
(7, 'M', 'Khaki', 'BCP1690M'),      -- Baggy Chino Pants
(8, 'M', 'Olive', 'CS1250M'),       -- Cargo Shorts
(9, 'M', 'Black', 'JS1100M'),       -- Jogger Shorts
(10, '32', 'Blue', 'SJ1850M'),      -- Straight Jeans
(11, '32', 'Black', 'STJ1990M'),    -- Slim Travel Jean

-- Womens Products (productsBottom) - 8 products
(12, 'M', 'Blue', 'DJ1490W'),       -- Drawstring Jean
(13, 'M', 'Black', 'TP1590W'),      -- Tura Pants
(14, 'M', 'Gray', 'LP1550W'),       -- Lou Pants
(15, 'M', 'Black', 'VS1300W'),      -- Veron Skirt
(16, 'M', 'Pink', 'CKS1700W'),      -- Cable Knit Sweater
(17, 'M', 'White', 'CS1250W'),      -- Cotton Shirt
(18, 'M', 'White', 'RV950W'),       -- Rib Vest
(19, 'M', 'Black', 'RSS990W'),      -- Rib Short Sleeve

-- Footwear Products - 8 products
(20, '42', 'White', 'AS3150U'),     -- Armani Sneakers
(21, '42', 'Black', 'CMK2990U'),    -- City MK Sneakers
(22, '42', 'Brown', 'ELS2890U'),    -- Evo Leather Sneakers
(23, 'M', 'White', '2PSS750W'),     -- 2-Pack Sport Socks
(24, 'M', 'Gray', 'SRS450W'),       -- Striped Ribbed Sock
(25, 'M', 'Khaki', 'CDSK450W'),     -- Corgi Dog Socks Khaki
(26, 'M', 'Green', 'PDSG450W'),     -- Pug Dog Sock Green
(27, 'M', 'White', 'BJT750W'),      -- Breathable Jersey Tennis Socks

-- Accessories Products - 4 products
(28, 'One Size', 'Black', 'FS1490A'), -- Ferrari Sunglasses
(29, 'One Size', 'Gold', 'GS1490A'),  -- Gold Sunglasses
(30, 'One Size', 'Blue', 'LADC850A'), -- LA Dodgers Cap
(31, 'One Size', 'Navy', 'NYYC850A'); -- NY Yankees Cap

-- Insert inventory
INSERT INTO product_inventory (variant_id, stock_quantity, restock_threshold) VALUES
-- Mens Products (productsTop) - 11 products
(1, 3, 2),   -- REG1350M: Regular Fit Solid Cotton Shirt - 3 in stock
(2, 5, 2),   -- CSF1325M: Custom Slim Fit Mesh Polo Shirt - 5 in stock
(3, 7, 2),   -- CSF1295M: Custom Slim Fit Jersey Crewneck T-Shirt - 7 in stock
(4, 0, 2),   -- OXF1800M: Untucked Oxford Shirt - OUT OF STOCK (1 of 5)
(5, 4, 2),   -- PPS1950M: Paris Polo Shirt Regular Fit Stretch - 4 in stock
(6, 6, 2),   -- CSSC1950M: Custom Slim Fit Soft Cotton Polo Shirt - 6 in stock
(7, 5, 2),   -- BCP1690M: Baggy Chino Pants - 5 in stock
(8, 4, 2),   -- CS1250M: Cargo Shorts - 4 in stock
(9, 6, 2),   -- JS1100M: Jogger Shorts - 6 in stock
(10, 3, 2),  -- SJ1850M: Straight Jeans - 3 in stock
(11, 4, 2),  -- STJ1990M: Slim Travel Jean - 4 in stock

-- Womens Products (productsBottom) - 8 products
(12, 6, 2),  -- DJ1490W: Drawstring Jean - 6 in stock
(13, 5, 2),  -- TP1590W: Tura Pants - 5 in stock
(14, 4, 2),  -- LP1550W: Lou Pants - 4 in stock
(15, 5, 2),  -- VS1300W: Veron Skirt - 5 in stock
(16, 0, 2),  -- CKS1700W: Cable Knit Sweater - OUT OF STOCK (2 of 5)
(17, 5, 2),  -- CS1250W: Cotton Shirt - 5 in stock
(18, 6, 2),  -- RV950W: Rib Vest - 6 in stock
(19, 6, 2),  -- RSS990W: Rib Short Sleeve - 6 in stock

-- Footwear Products - 8 products
(20, 4, 2),  -- AS3150U: Armani Sneakers - 4 in stock
(21, 3, 2),  -- CMK2990U: City MK Sneakers - 3 in stock
(22, 5, 2),  -- ELS2890U: Evo Leather Sneakers - 5 in stock
(23, 0, 2),  -- 2PSS750W: 2-Pack Sport Socks - OUT OF STOCK (3 of 5)
(24, 5, 2),  -- SRS450W: Striped Ribbed Sock - 5 in stock
(25, 3, 2),  -- CDSK450W: Corgi Dog Socks Khaki - 3 in stock
(26, 4, 2),  -- PDSG450W: Pug Dog Sock Green - 4 in stock
(27, 8, 2),  -- BJT750W: Breathable Jersey Tennis Socks - 8 in stock

-- Accessories Products - 4 products
(28, 5, 2),  -- FS1490A: Ferrari Sunglasses - 5 in stock
(29, 0, 2),  -- GS1490A: Gold Sunglasses - OUT OF STOCK (4 of 5)
(30, 5, 2),  -- LADC850A: LA Dodgers Cap - 5 in stock
(31, 0, 2);  -- NYYC850A: NY Yankees Cap - OUT OF STOCK (5 of 5) 