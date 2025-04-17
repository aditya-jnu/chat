const bcrypt = require('bcrypt');
const userModel = require('../models/userSchema');
const jwt = require('jsonwebtoken');
require('dotenv').config();

//********** Sign-Up Controller **********\\
exports.signUp = async (req, res) => {
  try {
    let { fullname, username, password } = req.body;
    username = username.toLowerCase();
    const userExist = await userModel.findOne({ username });

    if (userExist) {
      return res.status(400).json({
        success: false,
        message: 'this userName already exist'
      });
    }
    if (password.length<8){
      return res.status(401).json({
        success: false,
        message: 'the passWord must be at least 8 characters long'
      })
    }
    // password hashing
    let hashedPass;
    try {
      hashedPass = await bcrypt.hash(password, 10);
    } catch (err) {
      console.error('Error in hashing the password', err);
      return res.status(500).json({
        success: false,
        message: 'error in processing your request'
      });
    }

    const userData = await userModel.create({
      fullname,
      username,
      password: hashedPass,
    });
    console.log('New user saved in DB', userData);

    return res.status(201).json({
      success: true,
      message: 'user created successfully!',
      user: userData
    });
  } catch (err) {
    console.error('Error in sign-up process', err);
    return res.status(500).json({
      success: false,
      message: 'internal server error, please try again later.'
    });
  }
};

//********** Sign-In Controller **********\\
exports.signIn = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('User input:', username, password);

    const userExist = await userModel.findOne({ username })

    if (!userExist) {
      console.log('user does not exist, please signUp.');
      return res.status(402).json({
        success: false,
        message: 'user does not exist, please signUp.'
      });
    }

    console.log('user found in DB', userExist);

    const isPasswordValid = await bcrypt.compare(password, userExist.password);

    if(isPasswordValid){
      console.log("PASSWORD VALID")
      // Generate JWT token
      const token = jwt.sign(
        { userId: userExist._id, userName: userExist.username }, // Payload with necessary user data
        process.env.JWT_SECRET, // Secret key from environment variables
        { expiresIn: '1h' } // Token expiry time (optional)
      );
      return res.status(200).json({
        success: true,
        message: 'user loggedIn successfully.',
        user: userExist,
        token: token
      });
    } else {
      return res.status(403).json({
        success: false,
        message: 'incorrect passWord, please try again.'
      });
    }
  } catch (err) {
    console.error('Error in sign-in process', err);
    return res.status(500).json({
      success: false,
      message: 'internal server error, please try again later.'
    });
  }
};
