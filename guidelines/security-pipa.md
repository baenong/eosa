---
guideline_id: security-pipa
guideline_name: 정보보안 및 개인정보보호
version: "2024"
legal_basis: "개인정보보호법(PIPA), 개인정보의 안전성 확보조치 기준(행안부 고시), 전자정부 SW 개발보안 가이드(KISA), 개발자 대상 개인정보 보호조치 적용 안내서(개인정보위), 인공지능(AI) 보안 안내서(KISA)"
source: "KISA 전자정부 SW 개발보안 가이드, KISA JavaScript 시큐어 코딩 가이드, KISA Python 시큐어 코딩 가이드, 개인정보보호위원회 개발자 대상 안내서, KISA AI 보안 안내서"
last_updated: "2026-06-19"
next_review: "2027-06-19"
---

# 정보보안 및 개인정보보호 가이드라인

5개 공식 가이드 통합 (중복 항목 단일화)

## 적용 범위

공공기관이 운영하거나 공공기관을 위해 개발하는 모든 Python·JavaScript 소프트웨어.
AI 기반 서비스(SEC-6.x)는 AI 모델을 학습·서비스하는 시스템에 추가 적용.

---

## SEC-1.0 인증 및 접근 제어

### SEC-1.1 기본 관리자 계정명 금지

- **심각도**: 높음
- **기본 동작**: 관리자 계정은 기관 규칙에 따른 고유 이름 사용
- **의심 패턴 (Python)**: `username = "admin"`, `user = "root"`, `account = "administrator"`
- **의심 패턴 (JS)**: `username: 'admin'`, `user: 'root'`
- **주석 템플릿**: `# EOSA[보안]: 기본 관리자 계정명 사용 의심 (Rule ID: SEC-1.1) — 기관 정책에 따른 계정명으로 변경 검토`
- **근거**: 행안부 정보보안 관리규정 제15조

### SEC-1.2 하드코딩 비밀값 금지

- **심각도**: 높음
- **기본 동작**: 비밀값은 항상 환경변수 또는 시크릿 관리 서비스에서 읽음
- **올바른 예시 (Python)**:
  ```python
  import os
  password = os.environ.get("DB_PASSWORD")
  api_key = os.environ.get("API_KEY")
  ```
- **올바른 예시 (JS)**:
  ```javascript
  const password = process.env.DB_PASSWORD;
  const apiKey = process.env.API_KEY;
  ```
- **의심 패턴**: 문자열 리터럴로 직접 할당된 `password`, `secret`, `api_key`, `token`, `private_key`
- **주석 템플릿**: `# EOSA[보안]: 하드코딩된 비밀값 의심 (Rule ID: SEC-1.2) — 환경변수 또는 시크릿 관리 서비스 사용`
- **근거**: 개인정보보호법 제29조, OWASP A02:2021, KISA 시큐어 코딩 가이드 (보안기능 6항)

### SEC-1.3 세션 보안

- **심각도**: 높음
- **기본 동작**: 세션 쿠키에 `HttpOnly`, `Secure`, `SameSite=Strict` 설정. 로그인 성공 후 세션 ID 재생성
- **올바른 예시 (Python/Flask)**:
  ```python
  app.config['SESSION_COOKIE_HTTPONLY'] = True
  app.config['SESSION_COOKIE_SECURE'] = True
  app.config['SESSION_COOKIE_SAMESITE'] = 'Strict'
  ```
- **올바른 예시 (JS/Express)**:
  ```javascript
  app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, secure: true, sameSite: 'strict' }
  }));
  // 로그인 성공 후 세션 재생성
  req.session.regenerate((err) => { req.session.userId = user.id; });
  ```
- **의심 패턴**: `httpOnly: false`, `secure: false`, 로그인 전후 동일 세션 ID 유지
- **주석 템플릿**: `# EOSA[보안]: 세션 쿠키 보안 속성 누락 의심 (Rule ID: SEC-1.3) — HttpOnly·Secure·SameSite 설정 확인`
- **근거**: 개인정보의 안전성 확보조치 기준 제6조, KISA 시큐어 코딩 가이드 (캡슐화 1항)

### SEC-1.4 비밀번호 복잡도 규칙

