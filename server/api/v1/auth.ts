import express from 'express';
import passport from 'passport';
import passportJwt from 'passport-jwt';
import passportLocal from 'passport-local';
import jwt from 'jsonwebtoken';

import UserModel from '../../db/models/users';

const { Strategy: JwtStrategy, ExtractJwt } = passportJwt;
const { Strategy: LocalStrategy } = passportLocal;

const jwtAudience = 'mypage.com';

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
  audience: jwtAudience,
};

// Setup passport JWT
passport.use(new JwtStrategy(opts, (jwtPayload, done): void => {
  UserModel.findById(jwtPayload.userId, (err, user): void => {
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

type signJwtType = (res: express.Response, userId: string) => void;
const signJwt: signJwtType = function (res, userId): void {
  jwt.sign(
    { userId },
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    process.env.JWT_SECRET!,
    { expiresIn: '30 days', audience: jwtAudience },
    (err, token): void => {
      if (err) res.sendError(500, 'JWT error');
      res.sendSuccess({ userId, token });
    },
  );
};

export default express.Router()
  .post('/login',
    passport.authenticate('local', { session: false }),
    (req, res): void => {
      signJwt(res, req.user.id);
    })

  // Create user
  .post('/register', async (req, res): Promise<void> => {
    try {
      const userModel = new UserModel(req.body);
      const user = await userModel.save();
      signJwt(res, user.id);
    } catch (err) {
      res.sendError(500, err.message);
    }
  })

  // From here on, has to be authenticated
  .use(passport.authenticate('jwt', { session: false }));
