
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const db = require('../models');
const User = db.users;

const register = async (req, res) => {
  const { name, password, gender } = req.body;

  if (!name || !password || !gender) {
    return res.status(400).json({ error: 'Name, password, and gender are required.' });
  }

  const hashedPassword = bcrypt.hashSync(password, 8);

  try {
    const user = await User.create({ id: uuidv4(), name, password: hashedPassword, gender });
    const token = jwt.sign({ id: user.id }, 'secret_key', { expiresIn: '1h' });
    res.status(201).json({ token, user: { id: user.id, name: user.name, gender: user.gender } });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const login = async (req, res) => {
  const { name, password } = req.body;

  try {
    const user = await User.findOne({ where: { name } });

    if (!user) {
      return res.status(400).json({ error: 'User not found.' });
    }

    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) {
      return res.status(401).json({ error: 'Invalid password.' });
    }

    const token = jwt.sign({ id: user.id }, 'secret_key', { expiresIn: '1h' });
    res.json({ token, user: { id: user.id, name: user.name, gender: user.gender } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { register, login };
