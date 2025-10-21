const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    full_name: { type: String, required: true },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    uni_id: { type: String, required: true, unique: true }, // <-- add unique: true
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ["user", "staff", "admin", "student", "lecturer"],
        default: "user",
    },
    contact_no: {
        type: String,
        required: false,
        match: [/^[0-9+\-\s()]*$/, "Please enter a valid contact number"],
    },
    faculty: { type: String, required: false, trim: true },
});

module.exports = mongoose.model("UserModel", userSchema);