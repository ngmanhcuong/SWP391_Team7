require('dotenv').config();

const connectDB = require('../config/database');
const seedDevUsers = require('../config/seedDevUsers');
const seedSpecialties = require('../config/seedSpecialties');
const seedDoctors = require('../config/seedDoctors');
const seedReceptionist = require('../config/seedReceptionist');
const seedPatientData = require('../config/seedPatientData');

const run = async () => {
  process.env.AUTO_SEED = 'true';
  await connectDB();
  await seedDevUsers();
  await seedSpecialties();
  await seedDoctors();
  await seedReceptionist();
  await seedPatientData();
  console.log('Seed demo data completed successfully.');
  process.exit(0);
};

run().catch((error) => {
  console.error('Seed demo data failed:', error);
  process.exit(1);
});
