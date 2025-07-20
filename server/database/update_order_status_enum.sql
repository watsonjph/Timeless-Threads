-- Migration script to update orders table status column to ENUM
-- Run this script to update your existing database

-- Step 1: Alter orders table to change status column to ENUM
ALTER TABLE `orders` MODIFY COLUMN `status` ENUM('Pending', 'Verified', 'Cancelled') NOT NULL DEFAULT 'Pending';

-- Step 2: Update existing orders to use the new status values
-- Convert 'Shipped' and 'Delivered' to 'Verified' 
UPDATE `orders` SET `status` = 'Verified' WHERE `status` IN ('Shipped', 'Delivered');

-- Convert any other status values to 'Pending' (except 'Cancelled' which stays as is)
UPDATE `orders` SET `status` = 'Pending' WHERE `status` NOT IN ('Pending', 'Verified', 'Cancelled');

-- Step 3: Verify the changes
SELECT DISTINCT status FROM orders ORDER BY status;

-- Step 4: Show count of orders by status
SELECT status, COUNT(*) as count FROM orders GROUP BY status ORDER BY status; 