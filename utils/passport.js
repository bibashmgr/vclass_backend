const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');

// models
const userModel = require('../models/user.model.js');

// config
const config = require('../config/config.js');
const { getEmailInfo } = require('../services/email.service.js');

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

        userModel.findOne({ googleId: profile.id }).then((existingUser) => {
          if (existingUser) {
            let token = jwt.sign(
              {
                id: existingUser._id,
                iat: Math.floor(Date.now() / 1000),
                exp:
                  Math.floor(Date.now() / 1000) +
                  60 * config.jwtAccessExpirationMins,
              },
              config.jwtSecret
            );
            existingUser.token = token;
            done(null, existingUser);
          } else {
            let extractedInfo = getEmailInfo(email);
            let payload = {
              googleId: profile.id,
              email: email,
              name: profile.displayName,
              avatar: avatar,
            };
            if (extractedInfo.role === 'student') {
              payload = { ...payload, ...extractedInfo };
            }
            new userModel(payload).save().then((user) => {
              let token = jwt.sign(
                {
                  id: user._id,
                  iat: Math.floor(Date.now() / 1000),
                  exp:
                    Math.floor(Date.now() / 1000) +
                    60 * config.jwtAccessExpirationMins,
                },
                config.jwtSecret
              );
              user.token = token;
              done(null, user);
            });
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
