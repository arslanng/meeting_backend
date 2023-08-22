import express from "express";
import Boom from "boom";
import dotenv from "dotenv";

// routes
import auth from "./routes/auth";
import webhooks from "./routes/webhooks";

dotenv.config();

const app = express();

const port = process.env.PORT || 3001;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/auth", auth);
app.use("/webhooks", webhooks);

//route tanımı olmayan bir sayfaya istek yapıldığında:
app.use((req, res, next) => {
  return next(Boom.notFound("Not Found"));
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