- **심각도**: 높음
- **기본 동작**: 비밀번호 최소 8자리·두 종류 이상 문자 조합 강제. 단순 반복·연속 문자열 금지. 단방향 해시(bcrypt/Argon2·Salt 필수)로 저장
- **올바른 예시 (Python)**:
  ```python
  import re
  import bcrypt

  def validate_password(pw: str) -> bool:
      if len(pw) < 8:
          return False
      has_upper = bool(re.search(r'[A-Z]', pw))
      has_lower = bool(re.search(r'[a-z]', pw))
      has_digit = bool(re.search(r'\d', pw))
      has_special = bool(re.search(r'[!@#$%^&*]', pw))
      char_types = sum([has_upper, has_lower, has_digit, has_special])
      return char_types >= 2

  def hash_password(pw: str) -> bytes:
      return bcrypt.hashpw(pw.encode(), bcrypt.gensalt())
  ```
- **올바른 예시 (JS)**:
  ```javascript
  const bcrypt = require('bcrypt');

  function validatePassword(pw) {
    if (pw.length < 8) return false;
    const types = [/[A-Z]/, /[a-z]/, /\d/, /[!@#$%^&*]/].filter(r => r.test(pw));
    return types.length >= 2;
  }

  async function hashPassword(pw) {
    return bcrypt.hash(pw, 12);
  }
  ```
- **의심 패턴**: `MD5(password)`, `SHA1(password)` (Salt 없는 해시), 길이·복잡도 검증 없는 비밀번호 저장
- **주석 템플릿**: `# EOSA[보안]: 비밀번호 해시 또는 복잡도 규칙 미적용 의심 (Rule ID: SEC-1.4) — bcrypt/Argon2 + Salt 사용 필수`
- **근거**: 개인정보보호위원회 개발자 안내서 2.1, KISA 시큐어 코딩 가이드 (보안기능 14항)

### SEC-1.5 로그인 시도 횟수 제한

- **심각도**: 높음
- **기본 동작**: 동일 계정/IP 로그인 실패 5회 이상 시 잠금 또는 지수 백오프 적용
- **올바른 예시 (Python/Redis 활용)**:
  ```python
  import redis
  r = redis.Redis()

  def check_login_attempts(username: str) -> bool:
      key = f"login_fail:{username}"
      attempts = r.incr(key)
      r.expire(key, 900)  # 15분 TTL
      return attempts <= 5

  def login(username, password):
      if not check_login_attempts(username):
          raise Exception("계정이 잠겼습니다. 15분 후 다시 시도하세요.")
  ```
- **올바른 예시 (JS/Express)**:
  ```javascript
  const rateLimit = require('express-rate-limit');
  const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: '로그인 시도 횟수 초과. 15분 후 다시 시도하세요.'
  });
  app.post('/login', loginLimiter, loginHandler);
  ```
- **의심 패턴**: 로그인 실패 횟수를 카운트하거나 제한하는 코드 없음
- **주석 템플릿**: `# EOSA[보안]: 반복 로그인 시도 제한 없음 의심 (Rule ID: SEC-1.5) — 시도 횟수 제한 또는 잠금 기능 추가 필요`
- **근거**: KISA 시큐어 코딩 가이드 (보안기능 16항)

### SEC-1.6 CSRF 방지

- **심각도**: 높음
- **기본 동작**: 상태 변경(POST/PUT/DELETE) 요청에 CSRF 토큰 검증 또는 SameSite 쿠키 정책 적용
- **올바른 예시 (Python/Django)**:
  ```python
  # Django: {% csrf_token %} 폼에 포함 (자동 적용)
  # Flask: Flask-WTF의 CSRFProtect 사용
  from flask_wtf.csrf import CSRFProtect
  csrf = CSRFProtect(app)
  ```
- **올바른 예시 (JS/Express)**:
  ```javascript
  // 세션 기반 CSRF 토큰 생성 및 검증
  const crypto = require('crypto');

  app.use((req, res, next) => {
    if (!req.session.csrfToken) {
      req.session.csrfToken = crypto.randomBytes(32).toString('hex');
    }
    next();
  });

  function verifyCsrf(req, res, next) {
    const token = req.body._csrf || req.headers['x-csrf-token'];
    if (token !== req.session.csrfToken) return res.status(403).send('CSRF 검증 실패');
    next();
  }

  app.post('/api/update', verifyCsrf, updateHandler);
  ```
