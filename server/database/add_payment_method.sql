-- Add payment_method column to orders table
ALTER TABLE `orders` ADD COLUMN `payment_method` VARCHAR(50) DEFAULT NULL AFTER `total_amount`;

-- Update existing orders to have a default payment method
UPDATE `orders` SET `payment_method` = 'GCash' WHERE `payment_method` IS NULL; 