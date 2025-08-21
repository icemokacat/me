💡 혹시 해당 페이지가 잘 안보이거나, 디자인상 이상해 보이나요?
[링크](https://github.com/icemokacat/me/blob/release/public/md/exp4.md) github 에서 볼 수 있습니다.

# CI/CD 폐쇄망 환경 대응 방안

### 문제점

운영중인 서버는 폐쇄망으로 외부에서의 접근이 차단되어 있어 빌드한 jar 파일을

해당 서버로 전송할 수 없어 자동화가 불가.

jenkins 에서 빌드한 파일을 찾아서 jeus server에 deploy 해야 하는 불편함과

어떤 version 을 빌드하여 배포했는지 인지할 수 없어 문제 발생시 대응이 힘듬

<img width="809" height="469" alt="image" src="https://github.com/user-attachments/assets/5473b13d-c675-4999-852b-5a8ee38b76af" />

### 대응

#### 1. 빌드 파일 버전 관리 체계 구축

Commit Hash 기반 파일명: 빌드 시 Git commit hash를 JAR 파일명에 자동 포함

버전 추적 가능: 정확한 소스 코드 버전과 빌드 파일 매핑 관리

예시: application-{commit-hash}-{timestamp}.jar

#### 2. 웹 기반 빌드 파일 관리 시스템

**lighttpd 웹서버 구축**: 빌드 파일 저장소를 웹 인터페이스로 제공 (사내 CI/CD 서버내 위치)

💡 nginx 도 있었지만, CGI 설정을 해야 했고 파일 필터 및 정렬 기능이 다소 부족했습니다.

**Python 스크립트 개발**: 빌드 파일을 날짜순으로 자동 정렬하여 최신 버전을 상단에 표시

사용자 친화적 인터페이스: 개발팀이 쉽게 원하는 버전을 찾아 다운로드 가능

#### 3. 파일 생명주기 관리

**Shell Script 자동화**: 오래된 빌드 파일 자동 정리로 스토리지 효율성 확보

보관 정책 수립: 최신 N개 버전만 유지하는 자동 정리 시스템 구현

<img width="798" height="380" alt="image" src="https://github.com/user-attachments/assets/23d74bda-229b-4e1b-95cc-af922f1a248d" />

**구조**

nginx (프록시) → lighttpd (웹서버) → listing.py (CGI 스크립트)


**📃 nginx 설정 일부**

```conf
location / {
  proxy_pass http://lighttpd;  # 모든 요청을 lighttpd로 전달
}
location ~ ^/listing.py(/.*)?$ {
  proxy_pass http://lighttpd;  # listing.py 관련 요청도 lighttpd로
}
```

**📃 lighttpd.conf 설정**

```
server.document-root = "/var/www/build/download"
```

**📺 listing.py 간략 설명**

💡 파이썬 코드는 생성형 AI 도움을 받았습니다.

- 파일 필터링
```
allowed_extensions = ['.war','.zip','.jar','.tar','.log']
# 특정 확장자만 표시 (빌드 파일 중심)
```

- 필터 및 표기 변경
```py
# 디렉토리는 모두 표시하고, 파일은 특정 확장자만 표시
if S_ISDIR(info.st_mode) or any(entry.name.lower().endswith(ext) for ext in allowed_extensions):
 files.append((entry.name, info[ST_MTIME], size, mime_type, S_ISDIR(info.st_mode)))
```

- 최신순 정렬
```
files.sort(key=lambda x: x[1], reverse=True)  # mtime 기준 최신순
```

구축 예시

<img width="546" height="215" alt="image" src="https://github.com/user-attachments/assets/210d40ca-ce59-4450-a73b-87a8e633b0ae" />


# Springbatch를 이용한 Elasticsearch 데이터 증분 색인 처리
# 기타 프로세스 개선


