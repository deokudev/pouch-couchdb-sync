# 로그인 기능을 위한 superlogin 기반 express 서버

# History

1. package.json 내 파일 작성

```
{
  "name": "couch-pouchdb-sync-be",
  "version": "0.1.0",
  "description": "A sample Node.js app using Express",
  "engines": {
    "node": ">=16.0.0"
  },
  "main": "server.js",
  "type": "module",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "body-parser": "^1.20.2",
    "cors": "^2.8.5",
    "del": "^6.1.1",
    "express": "^4.18.2",
    "method-override": "^3.0.0",
    "morgan": "^1.10.0",
    "superlogin": "^0.6.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.0"
  }
}
```

2. 아래 명령어를 통해, express 관련 라이브러리 설치

```
npm install
```

3. server.js 파일 작성 후, 아래 내용 추가 (SuperLogin 라이브러리 사용)

```
var express = require("express");
var http = require("http");
var bodyParser = require("body-parser");
var logger = require("morgan");
var cors = require("cors");
var SuperLogin = require("superlogin");

var app = express();
app.set("port", process.env.PORT || 3000);
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// Express 설정
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "DELETE, PUT");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// 이 구성 객체는 SuperLogin을 초기화하는 데 사용되며, 변경할 수 있는 다양한 설정을 포함
var config = {
  dbServer: {
    protocol: "http://",
    // Pouch db host url, port, username, password
    host: "localhost:5984",
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
};
// 세부 설정 참조 : https://github.com/colinskow/superlogin?tab=readme-ov-file

// Initialize SuperLogin
var superlogin = new SuperLogin(config);

// Mount SuperLogin's routes to our app
// /auth/login, /auth/register 사용 가능하게 됨
app.use("/auth", superlogin.router);

app.listen(app.get("port"));
console.log("App listening on " + app.get("port"));
```

4. 실행

```
npm run start
```
