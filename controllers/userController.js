const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();

// @desc Register User
// @route POST /api/users/register
// @access public

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    res.status(400);
    throw new Error('All fields are necessary');
  }
  const userAvailable = await User.findOne({ email });
  if (userAvailable) {
    res.status(400);
    throw new Error('User already present');
  }
  //Hash Password
  const hashPassword = await bcrypt.hash(password, 10);
  console.log('hash password is: ', hashPassword);
  const user = await User.create({
    username,
    email,
    password: hashPassword,
  });

  console.log(`User is ${user}`);
  if (user) {
    res.status(201).json({ _id: user.id, email: user.email });
  } else {
    res.status(400);
    throw new Error('User data not valid');
  }

  res.json({ message: 'Register the user' });
});

// @desc User Login
// @route POST /api/users/login
// @access public

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error('All fields are necessary');
  }
  let user = await User.findOne({ email });
  //compare hash and actual password
  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = jwt.sign(
      {
        user: {
          username: user.username,
          email: user.email,
          id: user._id,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '15m' }
    );
    res.status(200).json({ accessToken }); // Send the token in the response
  } else {
    res.status(401);
    throw new Error('Email or password not valid');
  }
});

// @desc Current user info
// @route POST /api/users/current
// @access private

const currentUser = asyncHandler(async (req, res) => {
  res.json(req.user);
});

module.exports = { registerUser, loginUser, currentUser };
