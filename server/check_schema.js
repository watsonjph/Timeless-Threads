import pool from './config/db.config.js';

async function checkSchema() {
  try {
    const [rows] = await pool.query('DESCRIBE orders');
    console.log('Orders table columns:');
    rows.forEach(row => console.log(row.Field));
    
    // Check if payment_method column exists
    const hasPaymentMethod = rows.some(row => row.Field === 'payment_method');
    console.log('\nHas payment_method column:', hasPaymentMethod);
    
    if (!hasPaymentMethod) {
      console.log('\nAdding payment_method column...');
      await pool.query('ALTER TABLE orders ADD COLUMN payment_method VARCHAR(50) DEFAULT NULL AFTER total_amount');
      console.log('payment_method column added successfully!');
    }
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

checkSchema(); 