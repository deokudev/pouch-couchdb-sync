# CouchDB PouchDB Sync 예시

# History

```
ionic start pouch-couchdb-sync
cd pouch-couchdb-sync

ionic g page Login
ionic g page Signup
ionic g service PouchDb

npm install pouchdb --save
npm install @types/pouchdb --save-dev

// app.module.ts 상에 Service, Page import
// Page 코드 추가

// backend 폴더에 로그인 기능을 위한 express 서버 구현

// couchdb 실행을 위한 docker-compose.yml 작성
// docker 설치되어 있지 않다면, rancher desktop 설치
docker-compose up -d # docker-compose up 명령어를 통한, docker container 실행
docker ps

http://localhost:5984/_utils/ 접속하여, CouchDB Fauxton 관리 인터페이스 접근 가능
// couchdb에 대한 cors 설정 또한 필수적
// Fauxton 관리 인터페이스에서도 설정 가능하나, curl로 터미널 상에서도 가능하다.
// 아래와 같이 설정해야, 외부 애플리케이션이 CORS 제한 없이 CouchDB API에 접근할 수 있습니다.
# CORS 활성화
curl -X PUT http://admin:password@localhost:5984/_node/couchdb@localhost/_config/httpd/enable_cors -d '"true"'

# 허용할 Origins 설정(모든 도메인 허용. 보안 필요 시 특정 도메인으로 제한)
curl -X PUT http://admin:password@localhost:5984/_node/couchdb@localhost/_config/cors/origins -d '"*"'

# CORS 설정 - 허용할 credentials, methods, headers
curl -X PUT http://admin:password@localhost:5984/_node/couchdb@localhost/_config/cors/credentials -d '"true"'
curl -X PUT http://admin:password@localhost:5984/_node/couchdb@localhost/_config/cors/methods -d '"GET, PUT, POST, DELETE"'
curl -X PUT http://admin:password@localhost:5984/_node/couchdb@localhost/_config/cors/headers -d '"accept, authorization, content-type, origin"'

# 앱 실행
ionic serve
```

# 출처

Creating a Multiple User App with PouchDB & CouchDB
https://www.joshmorony.com/creating-a-multiple-user-app-with-pouchdb-couchdb/

joshmorony - Build Mobile Apps with HTML5 – 21 Jul 16
https://www.joshmorony.com/part-2-creating-a-multiple-user-app-with-ionic-2-pouchdb-couchdb/

joshmorony - Build Mobile Apps with HTML5 – 4 Jul 17
https://www.joshmorony.com/restricting-document-updates-in-couchdb/

Case Study: A Complex CouchDB/PouchDB Application in Ionic
https://www.joshmorony.com/case-study-a-complex-couchdbpouchdb-application-in-ionic/
