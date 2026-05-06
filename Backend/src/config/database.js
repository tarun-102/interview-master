const mongoose = require("mongoose");

async function conectToDB() {
  try {
    console.log(process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);
    console.log("connected to database");
  } catch (err) {
    console.log(err);
  }
}

module.exports = conectToDB;
