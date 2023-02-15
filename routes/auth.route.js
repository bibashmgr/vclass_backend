const express = require('express');
const passport = require('passport');

// config
const config = require('../config/config.js');

// controllers
const {
  getUserInfo,
  logoutUser,
} = require('../controllers/auth.controller.js');

const router = express.Router();

router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${config.clientBaseUrl}/auth/login`,
  }),
  (req, res) => {
    res.redirect(`${config.clientBaseUrl}/`);
  }
);
router.get('/login/success', getUserInfo);
router.get('/logout', logoutUser);

module.exports = router;
