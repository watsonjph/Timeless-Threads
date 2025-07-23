-- Database Schema for Timeless Threads


-- Users Table
CREATE TABLE `users` (
  `user_id` INT(11) NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(20) DEFAULT NULL,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `firstName` VARCHAR(50) DEFAULT NULL,
  `lastName` VARCHAR(50) DEFAULT NULL,
  `role` ENUM('user','admin','supplier') DEFAULT 'user',
  `streetAddress` VARCHAR(255) DEFAULT NULL,
  `barangay` VARCHAR(100) DEFAULT NULL,
  `city` VARCHAR(100) DEFAULT NULL,
  `province` VARCHAR(100) DEFAULT NULL,
  `postalCode` VARCHAR(15) DEFAULT NULL,
  `profile_pic_url` TEXT,
  `has_profile_pic` TINYINT(1) DEFAULT 0,
  `is_deleted` TINYINT(1) DEFAULT 0,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Categories Table
CREATE TABLE `categories` (
  `category_id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `description` TEXT,
  PRIMARY KEY (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Suppliers Table
CREATE TABLE `suppliers` (
  `supplier_id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `contact_person` VARCHAR(100) DEFAULT NULL,
  `contact_email` VARCHAR(100) DEFAULT NULL,
  `contact_phone` VARCHAR(20) DEFAULT NULL,
  `street_address` VARCHAR(255) DEFAULT NULL,
  `city` VARCHAR(100) DEFAULT NULL,
  `province` VARCHAR(100) DEFAULT NULL,
  `postal_code` VARCHAR(15) DEFAULT NULL,
  PRIMARY KEY (`supplier_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Products Table
CREATE TABLE `products` (
  `product_id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `category_id` INT(11) DEFAULT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `is_active` BOOLEAN DEFAULT TRUE,
  `supplier_id` INT(11) DEFAULT NULL,
  PRIMARY KEY (`product_id`),
  FOREIGN KEY (`category_id`) REFERENCES `categories`(`category_id`),
  FOREIGN KEY (`supplier_id`) REFERENCES `suppliers`(`supplier_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Product Variants Table
CREATE TABLE `product_variants` (
  `variant_id` INT(11) NOT NULL AUTO_INCREMENT,
  `product_id` INT(11) NOT NULL,
  `size` VARCHAR(20) DEFAULT NULL,
  `color` VARCHAR(50) DEFAULT NULL,
  `sku` VARCHAR(100) UNIQUE,
  `is_active` BOOLEAN DEFAULT TRUE,
  PRIMARY KEY (`variant_id`),
  FOREIGN KEY (`product_id`) REFERENCES `products`(`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Product Images Table
CREATE TABLE `product_images` (
  `image_id` INT(11) NOT NULL AUTO_INCREMENT,
  `product_id` INT(11) NOT NULL,
  `image_url` TEXT NOT NULL,
  `is_primary` BOOLEAN DEFAULT FALSE,
  `display_order` INT DEFAULT 1,
  PRIMARY KEY (`image_id`),
  FOREIGN KEY (`product_id`) REFERENCES `products`(`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Product Reviews Table
CREATE TABLE `product_reviews` (
  `review_id` INT(11) NOT NULL AUTO_INCREMENT,
  `rating` INT CHECK (`rating` BETWEEN 1 AND 5),
  `review_text` TEXT,
  `review_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `user_id` INT(11) DEFAULT NULL,
  `product_id` INT(11) DEFAULT NULL,
  PRIMARY KEY (`review_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`),
  FOREIGN KEY (`product_id`) REFERENCES `products`(`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Orders Table
CREATE TABLE `orders` (
  `order_id` INT(11) NOT NULL AUTO_INCREMENT,
  `user_id` INT(11) NOT NULL,
  `shipping_full_name` VARCHAR(255) DEFAULT NULL,
  `shipping_contact_number` VARCHAR(50) DEFAULT NULL,
  `order_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `status` ENUM('Pending', 'Verified', 'Completed', 'Cancelled') NOT NULL DEFAULT 'Pending',
  `payment_verified` BOOLEAN DEFAULT FALSE,
  `total_amount` DECIMAL(10,2),
  `payment_method` VARCHAR(50) DEFAULT NULL,
  `shipping_street_address` VARCHAR(255),
  `shipping_barangay` VARCHAR(100),
  `shipping_city` VARCHAR(100),
  `shipping_province` VARCHAR(100),
  `shipping_postal_code` VARCHAR(15),
  PRIMARY KEY (`order_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Order Items Table
CREATE TABLE `order_items` (
  `order_items_id` INT(11) NOT NULL AUTO_INCREMENT,
  `variant_id` INT(11) DEFAULT NULL,
  `order_id` INT(11) NOT NULL,
  `quantity` INT NOT NULL,
  `unit_price` DECIMAL(10,2),
  `subtotal` DECIMAL(10,2),
  PRIMARY KEY (`order_items_id`),
  FOREIGN KEY (`variant_id`) REFERENCES `product_variants`(`variant_id`),
  FOREIGN KEY (`order_id`) REFERENCES `orders`(`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Payments Table
CREATE TABLE `payments` (
  `payment_id` INT(11) NOT NULL AUTO_INCREMENT,
  `order_id` INT(11) NOT NULL,
  `amount` DECIMAL(10,2),
  `reference_number` VARCHAR(100),
  `fee` DECIMAL(10,2),
  `amount_received` DECIMAL(10,2),
  `status` ENUM('pending', 'receipt_uploaded', 'verified', 'failed', 'disputed') DEFAULT 'pending',
  `receipt_image_path` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `disputed` BOOLEAN DEFAULT FALSE,
  `verified_at` TIMESTAMP NULL DEFAULT NULL,
  `verification_notes` TEXT,
  PRIMARY KEY (`payment_id`),
  FOREIGN KEY (`order_id`) REFERENCES `orders`(`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Order Fulfillment Table
CREATE TABLE `order_fulfillment` (
  `order_fulfillment_id` INT(11) NOT NULL AUTO_INCREMENT,
  `order_id` INT(11) NOT NULL,
  `status` ENUM('Pending', 'Confirmed', 'Delivery-In-Progress', 'Delivered', 'Cancelled') DEFAULT 'Pending',
  `shipped_date` TIMESTAMP NULL DEFAULT NULL,
  `delivery_date` TIMESTAMP NULL DEFAULT NULL,
  `tracking_number` VARCHAR(100),
  PRIMARY KEY (`order_fulfillment_id`),
  FOREIGN KEY (`order_id`) REFERENCES `orders`(`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Delivery Partners Table
CREATE TABLE `delivery_partners` (
  `partner_id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `contact_email` VARCHAR(100),
  `api_endpoint` TEXT,
  `contact_phone` VARCHAR(20),
  `tracking_url` TEXT,
  PRIMARY KEY (`partner_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Supplier Orders Table
CREATE TABLE `supplier_orders` (
  `supplier_order_id` INT AUTO_INCREMENT PRIMARY KEY,
  `supplier_id` INT NOT NULL,
  `ordered_by_admin_id` INT NOT NULL, -- user_id of the admin
  `order_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `status` ENUM('Pending', 'Shipped', 'Delivered', 'Cancelled') DEFAULT 'Pending',
  `notes` TEXT,
  `total_amount` DECIMAL(10,2),
  FOREIGN KEY (`supplier_id`) REFERENCES `suppliers`(`supplier_id`),
  FOREIGN KEY (`ordered_by_admin_id`) REFERENCES `users`(`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Supplier Order Items Table
CREATE TABLE `supplier_order_items` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `supplier_order_id` INT NOT NULL,
  `variant_id` INT NOT NULL,
  `quantity_ordered` INT NOT NULL,
  FOREIGN KEY (`supplier_order_id`) REFERENCES `supplier_orders`(`supplier_order_id`),
  FOREIGN KEY (`variant_id`) REFERENCES `product_variants`(`variant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Product Inventory Table
CREATE TABLE `product_inventory` (
  `pd_inventory_id` INT(11) NOT NULL AUTO_INCREMENT,
  `variant_id` INT(11) NOT NULL,
  `stock_quantity` INT DEFAULT 0,
  `restock_threshold` INT DEFAULT 5,
  `last_restocked` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`pd_inventory_id`),
  FOREIGN KEY (`variant_id`) REFERENCES `product_variants`(`variant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


COMMIT;