const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true,
  },
  Email: {
    type: String,
    required: true,
    unique: true,
  },
  Password: {
    type: String,
    required: true,
  },
  Course: {
    type: String,
    required: true,
  },
  Branch: {
    type: String,
    required: true,
  },
  RegistrationNo: {
    type: String,
  },
  RollNo: {
    type: String,
  },
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
