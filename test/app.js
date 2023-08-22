"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _express = require('express'); var _express2 = _interopRequireDefault(_express);
var _boom = require('boom'); var _boom2 = _interopRequireDefault(_boom);
var _dotenv = require('dotenv'); var _dotenv2 = _interopRequireDefault(_dotenv);

// routes
var _auth = require('./routes/auth'); var _auth2 = _interopRequireDefault(_auth);
var _webhooks = require('./routes/webhooks'); var _webhooks2 = _interopRequireDefault(_webhooks);

_dotenv2.default.config();

const app = _express2.default.call(void 0, );

const port = process.env.PORT || 3001;

app.use(_express2.default.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/auth", _auth2.default);
app.use("/webhooks", _webhooks2.default);

//route tanımı olmayan bir sayfaya istek yapıldığında:
app.use((req, res, next) => {
  return next(_boom2.default.notFound("Not Found"));
});

//hata gönderildiğinde:
app.use((err, req, res, next) => {
  if (err) {
    if (err.output) {
      return res.status(err.output.statusCode || 500).json(err.output.payload);
    }
  }

  return res.status(500).json(err);
});

app.listen(port, () => console.log(`Server is up and running. Port: ${port}`));
