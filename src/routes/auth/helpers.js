import JWT from "jsonwebtoken";
import Boom from "boom";

export const singAccessToken = (user) => {
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

    JWT.sign(
      payload,
      process.env.JWT_ACCESS_TOKEN_SECRET,
      options,
      (err, token) => {
        if (err) {
          return reject(Boom.internal("JWT sing error"));
        }
        resolve(token);
      }
    ); // ilk parametre payload, ikinci parametre access token secret, üçüncü parametre options, dördüncü parametre callback fonksiyon
  });
};

export const verifyAccessToken = (req, res, next) => {
  const authHeader = req.headers.authorization || req.query.token?.toString();

  if (!authHeader) {
    return next(Boom.unauthorized("No token provided"));
  }

  const bearerToken = authHeader.split(" ");
  const token = bearerToken[bearerToken.length - 1];

  JWT.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      const message =
        err.name === "JsonWebTokenError" ? "Unouthorized" : err.message;
      return next(Boom.unauthorized(message));
    }
    req.payload = decoded;
    req.token = token;
    next();
  });
};
