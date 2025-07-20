-- Migration script to add 'Completed' status to orders table ENUM
-- Run this script to update your existing database

-- Step 1: Alter orders table to add 'Completed' to the status ENUM
ALTER TABLE `orders` MODIFY COLUMN `status` ENUM('Pending', 'Verified', 'Completed', 'Cancelled') NOT NULL DEFAULT 'Pending';

-- Step 2: Verify the changes
SELECT DISTINCT status FROM orders ORDER BY status;

-- Step 3: Show count of orders by status
SELECT status, COUNT(*) as count FROM orders GROUP BY status ORDER BY status; 