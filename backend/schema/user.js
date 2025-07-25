const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please provide username"],
      trim: true,
      minlength: 3,
      maxlength: 30,
      index: true,
    },

    email: {
      type: String,
      required: [true, "Please Proovide an email"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },

    password: {
      type: String,
      required: [true, "Please Provide a password"],
      minlength: 8,
      select: false,
    },

    passwordConfirm: {
      type: String,
      required: [true, "Please Confirm your password"],
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: "Passwords are not same",
      },
    },

    role: {
      type: String,
      enum: ["student", "club-admin", "admin", "pending-club-admin"],
      default: "student",
      required: true,
    },

    age: {
      type : Number,
    },

    yearOfStudy: {
      type : String,
      enum: ["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year"],
      default: "1st Year",  
      required: true
    },

    department: {
      type :String,
    },

    isClubMember: { 
      type: Boolean, 
      default: false 
    },
    
    club: { 
      type: mongoose.Schema.Types.ObjectId,
       ref: "Club", default: null 
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    otp: {
      type: String,
      default: null,
    },

    otpExpires: {
      type: Date,
      default: null,
    },

    resetPasswordOTP: {
      type: String,
      default: null,
    },

    resetPasswordOTPExpires: {
      type: Date,
      default: null,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;

  next();
});

userSchema.methods.correctPassword = async function (password, userPassword) {
  return await bcrypt.compare(password, userPassword);
};

//const User = mongoose.model("User", userSchema);
// ...existing code...
module.exports = mongoose.models.User || mongoose.model("User", userSchema);
