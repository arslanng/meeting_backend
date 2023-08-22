"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }var _jsonwebtoken = require('jsonwebtoken'); var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);
var _boom = require('boom'); var _boom2 = _interopRequireDefault(_boom);

 const singAccessToken = (user) => {
  return new Promise((resolve, reject) => {
    const payload = {
      "https://hasura.io/jwt/claims": {
        // hasurada kullanabilmemiz için gereken tanımlar.
        "x-hasura-allowed-roles": ["user"],
        "x-hasura-default-role": "user",
        "x-hasura-user-id": user.id.toString(),
      },
      email: user.email,
    };

    const options = {
      expiresIn: "100d", // ne kadar süre için geçerli
      issuer: "graphql-egitimi", // tokenı kim vermiş
      audience: user.id.toString(), // token kime verilmiş
    };

    _jsonwebtoken2.default.sign(
      payload,
      process.env.JWT_ACCESS_TOKEN_SECRET,
      options,
      (err, token) => {
        if (err) {
          return reject(_boom2.default.internal("JWT sing error"));
        }
        resolve(token);
      }
    ); // ilk parametre payload, ikinci parametre access token secret, üçüncü parametre options, dördüncü parametre callback fonksiyon
  });
}; exports.singAccessToken = singAccessToken;

 const verifyAccessToken = (req, res, next) => {
  const authHeader = req.headers.authorization || _optionalChain([req, 'access', _ => _.query, 'access', _2 => _2.token, 'optionalAccess', _3 => _3.toString, 'call', _4 => _4()]);

  if (!authHeader) {
    return next(_boom2.default.unauthorized("No token provided"));
  }

  const bearerToken = authHeader.split(" ");
  const token = bearerToken[bearerToken.length - 1];

  _jsonwebtoken2.default.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      const message =
        err.name === "JsonWebTokenError" ? "Unouthorized" : err.message;
      return next(_boom2.default.unauthorized(message));
    }
    req.payload = decoded;
    req.token = token;
    next();
  });
}; exports.verifyAccessToken = verifyAccessToken;
