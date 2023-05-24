const GoogleStrategy = require('passport-google-oauth20').Strategy;

// models
const userModel = require('../models/user.model.js');

// config
const config = require('../config/config.js');

// helpers
const { getEmailInfo } = require('../helpers/emailExtractor.js');

// services
const { generateToken } = require('../services/token.service.js');

module.exports = (passport) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: config.googleClientId,
        clientSecret: config.googleClientSecret,
        callbackURL: '/auth/google/callback',
      },
      (accessToken, refreshToken, profile, done) => {
        const email = profile.emails[0].value;
        const avatar = profile.photos[0].value;

        userModel
          .findOne({ googleId: profile.id })
          .then(async (existingUser) => {
            if (existingUser) {
              let token = generateToken(existingUser._id);
              existingUser.token = token;
              done(null, existingUser);
            } else {
              let payload = {
                googleId: profile.id,
                email: email,
                name: profile.displayName,
                avatar: avatar,
              };
              let extractedInfo = await getEmailInfo(email);
              if (extractedInfo.role === 'student') {
                payload = { ...payload, ...extractedInfo };
              }

              const user = await userModel(payload).save();

              if (user) {
                let token = generateToken(user._id);
                user['token'] = token;
                done(null, user);
              }
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
