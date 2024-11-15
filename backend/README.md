# CouchDb 동기화 로그인 기능을 위한 CouchAuth (SuperLogin) 기반 Express 서버

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

3. server.js 파일 작성 후, 아래 내용 추가 (CouchAuth 라이브러리 사용)

4. docker-compose를 통한 couchdb, redis 실행

```
docker-compose up -d
```

5. user 데이터 베이스 생성 (couchdb 3.0부터는 클러스터링 기능 때문에 기본 테이블 생성 안함)
   아래 방식 또는 http://localhost:5984/\_utils 사이트에서, 직접 생성

```
# sl-users 데이터베이스 생성
curl -X PUT http://admin:password@localhost:5984/sl-users

# _users 데이터베이스 생성 (CouchDB의 내부 데이터베이스로 주로 사용자를 관리하는 데 사용)
curl -X PUT http://admin:password@localhost:5984/_users

```

couch db CORS 설정

```
http://localhost:5984/\_utils 사이트에서 ENABLE CORS
```

6. 실행

```
npm run start
```

7. 정리

```
# volume까지 정리
docker-compose down -v
```
