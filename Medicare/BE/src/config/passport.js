const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:8000/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value?.toLowerCase();
        if (!email) {
          return done(new Error('Google không cung cấp email'), null);
        }
        const googleAvatar = profile.photos?.[0]?.value;

        // Check if user exists by googleId
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          // Update Google access token and avatar if changed
          user.googleAccessToken = accessToken;
          if (!user.avatar && googleAvatar) user.avatar = googleAvatar;
          user.lastLogin = new Date();
          await user.save();
          return done(null, user);
        }

        // Check if email already registered (merge accounts)
        user = await User.findOne({ email });

        if (user) {
          user.googleId = profile.id;
          user.googleAccessToken = accessToken;
          user.isEmailVerified = true; // Google verified the email
          if (!user.avatar && googleAvatar) user.avatar = googleAvatar;
          user.lastLogin = new Date();
          await user.save();
          return done(null, user);
        }

        // Create new user from Google
        user = await User.create({
          googleId: profile.id,
          email,
          fullName: profile.displayName,
          avatar: googleAvatar,
          isEmailVerified: true,
          googleAccessToken: accessToken,
          lastLogin: new Date(),
        });

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
