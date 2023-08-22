import express from "express";
import nodemailer from "nodemailer";
// import Boom from "boom";

import Hasura from "../../clients/hasura";
import { GET_MEETING_PARTICIPANTS } from "./queries";

const router = express.Router();

const smtpConfig = {
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    password: process.env.GMAIL_PASSWORD,
  },
};

const transporter = nodemailer.createTransport(smtpConfig);

router.get("/meeting_created", (req, res) =>{
    res.send("Hello World")
})

router.post("/meeting_created", async (req, res, next) => {
  const meeting = req.body.event.data.new;

  const { meetings_by_pk } = await Hasura.request(GET_MEETING_PARTICIPANTS, {
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

export default router;
