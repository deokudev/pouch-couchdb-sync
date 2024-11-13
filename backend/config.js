import dotenv from "dotenv";
// dotenv 설정
dotenv.config();

const config = {
  testMode: {
    noEmail: !process.env.SENDGRID_USERNAME,
    debugEmail: !process.env.SENDGRID_USERNAME,
  },
  security: {
    maxFailedLogins: 5,
    lockoutTime: 600,
    tokenLife: 86400,
    // 사용자가 가입할 때 자동으로 인증되므로 가입 후 로그인하는 대신 바로 메인 애플리케이션으로 이동할 수 있습니다.
    loginOnRegistration: true,
  },
  local: {
    sendConfirmEmail: true,
    requireEmailConfirm: false,
  },
  // Couch db host url, port, username, password
  dbServer: {
    protocol: process.env.DB_HOST ? "https://" : "http://",
    // fix: 127.0.0.1을 사용하여 IPv4로 명확히 지정 필요
    host: process.env.DB_HOST || "127.0.0.1:5984",
    user: process.env.DB_USER || "admin",
    password: process.env.DB_PASSWORD || "password",
    // Automatically detect if the host is Cloudant
    cloudant: process.env.DB_HOST && process.env.DB_HOST.search(/\.cloudant\.com$/) > -1,
    userDB: "sl-users",
    couchAuthDB: "_users",
  },
  // Session 관리로 Redis를 사용할 경우(선택)
  // session: {
  //   adapter: "redis",
  //   redis: {
  //     url: process.env.REDIS_URL || "//localhost:6379",
  //   },
  // },
  userDBs: {
    // 현재는 personal 라는 단일 개인 데이터베이스를 가지고 있습니다 . 즉, 가입하는 각 사용자에게 다음 형식으로 생성되는 자체 개인 데이터베이스가 제공됩니다.
    // SuperLogin에는 여러 사용자가 접근할 수 있는 공유 데이터베이스를 생성하도록 지시할 수도 있음
    defaultDBs: {
      private: ["personal"],
    },
    model: {
      personal: {
        designDocs: [],
        permissions: ["_reader", "_writer", "_replicator"],
      },
    },
    // privatePrefix: "sldemo",
    // designDocDir: __dirname + "/designDocs",
  },
  providers: {
    local: true,
    google: {
      credentials: {
        clientID: process.env.GOOGLE_CLIENTID,
        clientSecret: process.env.GOOGLE_CLIENTSECRET,
      },
      options: {
        scope: ["profile", "email"],
      },
    },
  },
  //   //  Mail(Gmail)
  //   mailer: {
  //     fromEmail: process.env.FROM_EMAIL || "gmail.user@gmail.com",
  //     options: {
  //       service: "Gmail",
  //       auth: {
  //         user: "gmail.user@gmail.com",
  //         pass: "userpass",
  //       },
  //     },
  //   },
  //   //  Mail(SendGrid)
  //   mailer: {
  //     fromEmail: process.env.FROM_EMAIL || "noreply@example.com",
  //     transport: require("nodemailer-sendgrid-transport"),
  //     options: {
  //       auth: {
  //         api_user: process.env.SENDGRID_USERNAME,
  //         api_key: process.env.SENDGRID_PASSWORD,
  //       },
  //     },
  //   },
};
export default config;
