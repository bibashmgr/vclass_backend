const GoogleStrategy = require('passport-google-oauth20').Strategy;
const dotenv = require('dotenv');

// models
const userModel = require('../models/user.model.js');

// environment variables
dotenv.config();
CLIENT_BASE_URL = process.env.CLIENT_BASE_URL;
GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

module.exports = (passport) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback',
      },
      (accessToken, refreshToken, profile, done) => {
        const email = profile.emails[0].value;
        const avatar = profile.photos[0].value;

        userModel.findOne({ googleId: profile.id }).then((existingUser) => {
          if (existingUser) {
            done(null, existingUser);
          } else {
            new userModel({
              googleId: profile.id,
              email: email,
              name: profile.displayName,
              avatar: avatar,
            })
              .save()
              .then((user) => done(null, user));
          }
        });
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    userModel.findById(id).then((user) => done(null, user));
  });
};
