const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Local MongoDB Connected");
  } catch (err) {
    console.log("❌ MongoDB Error");
    console.log(err);
    process.exit(1);
  }
};

module.exports = connectDB;