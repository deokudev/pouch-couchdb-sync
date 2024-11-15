import express from "express";
import bodyParser from "body-parser";
import logger from "morgan";
import cors from "cors";
import { CouchAuth } from "@perfood/couch-auth";
import dotenv from "dotenv";
import { Strategy as GoogleTokenStrategy } from "passport-google-token";
import { getProfile, changeProfileName } from "./profile.js";
import config from "./config.js";

// dotenv 설정
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.set("port", PORT);
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// Redirect to https except on localhost
app.use(httpsRedirect);

// app.use(express.static(path.join(__dirname, "../frontend/www")));
// app.use("*", function (req, res) {
//   res.sendFile("index.html", { root: path.join(__dirname, "../client/www") });
// });

app.use(cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "DELETE, POST, PUT");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// couchAuth 초기화
const couchAuth = new CouchAuth(config);

couchAuth.registerTokenProvider("google", GoogleTokenStrategy);

// couchAuth Router 설정 (API 제공)
app.use("/auth", couchAuth.router);

app.get("/user/profile", couchAuth.requireAuth, function (req, res, next) {
  getProfile(couchAuth, req.user._id).then(
    function (userProfile) {
      res.status(200).json(userProfile);
    },
    function (err) {
      return next(err);
    }
  );
});

app.post("/user/change-name", couchAuth.requireAuth, function (req, res, next) {
  if (!req.body.newName) {
    return next({
      error: "Field 'newName' is required",
      status: 400,
    });
  }
  changeProfileName(couchAuth, req.user._id, req.body.newName).then(
    function (userProfile) {
      res.status(200).json(userProfile);
    },
    function (err) {
      return next(err);
    }
  );
});

app.post("/user/destroy", couchAuth.requireAuth, function (req, res, next) {
  couchAuth.removeUser(req.user._id, true).then(
    function () {
      console.log("User destroyed!");
      res
        .status(200)
        .json({ ok: true, success: "User: " + req.user._id + " destroyed." });
    },
    function (err) {
      return next(err);
    }
  );
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// development error handler
// will print stacktrace
if (app.get("env") === "development") {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render("error", {
      message: err.message,
      error: err,
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render("error", {
    message: err.message,
    error: {},
  });
});

// Force HTTPS redirect unless we are using localhost
function httpsRedirect(req, res, next) {
  if (
    req.protocol === "https" ||
    req.header("X-Forwarded-Proto") === "https" ||
    req.hostname === "localhost"
  ) {
    return next();
  }
  res.status(301).redirect("https://" + req.headers["host"] + req.url);
}

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
