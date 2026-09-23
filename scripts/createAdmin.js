const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const MONGODB_URI = process.env.MONGODB_URI || "your_mongodb_uri_here";

const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,
    role: String,
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);

async function createAdmin() {
  await mongoose.connect(MONGODB_URI);

  const existingAdmin = await User.findOne({ email: "admin@tradelify.com" });

  if (existingAdmin) {
    console.log("Admin আগেই আছে!");
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash("admin123456", 12);

  await User.create({
    name: "Admin",
    email: "admin@tradelify.com",
    password: hashedPassword,
    role: "admin",
  });

  console.log("✅ Admin তৈরি হয়েছে!");
  console.log("Email: admin@tradelify.com");
  console.log("Password: admin123456");
  process.exit(0);
}

createAdmin().catch(console.error);