- **의심 패턴**: POST 요청 처리 시 CSRF 토큰 검증 없음, `SameSite` 미설정 쿠키
- **주석 템플릿**: `# EOSA[보안]: CSRF 토큰 검증 없음 의심 (Rule ID: SEC-1.6) — 상태 변경 요청에 CSRF 토큰 추가 필요`
- **근거**: KISA JS 시큐어 코딩 가이드 (입력데이터 검증 11항), OWASP A01:2021

---

## SEC-2.0 입력 검증

### SEC-2.1 개인정보 암호화 저장

- **심각도**: 높음
- **기본 동작**: 주민등록번호·여권번호·금융계좌·바이오정보는 AES-256 이상으로 암호화 후 저장. 비밀번호는 단방향 해시(SEC-1.4)
- **암호화 대상**: `rrn`, `ssn`, `주민번호`, `여권번호`, `passport_no`, `account_no`, `바이오`
- **올바른 예시 (Python)**:
  ```python
  from cryptography.fernet import Fernet
  # ENCRYPTION_KEY 환경변수에는 Fernet.generate_key()로 생성한 값을 저장
  # python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"
  key = os.environ.get("ENCRYPTION_KEY").encode()  # 이미 base64 인코딩된 32바이트 키
  f = Fernet(key)
  encrypted_rrn = f.encrypt(rrn.encode())
  ```
- **올바른 예시 (JS)**:
  ```javascript
  const crypto = require('crypto');
  const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
  function encrypt(text) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    return iv.toString('hex') + ':' + cipher.update(text, 'utf8', 'hex') + cipher.final('hex');
  }
  ```
- **의심 패턴**: 암호화 없이 DB에 `rrn`, `ssn`, `주민번호`, `주민등록번호`, `passport_no` 저장
- **주석 템플릿**: `# EOSA[보안]: 개인정보 암호화 없이 저장 의심 (Rule ID: SEC-2.1) — AES-256 이상 암호화 후 저장 필수`
- **근거**: 개인정보보호법 제24조의2, 제25조

### SEC-2.2 SQL 인젝션 방지

- **심각도**: 높음
- **기본 동작**: 모든 DB 쿼리는 파라미터 바인딩(prepared statement) 사용. 동적 쿼리가 불가피하면 화이트리스트로 검증
- **올바른 예시 (Python)**:
  ```python
  # SQLite/MySQL: ?  PostgreSQL: %s
  cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
  cursor.execute("INSERT INTO logs VALUES (%s, %s)", (user_id, action))
  ```
- **올바른 예시 (JS/Node.js)**:
  ```javascript
  // mysql2
  db.execute("SELECT * FROM users WHERE id = ?", [userId]);
  // pg
  db.query("SELECT * FROM users WHERE id = $1", [userId]);
  ```
- **의심 패턴 (Python)**: f-string 또는 `%` 포매팅으로 SQL 조합 (`f"SELECT ... WHERE id={user_id}"`)
- **의심 패턴 (JS)**: 템플릿 리터럴로 SQL 조합 (`` `SELECT ... WHERE id=${userId}` ``)
- **주석 템플릿**: `# EOSA[보안]: SQL 인젝션 취약점 의심 (Rule ID: SEC-2.2) — 파라미터 바인딩 사용 필수`
- **근거**: 개인정보의 안전성 확보조치 기준 제8조, OWASP A03:2021, KISA 시큐어 코딩 가이드 (입력데이터 검증 1항)

### SEC-2.3 XSS (크로스사이트 스크립팅) 방지

- **심각도**: 높음
- **기본 동작**: 사용자 입력을 HTML에 출력할 때 반드시 이스케이프. `innerHTML` 대신 `textContent` 사용
- **올바른 예시 (Python/Jinja2)**:
  ```html
  {{ user_input | e }}   {# 자동 이스케이프 #}
  ```
- **올바른 예시 (JS)**:
  ```javascript
  // DOM API
  element.textContent = userInput;        // Safe
  // element.innerHTML = userInput;       // NG

  // React: JSX는 자동 이스케이프
  <div>{userInput}</div>                  // Safe
  // <div dangerouslySetInnerHTML={{__html: userInput}} />  // NG

  // 라이브러리 사용 (불가피한 HTML 렌더링 시)
  import DOMPurify from 'dompurify';
  element.innerHTML = DOMPurify.sanitize(userInput);
  ```
