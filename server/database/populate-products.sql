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

-- Insert product variants
INSERT INTO product_variants (product_id, size, color, sku) VALUES
-- Additional Mens Product Variants (S, L sizes and more colors)
(1, 'S', 'White', 'REG1350S'),
(1, 'L', 'White', 'REG1350L'),
(1, 'M', 'Blue', 'REG1350MBL'),
(1, 'S', 'Blue', 'REG1350SBL'),
(1, 'L', 'Blue', 'REG1350LBL'),

(2, 'S', 'White', 'CSF1325S'),
(2, 'L', 'White', 'CSF1325L'),
(2, 'M', 'Navy', 'CSF1325MN'),
(2, 'S', 'Navy', 'CSF1325SN'),
(2, 'L', 'Navy', 'CSF1325LN'),

(3, 'S', 'Black', 'CSF1295S'),
(3, 'L', 'Black', 'CSF1295L'),
(3, 'M', 'Gray', 'CSF1295MG'),
(3, 'S', 'Gray', 'CSF1295SG'),
(3, 'L', 'Gray', 'CSF1295LG'),

(4, 'S', 'White', 'OXF1800S'),
(4, 'L', 'White', 'OXF1800L'),
(4, 'M', 'Blue', 'OXF1800MBL'),
(4, 'S', 'Blue', 'OXF1800SBL'),
(4, 'L', 'Blue', 'OXF1800LBL'),

(5, 'S', 'Blue', 'PPS1950S'),
(5, 'L', 'Blue', 'PPS1950L'),
(5, 'M', 'White', 'PPS1950MW'),
(5, 'S', 'White', 'PPS1950SW'),
(5, 'L', 'White', 'PPS1950LW'),

(6, 'S', 'Navy', 'CSSC1950S'),
(6, 'L', 'Navy', 'CSSC1950L'),
(6, 'M', 'Gray', 'CSSC1950MG'),
(6, 'S', 'Gray', 'CSSC1950SG'),
(6, 'L', 'Gray', 'CSSC1950LG'),

(7, 'S', 'Khaki', 'BCP1690S'),
(7, 'L', 'Khaki', 'BCP1690L'),
(7, 'M', 'Black', 'BCP1690MB'),
(7, 'S', 'Black', 'BCP1690SB'),
(7, 'L', 'Black', 'BCP1690LB'),

(8, 'S', 'Olive', 'CS1250S'),
(8, 'L', 'Olive', 'CS1250L'),
(8, 'M', 'Beige', 'CS1250MBE'),
(8, 'S', 'Beige', 'CS1250SBE'),
(8, 'L', 'Beige', 'CS1250LBE'),

(9, 'S', 'Black', 'JS1100S'),
(9, 'L', 'Black', 'JS1100L'),
(9, 'M', 'Gray', 'JS1100MG'),
(9, 'S', 'Gray', 'JS1100SG'),
(9, 'L', 'Gray', 'JS1100LG'),

(10, '30', 'Blue', 'SJ1850-30'),
(10, '34', 'Blue', 'SJ1850-34'),
(10, '32', 'Black', 'SJ1850-32B'),
(10, '30', 'Black', 'SJ1850-30B'),
(10, '34', 'Black', 'SJ1850-34B'),

(11, '30', 'Black', 'STJ1990-30'),
(11, '34', 'Black', 'STJ1990-34'),
(11, '32', 'Blue', 'STJ1990-32B'),
(11, '30', 'Blue', 'STJ1990-30B'),
(11, '34', 'Blue', 'STJ1990-34B'),

-- Additional Womens Product Variants (S, L sizes and more colors)
(12, 'S', 'Blue', 'DJ1490WS'),
(12, 'L', 'Blue', 'DJ1490WL'),
(12, 'M', 'Black', 'DJ1490WMB'),
(12, 'S', 'Black', 'DJ1490WSB'),
(12, 'L', 'Black', 'DJ1490WLB'),

(13, 'S', 'Black', 'TP1590WS'),
(13, 'L', 'Black', 'TP1590WL'),
(13, 'M', 'Gray', 'TP1590WMG'),
(13, 'S', 'Gray', 'TP1590WSG'),
(13, 'L', 'Gray', 'TP1590WLG'),

