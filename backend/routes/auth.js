const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const auth = require('../middleware/auth');

const JWT_SECRET = process.env.JWT_SECRET || 'secret_key';

// @route   POST /api/register
// @desc    Register a new student
// @access  Public
router.post('/register', async (req, res) => {
  const { Name, Email, Password, Course, Branch } = req.body;

  try {
    let student = await Student.findOne({ Email });

    if (student) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const registrationNo = '2024' + Math.floor(1000000000 + Math.random() * 9000000000).toString();
    const rollNo = '2400' + Math.floor(100000000 + Math.random() * 900000000).toString();

    student = new Student({
      Name,
      Email,
      Password,
      Course,
      Branch,
      RegistrationNo: registrationNo,
      RollNo: rollNo
    });

    const salt = await bcrypt.genSalt(10);
    student.Password = await bcrypt.hash(Password, salt);

    await student.save();

    res.status(201).json({ message: 'Student registered successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/login
// @desc    Authenticate student and return JWT token
// @access  Public
router.post('/login', async (req, res) => {
  const { Email, Password } = req.body;

  try {
    let student = await Student.findOne({ Email });

    if (!student) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(Password, student.Password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    const payload = {
      user: {
        id: student.id
      }
    };

    jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/me
// @desc    Get logged in student details
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const student = await Student.findById(req.user.id).select('-Password');
    res.json(student);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT /api/update-password
// @desc    Update password (verify old password)
// @access  Private
router.put('/update-password', auth, async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  try {
    const student = await Student.findById(req.user.id);

    const isMatch = await bcrypt.compare(oldPassword, student.Password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect old password' });
    }

    const salt = await bcrypt.genSalt(10);
    student.Password = await bcrypt.hash(newPassword, salt);

    await student.save();

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT /api/update-course
// @desc    Change course and branch
// @access  Private
router.put('/update-course', auth, async (req, res) => {
  const { Course, Branch } = req.body;

  try {
    const student = await Student.findById(req.user.id);
    student.Course = Course;
    student.Branch = Branch;
    await student.save();

    res.json({ message: 'Course & Branch updated successfully', course: student.Course, branch: student.Branch });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