- **의심 패턴**: `innerHTML =`, `document.write(`, `v-html=`, `dangerouslySetInnerHTML`에 검증 없는 사용자 입력 삽입
- **주석 템플릿**: `# EOSA[보안]: XSS 취약점 의심 (Rule ID: SEC-2.3) — 사용자 입력 이스케이프 또는 textContent 사용`
- **근거**: OWASP A03:2021, KISA JS 시큐어 코딩 가이드 (입력데이터 검증 4항)

### SEC-2.4 운영체제 명령어 삽입 금지

- **심각도**: 높음
- **기본 동작**: 사용자 입력을 OS 명령어에 사용하지 않음. 불가피하면 인수 배열로 전달하고 입력값은 화이트리스트 검증
- **올바른 예시 (Python)**:
  ```python
  import subprocess

  # NG: shell=True + 사용자 입력
  # subprocess.run(f"ls -l {user_path}", shell=True)

  # OK: 인수 배열 + 입력 검증
  import re
  if not re.match(r'^/[\w/]+$', user_path):
      raise ValueError("허용되지 않은 경로")
  result = subprocess.run(['/bin/ls', '-l', user_path], capture_output=True, text=True)
  ```
- **올바른 예시 (JS/Node.js)**:
  ```javascript
  const { execFile } = require('child_process');

  // NG: exec() + 사용자 입력 연결
  // child_process.exec("ls -l " + req.query.path, ...)

  // OK: execFile() — 인수 배열로만 전달
  const inputPath = req.query.path;
  if (!/^(\/[\w^]+)+\/?$/.test(inputPath)) return res.send('invalid path');
  execFile('/bin/ls', ['-l', inputPath], (err, data) => res.send(data));
  ```
- **의심 패턴 (Python)**: `os.system(cmd + user_input)`, `subprocess.run(f"...{user_input}", shell=True)`
- **의심 패턴 (JS)**: `child_process.exec("..." + req.query.xxx)`
- **주석 템플릿**: `# EOSA[보안]: OS 명령어 삽입 취약점 의심 (Rule ID: SEC-2.4) — execFile() 및 인수 배열 사용, 입력 화이트리스트 검증`
- **근거**: KISA 시큐어 코딩 가이드 (입력데이터 검증 5항), CWE-78

### SEC-2.5 경로 조작 방지

- **심각도**: 높음
- **기본 동작**: 파일 경로에 사용자 입력 포함 시 기준 디렉토리 밖으로 벗어나는지 검증 (`path traversal` 방지)
- **올바른 예시 (Python)**:
  ```python
  import os

  BASE_DIR = '/var/app/uploads'

  def safe_open(filename: str):
      safe_path = os.path.realpath(os.path.join(BASE_DIR, filename))
      if not safe_path.startswith(BASE_DIR + os.sep):
          raise PermissionError("허용되지 않은 경로")
      return open(safe_path, 'r')
  ```
- **올바른 예시 (JS)**:
  ```javascript
  const path = require('path');
  const BASE_DIR = '/var/app/uploads';

  function safePath(filename) {
    const resolved = path.resolve(BASE_DIR, filename);
    if (!resolved.startsWith(BASE_DIR + path.sep)) {
      throw new Error('허용되지 않은 경로');
    }
    return resolved;
  }
  ```
- **의심 패턴**: `open(user_input)`, `fs.readFile(req.params.file)`, `../` 포함 경로 필터링 없음
- **주석 템플릿**: `# EOSA[보안]: 경로 조작(Path Traversal) 취약점 의심 (Rule ID: SEC-2.5) — realpath() 기준 디렉토리 검증 필요`
- **근거**: KISA 시큐어 코딩 가이드 (입력데이터 검증 3항), CWE-22

### SEC-2.6 eval() 및 동적 코드 실행 금지

- **심각도**: 높음
- **기본 동작**: `eval()`, `exec()`, `Function()` 등 동적 코드 실행 함수에 외부 입력 전달 금지
- **올바른 예시 (JS)**:
  ```javascript
  // NG: 사용자 입력을 eval에 전달
  // eval(req.body.formula);
  // new Function(req.body.code)();

  // OK: 허용된 연산만 실행
  const ALLOWED_OPS = { add: (a, b) => a + b, multiply: (a, b) => a * b };
  const op = ALLOWED_OPS[req.body.operation];
  if (!op) throw new Error('허용되지 않은 연산');
  const result = op(req.body.a, req.body.b);
  ```
