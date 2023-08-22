"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _express = require('express'); var _express2 = _interopRequireDefault(_express);
var _nodemailer = require('nodemailer'); var _nodemailer2 = _interopRequireDefault(_nodemailer);
// import Boom from "boom";

var _hasura = require('../../clients/hasura'); var _hasura2 = _interopRequireDefault(_hasura);
var _queries = require('./queries');

const router = _express2.default.Router();

const smtpConfig = {
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    password: process.env.GMAIL_PASSWORD,
  },
};

const transporter = _nodemailer2.default.createTransport(smtpConfig);

router.get("/meeting_created", (req, res) =>{
    res.send("Hello World")
})

router.post("/meeting_created", async (req, res, next) => {
  const meeting = req.body.event.data.new;

  res.send({meeting})

  const { meetings_by_pk } = await _hasura2.default.request(_queries.GET_MEETING_PARTICIPANTS, {
    id: meeting.id,
  });

  const title = meeting.title;
  const { fullName } = meetings_by_pk.user;
  const participants = meetings_by_pk.participants
    .map(({ user }) => user.email)
    .toString();

  const mailOptions = {
    from: "myhasurabackendd@gmail.com",
    to: participants,
    subject: `${fullName} sizi bir görüşmeye davet etti`,
    text: `${fullName} sizi ${title} adlı görüşmeye davet etti.`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      throw new Error(error)
    }

    res.json({ info });
  });
});

exports. default = router;
