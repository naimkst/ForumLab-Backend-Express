const express = require('express');
const bcrypt = require('bcryptjs');

const User = require('../models/user');
const Session = require('../models/session');
const { authenticate } = require('../middleware/authenticate');
const { csrfCheck } = require('../middleware/csrfCheck');
const { initSession, isEmail } = require('../utils/utils');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!isEmail(email)) {
      throw new Error('Email must be a valid email address.');
    }
    if (typeof password !== 'string') {
      throw new Error('Password must be a string.');
    }
    const user = new User({ email, password });
    const persistedUser = await user.save();
    const userId = persistedUser._id;
    const session = await initSession(userId);

    res
      .cookie('token', session.token, {
        httpOnly: true,
        sameSite: true,
        maxAge: 1209600000,
        secure: process.env.NODE_ENV === 'production',
      })
      .status(201)
      .json({
        message: 'User Registration Successful',
        csrfToken: session.csrfToken,
      });
  } catch (err) {
    res.status(400).json({
      errors: [
        {
          message: 'Something went wrong during registration process.',
          error: err.message,
        },
      ],
    });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!isEmail(email)) {
      return res.status(400).json({
        errors: [
          {
            title: 'Bad Request',
            detail: 'Email must be a valid email address',
          },
        ],
      });
    }
    if (typeof password !== 'string') {
      return res.status(400).json({
        errors: [
          {
            title: 'Bad Request',
            detail: 'Password must be a string',
          },
        ],
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error();
    }
    const userId = user._id;

    const passwordValidated = await bcrypt.compare(password, user.password);
    if (!passwordValidated) {
      throw new Error();
    }

    const session = await initSession(userId);

    res
      .cookie('token', session.token, {
        httpOnly: true,
        sameSite: true,
        maxAge: 1209600000,
        secure: process.env.NODE_ENV === 'production',
      })
      .json({
        message: 'Login Successful',
        csrfToken: session.csrfToken,
      });
  } catch (err) {
    res.status(401).json({
      errors: [
        {
          message: 'Invalid Credentials',
          error: err.message,
        },
      ],
    });
  }
});

router.get('/me', authenticate, async (req, res) => {
  try {
    const { userId } = req.session;
    const user = await User.findById({ _id: userId }, { email: 1, _id: 0 });

    res.json({
      message: 'Authentication successful',
      user,
    });
  } catch (err) {
    res.status(401).json({
      errors: [
        {
          message: 'Not authorized to access this route',
          error: err.message,
        },
      ],
    });
  }
});

router.delete('/me', authenticate, csrfCheck, async (req, res) => {
  try {
    const { userId } = req.session;
    const { password } = req.body;
    if (typeof password !== 'string') {
      throw new Error();
    }
    const user = await User.findById({ _id: userId });

    const passwordValidated = await bcrypt.compare(password, user.password);
    if (!passwordValidated) {
      throw new Error();
    }

    await Session.expireAllTokensForUser(userId);
    res.clearCookie('token');
    await User.findByIdAndDelete({ _id: userId });
    res.json({
      message: 'Account Deleted',
    });
  } catch (err) {
    res.status(401).json({
      errors: [
        {
          message: 'Invalid Credentials',
          error: err.message,
        },
      ],
    });
  }
});

router.put('/logout', authenticate, csrfCheck, async (req, res) => {
  try {
    const { session } = req;
    await session.expireToken(session.token);
    res.clearCookie('token');

    res.json({
      title: 'Logout Successful',
      detail: 'Successfuly expired login session',
    });
  } catch (err) {
    res.status(400).json({
      errors: [
        {
          message: 'Logout Failed',
          error: err.message,
        },
      ],
    });
  }
});

module.exports = router;