- **올바른 예시 (Python)**:
  ```python
  # NG: eval(user_input)
  # OK: ast.literal_eval (리터럴만 허용)
  import ast
  safe_value = ast.literal_eval(user_input)  # 숫자/문자열/리스트만 허용
  ```
- **의심 패턴**: `eval(req.body.*)`, `exec(user_input)`, `Function(req.query.*)()`
- **주석 템플릿**: `# EOSA[보안]: 동적 코드 실행 취약점 의심 (Rule ID: SEC-2.6) — eval/exec에 외부 입력 전달 금지`
- **근거**: KISA JS 시큐어 코딩 가이드 (입력데이터 검증 2항), CWE-95

### SEC-2.7 오픈 리다이렉트 방지

- **심각도**: 중간
- **기본 동작**: 리다이렉트 URL이 외부 입력에서 올 경우 허용 도메인 화이트리스트로 검증
- **올바른 예시 (Python)**:
  ```python
  from urllib.parse import urlparse

  ALLOWED_HOSTS = {'mygov.go.kr', 'www.mygov.go.kr'}

  def safe_redirect(url: str):
      parsed = urlparse(url)
      if parsed.netloc and parsed.netloc not in ALLOWED_HOSTS:
          raise ValueError("허용되지 않은 리다이렉트 주소")
      return redirect(url)
  ```
- **올바른 예시 (JS)**:
  ```javascript
  const ALLOWED_HOSTS = new Set(['mygov.go.kr', 'www.mygov.go.kr']);

  function safeRedirect(res, url) {
    try {
      const parsed = new URL(url);
      if (!ALLOWED_HOSTS.has(parsed.hostname)) throw new Error();
    } catch {
      return res.redirect('/');   // 기본 페이지로 대체
    }
    res.redirect(url);
  }
  ```
- **의심 패턴**: `redirect(req.query.next)`, `res.redirect(req.body.url)` (검증 없이)
- **주석 템플릿**: `# EOSA[보안]: 오픈 리다이렉트 취약점 의심 (Rule ID: SEC-2.7) — 허용 도메인 화이트리스트 검증 필요`
- **근거**: KISA 시큐어 코딩 가이드 (입력데이터 검증 7항), CWE-601

### SEC-2.8 역직렬화 보안

- **심각도**: 높음
- **기본 동작**: 신뢰할 수 없는 출처의 직렬화 데이터 역직렬화 금지. 불가피하면 서명·타입 검증 후 처리
- **올바른 예시 (Python)**:
  ```python
  # NG: pickle은 신뢰할 수 없는 데이터에 사용 금지
  # data = pickle.loads(user_data)

  # OK: JSON 사용 (타입 제한 있음)
  import json
  data = json.loads(user_data)  # JSON은 코드 실행 불가

  # 불가피한 경우: 서명 검증 후 역직렬화
  import hmac
  secret = SECRET_KEY if isinstance(SECRET_KEY, bytes) else SECRET_KEY.encode()
  expected = hmac.new(secret, raw_data, 'sha256').hexdigest()
  if not hmac.compare_digest(expected, provided_sig):
      raise ValueError("서명 검증 실패")
  ```
- **의심 패턴**: `pickle.loads(request.data)`, `yaml.load(user_input)` (Loader 없음), `JSON.parse` + `eval`
- **주석 템플릿**: `# EOSA[보안]: 신뢰할 수 없는 역직렬화 의심 (Rule ID: SEC-2.8) — JSON 사용 또는 서명 검증 후 역직렬화`
- **근거**: KISA JS 시큐어 코딩 가이드 (코드오류 3항), CWE-502, OWASP A08:2021

---

## SEC-3.0 로깅 및 에러처리

### SEC-3.1 개인정보 로그 출력 금지

- **심각도**: 중간
- **기본 동작**: 로그에 개인정보 포함 금지. 필요 시 마스킹 처리
- **올바른 예시 (Python)**:
  ```python
  phone_masked = f"{phone[:3]}-****-{phone[-4:]}"
  logging.info(f"Login attempt: {phone_masked}")

  # 주민번호 마스킹
  rrn_masked = rrn[:6] + "-*******"
  ```
