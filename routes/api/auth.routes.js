const express = require('express');
const { schemas } = require('../../models/user.model');
const ctrl = require('../../controllers/auth.controller');
const { validateBody, authenticate } = require('../../middlewares');

const router = express.Router();

router.post(
  '/register',
  validateBody(schemas.registerUserSchema, 'missing fields'),
  ctrl.registerUser
);

router.post(
  '/login',
  validateBody(schemas.loginUserSchema, 'missing fields'),
  ctrl.loginUser
);

router.post('/logout', authenticate, ctrl.logoutUser);

router.get('/current', authenticate, ctrl.getCurrentUser);

router.patch(
  '/themes',
  authenticate,
  validateBody(schemas.updateThemeSchema),
  ctrl.updateTheme
);

// router.patch(
//   '/',
//   authenticate,
//   validateBody(schemas.updateUserSubscription, 'missing field subscription'),
//   ctrl.updateUserSubscription
// );

module.exports = router;