(14, 'S', 'Gray', 'LP1550WS'),
(14, 'L', 'Gray', 'LP1550WL'),
(14, 'M', 'Black', 'LP1550WMB'),
(14, 'S', 'Black', 'LP1550WSB'),
(14, 'L', 'Black', 'LP1550WLB'),

(15, 'S', 'Black', 'VS1300WS'),
(15, 'L', 'Black', 'VS1300WL'),
(15, 'M', 'Blue', 'VS1300WMBL'),
(15, 'S', 'Blue', 'VS1300WSBL'),
(15, 'L', 'Blue', 'VS1300WLBL'),

(16, 'S', 'Pink', 'CKS1700WS'),
(16, 'L', 'Pink', 'CKS1700WL'),
(16, 'M', 'White', 'CKS1700WMW'),
(16, 'S', 'White', 'CKS1700WSW'),
(16, 'L', 'White', 'CKS1700WLW'),

(17, 'S', 'White', 'CS1250WS'),
(17, 'L', 'White', 'CS1250WL'),
(17, 'M', 'Blue', 'CS1250WMBL'),
(17, 'S', 'Blue', 'CS1250WSBL'),
(17, 'L', 'Blue', 'CS1250WLBL'),

(18, 'S', 'White', 'RV950WS'),
(18, 'L', 'White', 'RV950WL'),
(18, 'M', 'Black', 'RV950WMB'),
(18, 'S', 'Black', 'RV950WSB'),
(18, 'L', 'Black', 'RV950WLB'),

(19, 'S', 'Black', 'RSS990WS'),
(19, 'L', 'Black', 'RSS990WL'),
(19, 'M', 'White', 'RSS990WMW'),
(19, 'S', 'White', 'RSS990WSW'),
(19, 'L', 'White', 'RSS990WLW');

-- Insert inventory
-- For each variant, insert inventory using a subquery to get the correct variant_id
INSERT INTO product_inventory (variant_id, stock_quantity, restock_threshold)
SELECT variant_id, 3, 2 FROM product_variants WHERE sku = 'REG1350M';
INSERT INTO product_inventory (variant_id, stock_quantity, restock_threshold)
SELECT variant_id, 5, 2 FROM product_variants WHERE sku = 'CSF1325M';
INSERT INTO product_inventory (variant_id, stock_quantity, restock_threshold)
SELECT variant_id, 7, 2 FROM product_variants WHERE sku = 'CSF1295M';
INSERT INTO product_inventory (variant_id, stock_quantity, restock_threshold)
SELECT variant_id, 0, 2 FROM product_variants WHERE sku = 'OXF1800M';
INSERT INTO product_inventory (variant_id, stock_quantity, restock_threshold)
SELECT variant_id, 4, 2 FROM product_variants WHERE sku = 'PPS1950M';
INSERT INTO product_inventory (variant_id, stock_quantity, restock_threshold)
SELECT variant_id, 6, 2 FROM product_variants WHERE sku = 'CSSC1950M';
INSERT INTO product_inventory (variant_id, stock_quantity, restock_threshold)
SELECT variant_id, 5, 2 FROM product_variants WHERE sku = 'BCP1690M';
INSERT INTO product_inventory (variant_id, stock_quantity, restock_threshold)
SELECT variant_id, 4, 2 FROM product_variants WHERE sku = 'CS1250M';
INSERT INTO product_inventory (variant_id, stock_quantity, restock_threshold)
SELECT variant_id, 6, 2 FROM product_variants WHERE sku = 'JS1100M';
INSERT INTO product_inventory (variant_id, stock_quantity, restock_threshold)
SELECT variant_id, 3, 2 FROM product_variants WHERE sku = 'SJ1850M';
INSERT INTO product_inventory (variant_id, stock_quantity, restock_threshold)
SELECT variant_id, 4, 2 FROM product_variants WHERE sku = 'STJ1990M';