- **올바른 예시 (JS)**:
  ```javascript
  const maskPhone = (p) => p.replace(/(\d{3})-(\d{3,4})-(\d{4})/, '$1-****-$3');
  logger.info(`Login: ${maskPhone(phone)}`);
  ```
- **의심 패턴**: `logging.info(f"...{user.ssn}...")`, `console.log(email, password)`, `logger.debug(req.body)` (개인정보 포함)
- **주석 템플릿**: `# EOSA[보안]: 개인정보가 로그에 출력될 수 있습니다 (Rule ID: SEC-3.1) — 마스킹 처리 또는 로그에서 제거`
- **근거**: 개인정보보호법 제29조, 개인정보의 안전성 확보조치 기준

### SEC-3.2 오류 메시지 정보 노출 금지

- **심각도**: 중간
- **기본 동작**: 사용자에게 표시되는 오류 메시지에 스택 트레이스·DB 구조·시스템 경로·내부 변수 포함 금지
- **올바른 예시 (Python/Flask)**:
  ```python
  # 프로덕션 환경
  app.config['DEBUG'] = False
  app.config['PROPAGATE_EXCEPTIONS'] = False

  @app.errorhandler(Exception)
  def handle_error(e):
      logger.error(f"Internal error: {e}", exc_info=True)  # 내부 로그에만 기록
      return jsonify({'error': '서비스 처리 중 오류가 발생했습니다.'}), 500
  ```
- **올바른 예시 (JS/Express)**:
  ```javascript
  app.use((err, req, res, next) => {
    console.error(err.stack);  // 서버 로그에만
    res.status(500).json({ message: '서비스 처리 중 오류가 발생했습니다.' });
  });

  // process.env.NODE_ENV === 'production' 확인
  ```
- **의심 패턴**: `debug=True` 프로덕션 설정, `res.send(err.stack)`, `return str(e)` 에러 메시지 그대로 노출
- **주석 템플릿**: `# EOSA[보안]: 오류 메시지 정보 노출 의심 (Rule ID: SEC-3.2) — 내부 오류는 로그에만 기록, 사용자에게는 일반 메시지 반환`
- **근거**: KISA 시큐어 코딩 가이드 (에러처리 1항), CWE-209

---

## SEC-4.0 통신 보안

### SEC-4.1 HTTPS 강제

- **심각도**: 높음
- **기본 동작**: 외부 통신은 항상 HTTPS. HTTP 요청은 HTTPS로 리다이렉트. `verify=False` 금지
- **올바른 예시 (Python)**:
  ```python
  from flask_talisman import Talisman
  Talisman(app, force_https=True)

  # requests 라이브러리: verify 생략(기본 True) 또는 명시적 True
  requests.get('https://api.example.go.kr/data', verify=True)
  ```
- **올바른 예시 (JS)**:
  ```javascript
  // Express HTTPS 리다이렉트
  app.use((req, res, next) => {
    if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect(301, 'https://' + req.hostname + req.url);
    }
    next();
  });
  ```
- **의심 패턴**: `http://` 외부 API 호출, `verify=False`, `rejectUnauthorized: false`
- **주석 템플릿**: `# EOSA[보안]: HTTP 통신 의심 (Rule ID: SEC-4.1) — HTTPS 사용 및 인증서 검증 필수`
- **근거**: 개인정보의 안전성 확보조치 기준 제7조

### SEC-4.2 CORS 최소화

- **심각도**: 중간
- **기본 동작**: CORS는 허용 도메인을 명시적으로 지정. 인증 API에서 와일드카드(`*`) 금지
- **올바른 예시 (JS)**:
  ```javascript
  const cors = require('cors');
  app.use(cors({
    origin: ['https://www.mygov.go.kr', 'https://admin.mygov.go.kr'],
    credentials: true
  }));
  ```
- **의심 패턴**: `CORS(app, origins="*")`, `Access-Control-Allow-Origin: *` (인증 쿠키 전송 API에서)
- **주석 템플릿**: `# EOSA[보안]: CORS 와일드카드 설정 의심 (Rule ID: SEC-4.2) — 허용 도메인 명시적 지정 권장`
- **근거**: KISA 시큐어 코딩 가이드 (보안기능 2항)

### SEC-4.3 SSRF 방지

