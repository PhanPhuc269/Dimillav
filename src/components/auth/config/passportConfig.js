const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');
require('dotenv').config();
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },async (email, password, done) => {
    console.log('LocalStrategy');
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return done(null, false, { message: 'Incorrect email.' });
        }
        if (user.password===undefined) {
            return done(null, false, { message: 'You registered with Google. Please login with Google.' });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return done(null, false, { message: 'Incorrect password.' });
        }

        if(user.status == 'banned'){
            return done(null, false, { message: 'Your account has been banned.' });
        }
        return done(null, user);
    } catch (error) {
        return done(error);
    }
}
));

// GoogleStrategy (đăng nhập bằng Google)
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID, // Thay bằng Client ID của bạn
    clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Thay bằng Client Secret của bạn
    callbackURL: '/auth/google/callback' // URL callback của bạn
}, async (accessToken, refreshToken, profile, done) => {
    console.log('GoogleStrategy');
    try {
        // Tìm user dựa trên Google ID
        let user = await User.findOne({ email: profile.emails[0].value });

        // Nếu user chưa tồn tại, tạo mới
        if (!user) {
            const email = profile.emails[0].value;
            const username = email.split('@')[0];
            user = await User.create({
                googleId: profile.id,
                email: profile.emails[0].value,
                name: profile.displayName,
                username: username,
                isConfirmed: true
            });
        }
        return done(null, user);
    } catch (error) {
        return done(error);
    }
}));


passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        if (!user) {
            return done(null, false);
        }
        done(null, { ...user.toObject(), isConfirmed: user.isConfirmed });
    } catch (error) {
        done(error);
    }
});

module.exports = passport;