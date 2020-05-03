const express = require("express");
const bodyParser = require("body-parser");
const usersRoutes = require("./routes/users-routes");
const placesRoutes = require("./routes/places-routes");
const mongoose = require("mongoose");

const app = express();

app.use(bodyParser.json());

app.use("/api/places", placesRoutes);
app.use("/api/users", usersRoutes);

app.use((req, res, next) => {
  const error = new Error("Could not find this route");
  error.code = 404;
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknon error occured" });
});

mongoose
  .connect('mongodb+srv://anurag:Kehkelunga_786@cluster0-sn3p1.mongodb.net/test?retryWrites=true&w=majority')
  .then(() => {
    console.log("Mongo Connected");
    app.listen(5000);
  })
  .catch((err) => console.log(err));