- **심각도**: 높음
- **기본 동작**: 사용자 제공 URL로 서버에서 외부 요청을 보낼 경우 허용 도메인 화이트리스트로 검증. 내부 IP 대역 접근 차단
- **올바른 예시 (Python)**:
  ```python
  import ipaddress
  from urllib.parse import urlparse

  ALLOWED_SCHEMES = {'https'}
  ALLOWED_HOSTS = {'api.data.go.kr', 'www.mygov.go.kr'}

  def safe_fetch(url: str):
      parsed = urlparse(url)
      if parsed.scheme not in ALLOWED_SCHEMES:
          raise ValueError("허용되지 않은 스킴")
      if parsed.hostname not in ALLOWED_HOSTS:
          raise ValueError("허용되지 않은 호스트")
      # 내부 IP 차단
      try:
          addr = ipaddress.ip_address(parsed.hostname)
          if addr.is_private or addr.is_loopback:
              raise ValueError("내부 IP 접근 차단")
      except ValueError:
          pass
      return requests.get(url, timeout=5)
  ```
- **의심 패턴**: `requests.get(req.body.url)`, `fetch(req.query.target)` (검증 없이)
- **주석 템플릿**: `# EOSA[보안]: SSRF 취약점 의심 (Rule ID: SEC-4.3) — 허용 URL 화이트리스트 검증 및 내부 IP 차단 필요`
- **근거**: KISA JS 시큐어 코딩 가이드 (입력데이터 검증 12항), OWASP A10:2021, CWE-918

---

## SEC-5.0 파일 처리

### SEC-5.1 파일 업로드 검증

- **심각도**: 높음
- **기본 동작**: 파일 업로드 시 확장자·MIME 타입·파일 크기 화이트리스트 검증. 업로드 경로에서 직접 실행 불가하도록 설정
- **올바른 예시 (Python)**:
  ```python
  import magic  # python-magic
  import uuid

  ALLOWED_EXTENSIONS = {'pdf', 'hwp', 'hwpx', 'docx', 'xlsx', 'jpg', 'png', 'gif'}
  ALLOWED_MIMES = {'application/pdf', 'image/jpeg', 'image/png', 'image/gif'}
  MAX_SIZE = 10 * 1024 * 1024  # 10MB

  def save_upload(file):
      if file.content_length > MAX_SIZE:
          raise ValueError("파일 크기 초과")
      ext = file.filename.rsplit('.', 1)[-1].lower()
      if ext not in ALLOWED_EXTENSIONS:
          raise ValueError("허용되지 않은 파일 형식")
      mime = magic.from_buffer(file.read(1024), mime=True)
      if mime not in ALLOWED_MIMES:
          raise ValueError("파일 내용과 확장자 불일치")
      # 원본 파일명 사용 금지 — UUID로 대체
      safe_name = str(uuid.uuid4()) + '.' + ext
      file.save(os.path.join('/var/uploads', safe_name))
  ```
- **올바른 예시 (JS/Multer)**:
  ```javascript
  const multer = require('multer');
  const ALLOWED_MIMES = ['image/jpeg', 'image/png', 'application/pdf'];

  const upload = multer({
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      if (!ALLOWED_MIMES.includes(file.mimetype)) {
        return cb(new Error('허용되지 않은 파일 형식'));
      }
      cb(null, true);
    }
  });
  ```
- **의심 패턴**: 확장자 검증 없이 `file.save()` 직접 호출, 업로드 디렉토리가 웹 루트 내에 있음
- **주석 템플릿**: `# EOSA[보안]: 파일 업로드 검증 누락 의심 (Rule ID: SEC-5.1) — 확장자·MIME·크기 검증 및 UUID 파일명 사용`
- **근거**: KISA JS 시큐어 코딩 가이드 (입력데이터 검증 6항), OWASP A04:2021

---

## SEC-6.0 AI 보안 (AI 서비스 개발 시 추가 적용)

### SEC-6.1 프롬프트 인젝션 방지

