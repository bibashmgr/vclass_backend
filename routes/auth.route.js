const express = require('express');
const passport = require('passport');

// config
const config = require('../config/config.js');

// controllers
const { getUserInfo } = require('../controllers/auth.controller.js');

// middlewares
const { userValidation } = require('../middlewares/validation.middleware.js');

const router = express.Router();

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
  })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${config.clientBaseUrl}/auth/login`,
    session: false,
  }),
  (req, res) => {
    res.redirect(
      `${config.clientBaseUrl}/auth/login/success?token=${req.user.token}`
    );
  }
);

router.get('/login/success', userValidation, getUserInfo);

module.exports = router;
