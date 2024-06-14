
const db = require('../models');
const User = db.users;

const getUsersByGender = async (req, res) => {
  const { gender } = req.query;

  let condition = {};
  if (gender && gender !== 'both') {
    condition = { gender };
  }

  try {
    const users = await User.findAll({ where: condition });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getUsersByGender };
