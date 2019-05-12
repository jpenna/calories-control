import express from 'express';
import passport from 'passport';
import passportJwt from 'passport-jwt';
import passportLocal from 'passport-local';
import jwt from 'jsonwebtoken';

import UserModel from '../../db/models/users';

const { Strategy: JwtStrategy, ExtractJwt } = passportJwt;
const { Strategy: LocalStrategy } = passportLocal;

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
  audience: 'mypage.com',
};

// Setup passport JWT
passport.use(new JwtStrategy(opts, (jwtPayload, done): void => {
  UserModel.findOne({ id: jwtPayload.sub }, (err, user): void => {
    if (err) return done(err, false);
    if (user) return done(null, user);
    done(null, false);
  });
}));

// Setup passport local
passport.use(new LocalStrategy({
  usernameField: 'email',
}, (email, password, done): void => {
  UserModel.findOne({ email }, (err, user): void => {
    // DB error
    if (err) return done(err);
    // User not found
    if (!user) return done(null, false);
    user.verifyPassword(password).then((verified): void => {
      // Wrong Password
      if (!verified) return done(null, false);
      // Authenticated
      return done(null, user);
    });
  });
}));

export default express.Router()
  .post('/login',
    passport.authenticate('local', { session: false }),
    async (req, res): Promise<void> => {
      // jwt.sign({ foo: 'bar' }, privateKey, { algorithm: 'RS256' }, function(err, token) {
      //   console.log(token);
      // });
      res.json(req.user);
    })

  // Create user
  .post('/register', async (req, res): Promise<void> => {
    try {
      const userModel = new UserModel(req.body);
      const user = await userModel.save();
      res.json(user);
    } catch (err) {
      res.status(500);
      res.json({
        success: false,
        error: err.message,
      });
    }
  })

  // From here on, has to be authenticated
  .use(passport.authenticate('jwt', { session: false }));