-- Womens Products (productsBottom) - 8 products
INSERT INTO product_inventory (variant_id, stock_quantity, restock_threshold)
SELECT variant_id, 6, 2 FROM product_variants WHERE sku = 'DJ1490W';
INSERT INTO product_inventory (variant_id, stock_quantity, restock_threshold)
SELECT variant_id, 5, 2 FROM product_variants WHERE sku = 'TP1590W';
INSERT INTO product_inventory (variant_id, stock_quantity, restock_threshold)
SELECT variant_id, 4, 2 FROM product_variants WHERE sku = 'LP1550W';
INSERT INTO product_inventory (variant_id, stock_quantity, restock_threshold)
SELECT variant_id, 5, 2 FROM product_variants WHERE sku = 'VS1300W';
INSERT INTO product_inventory (variant_id, stock_quantity, restock_threshold)
SELECT variant_id, 0, 2 FROM product_variants WHERE sku = 'CKS1700W';
INSERT INTO product_inventory (variant_id, stock_quantity, restock_threshold)
SELECT variant_id, 5, 2 FROM product_variants WHERE sku = 'CS1250W';
INSERT INTO product_inventory (variant_id, stock_quantity, restock_threshold)
SELECT variant_id, 6, 2 FROM product_variants WHERE sku = 'RV950W';
INSERT INTO product_inventory (variant_id, stock_quantity, restock_threshold)
SELECT variant_id, 6, 2 FROM product_variants WHERE sku = 'RSS990W';

-- Footwear Products - 8 products
INSERT INTO product_inventory (variant_id, stock_quantity, restock_threshold)
SELECT variant_id, 4, 2 FROM product_variants WHERE sku = 'AS3150U';
INSERT INTO product_inventory (variant_id, stock_quantity, restock_threshold)
SELECT variant_id, 3, 2 FROM product_variants WHERE sku = 'CMK2990U';
INSERT INTO product_inventory (variant_id, stock_quantity, restock_threshold)
SELECT variant_id, 5, 2 FROM product_variants WHERE sku = 'ELS2890U';
INSERT INTO product_inventory (variant_id, stock_quantity, restock_threshold)
SELECT variant_id, 0, 2 FROM product_variants WHERE sku = '2PSS750W';
INSERT INTO product_inventory (variant_id, stock_quantity, restock_threshold)
SELECT variant_id, 5, 2 FROM product_variants WHERE sku = 'SRS450W';
INSERT INTO product_inventory (variant_id, stock_quantity, restock_threshold)
SELECT variant_id, 3, 2 FROM product_variants WHERE sku = 'CDSK450W';
INSERT INTO product_inventory (variant_id, stock_quantity, restock_threshold)
SELECT variant_id, 4, 2 FROM product_variants WHERE sku = 'PDSG450W';
INSERT INTO product_inventory (variant_id, stock_quantity, restock_threshold)
SELECT variant_id, 8, 2 FROM product_variants WHERE sku = 'BJT750W';

-- Accessories Products - 4 products
INSERT INTO product_inventory (variant_id, stock_quantity, restock_threshold)
SELECT variant_id, 5, 2 FROM product_variants WHERE sku = 'FS1490A';
INSERT INTO product_inventory (variant_id, stock_quantity, restock_threshold)
SELECT variant_id, 0, 2 FROM product_variants WHERE sku = 'GS1490A';
INSERT INTO product_inventory (variant_id, stock_quantity, restock_threshold)
SELECT variant_id, 5, 2 FROM product_variants WHERE sku = 'LADC850A';
INSERT INTO product_inventory (variant_id, stock_quantity, restock_threshold)
SELECT variant_id, 0, 2 FROM product_variants WHERE sku = 'NYYC850A';

-- Additional Mens Product Variants Inventory
INSERT INTO product_inventory (variant_id, stock_quantity, restock_threshold)
SELECT variant_id, 4, 2 FROM product_variants WHERE sku = 'REG1350S';
INSERT INTO product_inventory (variant_id, stock_quantity, restock_threshold)
SELECT variant_id, 3, 2 FROM product_variants WHERE sku = 'REG1350L';
INSERT INTO product_inventory (variant_id, stock_quantity, restock_threshold)
SELECT variant_id, 5, 2 FROM product_variants WHERE sku = 'REG1350MBL';
INSERT INTO product_inventory (variant_id, stock_quantity, restock_threshold)
SELECT variant_id, 4, 2 FROM product_variants WHERE sku = 'REG1350SBL';
INSERT INTO product_inventory (variant_id, stock_quantity, restock_threshold)
SELECT variant_id, 3, 2 FROM product_variants WHERE sku = 'REG1350LBL';

