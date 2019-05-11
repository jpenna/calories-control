import express from 'express';
import passport from 'passport';
import passportJwt from 'passport-jwt';

import UserModel from '../../db/models/users';

const { Strategy: JwtStrategy, ExtractJwt } = passportJwt;
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
  audience: 'mypage.com',
};

passport.use(new JwtStrategy(opts, (jwtPayload, done): void => {
  UserModel.findOne({ id: jwtPayload.sub }, (err, user): void => {
    if (err) return done(err, false);
    if (user) return done(null, user);
    return done(null, false);
  });
}));

export default express.Router()
  .post('/login', async (req, res): Promise<void> => {
    try {
      const { email, password } = req.body;
      if (!email !== !password) throw Error('Email and password are required');
    } catch (err) {
      res.status(400).send({
        success: false,
        error: err.message,
      });
    }
  })

  // Create user
  .post('/register', async (req, res): Promise<void> => {
    try {
      const userModel = new UserModel(req.body);
      const { password, ...user } = (await userModel.save()).toObject();
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
