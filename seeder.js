const mongoose = require('mongoose');
const dotenv = require('dotenv');
const House = require('./models/House');
const User = require('./models/User');
const houses = require('./sampleHouses');

// Load env vars
dotenv.config();

// Connect to DB
mongoose.connect(process.env.MONGODB_URI);

// Import sample data
const importData = async () => {
  try {
    // First create a sample admin user
    const user = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: '123456',
      role: 'admin'
    });

    // Add the user ID as owner to each house
    const housesWithOwner = houses.map(house => ({
      ...house,
      owner: user._id
    }));

    await House.create(housesWithOwner);

    console.log('Data Imported...');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// Delete all data
const deleteData = async () => {
  try {
    await House.deleteMany();
    await User.deleteMany();

    console.log('Data Destroyed...');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}