INSERT INTO product_inventory (variant_id, stock_quantity, restock_threshold)
SELECT variant_id, 4, 2 FROM product_variants WHERE sku = 'CSF1325S';
INSERT INTO product_inventory (variant_id, stock_quantity, restock_threshold)
SELECT variant_id, 3, 2 FROM product_variants WHERE sku = 'CSF1325L';
INSERT INTO product_inventory (variant_id, stock_quantity, restock_threshold)
SELECT variant_id, 5, 2 FROM product_variants WHERE sku = 'CSF1325MN';
INSERT INTO product_inventory (variant_id, stock_quantity, restock_threshold)
SELECT variant_id, 4, 2 FROM product_variants WHERE sku = 'CSF1325SN';
INSERT INTO product_inventory (variant_id, stock_quantity, restock_threshold)
SELECT variant_id, 3, 2 FROM product_variants WHERE sku = 'CSF1325LN';

INSERT INTO product_inventory (variant_id, stock_quantity, restock_threshold)
SELECT variant_id, 4, 2 FROM product_variants WHERE sku = 'CSF1295S';
INSERT INTO product_inventory (variant_id, stock_quantity, restock_threshold)
SELECT variant_id, 3, 2 FROM product_variants WHERE sku = 'CSF1295L';
INSERT INTO product_inventory (variant_id, stock_quantity, restock_threshold)
SELECT variant_id, 5, 2 FROM product_variants WHERE sku = 'CSF1295MG';
INSERT INTO product_inventory (variant_id, stock_quantity, restock_threshold)
SELECT variant_id, 4, 2 FROM product_variants WHERE sku = 'CSF1295SG';
INSERT INTO product_inventory (variant_id, stock_quantity, restock_threshold)
SELECT variant_id, 3, 2 FROM product_variants WHERE sku = 'CSF1295LG';

INSERT INTO product_inventory (variant_id, stock_quantity, restock_threshold)
SELECT variant_id, 4, 2 FROM product_variants WHERE sku = 'OXF1800S';
INSERT INTO product_inventory (variant_id, stock_quantity, restock_threshold)
SELECT variant_id, 3, 2 FROM product_variants WHERE sku = 'OXF1800L';
INSERT INTO product_inventory (variant_id, stock_quantity, restock_threshold)
SELECT variant_id, 5, 2 FROM product_variants WHERE sku = 'OXF1800MBL';
INSERT INTO product_inventory (variant_id, stock_quantity, restock_threshold)
SELECT variant_id, 4, 2 FROM product_variants WHERE sku = 'OXF1800SBL';
INSERT INTO product_inventory (variant_id, stock_quantity, restock_threshold)
SELECT variant_id, 3, 2 FROM product_variants WHERE sku = 'OXF1800LBL';

INSERT INTO product_inventory (variant_id, stock_quantity, restock_threshold)
SELECT variant_id, 4, 2 FROM product_variants WHERE sku = 'PPS1950S';
INSERT INTO product_inventory (variant_id, stock_quantity, restock_threshold)
SELECT variant_id, 3, 2 FROM product_variants WHERE sku = 'PPS1950L';
INSERT INTO product_inventory (variant_id, stock_quantity, restock_threshold)
SELECT variant_id, 5, 2 FROM product_variants WHERE sku = 'PPS1950MW';
INSERT INTO product_inventory (variant_id, stock_quantity, restock_threshold)
SELECT variant_id, 4, 2 FROM product_variants WHERE sku = 'PPS1950SW';
INSERT INTO product_inventory (variant_id, stock_quantity, restock_threshold)
SELECT variant_id, 3, 2 FROM product_variants WHERE sku = 'PPS1950LW';

