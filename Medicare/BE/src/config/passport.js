const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

const isGoogleConfigured = () =>
  process.env.GOOGLE_CLIENT_ID
  && process.env.GOOGLE_CLIENT_SECRET
  && !String(process.env.GOOGLE_CLIENT_ID).includes('your_google');

if (isGoogleConfigured()) {
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

          let user = await User.findOne({ googleId: profile.id });

          if (user) {
            user.googleAccessToken = accessToken;
            if (!user.avatar && googleAvatar) user.avatar = googleAvatar;
            user.lastLogin = new Date();
            await user.save();
            return done(null, user);
          }

          user = await User.findOne({ email });

          if (user) {
            user.googleId = profile.id;
            user.googleAccessToken = accessToken;
            user.isEmailVerified = true;
            if (!user.avatar && googleAvatar) user.avatar = googleAvatar;
            user.lastLogin = new Date();
            await user.save();
            return done(null, user);
          }

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
} else {
  console.warn('[Passport] Google OAuth chưa cấu hình — bỏ qua đăng nhập Google.');
}

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
