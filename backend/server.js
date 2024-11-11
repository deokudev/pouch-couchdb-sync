import express from "express";
import bodyParser from "body-parser";
import logger from "morgan";
import cors from "cors";
import SuperLogin from "superlogin";

const app = express();
const PORT = process.env.PORT || 3000;

app.set("port", PORT);
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// Express 설정
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "DELETE, PUT");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// SuperLogin을 초기화하는 데 사용되며, 변경할 수 있는 다양한 설정을 포함
const config = {
  // Pouch db host url, port, username, password
  dbServer: {
    protocol: "http://",
    // fix: 127.0.0.1을 사용하여 IPv4로 명확히 지정 필요
    host: "127.0.0.1:5984",
    user: "admin",
    password: "password",
    userDB: "sl-users",
    couchAuthDB: "_users",
  },
  // 확인 이메일, 비밀번호 분실 이메일 등을 보낼 때 사용
  mailer: {
    fromEmail: "gmail.user@gmail.com",
    options: {
      service: "Gmail",
      auth: {
        user: "gmail.user@gmail.com",
        pass: "userpass",
      },
    },
  },
  security: {
    maxFailedLogins: 3,
    lockoutTime: 600,
    tokenLife: 86400,
    // 사용자가 가입할 때 자동으로 인증되므로 가입 후 로그인하는 대신 바로 메인 애플리케이션으로 이동할 수 있습니다.
    loginOnRegistration: true,
  },
  // 생성될 데이터베이스를 정의
  userDBs: {
    // 현재는 supertest 라는 단일 개인 데이터베이스를 가지고 있습니다 . 즉, 가입하는 각 사용자에게 다음 형식으로 생성되는 자체 개인 데이터베이스가 제공됩니다.
    // SuperLogin에는 여러 사용자가 접근할 수 있는 공유 데이터베이스를 생성하도록 지시할 수도 있음
    defaultDBs: {
      private: ["supertest"],
    },
    model: {
      supertest: {
        permissions: ["_reader", "_writer", "_replicator"],
      },
    },
  },
  providers: {
    local: true,
  },
}; // 세부 설정 참조 : https://github.com/colinskow/superlogin?tab=readme-ov-file

// SuperLogin 초기화 및 라우터 설정
const superlogin = new SuperLogin(config);
// /auth/login, /auth/register 사용 가능하

app.use("/auth", superlogin.router);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
