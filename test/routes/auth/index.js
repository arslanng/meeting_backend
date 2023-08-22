"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _express = require('express'); var _express2 = _interopRequireDefault(_express);
var _boom = require('boom'); var _boom2 = _interopRequireDefault(_boom);
var _bcryptjs = require('bcryptjs'); var _bcryptjs2 = _interopRequireDefault(_bcryptjs);
var _helpers = require('./helpers'); // accessToken için import edildi.

var _hasura = require('../../clients/hasura'); var _hasura2 = _interopRequireDefault(_hasura);
var _queries = require('./queries');
var _validations = require('./validations');

const router = _express2.default.Router();

router.post("/register", async (req, res, next) => {
  const input = req.body.input.data;

  input.email = input.email.toLowerCase();

  // validasyon işlemi
  const { error } = _validations.registerSchema.validate(input);
  if (error) {
    return next(_boom2.default.badRequest(error.details[0].message));
  }

  try {
    const isExistUser = await _hasura2.default.request(_queries.IS_EXIST_USER, {
      email: input.email,
    });

    // user zaten varsa hata ver
    if (isExistUser.users.length > 0) {
      throw _boom2.default.conflict(`user already exist (${input.email})`);
    }

    // Parola şifreleme işlemi
    const salt = await _bcryptjs2.default.genSalt(10);
    const hash = await _bcryptjs2.default.hash(input.password, salt); // şifrelenmiş parola

    // user yoksa user oluştur
    const { insert_users_one: user } = await _hasura2.default.request(
      _queries.INSERT_USER_MUTATION,
      {
        input: {
          ...input,
          password: hash,
        },
      }
    );

    const accessToken = await _helpers.singAccessToken.call(void 0, user); // accessToken üretildi.

    res.json({ accessToken });
  } catch (err) {
    return next(_boom2.default.badRequest(err));
  }
});

router.post("/login", async (req, res, next) => {
  const input = req.body.input.data;
  input.email = input.email.toLowerCase();

  const { error } = _validations.loginSchema.validate(input);
  if (error) {
    return next(_boom2.default.badRequest(error.details[0].message));
  }

  try {
    const { users } = await _hasura2.default.request(_queries.LOGIN_QUERY, {
      email: input.email,
    });

    if (users.length === 0) {
      throw _boom2.default.unauthorized("Email or password is incorrect");
    }

    const user = users[0];

    const isMatch = await _bcryptjs2.default.compare(input.password, user.password);

    if (!isMatch) {
      throw _boom2.default.unauthorized("Email or password is incorrect");
    }

    const accessToken = await _helpers.singAccessToken.call(void 0, user);
    return res.json({ accessToken });
  } catch (err) {
    return next(err);
  }
});

router.post("/me", _helpers.verifyAccessToken, async (req, res, next) => {
  const { aud } = req.payload;

  return res.json({
    user_id: aud,
  });
});

exports. default = router;
