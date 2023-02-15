const GoogleStrategy = require('passport-google-oauth20').Strategy;

// models
const userModel = require('../models/user.model.js');

// config
const config = require('../config/config.js');

module.exports = (passport) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: config.googleClientId,
        clientSecret: config.googleClientSecret,
        callbackURL: '/auth/google/callback',
      },
      (accessToken, refreshToken, profile, done) => {
        console.log(profile);
        return done(null, profile);
        // const email = profile.emails[0].value;
        // const avatar = profile.photos[0].value;

        // userModel.findOne({ googleId: profile.id }).then((existingUser) => {
        //   if (existingUser) {
        //     done(null, existingUser);
        //   } else {
        //     new userModel({
        //       googleId: profile.id,
        //       email: email,
        //       name: profile.displayName,
        //       avatar: avatar,
        //     })
        //       .save()
        //       .then((user) => done(null, user));
        //   }
        // });
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user);
    // done(null, user.id);
  });

  passport.deserializeUser((user, done) => {
    done(null, user);
    // userModel.findById(id).then((user) => done(null, user));
  });
  // passport.deserializeUser((id, done) => {
  //   userModel.findById(id).then((user) => done(null, user));
  // });
};
