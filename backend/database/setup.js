const fs = require('fs');
const path = require('path');
const pool = require('../config/database');

async function setupDatabase() {
  console.log('\n🔧 Setting up Beskydy Tourism Database...\n');

  try {
    // Read schema file
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Execute schema
    console.log('📋 Creating tables and inserting sample data...');
    await pool.query(schema);

    // Verify setup
    const userCount = await pool.query('SELECT COUNT(*) FROM users');
    const attractionsCount = await pool.query('SELECT COUNT(*) FROM attractions');
    const accommodationCount = await pool.query('SELECT COUNT(*) FROM accommodation');
    const activitiesCount = await pool.query('SELECT COUNT(*) FROM activities');
    const bookingsCount = await pool.query('SELECT COUNT(*) FROM bookings');
    const contactsCount = await pool.query('SELECT COUNT(*) FROM contacts');

    console.log('\n✅ Database setup completed successfully!\n');
    console.log('📊 Database Statistics:');
    console.log(`   • Users: ${userCount.rows[0].count}`);
    console.log(`   • Attractions: ${attractionsCount.rows[0].count}`);
    console.log(`   • Accommodation: ${accommodationCount.rows[0].count}`);
    console.log(`   • Activities: ${activitiesCount.rows[0].count}`);
    console.log(`   • Bookings: ${bookingsCount.rows[0].count}`);
    console.log(`   • Contact Messages: ${contactsCount.rows[0].count}`);
    console.log('\n🔐 Demo Credentials:');
    console.log('   Admin: admin@beskydy.cz / adminpass123');
    console.log('   User: user@beskydy.cz / userpass123');
    console.log('\n');

  } catch (error) {
    console.error('❌ Error setting up database:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run setup
setupDatabase();