INSERT INTO product_inventory (variant_id, stock_quantity, restock_threshold)
SELECT variant_id, 4, 2 FROM product_variants WHERE sku = 'CSSC1950S';
INSERT INTO product_inventory (variant_id, stock_quantity, restock_threshold)
SELECT variant_id, 3, 2 FROM product_variants WHERE sku = 'CSSC1950L';
INSERT INTO product_inventory (variant_id, stock_quantity, restock_threshold)
SELECT variant_id, 5, 2 FROM product_variants WHERE sku = 'CSSC1950MG';
INSERT INTO product_inventory (variant_id, stock_quantity, restock_threshold)
SELECT variant_id, 4, 2 FROM product_variants WHERE sku = 'CSSC1950SG';
INSERT INTO product_inventory (variant_id, stock_quantity, restock_threshold)
SELECT variant_id, 3, 2 FROM product_variants WHERE sku = 'CSSC1950LG';

INSERT INTO product_inventory (variant_id, stock_quantity, restock_threshold)
SELECT variant_id, 4, 2 FROM product_variants WHERE sku = 'BCP1690S';
INSERT INTO product_inventory (variant_id, stock_quantity, restock_threshold)
SELECT variant_id, 3, 2 FROM product_variants WHERE sku = 'BCP1690L';
INSERT INTO product_inventory (variant_id, stock_quantity, restock_threshold)
SELECT variant_id, 5, 2 FROM product_variants WHERE sku = 'BCP1690MB';
INSERT INTO product_inventory (variant_id, stock_quantity, restock_threshold)
SELECT variant_id, 4, 2 FROM product_variants WHERE sku = 'BCP1690SB';
INSERT INTO product_inventory (variant_id, stock_quantity, restock_threshold)
SELECT variant_id, 3, 2 FROM product_variants WHERE sku = 'BCP1690LB';

INSERT INTO product_inventory (variant_id, stock_quantity, restock_threshold)
SELECT variant_id, 4, 2 FROM product_variants WHERE sku = 'CS1250S';
INSERT INTO product_inventory (variant_id, stock_quantity, restock_threshold)
SELECT variant_id, 3, 2 FROM product_variants WHERE sku = 'CS1250L';
INSERT INTO product_inventory (variant_id, stock_quantity, restock_threshold)
SELECT variant_id, 5, 2 FROM product_variants WHERE sku = 'CS1250MBL';
INSERT INTO product_inventory (variant_id, stock_quantity, restock_threshold)
SELECT variant_id, 4, 2 FROM product_variants WHERE sku = 'CS1250SBL';
INSERT INTO product_inventory (variant_id, stock_quantity, restock_threshold)
SELECT variant_id, 3, 2 FROM product_variants WHERE sku = 'CS1250LBL';

INSERT INTO product_inventory (variant_id, stock_quantity, restock_threshold)
SELECT variant_id, 4, 2 FROM product_variants WHERE sku = 'RV950S';
INSERT INTO product_inventory (variant_id, stock_quantity, restock_threshold)
SELECT variant_id, 3, 2 FROM product_variants WHERE sku = 'RV950L';
INSERT INTO product_inventory (variant_id, stock_quantity, restock_threshold)
SELECT variant_id, 5, 2 FROM product_variants WHERE sku = 'RV950MB';
INSERT INTO product_inventory (variant_id, stock_quantity, restock_threshold)
SELECT variant_id, 4, 2 FROM product_variants WHERE sku = 'RV950SB';
INSERT INTO product_inventory (variant_id, stock_quantity, restock_threshold)
SELECT variant_id, 3, 2 FROM product_variants WHERE sku = 'RV950LB';

INSERT INTO product_inventory (variant_id, stock_quantity, restock_threshold)
SELECT variant_id, 4, 2 FROM product_variants WHERE sku = 'RSS990S';
INSERT INTO product_inventory (variant_id, stock_quantity, restock_threshold)
SELECT variant_id, 3, 2 FROM product_variants WHERE sku = 'RSS990L';
INSERT INTO product_inventory (variant_id, stock_quantity, restock_threshold)
SELECT variant_id, 5, 2 FROM product_variants WHERE sku = 'RSS990MW';
INSERT INTO product_inventory (variant_id, stock_quantity, restock_threshold)
SELECT variant_id, 4, 2 FROM product_variants WHERE sku = 'RSS990SW';
INSERT INTO product_inventory (variant_id, stock_quantity, restock_threshold)
SELECT variant_id, 3, 2 FROM product_variants WHERE sku = 'RSS990LW'; 