const express = require('express');
const router = express.Router();
const authorization = require('../../middlewares/authorization');

const Admin = require('../../models/Admin');
const Company = require('../../models/Company');
const Student = require('../../models/Student');

const { ADMIN, COMPANY, STUDENT } = require('../../constants/roles');

// Update user profile route
router.patch('/', authorization, async (req, res) => {
  const { _id, role } = req.user;
  const {
    firstName,
    lastName,
    companyName,
    companyEmail,
    companyPhone,
    phone, // Assuming this is for student's phone, adjust if needed
  } = req.body;

  try {
    let user;
    switch (role) {
      case ADMIN:
        user = await Admin.findByIdAndUpdate(
          _id,
          { $set: { firstName, lastName } },
          { new: true }
        );
        break;
      case COMPANY:
        user = await Company.findByIdAndUpdate(
          _id,
          { $set: { firstName, lastName, companyName, companyEmail, companyPhone } },
          { new: true }
        );
        
        break;
      case STUDENT:
        user = await Student.findByIdAndUpdate(
          _id,
          { $set: { firstName, lastName, phone } },
          { new: true }
        );
        break;
      default:
        return res.status(400).json({ message: 'Invalid role' });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({message:"updated successfully"});
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
