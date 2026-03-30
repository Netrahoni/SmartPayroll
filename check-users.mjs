import 'dotenv/config';
import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI;

try {
  await mongoose.connect(MONGO_URI);
  console.log('✅ Connected to MongoDB\n');

  const db = mongoose.connection.db;
  const users = await db.collection('users').find({}, {
    projection: { password: 0 } // exclude password hash
  }).toArray();

  if (users.length === 0) {
    console.log('⚠️  No users found in the database.');
  } else {
    console.log(`👥 Found ${users.length} user(s):\n`);
    users.forEach((u, i) => {
      console.log(`--- User ${i + 1} ---`);
      console.log(`  ID:         ${u._id}`);
      console.log(`  Name:       ${u.firstName} ${u.middleName || ''} ${u.lastName}`.trim());
      console.log(`  Email:      ${u.email}`);
      console.log(`  Company:    ${u.company}`);
      console.log(`  Department: ${u.department}`);
      console.log(`  Position:   ${u.position}`);
      console.log(`  Created:    ${u.createdAt}`);
      console.log('');
    });
  }
} catch (err) {
  console.error('❌ Error:', err.message);
}

process.exit(0);