- **심각도**: 높음
- **기본 동작**: 외부 입력이 시스템 프롬프트를 덮어쓰지 못하도록 역할·기능 범위 제한. 사용자 입력과 시스템 지시를 명확히 분리
- **올바른 예시 (Python/OpenAI SDK)**:
  ```python
  import re

  INJECTION_PATTERNS = [
      r'ignore\s+(previous|all|above)',
      r'system:\s*',
      r'new\s+instruction',
      r'disregard\s+',
  ]

  def sanitize_prompt(user_input: str) -> str:
      for pattern in INJECTION_PATTERNS:
          if re.search(pattern, user_input, re.IGNORECASE):
              raise ValueError("허용되지 않은 입력입니다.")
      return user_input[:2000]  # 길이 제한

  messages = [
      {"role": "system", "content": "당신은 민원 상담 AI입니다. 민원 관련 질문에만 답변하세요."},
      {"role": "user", "content": sanitize_prompt(user_input)}
  ]
  response = client.chat.completions.create(model="gpt-4", messages=messages)
  ```
- **의심 패턴**: 사용자 입력을 시스템 프롬프트에 직접 포함, 입력 길이·패턴 검증 없음
- **주석 템플릿**: `# EOSA[보안]: 프롬프트 인젝션 취약점 의심 (Rule ID: SEC-6.1) — 사용자 입력 검증 및 시스템 프롬프트 분리 필요`
- **근거**: KISA AI 보안 안내서 3.2.1, OWASP LLM01:2023

### SEC-6.2 AI 출력 검증 및 민감정보 필터링

- **심각도**: 높음
- **기본 동작**: AI 모델 출력에서 개인정보·시스템 정보가 포함되지 않도록 필터링. AI 출력을 신뢰하지 않고 이후 처리에서 검증
- **올바른 예시 (Python)**:
  ```python
  import re

  PII_PATTERNS = [
      r'\d{6}-\d{7}',           # 주민등록번호
      r'\d{3}-\d{3,4}-\d{4}',  # 전화번호
      r'[A-Z0-9]{8}',           # 여권번호 유사
  ]

  def sanitize_ai_output(output: str) -> str:
      for pattern in PII_PATTERNS:
          output = re.sub(pattern, '[개인정보 제거]', output)
      return output

  ai_response = get_ai_response(prompt)
  safe_response = sanitize_ai_output(ai_response)
  # AI 출력을 DB 쿼리·OS 명령어에 직접 사용 금지
  ```
- **의심 패턴**: AI 출력을 바로 `eval()`, `exec()`, DB 쿼리, HTML 렌더링에 사용
- **주석 템플릿**: `# EOSA[보안]: AI 출력 미검증 사용 의심 (Rule ID: SEC-6.2) — PII 필터링 및 출력 검증 후 사용`
- **근거**: KISA AI 보안 안내서 2.1, 3.2

### SEC-6.3 학습 데이터 및 모델 보안

- **심각도**: 중간
- **기본 동작**: 학습 데이터에 개인정보 포함 금지 (익명화·가명화 처리). 모델 파일은 서명 검증 후 로드. 오픈소스 라이브러리 취약점 정기 점검
- **올바른 예시 (Python)**:
  ```python
  # 학습 데이터 개인정보 제거
  import pandas as pd

  def anonymize_dataset(df: pd.DataFrame) -> pd.DataFrame:
      pii_columns = ['name', 'phone', 'email', 'rrn']
      return df.drop(columns=[c for c in pii_columns if c in df.columns])

  # 오픈소스 취약점 점검 (CI/CD에 통합)
  # pip install safety && safety check
  # npm audit
  ```
- **의심 패턴**: 실 개인정보가 포함된 CSV를 학습 데이터로 직접 사용, 출처 불명 모델 파일 바로 로드
- **주석 템플릿**: `# EOSA[보안]: 학습 데이터 개인정보 포함 의심 (Rule ID: SEC-6.3) — 익명화/가명화 처리 후 사용`
- **근거**: KISA AI 보안 안내서 2.1, 2.2, 3.3

---

## 버전 변경 이력

- **2024 (2026-06-19 재작성)**: 5개 공식 PDF 기반 전면 재작성. SEC-1.4 비밀번호 복잡도, SEC-1.5 로그인 횟수제한, SEC-1.6 CSRF, SEC-2.4~2.8 (OS명령어·경로조작·eval·오픈리다이렉트·역직렬화), SEC-3.2 오류메시지, SEC-4.3 SSRF, SEC-6.x AI보안 신규 추가
- **2024 (초안)**: SEC-1.1~1.3, SEC-2.1~2.3, SEC-3.1, SEC-4.1~4.2, SEC-5.1 포함 초기 버전
