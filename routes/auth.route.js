const express = require('express');
const passport = require('passport');

// environment variables
CLIENT_BASE_URL = process.env.CLIENT_BASE_URL;

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
    failureRedirect: `${CLIENT_BASE_URL}/auth/login`,
  }),
  (req, res) => {
    res.redirect(`${CLIENT_BASE_URL}/auth/login`);
  }
);
router.get('/login/success', getUserInfo);
router.get('/logout', logoutUser);

module.exports = router;
